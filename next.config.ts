import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
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
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
