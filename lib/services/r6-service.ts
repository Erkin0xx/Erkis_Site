// @ts-nocheck
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";
import * as UbisoftAPI from "./ubisoft-api";

/**
 * R6Stats interface - strictly typed player statistics
 */
export interface R6Stats {
  username: string;
  platform: string;
  rankName: string;
  rankIconUrl: string;
  mmr: number;
  kd: number;
  winRate: number;
  kills: number;
  deaths: number;
  wins: number;
  losses: number;
  hoursPlayed: number;
  level: number;
}

/**
 * Platform type for R6 API
 */
type R6Platform = "pc" | "psn" | "xbl";

/**
 * Cache TTL in milliseconds (15 minutes)
 */
const CACHE_TTL = 15 * 60 * 1000;

/**
 * R6Service - Singleton service for Rainbow Six Siege API integration
 */
class R6Service {
  private static instance: R6Service;
  private supabase: ReturnType<typeof createClient<Database>>;

  private constructor() {
    // Initialize Supabase client with service role key for server-side operations
    this.supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): R6Service {
    if (!R6Service.instance) {
      R6Service.instance = new R6Service();
    }
    return R6Service.instance;
  }

  /**
   * Check cache for existing stats
   */
  private async checkCache(
    username: string,
    platform: R6Platform
  ): Promise<R6Stats | null> {
    try {
      const { data, error } = await this.supabase
        .from("r6_cache")
        .select("*")
        .eq("username", username.toLowerCase())
        .eq("platform", platform)
        .single();

      if (error || !data) {
        return null;
      }

      // Check if cache is expired
      const expiresAt = new Date(data.expires_at).getTime();
      const now = Date.now();

      if (now > expiresAt) {
        // Cache expired, delete it
        await this.supabase
          .from("r6_cache")
          .delete()
          .eq("id", data.id);
        return null;
      }

      // Return cached stats
      return data.stats as R6Stats;
    } catch (error) {
      console.error("Error checking cache:", error);
      return null;
    }
  }

  /**
   * Save stats to cache
   */
  private async saveToCache(
    username: string,
    platform: R6Platform,
    stats: R6Stats
  ): Promise<void> {
    try {
      const now = new Date();
      const expiresAt = new Date(now.getTime() + CACHE_TTL);

      // First, try to update existing cache entry
      const { data: existing } = await this.supabase
        .from("r6_cache")
        .select("id")
        .eq("username", username.toLowerCase())
        .eq("platform", platform)
        .single();

      if (existing) {
        // Update existing entry
        await this.supabase
          .from("r6_cache")
          .update({
            stats: stats as unknown as Database["public"]["Tables"]["r6_cache"]["Update"]["stats"],
            cached_at: now.toISOString(),
            expires_at: expiresAt.toISOString(),
          })
          .eq("id", existing.id);
      } else {
        // Insert new entry
        await this.supabase.from("r6_cache").insert({
          user_id: "system", // Use a system user ID for now
          username: username.toLowerCase(),
          platform,
          stats: stats as unknown as Database["public"]["Tables"]["r6_cache"]["Insert"]["stats"],
          cached_at: now.toISOString(),
          expires_at: expiresAt.toISOString(),
        });
      }
    } catch (error) {
      console.error("Error saving to cache:", error);
      // Don't throw - caching is not critical
    }
  }

