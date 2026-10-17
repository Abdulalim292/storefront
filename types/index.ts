export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'electronics' | 'home-decor' | 'accessories';
  images: string[];
  featured: boolean;
  stockStatus: 'in-stock' | 'low-stock' | 'out-of-stock';
}

export interface CartItem extends Product {
  quantity: number;
}
