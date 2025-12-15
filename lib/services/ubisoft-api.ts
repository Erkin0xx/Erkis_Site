/**
 * Direct Ubisoft API Integration
 * Based on r6api.js-next implementation but optimized for Next.js
 */

const UBI_APP_ID = "3587dcbb-7f81-457c-9781-0e3f29f6f56a";
const SPACE_IDS = {
  uplay: "5172a557-50b5-4665-b7db-e3f2e8c5041d",
  psn: "05bfb3f7-6c21-4c42-be1f-97a33fb5cf66",
  xbl: "98a601e5-ca91-4440-b1c5-753f601a2c90",
};

const SANDBOX_IDS = {
  uplay: "OSBOR_PC_LNCH_A",
  psn: "OSBOR_PS4_LNCH_A",
  xbl: "OSBOR_XBOXONE_LNCH_A",
};

interface AuthToken {
  ticket: string;
  sessionId: string;
  expiration: string;
}

let cachedAuth: AuthToken | null = null;

/**
 * Authenticate with Ubisoft (with trustedDevice challenge)
 */
async function authenticate(
  email: string,
  password: string
): Promise<AuthToken> {
  // Check if we have a valid cached token
  if (cachedAuth && new Date(cachedAuth.expiration) > new Date()) {
    return cachedAuth;
  }

  console.log("🔐 Authenticating with email:", email);
  console.log("🔐 Password length:", password?.length, "chars");

  const basicAuth = Buffer.from(`${email}:${password}`).toString("base64");

  // Prepare the challenge header
  const response = await fetch(
    "https://public-ubiservices.ubi.com/v3/profiles/sessions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${basicAuth}`,
        "Ubi-AppId": UBI_APP_ID,
        "Ubi-Challenge": `{"category":"trustedDevice","challengeId":"00000000-0000-0000-0000-000000000000"}`,
      },
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Authentication failed: ${response.statusText} - ${errorText}`
    );
  }

  const data = await response.json();

  // Check if 2FA is required
  if (data.twoFactorAuthenticationTicket && !data.ticket) {
    throw new Error(
      "Two-factor authentication is required. Please disable 2FA on the Ubisoft account."
    );
  }

  cachedAuth = {
    ticket: data.ticket,
    sessionId: data.sessionId,
    expiration: data.expiration,
  };

  return cachedAuth;
}

/**
 * Find user by username
 */
export async function findUserByUsername(
  platform: "uplay" | "psn" | "xbl",
  username: string
): Promise<any> {
  const email = process.env.UBI_EMAIL;
  const password = process.env.UBI_PASSWORD;

  if (!email || !password) {
    throw new Error("Ubisoft credentials not configured");
  }

  const auth = await authenticate(email, password);

  const response = await fetch(
    `https://public-ubiservices.ubi.com/v3/profiles?namesOnPlatform=${encodeURIComponent(username)}&platformType=${platform}`,
    {
      headers: {
        Authorization: `Ubi_v1 t=${auth.ticket}`,
        "Ubi-AppId": UBI_APP_ID,
        "Ubi-SessionId": auth.sessionId,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to find user: ${response.statusText}`);
  }

  const data = await response.json();
  return data.profiles?.[0] || null;
}

/**
 * Get user progression (level, XP)
 */
export async function getUserProgression(
  platform: "uplay" | "psn" | "xbl",
  profileId: string
): Promise<any> {
  const email = process.env.UBI_EMAIL;
  const password = process.env.UBI_PASSWORD;

  if (!email || !password) {
    throw new Error("Ubisoft credentials not configured");
  }

  const auth = await authenticate(email, password);
  const spaceId = SPACE_IDS[platform];
  const sandboxId = SANDBOX_IDS[platform];

  const response = await fetch(
    `https://public-ubiservices.ubi.com/v1/spaces/${spaceId}/sandboxes/${sandboxId}/r6playerprofile/playerprofile/progressions?profile_ids=${profileId}`,
    {
      headers: {
        Authorization: `Ubi_v1 t=${auth.ticket}`,
        "Ubi-AppId": UBI_APP_ID,
        "Ubi-SessionId": auth.sessionId,
      },
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Progression API error:", response.status, errorText);
    throw new Error(`Failed to get progression: ${response.statusText}`);
  }

  const data = await response.json();
  return data.player_profiles?.[0] || null;
}

/**
 * Get user profile info by ID (for getting username)
 */
export async function getUserProfile(profileId: string): Promise<any> {
  const email = process.env.UBI_EMAIL;
  const password = process.env.UBI_PASSWORD;

  if (!email || !password) {
    throw new Error("Ubisoft credentials not configured");
  }

  const auth = await authenticate(email, password);

  const response = await fetch(
    `https://public-ubiservices.ubi.com/v3/profiles?profileIds=${profileId}`,
    {
      headers: {
        Authorization: `Ubi_v1 t=${auth.ticket}`,
        "Ubi-AppId": UBI_APP_ID,
        "Ubi-SessionId": auth.sessionId,
      },
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Profile API error:", response.status, errorText);
    throw new Error(`Failed to get profile: ${response.statusText}`);
  }

  const data = await response.json();
  return data.profiles?.[0] || null;
}

/**
 * Get user seasonal stats
 */
export async function getUserSeasonal(
  platform: "uplay" | "psn" | "xbl",
  profileId: string,
  seasonId: number = -1
): Promise<any> {
  const email = process.env.UBI_EMAIL;
  const password = process.env.UBI_PASSWORD;

  if (!email || !password) {
    throw new Error("Ubisoft credentials not configured");
  }

  const auth = await authenticate(email, password);
  const spaceId = SPACE_IDS[platform];
  const sandboxId = SANDBOX_IDS[platform];

  const response = await fetch(
    `https://prod.datadev.ubisoft.com/v1/profiles/${profileId}/playerstats?spaceId=${spaceId}&view=seasonal&aggregation=summary&gameMode=all&platformGroup=pc&seasons=${seasonId}`,
    {
      headers: {
        Authorization: `Ubi_v1 t=${auth.ticket}`,
        "Ubi-AppId": UBI_APP_ID,
        "Ubi-SessionId": auth.sessionId,
        Expiration: auth.expiration,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to get seasonal stats: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}
