import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

if (isDev) {
  require("./proxy-setup");
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // 允许任何 R2 自定义域名
      },
      {
        protocol: "https",
        hostname: "replicate.delivery",
      },
      {
        protocol: "https",
        hostname: "fal.media",
      },
      {
        protocol: "https",
        hostname: "*.r2.cloudflarestorage.com", // R2 默认域名
      },
    ],
  },
};

export default nextConfig;
