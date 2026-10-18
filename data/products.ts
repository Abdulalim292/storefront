import { Product, ProductCategory } from '@/types';

export const CATEGORIES: { label: string; value: ProductCategory | 'all' }[] = [
  { label: 'All parts', value: 'all' },
  { label: 'Turbocharging', value: 'turbocharging' },
  { label: 'Cylinder assembly', value: 'cylinder-assembly' },
  { label: 'Pistons & rings', value: 'pistons-rings' },
  { label: 'Valve train', value: 'valve-train' },
  { label: 'Fuel system', value: 'fuel-system' },
  { label: 'Engine components', value: 'engine-components' },
  { label: 'Cooling system', value: 'cooling-system' },
  { label: 'Gearbox parts', value: 'gearbox-parts' },
  { label: 'Heavy equipment parts', value: 'heavy-equipment-parts' },
];

const PHOTO_SOURCES: Record<string, { image: string; source: string; credit: string; license: string; licenseUrl: string }> = {
  'marine-piston-photo': {
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Kolben_und_Pleuel_eines_Schiffsdieselmotors_Deutsches_Museum.jpg?width=900',
    source: 'https://commons.wikimedia.org/wiki/File:Kolben_und_Pleuel_eines_Schiffsdieselmotors_Deutsches_Museum.jpg',
    credit: 'Wikisympathisant / Wikimedia Commons',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
  },
  'crankshaft-photo': {
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/View_of_the_crankshaft_from_a_diesel_engine_outside_Colchester_Town_station_-_geograph.org.uk_-_6212573.jpg?width=900',
    source: 'https://commons.wikimedia.org/wiki/File:View_of_the_crankshaft_from_a_diesel_engine_outside_Colchester_Town_station_-_geograph.org.uk_-_6212573.jpg',
    credit: 'Robert Lamb / Wikimedia Commons',
    license: 'CC BY-SA 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0/',
  },
  'impeller-photo': {
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/02_Impeller.jpg?width=900',
    source: 'https://commons.wikimedia.org/wiki/File:02_Impeller.jpg',
    credit: 'LittleGun / Wikimedia Commons',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
  },
  'opened-gearbox-photo': {
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/ZF-16S181-transmission-hous.jpg?width=900',
    source: 'https://commons.wikimedia.org/wiki/File:ZF-16S181-transmission-hous.jpg',
    credit: 'Vivan755 / Wikimedia Commons',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
  },
  'cylinder-head-photo': {
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Cylinder_head_from_Toyota_Diesel_Engine_Coaster.jpg?width=900',
    source: 'https://commons.wikimedia.org/wiki/File:Cylinder_head_from_Toyota_Diesel_Engine_Coaster.jpg',
    credit: 'Ll1324 / Wikimedia Commons',
    license: 'CC0 1.0',
    licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
  },
  'excavator-hydraulics-photo': {
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Close-up_of_the_hydraulic_parts_of_an_excavator.jpg?width=900',
    source: 'https://commons.wikimedia.org/wiki/File:Close-up_of_the_hydraulic_parts_of_an_excavator.jpg',
    credit: 'Shixart1985 / Wikimedia Commons',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0/',
  },
  'piston-rings-photo': {
    image: 'https://upload.wikimedia.org/wikipedia/commons/0/0d/Piston_rings_by_Hoshino_Piston_Ring.jpg',
    source: 'https://commons.wikimedia.org/wiki/File:Piston_rings_by_Hoshino_Piston_Ring.jpg',
    credit: '160SX / Wikimedia Commons',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
  },
  'valve-train-photo': {
    image: 'https://upload.wikimedia.org/wikipedia/commons/e/ed/W%C3%A4rtsil%C3%A4_46_engine_valve_train_parts_Forum_Marinum.JPG',
    source: 'https://commons.wikimedia.org/wiki/File:W%C3%A4rtsil%C3%A4_46_engine_valve_train_parts_Forum_Marinum.JPG',
    credit: 'MKFI / Wikimedia Commons',
    license: 'Public domain',
    licenseUrl: 'https://commons.wikimedia.org/wiki/Template:PD-self',
  },
  'fuel-injector-photo': {
    image: 'https://upload.wikimedia.org/wikipedia/commons/e/e2/Bosch_common_rail_injector.JPG',
    source: 'https://commons.wikimedia.org/wiki/File:Bosch_common_rail_injector.JPG',
    credit: 'Panoha / Wikimedia Commons',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
  },
  'gasket-photo': {
    image: 'https://upload.wikimedia.org/wikipedia/commons/8/8b/Zylinderkopfdichtung.jpg',
    source: 'https://commons.wikimedia.org/wiki/File:Zylinderkopfdichtung.jpg',
    credit: 'Stahlkocher / Wikimedia Commons',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
  },
  'bearing-photo': {
    image: 'https://upload.wikimedia.org/wikipedia/commons/e/ea/Ashton_Frost_engine_main_bearing.jpg',
    source: 'https://commons.wikimedia.org/wiki/File:Ashton_Frost_engine_main_bearing.jpg',
    credit: 'Globbet / Wikimedia Commons',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
  },
  'cylinder-block-photo': {
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Cylinder_block_for_V6_Diesel.jpg?width=900',
    source: 'https://commons.wikimedia.org/wiki/File:Cylinder_block_for_V6_Diesel.jpg',
    credit: '160SX / Wikimedia Commons',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
  },
  'water-pump-photo': {
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/01_Pumphus_2.jpg?width=900',
    source: 'https://commons.wikimedia.org/wiki/File:01_Pumphus_2.jpg',
    credit: 'LittleGun / Wikimedia Commons',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
  },
  'oil-filter-photo': {
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/OFMM_1.jpg?width=900',
    source: 'https://commons.wikimedia.org/wiki/File:OFMM_1.jpg',
    credit: '01x07x2022000 / Wikimedia Commons',
    license: 'CC0 1.0',
    licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
  },
  'fuel-filter-photo': {
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Fuelfilter_open.jpg?width=900',
    source: 'https://commons.wikimedia.org/wiki/File:Fuelfilter_open.jpg',
    credit: 'Kat1100 / Wikimedia Commons',
    license: 'CC BY 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/3.0/',
  },
  'starter-photo': {
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Starter_motor_(4716412953).jpg?width=900',
    source: 'https://commons.wikimedia.org/wiki/File:Starter_motor_(4716412953).jpg',
    credit: 'Andrew Fogg / Wikimedia Commons',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0/',
  },
  'track-photo': {
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Caterpillar_track_segments.jpg?width=900',
    source: 'https://commons.wikimedia.org/wiki/File:Caterpillar_track_segments.jpg',
    credit: 'Paul Goyette / Wikimedia Commons',
    license: 'CC BY-SA 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0/',
  },
  'bucket-photo': {
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/EP-mininghoe05.jpg?width=900',
    source: 'https://commons.wikimedia.org/wiki/File:EP-mininghoe05.jpg',
    credit: 'ESCO Corporation / Wikimedia Commons',
    license: 'Public domain',
    licenseUrl: '',
  },
  'turbocharger-photo': {
    image: 'https://upload.wikimedia.org/wikipedia/commons/3/34/Turbocharger_assembly.jpg',
    source: 'https://commons.wikimedia.org/wiki/File:Turbocharger_assembly.jpg',
    credit: 'Panoha / Wikimedia Commons',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
  },
  'cylinder-liner-photo': {
    image: 'https://upload.wikimedia.org/wikipedia/commons/e/e9/Fairbanks_Morse_OP_Liner.jpg',
    source: 'https://commons.wikimedia.org/wiki/File:Fairbanks_Morse_OP_Liner.jpg',
    credit: 'Seth4404 / Wikimedia Commons',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
  },
  'injection-pump-photo': {
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bosch_distributor_injection_pump.jpg?width=900',
    source: 'https://commons.wikimedia.org/wiki/File:Bosch_distributor_injection_pump.jpg',
    credit: 'Panoha / Wikimedia Commons',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
  },
  'alternator-photo': {
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Alternator.jpg?width=900',
    source: 'https://commons.wikimedia.org/wiki/File:Alternator.jpg',
    credit: 'Angelsharum / Wikimedia Commons',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
  },
};

