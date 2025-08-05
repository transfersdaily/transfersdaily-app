/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Disable ESLint during builds to prevent warnings from failing the build
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Minimal configuration for App Router
  experimental: {
    // Remove any experimental features that might cause issues
  },

  // Image configuration using the new remotePatterns format
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'd2w4vhlo0um37d.cloudfront.net',
        port: '',
        pathname: '/articles/**',
      },
      {
        protocol: 'https',
        hostname: 'd1ix9g9onn4adc.cloudfront.net',
        port: '',
        pathname: '/articles/**',
      },
      {
        protocol: 'https',
        hostname: '*.cloudfront.net',
        port: '',
        pathname: '/articles/**',
      },
      {
        protocol: 'https',
        hostname: '*.amazonaws.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 's3.amazonaws.com',
        port: '',
        pathname: '/**',
      }
    ]
  },
}

module.exports = nextConfig
