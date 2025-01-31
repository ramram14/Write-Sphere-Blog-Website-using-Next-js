import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: '*',
        port: '',
        pathname: '/**'
      },
      {
        protocol: "http",
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**'
      }
    ]
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '3mb'
    }
  },
  eslint: {
    ignoreDuringBuilds: true
  }
};

export default nextConfig;
