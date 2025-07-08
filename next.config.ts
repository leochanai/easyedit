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
        hostname: "napkinsdev.s3.us-east-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "replicate.delivery",
      },
      {
        protocol: "https",
        hostname: "fal.media",
      },
    ],
  },
};

export default nextConfig;
