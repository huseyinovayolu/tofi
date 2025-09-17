const withNextIntl = require('next-intl/plugin')();

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true
  },
  images: {
    domains: ['api.placeholder.com', 'via.placeholder.com'],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  async rewrites() {
    return [
      {
        source: '/api/placeholder/:path*',
        destination: 'https://via.placeholder.com/:path*',
      },
    ];
  },
};

module.exports = withNextIntl(nextConfig);