const withNextIntl = require('next-intl/plugin')();

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  transpilePackages: ['@tofi/ui', '@tofi/auth', '@tofi/database', '@tofi/types'],
  images: {
    domains: ['localhost', 'minio', 'tofi.ch'],
    formats: ['image/webp', 'image/avif'],
  },
  // Swiss-specific optimizations
  i18n: {
    locales: ['de-CH', 'fr-CH', 'it-CH', 'en'],
    defaultLocale: 'de-CH',
    localeDetection: true,
  },
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

module.exports = withNextIntl(nextConfig);