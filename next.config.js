/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  basePath: '/ai-hr',
  assetPrefix: '/ai-hr/',
};
module.exports = nextConfig;