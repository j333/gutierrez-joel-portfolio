/** @type {import('next').NextConfig} */
const nextConfig = {
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
