import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://web-production-9463.up.railway.app/:path*',
      },
    ];
  },
};

export default nextConfig;
