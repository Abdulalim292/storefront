import catalog from './catalog.json';
import type { EquipmentGroup, Product } from '@/types';

export interface EquipmentModel {
  id: string;
  name: string;
  description: string;
  image: string;
  specifications?: string[];
}

type EquipmentProduct = Product & { equipmentGroup?: EquipmentGroup };

const models = catalog.products.filter((item) => item.category === 'equipment') as EquipmentProduct[];

const toModel = (item: EquipmentProduct): EquipmentModel => ({
  id: item.id,
  name: item.name,
  description: item.description,
  image: item.images[0],
  specifications: item.specifications,
});

const byGroup = (group: EquipmentGroup) => models
  .filter((item) => item.equipmentGroup === group)
  .map(toModel);

export const marineEngineModels = byGroup('marine-engines');
export const marineGearboxModels = byGroup('marine-gearboxes');
export const heavyMachineryModels = byGroup('heavy-machinery');
export const EQUIPMENT_PRODUCTS = models as Product[];

function featured(items: EquipmentModel[], id: string): EquipmentModel {
  const model = items.find((item) => item.id === id) ?? items[0];
  if (!model) throw new Error(`The catalog must include equipment in this group (looking for ${id}).`);
  return model;
}

export const featuredMarineEngine = featured(marineEngineModels, 'cummins-kta19');
export const featuredMarineGearbox = featured(marineGearboxModels, 'fada-fd170');
export const featuredHeavyMachinery = featured(heavyMachineryModels, 'lonking-cdm833-wheel-loader');
