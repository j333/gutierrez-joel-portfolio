/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // LAN devices on the same Wi-Fi need this to load /_next assets in development.
  allowedDevOrigins: ['*.local', '192.168.*.*', '10.*.*.*', '172.*.*.*'],
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
