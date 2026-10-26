import type { EquipmentGroup, Product, ProductCategory } from '@/types';
import { PRODUCTS } from './products';
import {
  EQUIPMENT_PRODUCTS,
  featuredHeavyMachinery,
  featuredMarineEngine,
  featuredMarineGearbox,
} from './equipment';

export type CategoryKind = 'equipment' | 'parts';

export interface CategoryLanding {
  slug: string;
  label: string;
  kicker: string;
  heading: string;
  description: string;
  intro: string;
  kind: CategoryKind;
  equipmentGroup?: EquipmentGroup;
  productCategory?: ProductCategory;
  buyingNotes: string[];
  related: string[];
}

export const CATEGORY_LANDINGS: CategoryLanding[] = [
  {
    slug: 'marine-engines',
    label: 'Marine engines',
    kicker: 'Equipment',
    heading: 'Marine engines built for continuous work.',
    description: 'Marine diesel engines from Weichai, Cummins, Yuchai, Caterpillar, and MAN for propulsion and auxiliary duty.',
    intro: 'Compare engine families by displacement, power band, rated speed, and aspiration. Final rating depends on the exact model, duty classification, and vessel installation, so the engine model and serial number are confirmed before a quote.',
    kind: 'equipment',
    equipmentGroup: 'marine-engines',
    buyingNotes: [
      'Engine model, rating, and rated speed',
      'Vessel type, duty, and expected load profile',
      'Gearbox ratio and propeller requirements',
    ],
    related: ['marine-gearboxes', 'engine-components', 'turbocharging'],
  },
  {
    slug: 'marine-gearboxes',
    label: 'Marine gearboxes',
    kicker: 'Equipment',
    heading: 'Marine gearboxes matched to engine output.',
    description: 'FADA marine reduction gearboxes for workboats, fishing vessels, and commercial craft.',
    intro: 'Select a gearbox by input speed, reduction ratio, transmission capacity, and propeller thrust. The engine’s continuous rating and the vessel’s operating profile determine the right model.',
    kind: 'equipment',
    equipmentGroup: 'marine-gearboxes',
    buyingNotes: [
      'Engine model and continuous power rating',
      'Required reduction ratio and shaft speed',
      'Propeller thrust and installation space',
    ],
    related: ['marine-engines', 'gearbox-parts', 'heavy-machinery'],
  },
  {
    slug: 'heavy-machinery',
    label: 'Heavy machinery',
    kicker: 'Equipment',
    heading: 'Heavy machinery for demanding sites.',
    description: 'Wheel loaders and industrial diesel engines for construction, material handling, and off-highway work.',
    intro: 'Machine output, hydraulic performance, and service access all matter on site. Confirm the equipment model, year, and engine configuration so the machine and its service parts can be matched correctly.',
    kind: 'equipment',
    equipmentGroup: 'heavy-machinery',
    buyingNotes: [
      'Machine model, year, and configuration',
      'Engine code and emissions tier',
      'Attachment, duty cycle, and site conditions',
    ],
    related: ['heavy-equipment-parts', 'marine-engines', 'engine-components'],
  },
  {
    slug: 'turbocharging',
    label: 'Turbocharging',
    kicker: 'Engine parts',
    heading: 'Turbocharger assemblies and replacement cores.',
    description: 'Turbocharger assemblies and cartridges for marine and industrial diesel engines.',
    intro: 'A turbocharger is matched to the engine’s airflow, fuelling, and duty. Confirm the turbo model, engine model, and serial number before ordering so the housing, trim, and actuator configuration are correct.',
    kind: 'parts',
    productCategory: 'turbocharging',
    buyingNotes: [
      'Turbocharger model and part number',
      'Engine model, rating, and serial number',
      'Whether a complete assembly or cartridge is required',
    ],
    related: ['engine-components', 'fuel-system', 'marine-engines'],
  },
  {
    slug: 'cylinder-assembly',
    label: 'Cylinder assembly',
    kicker: 'Engine parts',
    heading: 'Cylinder liners, pistons, and overhaul parts.',
    description: 'Cylinder liners, pistons, and related components for diesel engine overhauls.',
    intro: 'Overhaul parts must match the block, crankshaft, and cylinder-head configuration. Bore size, liner type, piston dimensions, and part numbers are checked against the engine before a set is quoted.',
    kind: 'parts',
    productCategory: 'cylinder-assembly',
    buyingNotes: [
      'Engine model and serial number',
      'Bore diameter and liner type',
      'Piston dimensions and part number',
    ],
    related: ['pistons-rings', 'valve-train', 'engine-components'],
  },
  {
    slug: 'pistons-rings',
    label: 'Pistons & rings',
    kicker: 'Engine parts',
    heading: 'Pistons and rings for diesel rebuilds.',
    description: 'Pistons, piston rings, and related components for diesel engine rebuilds.',
    intro: 'Piston and ring sets are selected by engine model, bore, compression ratio, and ring configuration. Confirm the existing part numbers and any oversize machining before ordering.',
    kind: 'parts',
    productCategory: 'pistons-rings',
    buyingNotes: [
      'Engine model and piston part number',
      'Bore size and oversize requirement',
      'Ring configuration and compression ratio',
    ],
    related: ['cylinder-assembly', 'engine-components', 'valve-train'],
  },
  {
    slug: 'valve-train',
    label: 'Valve train',
    kicker: 'Engine parts',
    heading: 'Valves, seats, and guides for cylinder-head service.',
    description: 'Intake and exhaust valves, valve seats, guides, and valve-train components.',
    intro: 'Cylinder-head work depends on accurate dimensions and clean mating surfaces. Confirm the engine model, valve position, stem diameter, and seat dimensions, then check clearances during assembly.',
    kind: 'parts',
    productCategory: 'valve-train',
    buyingNotes: [
      'Engine model and cylinder-head configuration',
      'Valve position, stem diameter, and head diameter',
      'Seat and guide dimensions or part numbers',
    ],
    related: ['cylinder-assembly', 'engine-components', 'fuel-system'],
  },
  {
    slug: 'fuel-system',
    label: 'Fuel system',
    kicker: 'Engine parts',
    heading: 'Fuel injection parts matched to the engine.',
    description: 'Injector nozzles and fuel-system components for diesel engine maintenance.',
    intro: 'Fuel-system parts are matched by injector or nozzle number, engine specification, and pump configuration. Testing and calibration are recommended before installation.',
    kind: 'parts',
    productCategory: 'fuel-system',
    buyingNotes: [
      'Injector or nozzle number',
      'Engine model and pump configuration',
      'Calibration or testing requirements',
    ],
    related: ['turbocharging', 'engine-components', 'valve-train'],
  },
  {
    slug: 'engine-components',
    label: 'Engine components',
    kicker: 'Engine parts',
    heading: 'Gaskets, bearings, and engine service parts.',
    description: 'Cylinder-head gaskets, main bearings, cylinder heads, and other engine components.',
    intro: 'Engine components cover a wide range of overhaul and maintenance work. Share the engine model, serial number, and the relevant dimensions or part numbers so the correct item can be identified.',
    kind: 'parts',
    productCategory: 'engine-components',
    buyingNotes: [
      'Engine model and serial number',
      'Part number or dimensions where available',
      'Standard or oversize bearing and piston sizes',
    ],
    related: ['cylinder-assembly', 'valve-train', 'cooling-system'],
  },
  {
    slug: 'cooling-system',
    label: 'Cooling system',
    kicker: 'Engine parts',
    heading: 'Cooling-system parts for marine and industrial engines.',
    description: 'Water pumps, impellers, thermostats, and cooling-system components.',
    intro: 'Cooling-system parts are matched by engine model, pump type, and installation. Confirm the existing part number and pulley or housing configuration before ordering.',
    kind: 'parts',
    productCategory: 'cooling-system',
    buyingNotes: [
      'Engine model and cooling-system layout',
      'Pump or impeller part number',
      'Thermostat opening temperature where applicable',
    ],
    related: ['engine-components', 'marine-engines', 'turbocharging'],
  },
  {
    slug: 'gearbox-parts',
    label: 'Gearbox parts',
    kicker: 'Transmission parts',
    heading: 'Gearbox parts for marine transmissions.',
    description: 'Housings, shafts, gears, seals, and service parts for marine gearboxes.',
    intro: 'Gearbox parts are specific to the transmission model and serial number. Confirm the gearbox model, ratio, and the affected assembly before ordering shafts, gears, seals, or housings.',
    kind: 'parts',
    productCategory: 'gearbox-parts',
    buyingNotes: [
      'Gearbox model and serial number',
      'Reduction ratio and affected assembly',
      'Shaft, gear, or seal part numbers where available',
    ],
    related: ['marine-gearboxes', 'engine-components', 'heavy-equipment-parts'],
  },
  {
    slug: 'heavy-equipment-parts',
    label: 'Heavy equipment parts',
    kicker: 'Machinery parts',
    heading: 'Undercarriage, hydraulic, and bucket parts.',
    description: 'Track, hydraulic, and bucket components for excavators, loaders, and heavy machinery.',
    intro: 'Heavy-equipment parts are matched by machine model, serial number, and component position. Confirm the machine configuration and the dimensions or part numbers of the existing component.',
    kind: 'parts',
    productCategory: 'heavy-equipment-parts',
    buyingNotes: [
      'Machine model, serial number, and year',
      'Component position and dimensions',
      'Original or aftermarket part number',
    ],
    related: ['heavy-machinery', 'engine-components', 'gearbox-parts'],
  },
];

