/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/blog',
        destination: '/writing',
        permanent: true,
      },
      {
        source: '/blog/:path*',
        destination: '/writing/:path*',
        permanent: true,
      },
      {
        source: '/experience',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/experience/getgloby',
        destination: '/experience/marketfully',
        permanent: true,
      },
      {
        source: '/rehab-boost',
        destination: '/golf-boost',
        permanent: true,
      },
      {
        source: '/experience/rehab-boost',
        destination: '/experience/golf-boost',
        permanent: true,
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
