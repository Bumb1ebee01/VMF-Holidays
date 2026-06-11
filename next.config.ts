import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // The local `prisma dev` WASM Postgres handles few concurrent
    // connections; too many static-gen workers drop connections (P1017).
    cpus: 4,
  },
};

export default nextConfig;
