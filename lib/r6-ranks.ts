/**
 * Utility functions for Rainbow Six Siege rank icons
 */

/**
 * Converts a rank name (e.g., "Emerald I") to the local image filename
 * @param rankName - The rank name (e.g., "Emerald I", "Diamond V")
 * @returns The filename for the rank icon
 */
export function getRankIconPath(rankName: string): string {
  if (!rankName) return '/r6/ranks/unranked.png';

  // Parse rank name (e.g., "Emerald I" -> rank: "Emerald", division: "I")
  const parts = rankName.trim().split(' ');
  if (parts.length < 1) return '/r6/ranks/unranked.png';

  const rank = parts[0];
  const division = parts[1] || 'I';

  // Convert Roman numerals to numbers
  const divisionMap: { [key: string]: string } = {
    'I': '01',
    'II': '02',
    'III': '03',
    'IV': '04',
    'V': '05',
  };

  const divisionNumber = divisionMap[division] || '01';

  // Handle special cases
  if (rank.toLowerCase() === 'champions') {
    return `/r6/ranks/RANK_500x500Champions_01.png`;
  }

  // Format: RANK_500x500{Rank}_{Division}.png
  // Note: Gold is uppercase in the files
  // Examples:
  // - Emerald I -> RANK_500x500Emerald_01.png
  // - Diamond V -> RANK_500x500Diamond_01.png (only Division I exists)
  // - Platinum III -> RANK_500x500Platinum_03.png
  // - Gold II -> RANK_500x500GOLD_02.png (Gold is uppercase)
  const rankFormatted = rank.toLowerCase() === 'gold' ? 'GOLD' : rank;
  const filename = `RANK_500x500${rankFormatted}_${divisionNumber}.png`;

  return `/r6/ranks/${filename}`;
}

/**
 * List of all rank icons needed
 * Use this to download the correct icons from Ubisoft CDN
 */
export const RANK_ICONS_NEEDED = [
  // Champions
  'R6S_RANK_500x500_Champions.png',

  // Diamond
  'R6S_RANK_500x500_Diamond_01.png',
  'R6S_RANK_500x500_Diamond_02.png',
  'R6S_RANK_500x500_Diamond_03.png',
  'R6S_RANK_500x500_Diamond_04.png',
  'R6S_RANK_500x500_Diamond_05.png',

  // Emerald
  'R6S_RANK_500x500_Emerald_01.png',
  'R6S_RANK_500x500_Emerald_02.png',
  'R6S_RANK_500x500_Emerald_03.png',
  'R6S_RANK_500x500_Emerald_04.png',
  'R6S_RANK_500x500_Emerald_05.png',

  // Platinum
  'R6S_RANK_500x500_Platinum_01.png',
  'R6S_RANK_500x500_Platinum_02.png',
  'R6S_RANK_500x500_Platinum_03.png',
  'R6S_RANK_500x500_Platinum_04.png',
  'R6S_RANK_500x500_Platinum_05.png',

  // Gold
  'R6S_RANK_500x500_Gold_01.png',
  'R6S_RANK_500x500_Gold_02.png',
  'R6S_RANK_500x500_Gold_03.png',
  'R6S_RANK_500x500_Gold_04.png',
  'R6S_RANK_500x500_Gold_05.png',

  // Silver
  'R6S_RANK_500x500_Silver_01.png',
  'R6S_RANK_500x500_Silver_02.png',
  'R6S_RANK_500x500_Silver_03.png',
  'R6S_RANK_500x500_Silver_04.png',
  'R6S_RANK_500x500_Silver_05.png',

  // Bronze
  'R6S_RANK_500x500_Bronze_01.png',
  'R6S_RANK_500x500_Bronze_02.png',
  'R6S_RANK_500x500_Bronze_03.png',
  'R6S_RANK_500x500_Bronze_04.png',
  'R6S_RANK_500x500_Bronze_05.png',

  // Copper
  'R6S_RANK_500x500_Copper_01.png',
  'R6S_RANK_500x500_Copper_02.png',
  'R6S_RANK_500x500_Copper_03.png',
  'R6S_RANK_500x500_Copper_04.png',
  'R6S_RANK_500x500_Copper_05.png',

  // Unranked
  'unranked.png',
];

/**
 * CDN URLs for downloading rank icons
 */
export const RANK_CDN_BASE_URL = 'https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn';

/**
 * Get the CDN URL for a rank icon filename
 */
export function getRankCDNUrl(filename: string): string {
  // This is a placeholder - actual CDN URLs would need proper hash paths
  // You'll need to manually download these from the game assets
  return `${RANK_CDN_BASE_URL}/.../${filename}`;
}
