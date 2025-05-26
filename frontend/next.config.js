/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove output: 'export' to allow API routes
  // output: 'export',

  eslint: {
    ignoreDuringBuilds: true,
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    unoptimized: true,
  },

  // Updated for Next.js 15
  serverExternalPackages: [],

  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
    BACKEND_URL: process.env.BACKEND_URL,
  },

  // Configure redirects if needed
  async redirects() {
    return []
  },

  // Configure rewrites if needed
  async rewrites() {
    return []
  },

  // Webpack configuration
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Fix for potential module resolution issues
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
    }

    return config
  },
}

module.exports = nextConfig
