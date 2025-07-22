/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Basic experimental features without aggressive optimizations
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons']
  },

  // Minimal webpack configuration to avoid module loading issues
  webpack: (config, { isServer }) => {
    // Only add essential fallbacks
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      os: false,
    }

    return config
  },

  // Headers for better caching
  async headers() {
    return [
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },

  // Optimize images
  images: {
    domains: ['d2w4vhlo0um37d.cloudfront.net', 's3.amazonaws.com'],
    formats: ['image/webp', 'image/avif'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'd2w4vhlo0um37d.cloudfront.net',
        port: '',
        pathname: '/articles/**',
      },
      {
        protocol: 'https',
        hostname: '*.amazonaws.com',
        port: '',
        pathname: '/**',
      }
    ]
  },
}

module.exports = nextConfig
