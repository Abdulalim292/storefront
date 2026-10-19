import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Noor Alam Machineries',
    short_name: 'Noor Alam',
    description: 'Marine engines, gearboxes, machinery, and spare parts.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#111b18',
    icons: [
      {
        src: '/brand/noor-alam-icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/brand/noor-alam-icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
    shortcuts: [
      {
        name: 'View Inquiry List',
        url: '/',
        description: 'Check your parts inquiry list',
      },
      {
        name: 'Browse Parts',
        url: '/products',
        description: 'Explore our catalog of marine engine parts',
      },
    ],
  };
}