export function getCategoryLanding(slug: string) {
  return CATEGORY_LANDINGS.find((category) => category.slug === slug);
}

export function getCategoryProducts(category: CategoryLanding): Product[] {
  if (category.kind === 'equipment' && category.equipmentGroup) {
    return EQUIPMENT_PRODUCTS.filter((product) => product.equipmentGroup === category.equipmentGroup);
  }

  if (category.kind === 'parts' && category.productCategory) {
    return PRODUCTS.filter((product) => product.category === category.productCategory);
  }

  return [];
}

export function getCategoryForProduct(product: Product): CategoryLanding | undefined {
  if (product.category === 'equipment') {
    return CATEGORY_LANDINGS.find(
      (category) => category.equipmentGroup && category.equipmentGroup === product.equipmentGroup,
    );
  }

  return CATEGORY_LANDINGS.find((category) => category.productCategory === product.category);
}

export function getCategoryImageSource(category: CategoryLanding): { productId: string; src: string } {
  if (category.slug === 'marine-engines') {
    return { productId: featuredMarineEngine.id, src: featuredMarineEngine.image };
  }
  if (category.slug === 'marine-gearboxes') {
    return { productId: featuredMarineGearbox.id, src: featuredMarineGearbox.image };
  }
  if (category.slug === 'heavy-machinery') {
    return { productId: featuredHeavyMachinery.id, src: featuredHeavyMachinery.image };
  }

  const firstProduct = getCategoryProducts(category)[0];
  if (!firstProduct) {
    return { productId: featuredMarineEngine.id, src: featuredMarineEngine.image };
  }
  return { productId: firstProduct.id, src: firstProduct.images[0] ?? featuredMarineEngine.image };
}

export function getCategoryImage(category: CategoryLanding): string {
  return getCategoryImageSource(category).src;
}