  /**
   * Fetch stats from Ubisoft API (Direct Integration)
   */
  private async fetchFromAPI(
    username: string,
    platform: R6Platform
  ): Promise<R6Stats> {
    try {
      // Map platform names
      const platformMap: Record<R6Platform, "uplay" | "psn" | "xbl"> = {
        pc: "uplay",
        psn: "psn",
        xbl: "xbl",
      };

      const mappedPlatform = platformMap[platform];

      console.log(`🔍 Searching for player: ${username} on ${mappedPlatform}`);

      // Find player by username using direct API
      const user = await UbisoftAPI.findUserByUsername(mappedPlatform, username);

      if (!user) {
        throw new Error(`Player "${username}" not found on ${platform}`);
      }

      console.log(`✅ Found player: ${user.nameOnPlatform} (${user.profileId})`);

      const profileId = user.profileId;

      // Get progression and seasonal stats in parallel
      const [progression, seasonal] = await Promise.all([
        UbisoftAPI.getUserProgression(mappedPlatform, profileId),
        UbisoftAPI.getUserSeasonal(mappedPlatform, profileId, -1),
      ]);

      console.log("📊 Retrieved player data successfully");

      // Extract stats from seasonal data
      let mmr = 0;
      let kills = 0;
      let deaths = 0;
      let wins = 0;
      let losses = 0;

      // Parse seasonal stats
      if (seasonal?.platforms) {
        const platformStats = Object.values(seasonal.platforms)?.[0];
        if (platformStats?.gameModes) {
          const rankedStats = platformStats.gameModes.find(
            (mode: any) => mode.type === "ranked"
          );
          if (rankedStats?.teamRoles) {
            const allRoles = rankedStats.teamRoles.find(
              (role: any) => role.type === "all"
            );
            if (allRoles?.statsDetail?.ranked) {
              const ranked = allRoles.statsDetail.ranked;
              mmr = ranked.mmr || 0;
              kills = ranked.kills || 0;
              deaths = ranked.deaths || 0;
              wins = ranked.matchesWon || 0;
              losses = ranked.matchesLost || 0;
            }
          }
        }
      }

      const totalMatches = wins + losses;

      // Get rank info
      const rankName = this.getRankName(mmr);
      const rankIconUrl = this.getRankIconUrl(rankName);

      const r6Stats: R6Stats = {
        username: user.nameOnPlatform || username,
        platform,
        rankName,
        rankIconUrl,
        mmr,
        kd: deaths > 0 ? Number((kills / deaths).toFixed(2)) : kills,
        winRate:
          totalMatches > 0
            ? Number(((wins / totalMatches) * 100).toFixed(1))
            : 0,
        kills,
        deaths,
        wins,
        losses,
        hoursPlayed: 0,
        level: progression?.level || 0,
      };

      console.log(`✨ Stats compiled for ${r6Stats.username}: ${r6Stats.rankName} (${r6Stats.mmr} MMR)`);

      return r6Stats;
    } catch (error) {
      console.error("❌ Error fetching from R6 API:", error);
      if (error instanceof Error) {
        console.error("Error details:", error.message);
      }
      throw error;
    }
  }

  /**
   * Get rank name from MMR
   */
  private getRankName(mmr: number): string {
    if (mmr >= 5000) return "Champion";
    if (mmr >= 4400) return "Diamond I";
    if (mmr >= 4200) return "Diamond II";
    if (mmr >= 4000) return "Diamond III";
    if (mmr >= 3700) return "Emerald I";
    if (mmr >= 3500) return "Emerald II";
    if (mmr >= 3300) return "Emerald III";
    if (mmr >= 3000) return "Platinum I";
    if (mmr >= 2800) return "Platinum II";
    if (mmr >= 2600) return "Platinum III";
    if (mmr >= 2400) return "Gold I";
    if (mmr >= 2200) return "Gold II";
    if (mmr >= 2000) return "Gold III";
    if (mmr >= 1800) return "Silver I";
    if (mmr >= 1600) return "Silver II";
    if (mmr >= 1400) return "Silver III";
    if (mmr >= 1200) return "Bronze I";
    if (mmr >= 1000) return "Bronze II";
    if (mmr >= 800) return "Bronze III";
    if (mmr >= 600) return "Copper I";
    if (mmr >= 400) return "Copper II";
    if (mmr >= 200) return "Copper III";
    return "Unranked";
  }

  /**
   * Get rank icon URL (using static CDN URLs)
   */
  private getRankIconUrl(rankName: string): string {
    const rankSlug = rankName.toLowerCase().replace(/ /g, "_");
    return `https://staticctf.ubisoft.com/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/3MJMvRW6zGBCKoXQdFGqyK/6e548cc8cad4108a0303fb4a10e3ae68/r6s-rank-${rankSlug}.png`;
  }

