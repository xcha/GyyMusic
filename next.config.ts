import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '**.music.126.net',
      },
      {
        protocol: 'https',
        hostname: '**.music.126.net',
      },
    ],
  },
};

export default nextConfig;
