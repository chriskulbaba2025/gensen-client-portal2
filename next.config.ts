// next.config.ts
import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  images: {
    unoptimized: false, // let Next.js handle external images correctly
    remotePatterns: [
      {
        protocol: "https",
        hostname: "omnipressence.com",
        port: "",
        pathname: "/wp-content/uploads/**", // precise match for your icons
      },
    ],
  },

  webpack(config) {
    // Allow importing SVGs from /src/icons as React components
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      include: [path.resolve(__dirname, "src/icons")],
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

export default nextConfig;