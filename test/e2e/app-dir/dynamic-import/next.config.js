/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  experimental: {
    turbo: {
      moduleIdStrategy: 'named',
      minify: false,
    },
  },
}

module.exports = nextConfig
