import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

// Content-Security-Policy. We keep 'unsafe-inline' for scripts/styles because the
// site uses static rendering (a nonce-based CSP would force every page to render
// dynamically, killing SSG/CDN caching) and relies on inline JSON-LD + inline
// styles from framer-motion/React. The real value here is locking down which
// *external* origins may load: only the hosts we actually use. Update this list
// when adding a new third-party (e.g. an analytics or maps provider).
//   - unpkg.com .................. Leaflet JS/CSS (Trip Builder route map)
//   - *.tile.openstreetmap.org ... map tiles
//   - res.cloudinary.com / images.unsplash.com / upload.wikimedia.org … photos
//   - www.google.com / maps.google.com … embedded Google Map (Contact page)
//   - googletagmanager.com / *.google-analytics.com … GA4 (loads only if
//     NEXT_PUBLIC_GA_ID is set — see components/analytics/Analytics.tsx)
const csp = [
  `default-src 'self'`,
  `script-src 'self' 'unsafe-inline' https://unpkg.com https://www.googletagmanager.com${isDev ? " 'unsafe-eval'" : ""}`,
  `style-src 'self' 'unsafe-inline' https://unpkg.com`,
  `img-src 'self' data: blob: https://res.cloudinary.com https://images.unsplash.com https://upload.wikimedia.org https://*.tile.openstreetmap.org https://unpkg.com https://www.googletagmanager.com https://*.google-analytics.com`,
  `font-src 'self'`,
  `connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com${isDev ? " ws: wss:" : ""}`,
  `frame-src 'self' https://www.google.com https://maps.google.com`,
  `object-src 'none'`,
  `base-uri 'self'`,
  `form-action 'self'`,
  `frame-ancestors 'self'`,
  ...(isDev ? [] : [`upgrade-insecure-requests`]),
].join("; ");

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
      // The standalone packages listing was permanently merged into Destinations;
      // use a 308 so search engines transfer ranking signals and drop the old URL.
      { source: "/packages", destination: "/destinations", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        // Baseline security headers across the whole site.
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: csp },
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
