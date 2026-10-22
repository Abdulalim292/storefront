import type { Metadata } from 'next';
import { ProductPhotoManager } from '@/components/admin/ProductPhotoManager';

export const metadata: Metadata = { title: 'Product photos | Noor Alam Machineries' };

export default function AdminProductPhotosPage() {
  return <ProductPhotoManager />;
}
