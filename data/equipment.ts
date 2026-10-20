import catalog from './catalog.json';
import type { Product } from '@/types';

export interface EquipmentModel {
  id: string;
  name: string;
  description: string;
  image: string;
  specifications?: string[];
}

const models = catalog.products.filter((item) => item.category === 'equipment');
const toModel = (item: (typeof models)[number]): EquipmentModel => ({
  id: item.id,
  name: item.name,
  description: item.description,
  image: item.images[0],
  specifications: item.specifications,
});

export const marineEngineModels = models.slice(0, 8).map(toModel);
export const marineGearboxModels = models.slice(8, 13).map(toModel);
export const heavyMachineryModels = models.slice(13).map(toModel);
export const EQUIPMENT_PRODUCTS = models as Product[];
