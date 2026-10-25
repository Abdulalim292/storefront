export type EquipmentGroup = 'marine-engines' | 'marine-gearboxes' | 'heavy-machinery';

export const PRODUCT_CATEGORY_VALUES = [
  'turbocharging',
  'cylinder-assembly',
  'pistons-rings',
  'valve-train',
  'fuel-system',
  'engine-components',
  'cooling-system',
  'gearbox-parts',
  'heavy-equipment-parts',
  'equipment',
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORY_VALUES)[number];

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
  price?: number | null;
  specifications?: string[];
  equipmentGroup?: EquipmentGroup;
}

export interface CartItem extends Product {
  quantity: number;
}
