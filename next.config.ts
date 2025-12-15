import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
      {
        protocol: "https",
        hostname: "ubisoft-avatars.akamaized.net",
      },
      {
        protocol: "https",
        hostname: "staticctf.ubisoft.com",
      },
    ],
  },
};

export default nextConfig;
