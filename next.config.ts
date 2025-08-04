import type { NextConfig } from "next";
import { withPlausibleProxy } from 'next-plausible';

const nextConfig: NextConfig = {
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    domains: [],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

// Wrap with Plausible proxy to avoid ad blockers
export default withPlausibleProxy()(nextConfig);
