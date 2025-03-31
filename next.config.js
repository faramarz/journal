/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config, { dev, isServer }) => {
    // Disable webpack caching in development
    if (dev) {
      config.cache = false
    }
    return config
  },
}

module.exports = nextConfig 