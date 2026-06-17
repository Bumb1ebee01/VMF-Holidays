import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    cpus: 4,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/dhmmvsjim/**",
      },
    ],
  },
};

export default nextConfig;