const catalogProducts: Product[] = [
  {
    id: 'turbocharger-assembly',
    name: 'Turbocharger Assembly',
    description: 'Turbocharger assembly for marine and industrial diesel engines. Confirm engine name, model, serial number, and turbo specification for fitment.',
    category: 'turbocharging',
    imageSourceUrl: 'https://commons.wikimedia.org/wiki/File:Turbocharger_assembly.jpg',
    imageCredit: 'Panoha / Wikimedia Commons',
    imageLicense: 'CC BY-SA 3.0',
    imageLicenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
    images: ['https://upload.wikimedia.org/wikipedia/commons/3/34/Turbocharger_assembly.jpg'],
  },
  {
    id: 'turbocharger-cartridge',
    name: 'Turbocharger Cartridge',
    description: 'Replacement turbocharger core assembly. Match the cartridge to the turbo model and engine application before ordering.',
    category: 'turbocharging',
    imageSourceUrl: 'https://commons.wikimedia.org/wiki/File:Turbocharger_assembly.jpg',
    imageCredit: 'Panoha / Wikimedia Commons',
    imageLicense: 'CC BY-SA 3.0',
    imageLicenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
    images: ['https://upload.wikimedia.org/wikipedia/commons/3/34/Turbocharger_assembly.jpg'],
  },
  {
    id: 'cylinder-liner',
    name: 'Cylinder Liner',
    description: 'Cylinder liner for diesel engine overhaul and maintenance. Bore size, engine model, and liner type are required to confirm compatibility.',
    category: 'cylinder-assembly',
    imageSourceUrl: 'https://commons.wikimedia.org/wiki/File:Fairbanks_Morse_OP_Liner.jpg',
    imageCredit: 'Seth4404 / Wikimedia Commons',
    imageLicense: 'CC BY-SA 3.0',
    imageLicenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
    images: ['https://upload.wikimedia.org/wikipedia/commons/e/e9/Fairbanks_Morse_OP_Liner.jpg'],
  },
  {
    id: 'engine-piston',
    name: 'Engine Piston',
    description: 'Replacement engine piston for marine and industrial diesel applications. Specify engine model, piston dimensions, and part number where available.',
    category: 'cylinder-assembly',
    imageSourceUrl: 'https://commons.wikimedia.org/wiki/File:Cummins_Diesel_engine_piston_head_45deg.jpg',
    imageCredit: 'S. Diddy / Wikimedia Commons',
    imageLicense: 'CC BY 2.0',
    imageLicenseUrl: 'https://creativecommons.org/licenses/by/2.0/',
    images: ['https://upload.wikimedia.org/wikipedia/commons/0/08/Cummins_Diesel_engine_piston_head_45deg.jpg'],
  },
  {
    id: 'piston-ring-set',
    name: 'Piston Ring Set',
    description: 'Piston ring set for engine service and rebuilds. Confirm cylinder bore and piston specification to identify the correct set.',
    category: 'pistons-rings',
    imageSourceUrl: 'https://commons.wikimedia.org/wiki/File:Piston_rings_by_Hoshino_Piston_Ring.jpg',
    imageCredit: '160SX / Wikimedia Commons',
    imageLicense: 'CC BY-SA 3.0',
    imageLicenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
    images: ['https://upload.wikimedia.org/wikipedia/commons/0/0d/Piston_rings_by_Hoshino_Piston_Ring.jpg'],
  },
  {
    id: 'valve-seat',
    name: 'Valve Seat',
    description: 'Replacement valve seat for cylinder head repair. Share the engine model and seat dimensions for fitment checking.',
    category: 'valve-train',
    imageSourceUrl: 'https://commons.wikimedia.org/wiki/File:W%C3%A4rtsil%C3%A4_46_engine_valve_train_parts_Forum_Marinum.JPG',
    imageCredit: 'MKFI / Wikimedia Commons',
    imageLicense: 'Public domain',
    imageLicenseUrl: 'https://commons.wikimedia.org/wiki/Template:PD-self',
    images: ['https://upload.wikimedia.org/wikipedia/commons/e/ed/W%C3%A4rtsil%C3%A4_46_engine_valve_train_parts_Forum_Marinum.JPG'],
  },
  {
    id: 'valve-guide',
    name: 'Valve Guide',
    description: 'Valve guide for cylinder head maintenance. Confirm valve stem and guide dimensions alongside the engine name, model or serial number.',
    category: 'valve-train',
    imageSourceUrl: 'https://commons.wikimedia.org/wiki/File:W%C3%A4rtsil%C3%A4_46_engine_valve_train_parts_Forum_Marinum.JPG',
    imageCredit: 'MKFI / Wikimedia Commons',
    imageLicense: 'Public domain',
    imageLicenseUrl: 'https://commons.wikimedia.org/wiki/Template:PD-self',
    images: ['https://upload.wikimedia.org/wikipedia/commons/e/ed/W%C3%A4rtsil%C3%A4_46_engine_valve_train_parts_Forum_Marinum.JPG'],
  },
  {
    id: 'head-valve',
    name: 'Head Valve',
    description: 'Replacement head valve for diesel engine service. Provide engine model and valve dimensions to confirm the correct part.',
    category: 'valve-train',
    imageSourceUrl: 'https://commons.wikimedia.org/wiki/File:W%C3%A4rtsil%C3%A4_46_engine_valve_train_parts_Forum_Marinum.JPG',
    imageCredit: 'MKFI / Wikimedia Commons',
    imageLicense: 'Public domain',
    imageLicenseUrl: 'https://commons.wikimedia.org/wiki/Template:PD-self',
    images: ['https://upload.wikimedia.org/wikipedia/commons/e/ed/W%C3%A4rtsil%C3%A4_46_engine_valve_train_parts_Forum_Marinum.JPG'],
  },
  {
    id: 'fuel-injector-nozzle',
    name: 'Fuel Injector Nozzle',
    description: 'Fuel injection nozzle for diesel engine maintenance. Match by injector or nozzle number and engine specification.',
    category: 'fuel-system',
    imageSourceUrl: 'https://commons.wikimedia.org/wiki/File:Bosch_common_rail_injector.JPG',
    imageCredit: 'Panoha / Wikimedia Commons',
    imageLicense: 'CC BY-SA 3.0',
    imageLicenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
    images: ['https://upload.wikimedia.org/wikipedia/commons/e/e2/Bosch_common_rail_injector.JPG'],
  },
  {
    id: 'cylinder-head-gasket',
    name: 'Cylinder Head Gasket',
    description: 'Cylinder head gasket for engine overhaul. Engine model, bore, and gasket configuration are needed to confirm fitment.',
    category: 'engine-components',
    imageSourceUrl: 'https://commons.wikimedia.org/wiki/File:Zylinderkopfdichtung.jpg',
    imageCredit: 'Stahlkocher / Wikimedia Commons',
    imageLicense: 'CC BY-SA 3.0',
    imageLicenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
    images: ['https://upload.wikimedia.org/wikipedia/commons/8/8b/Zylinderkopfdichtung.jpg'],
  },
  {
    id: 'main-bearing-set',
    name: 'Main Bearing Set',
    description: 'Main bearing shells for engine service. Confirm crankshaft size, bearing grade, and engine serial details before ordering.',
    category: 'engine-components',
    imageSourceUrl: 'https://commons.wikimedia.org/wiki/File:Ashton_Frost_engine_main_bearing.jpg',
    imageCredit: 'Globbet / Wikimedia Commons',
    imageLicense: 'CC BY-SA 3.0',
    imageLicenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
    images: ['https://upload.wikimedia.org/wikipedia/commons/e/ea/Ashton_Frost_engine_main_bearing.jpg'],
  },
  {
    id: 'water-pump-impeller',
    name: 'Water Pump Impeller',
    description: 'Replacement impeller for engine cooling water pump service. Confirm pump model and impeller dimensions for compatibility.',
    category: 'cooling-system',
    imageSourceUrl: 'https://commons.wikimedia.org/wiki/File:Impellerrad.jpg',
    imageCredit: 'Wualex / Wikimedia Commons',
    imageLicense: 'Public domain',
    imageLicenseUrl: 'https://commons.wikimedia.org/wiki/Template:PD-self',
    images: ['https://upload.wikimedia.org/wikipedia/commons/6/6b/Impellerrad.jpg'],
  },
  ...[
    'Engine Block', 'Cylinder Head', 'Cylinder Liner Kit', 'Piston Pin', 'Piston and Ring Kit',
    'Connecting Rod', 'Crankshaft', 'Camshaft', 'Oversize Main Bearing Set', 'Connecting Rod Bearing Set',
    'Thrust Washer Set', 'Top Overhaul Gasket Set', 'Oil Pan Gasket', 'Inlet Valve', 'Rocker Shaft',
    'Valve Bridge', 'Valve Rotator', 'Valve Spring', 'Rocker Arm', 'Push Rod',
    'Tappet', 'Timing Gear', 'Timing Chain', 'Timing Belt', 'Flywheel',
    'Flywheel Ring Gear', 'Crankshaft Pulley', 'Vibration Damper', 'Oil Pump', 'Oil Filter',
    'Oil Cooler', 'Water Pump', 'Water Pump Assembly', 'Thermostat', 'Coolant Hose',
    'Radiator', 'Fuel Injection Pump', 'Fuel Injector', 'Injector Nozzle', 'Fuel Filter',
    'Fuel Lift Pump', 'Turbocharger Oil Line', 'Turbocharger Rebuild Kit', 'Exhaust Manifold', 'Intake Manifold',
    'Air Filter', 'Starter Motor', 'Alternator', 'Engine Mount', 'Engine Overhaul Gasket Set',
  ].map((name) => makeCatalogProduct(name, 'engine-components')),
  ...[
    'Gearbox Housing', 'Input Shaft', 'Output Shaft', 'Intermediate Shaft', 'Reverse Idler Gear',
    'Forward Gear Set', 'Reverse Gear Set', 'Reduction Gear Set', 'Helical Gear Pair', 'Bevel Gear Set',
    'Clutch Pack', 'Forward Clutch Plate', 'Reverse Clutch Plate', 'Friction Disc', 'Separator Plate',
    'Clutch Hub', 'Clutch Drum', 'Clutch Piston', 'Clutch Return Spring', 'Hydraulic Pump',
    'Oil Pump Drive', 'Pressure Regulator Valve', 'Control Valve Body', 'Selector Valve', 'Shift Fork',
    'Shift Rail', 'Shift Linkage', 'Control Cable', 'Gear Selector', 'Planetary Carrier',
    'Sun Gear', 'Ring Gear', 'Planet Gear', 'Thrust Washer', 'Needle Bearing',
    'Tapered Roller Bearing', 'Ball Bearing', 'Thrust Bearing', 'Bearing Race', 'Input Shaft Seal',
    'Output Shaft Seal', 'O-Ring Kit', 'Gasket Set', 'Oil Filter', 'Suction Strainer',
    'Oil Cooler', 'Cooler Hose', 'Oil Pressure Switch', 'Speed Sensor', 'Gearbox Mounting Bracket',
    'Clutch Plate', 'Pressure Plate', 'Internal Gear Ring', 'Flywheel', 'Clutch Release Bearing',
    'Clutch Cover', 'Pilot Bearing', 'Gearbox Main Shaft', 'Counter Shaft', 'Synchronizer Ring',
    'Synchronizer Hub', 'Sleeve', 'Shift Collar', 'Selector Fork', 'Valve Body Gasket',
    'Torque Converter', 'Stator', 'Turbine', 'Impeller Blade', 'Lock-up Clutch',
    'Oil Pan', 'Sump Plug', 'Oil Gallery Plug', 'Filter Housing', 'Pressure Relief Valve',
    'Torsion Spring', 'Shift Detent Ball', 'Detent Spring', 'Input Spline', 'Output Spline',
    'Thrust Collar', 'Bearing Shell', 'Shim Kit', 'Seal Ring', 'Snap Ring',
    'Gearbox Vent', 'Oil Filler Cap', 'Magnetic Drain Plug', 'Gear Oil Cooler', 'Oil Feed Line',
    'Clutch Actuator', 'Master Cylinder', 'Slave Cylinder', 'Clutch Line', 'Clutch Pedal Kit',
    'Flywheel Bolt', 'Pressure Plate Bolt', 'Clutch Disc Spring', 'Gear Tooth Seal', 'Shaft Key',
    'Bearing Race Set', 'Tapered Roller Set', 'Ball Bearing Kit', 'Needle Bearing Set', 'Thrust Washer Kit',
    'Internal Ring Gear', 'Planet Gear Set', 'Sun Gear Assembly', 'Carrier Bearing', 'Planetary Pin',
    'Gearbox Mounting Pad', 'Vibration Damper', 'Input Coupling', 'Output Coupling', 'Drive Flange',
    'Gearbox Case Bolt', 'Case Gasket', 'Oil Seal Kit', 'Internal Oil Filter', 'Hydraulic Valve',
    'Shift Linkage Pin', 'Control Cable End', 'Selector Lever', 'Shift Rail Spring', 'Shift Fork Pin',
    'Clutch Disc Rivet', 'Friction Lining', 'Separator Disc', 'Pressure Spring', 'Clutch Plate Kit',
    'Gearbox lapped ring', 'Gearbox shim set', 'Input shaft bearing', 'Output shaft bearing', 'Intermediate shaft bearing',
    'Main shaft seal', 'Counter shaft seal', 'Housing seal', 'Gearbox oil pump gear', 'Oil pump housing',
    'Transmission fluid cooler', 'Fluid line fitting', 'Oil pressure sensor', 'Speedometer gear', 'Reverse idler shaft',
    'Gearbox torque converter', 'Clutch pressure spring', 'Clutch release fork', 'Clutch pivot ball', 'Flywheel ring gear',
    'Gearbox internal gasket', 'Oil pan gasket', 'Sealant kit', 'Gearbox overhaul kit', 'Transmission service set',
  ].map((name) => makeCatalogProduct(name, 'gearbox-parts')),
  ...[
    'Water Jacket Cover', 'Cylinder Head Bolt Set', 'Crankshaft Seal', 'Camshaft Bushing Set', 'Connecting Rod Bolt Set',
    'Wrist Pin Bushing', 'Piston Cooling Nozzle', 'Valve Stem Seal Set', 'Valve Collet Set', 'Rocker Cover',
    'Rocker Cover Gasket', 'Manifold Gasket Set', 'Turbocharger Gasket Kit', 'Exhaust Elbow', 'Engine Mounting Bracket',
    'Front Engine Support', 'Rear Engine Support', 'Engine Control Unit', 'Engine Wiring Harness', 'Oil Pressure Sensor',
    'Coolant Temperature Sensor', 'Crankshaft Position Sensor', 'Speed Pickup Sensor', 'Glow Plug Set', 'Intake Air Heater',
    'Exhaust Flex Connector', 'Expansion Tank', 'Coolant Level Sensor', 'Fuel Rail', 'High Pressure Fuel Pipe Set',
    'Fuel Return Pipe Set', 'Fuel Water Separator', 'Air Intake Silencer', 'Engine Service Kit',
  ].map((name) => makeCatalogProduct(name, 'engine-components')),
  ...[
    'Marine Gearbox Assembly', 'Reversing Gearbox Assembly', 'Reduction Gearbox Assembly', 'Transmission Input Coupling', 'Flexible Drive Coupling',
    'Torsional Damper', 'Propeller Shaft Flange', 'Output Flange', 'Input Shaft Bearing', 'Output Shaft Bearing',
    'Gearbox Oil Pump', 'Oil Pump Cover', 'Hydraulic Control Pump', 'Clutch Friction Plate Set', 'Clutch Steel Plate Set',
    'Clutch Disc Hub', 'Clutch Pressure Plate', 'Clutch Release Piston', 'Reverse Clutch Drum', 'Gear Shift Lever',
    'Gear Selector Cable', 'Neutral Safety Switch', 'Direction Control Valve', 'Pressure Relief Valve', 'Oil Cooler Core',
    'Oil Cooler Gasket', 'Dipstick Assembly', 'Breather Assembly', 'Magnetic Drain Plug', 'Gear Tooth Set',
    'Planetary Gear Carrier', 'Reduction Gear Pinion', 'Marine Transmission Service Kit',
  ].map((name) => makeCatalogProduct(name, 'gearbox-parts')),
  ...[
    'Track Shoe', 'Track Link', 'Track Roller', 'Carrier Roller', 'Track Idler',
    'Sprocket Segment', 'Track Chain', 'Rubber Track', 'Final Drive Motor', 'Travel Motor',
    'Swing Motor', 'Hydraulic Pump', 'Hydraulic Cylinder', 'Lift Cylinder', 'Boom Cylinder',
    'Bucket Cylinder', 'Hydraulic Hose', 'Hydraulic Hose Coupling', 'Hydraulic Control Valve', 'Hydraulic Relief Valve',
    'Swing Bearing', 'Slew Ring', 'Boom Pin', 'Bucket Pin', 'Bucket Bushing',
    'Bucket Cutting Edge', 'Bucket Tooth', 'Bucket Side Cutter', 'Quick Coupler', 'Loader Tire',
    'Wheel Hub', 'Axle Shaft', 'Brake Assembly',
  ].map((name) => makeCatalogProduct(name, 'heavy-equipment-parts')),
];

