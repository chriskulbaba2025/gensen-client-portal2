// next.config.js
import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'omnipressence.com',
        port: '',
        pathname: '/**',
      },
    ],
  },

  webpack(config) {
    // Allow importing SVGs from /src/icons
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      include: [path.resolve(__dirname, 'src/icons')],
      use: ['@svgr/webpack'],
    });
    return config;
  },
};

export default nextConfig;
