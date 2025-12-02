import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",  // necesario en Vercel para app router
};

export default nextConfig;
