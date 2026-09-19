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
      {
        source: '/',
        destination: '/login',
        permanent: false, // 307 temporary redirect for flexible auth routing
      },
      { source: '/apply', destination: '/student', permanent: false },
      { source: '/scan', destination: '/conductor', permanent: false },
    ];
  },
};

module.exports = nextConfig;
