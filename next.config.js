/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  webpack(config) {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname),
    };
    return config;
  },
  async redirects() {
    return [
      { source: '/apply', destination: '/student', permanent: false },
      { source: '/scan', destination: '/conductor', permanent: false },
    ];
  },
};

module.exports = nextConfig;