export const PRODUCTS: Product[] = catalogProducts.filter((product, index, products) =>
  typeof product.name === 'string' && product.name.trim().length > 0
  && typeof product.description === 'string' && product.description.trim().length > 0
  && Array.isArray(product.images) && product.images.some((image) => typeof image === 'string' && image.trim().length > 0)
  && products.findIndex((candidate) => candidate.id === product.id) === index
);

function makeCatalogProduct(name: string, category: ProductCategory): Product {
  const id = `${category}-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;
  const fitmentDetails = category === 'heavy-equipment-parts'
    ? 'Confirm the machine make, model, serial number, dimensions, and part number to check compatibility before ordering.'
    : 'Confirm the exact engine or gearbox model, serial number, dimensions, and part number to check compatibility before ordering.';

  const photoKey = getProductPhoto(name, category);
  const photoDetails = PHOTO_SOURCES[photoKey];
  const imagePath = photoDetails.image;

  return {
    id,
    name,
    description: `${name} for ${category === 'heavy-equipment-parts' ? 'construction and industrial machinery' : 'marine and industrial powertrain'} applications. ${fitmentDetails}`,
    category,
    images: [imagePath],
    imageSourceUrl: photoDetails.source,
    imageCredit: photoDetails.credit,
    imageLicense: photoDetails.license,
    imageLicenseUrl: photoDetails.licenseUrl,
  };
}

function getProductPhoto(name: string, category: ProductCategory): string {
  const normalizedName = name.toLowerCase();

  if (category === 'heavy-equipment-parts') {
    if (/bucket|cutting edge|tooth|side cutter/.test(normalizedName)) return 'bucket-photo';
    if (/track|roller|idler|sprocket/.test(normalizedName)) return 'track-photo';
    if (/tire|wheel|axle|brake|bearing/.test(normalizedName)) return 'track-photo';
    return 'excavator-hydraulics-photo';
  }

  if (category === 'gearbox-parts') {
    if (/gasket|seal|o-ring/.test(normalizedName)) return 'gasket-photo';
    return 'opened-gearbox-photo';
  }

  if (/crankshaft/.test(normalizedName)) return 'crankshaft-photo';
  if (/turbo/.test(normalizedName)) return 'turbocharger-photo';
  if (/cylinder liner/.test(normalizedName)) return 'cylinder-liner-photo';
  if (/cylinder block|engine block|water jacket/.test(normalizedName)) return 'cylinder-block-photo';
  if (/piston ring/.test(normalizedName)) return 'piston-rings-photo';
  if (/piston|connecting rod|wrist pin/.test(normalizedName)) return 'marine-piston-photo';
  if (/cylinder head/.test(normalizedName)) return 'cylinder-head-photo';
  if (/impeller/.test(normalizedName)) return 'impeller-photo';
  if (/water pump|oil pump|coolant|radiator|thermostat|oil cooler|expansion tank/.test(normalizedName)) return 'water-pump-photo';
  if (/valve|camshaft|rocker|push rod|tappet/.test(normalizedName)) return 'valve-train-photo';
  if (/oil filter|air filter/.test(normalizedName)) return 'oil-filter-photo';
  if (/fuel filter|fuel water separator/.test(normalizedName)) return 'fuel-filter-photo';
  if (/injection pump|fuel lift pump|fuel pump/.test(normalizedName)) return 'injection-pump-photo';
  if (/injector|fuel/.test(normalizedName)) return 'fuel-injector-photo';
  if (/starter/.test(normalizedName)) return 'starter-photo';
  if (/alternator/.test(normalizedName)) return 'alternator-photo';
  if (/control unit|wiring|sensor|glow plug|heater/.test(normalizedName)) return 'starter-photo';
  if (/timing gear|timing chain|timing belt|manifold|exhaust|air intake/.test(normalizedName)) return 'turbocharger-photo';
  if (/gasket/.test(normalizedName)) return 'gasket-photo';
  if (/bearing/.test(normalizedName)) return 'bearing-photo';
  if (/shaft|flywheel|damper|connecting rod/.test(normalizedName)) return 'crankshaft-photo';

  return 'cylinder-block-photo';
}
