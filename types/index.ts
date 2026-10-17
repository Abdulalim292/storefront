export type ProductCategory =
  | 'turbocharging'
  | 'cylinder-assembly'
  | 'pistons-rings'
  | 'valve-train'
  | 'fuel-system'
  | 'engine-components'
  | 'cooling-system';

export interface Product {
  id: string;
  name: string;
  description: string;
  category: ProductCategory;
  images: string[];
  imageSourceUrl: string;
  imageCredit: string;
  imageLicense: string;
  imageLicenseUrl: string;
}

export interface CartItem extends Product {
  quantity: number;
}
