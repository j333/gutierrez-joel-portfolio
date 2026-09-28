/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/:lang(en|es)/about.md',
        destination: '/md/:lang/about',
      },
      {
        source: '/:lang(en|es)/index.md',
        destination: '/md/:lang/index',
      },
      {
        source: '/:lang(en|es)/notes/:slug.md',
        destination: '/md/:lang/notes/:slug',
      },
      {
        source: '/:lang(en|es)/experience/:slug.md',
        destination: '/md/:lang/experience/:slug',
      },
      {
        source: '/:lang(en|es)/:slug.md',
        destination: '/md/:lang/:slug',
      },
    ];
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [256, 384],
    qualities: [75, 100],
  },
  // Vercel injects an adapter that skips NFT traces; standalone then crashes the build.
  output: process.env.VERCEL ? undefined : 'standalone',
  // LAN devices on the same Wi-Fi need this to load /_next assets in development.
  allowedDevOrigins: ['*.local', '192.168.*.*', '10.*.*.*', '172.*.*.*'],
  turbopack: {
    root: process.cwd(),
    resolveAlias: {
      '../build/polyfills/polyfill-module': './app/lib/modern-polyfill.js',
      'next/dist/build/polyfills/polyfill-module': './app/lib/modern-polyfill.js',
    },
  },
  experimental: {
    // Inline CSS to remove the render-blocking stylesheet request (~120ms on mobile PSI).
    inlineCss: true,
  },
};

export default nextConfig;