  /**
   * Fetch stats from Ubisoft API using profile ID directly
   */
  private async fetchFromAPIByProfileId(
    profileId: string,
    platform: R6Platform
  ): Promise<R6Stats> {
    try {
      // Map platform names
      const platformMap: Record<R6Platform, "uplay" | "psn" | "xbl"> = {
        pc: "uplay",
        psn: "psn",
        xbl: "xbl",
      };

      const mappedPlatform = platformMap[platform];

      console.log(`🔍 Fetching stats for profile ID: ${profileId} on ${mappedPlatform}`);

      // Get user profile info, progression and seasonal stats in parallel
      const [profile, progression, seasonal] = await Promise.all([
        UbisoftAPI.getUserProfile(profileId),
        UbisoftAPI.getUserProgression(mappedPlatform, profileId),
        UbisoftAPI.getUserSeasonal(mappedPlatform, profileId, -1),
      ]);

      console.log(`✅ Retrieved data for profile: ${profile?.nameOnPlatform || 'Unknown'}`);

      // Extract stats from seasonal data
      let mmr = 0;
      let kills = 0;
      let deaths = 0;
      let wins = 0;
      let losses = 0;

      // Parse seasonal stats
      if (seasonal?.platforms) {
        const platformStats = Object.values(seasonal.platforms)?.[0];
        if (platformStats?.gameModes) {
          const rankedStats = platformStats.gameModes.find(
            (mode: any) => mode.type === "ranked"
          );
          if (rankedStats?.teamRoles) {
            const allRoles = rankedStats.teamRoles.find(
              (role: any) => role.type === "all"
            );
            if (allRoles?.statsDetail?.ranked) {
              const ranked = allRoles.statsDetail.ranked;
              mmr = ranked.mmr || 0;
              kills = ranked.kills || 0;
              deaths = ranked.deaths || 0;
              wins = ranked.matchesWon || 0;
              losses = ranked.matchesLost || 0;
            }
          }
        }
      }

      const totalMatches = wins + losses;

      // Get rank info
      const rankName = this.getRankName(mmr);
      const rankIconUrl = this.getRankIconUrl(rankName);

      const username = profile?.nameOnPlatform || "Unknown";

      const r6Stats: R6Stats = {
        username,
        platform,
        rankName,
        rankIconUrl,
        mmr,
        kd: deaths > 0 ? Number((kills / deaths).toFixed(2)) : kills,
        winRate:
          totalMatches > 0
            ? Number(((wins / totalMatches) * 100).toFixed(1))
            : 0,
        kills,
        deaths,
        wins,
        losses,
        hoursPlayed: 0,
        level: progression?.level || 0,
      };

      console.log(`✨ Stats compiled for ${r6Stats.username}: ${r6Stats.rankName} (${r6Stats.mmr} MMR)`);

      return r6Stats;
    } catch (error) {
      console.error("❌ Error fetching from R6 API by profile ID:", error);
      if (error instanceof Error) {
        console.error("Error details:", error.message);
      }
      throw error;
    }
  }

  /**
   * Get player stats (main public method)
   */
  public async getPlayerStats(
    username: string,
    platform: R6Platform
  ): Promise<R6Stats> {
    try {
      // Check cache first
      const cachedStats = await this.checkCache(username, platform);
      if (cachedStats) {
        return cachedStats;
      }

      // Fetch from API
      const stats = await this.fetchFromAPI(username, platform);

      // Save to cache
      await this.saveToCache(username, platform, stats);

      return stats;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to get R6 stats: ${error.message}`);
      }
      throw new Error("Failed to get R6 stats: Unknown error");
    }
  }

  /**
   * Get player stats by profile ID
   */
  public async getPlayerStatsByProfileId(
    profileId: string,
    platform: R6Platform
  ): Promise<R6Stats> {
    try {
      // Fetch from API using profile ID
      const stats = await this.fetchFromAPIByProfileId(profileId, platform);

      // Save to cache using username from stats
      await this.saveToCache(stats.username, platform, stats);

      return stats;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to get R6 stats by profile ID: ${error.message}`);
      }
      throw new Error("Failed to get R6 stats by profile ID: Unknown error");
    }
  }
}

/**
 * Export singleton instance getter
 */
export const getPlayerStats = async (
  username: string,
  platform: R6Platform
): Promise<R6Stats> => {
  const service = R6Service.getInstance();
  return service.getPlayerStats(username, platform);
};

/**
 * Export singleton instance getter for profile ID lookup
 */
export const getPlayerStatsByProfileId = async (
  profileId: string,
  platform: R6Platform
): Promise<R6Stats> => {
  const service = R6Service.getInstance();
  return service.getPlayerStatsByProfileId(profileId, platform);
};
