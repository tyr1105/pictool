import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/pictool',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
