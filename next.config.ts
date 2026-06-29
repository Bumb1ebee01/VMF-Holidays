import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    cpus: 4,
  },
  // Don't advertise the framework; trims a response header on every request.
  poweredByHeader: false,
  compress: true,
  images: {
    // Serve AVIF/WebP where the browser supports it — large byte savings on hero
    // photos vs. the source JPEGs.
    formats: ["image/avif", "image/webp"],
    // Optimised remote images are immutable; cache them hard at the edge/browser.
    minimumCacheTTL: 2_592_000, // 30 days
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/dhmmvsjim/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
        pathname: "/wikipedia/commons/**",
      },
    ],
  },
  async redirects() {
    return [
      // The standalone packages listing was merged into Destinations.
      { source: "/packages", destination: "/destinations", permanent: false },
    ];
  },
  async headers() {
    return [
      {
        // Baseline security headers across the whole site.
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(self)",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
