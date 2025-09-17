import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  // A list of all locales that are supported
  locales: ['de', 'fr'],

  // Used when no locale matches
  defaultLocale: 'de'
});

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(de|fr)/:path*']
};