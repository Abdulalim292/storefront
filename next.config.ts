import type { NextConfig } from "next";

const isProduction = process.env.NODE_ENV === 'production';

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000' },
];

// The storefront loads no third-party scripts. Inline script/style allowances
// are still required because Next.js hydrates data through inline tags.
const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "manifest-src 'self'",
  "worker-src 'self' blob:",
].join('; ');

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.0.117'],
  poweredByHeader: false,
  images: {
    // Serve compact modern formats when the browser supports them while keeping
    // the original source format as the compatibility fallback.
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1440, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 480],
    qualities: [70, 75, 80],
    minimumCacheTTL: 604800,
    // Bound the optimizer's outbound requests so a slow or hostile image host
    // cannot stream an unbounded response into the cache.
    maximumRedirects: 1,
    maximumResponseBody: 15_000_000,
    dangerouslyAllowLocalIP: false,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/seed/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
        port: '',
        pathname: '/wikipedia/commons/**',
      },
      {
        protocol: 'https',
        hostname: 'commons.wikimedia.org',
        port: '',
        pathname: '/wiki/Special:FilePath/**',
        search: '?width=900',
      },
      {
        protocol: 'https',
        hostname: 'commons.wikimedia.org',
        port: '',
        pathname: '/wiki/Special:FilePath/**',
      },
      {
        protocol: 'https',
        hostname: 'www.zichai.net',
        port: '',
        pathname: '/favicon.ico',
      },
      {
        protocol: 'https',
        hostname: 'fada-gearbox.com',
        port: '',
        pathname: '/favicon.ico',
      },
      {
        protocol: 'https',
        hostname: 'cdn.merheinflare.com',
        port: '',
        pathname: '/public-site/products/**',
      },
      {
        protocol: 'https',
        hostname: 'image.made-in-china.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'mmaks.ru',
        port: '',
        pathname: '/sites/default/files/**',
      },
      {
        protocol: 'https',
        hostname: 'file.infoservision.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.yuchaiinternational.com',
        port: '',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'www.industrialmarinepower.com',
        port: '',
        pathname: '/img/**',
      },
      {
        protocol: 'https',
        hostname: 'img.nauticexpo.es',
        port: '',
        pathname: '/images_ne/**',
      },
      {
        protocol: 'https',
        hostname: 'i.ebayimg.com',
        port: '',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 'rebuiltcumminsenginesales.com',
        port: '',
        pathname: '/uploaded_images/**',
      },
      {
        protocol: 'https',
        hostname: 'product.hstatic.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'profmotors.ru',
        port: '',
        pathname: '/thumb/**',
      },
      {
        protocol: 'https',
        hostname: 'www.truck1-ao.com',
        port: '',
        pathname: '/img/**',
      },
      {
        protocol: 'https',
        hostname: 'www.deere.ca',
        port: '',
        pathname: '/assets/images/common/industries/engines-and-drivetrain/product/**',
      },
      {
        protocol: 'https',
        hostname: 'fada-gearbox.com',
        port: '',
        pathname: '/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'fadagearbox.com',
        port: '',
        pathname: '/wp-content/uploads/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          ...securityHeaders,
          ...(isProduction
            ? [{ key: 'Content-Security-Policy', value: contentSecurityPolicy }]
            : []),
        ],
      },
      {
        source: '/api/admin/:path*',
        headers: [{ key: 'Cache-Control', value: 'no-store' }],
      },
      {
        source: '/admin/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-store' },
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
        ],
      },
      {
        source: '/brand/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=604800, stale-while-revalidate=86400' },
        ],
      },
    ];
  },
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    // The lockfile in /home/alim is outside this repository, so keep Turbopack
    // scoped to the storefront project.
    root: process.cwd(),
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
