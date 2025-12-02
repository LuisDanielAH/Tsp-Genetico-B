/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  experimental: {
    appDir: true, // importante si usas App Router
  },
};

module.exports = nextConfig;
