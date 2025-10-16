<<<<<<< HEAD
// next.config.js
import type { NextConfig } from 'next';
import path from 'path';
=======
﻿import type { NextConfig } from "next";
>>>>>>> 79875a4 (Update Navbar and tiles to link to brand voice)

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
<<<<<<< HEAD
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
=======
      { protocol: "https", hostname: "omnipressence.com", pathname: "/wp-content/**" },
    ],
  },
>>>>>>> 79875a4 (Update Navbar and tiles to link to brand voice)
};

export default nextConfig;
