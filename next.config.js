/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove output: 'export' to enable server-side features
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  // Disable SWC for WebContainer compatibility
  swcMinify: false,
};

module.exports = nextConfig;