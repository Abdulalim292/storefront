import type { Product } from '@/types';

export interface EquipmentModel {
  id: string;
  name: string;
  description: string;
  image: string;
  specifications?: string[];
  specsSource?: string;
  specsCredit?: string;
}

export const marineEngineModels: EquipmentModel[] = [
  {
    id: 'weichai-wd615-series',
    name: 'WD615 Series',
    description: 'Weichai WD615 marine diesel engine series. Confirm the exact variant, rated power, and vessel application when requesting a quote.',
    image: 'https://cdn.merheinflare.com/public-site/products/weichai-wd615-series-marine-diesel-engine/0.jpg',
    specifications: ['Marine diesel engine series', 'Exact variant and rated power depend on configuration'],
  },
  {
    id: 'weichai-wd618-wd12-series',
    name: 'WD618 / WD12 Series',
    description: 'Weichai WD618 marine diesel engine series, also referred to as WD12. Confirm the exact engine model and rating for your vessel.',
    image: 'https://image.made-in-china.com/2f0j00ubFqtTKaIEcY/Turbocharged-Marine-Engine-Is-Certified-CCS-Weichai-Wd618.jpg',
    specifications: ['6 cylinders · 11.596 L displacement', '220–294 kW across listed WD12 variants', 'Rated speeds: 1,500–2,150 rpm', 'Turbocharged and aftercooled'],
  },
  {
    id: 'weichai-wp10',
    name: 'Weichai WP10',
    description: 'Six-cylinder, four-stroke marine diesel platform used for propulsion. Available ratings and equipment vary by WP10 variant; confirm rated speed, power, and gearbox compatibility.',
    image: 'https://image.made-in-china.com/2f0j00zjfMpAJgZGoD/Weichai-Wp10-Factory-Machinery-Dedicated-Weichai-Engine-Series-Marine-Diesel-Engine.webp',
    specifications: ['6 cylinders · 4-stroke diesel', '230–290 kW across listed marine variants', 'Rated speeds: 1,800–2,200 rpm', 'Fuel system: high-pressure common rail'],
    specsSource: 'https://truckparts-china.en.made-in-china.com/product/irtYCXlVJnkp/China-Weichai-Wp10-Factory-Machinery-Dedicated-Weichai-Engine-Series-Marine-Diesel-Engine.html',
    specsCredit: 'listing details',
  },
  {
    id: 'weichai-wp12',
    name: 'Weichai WP12',
    description: 'Six-cylinder marine diesel engine series offered for propulsion applications. Power and rated speed depend on the selected configuration; confirm the exact build before ordering.',
    image: 'https://image.made-in-china.com/2f0j00uCfqBEUgsbcW/Weichai-Wp12-Propulsion-Marine-Diesel-Engine-350HP-to-550HP-with-300-Gear-Box-for-Boats-on-Sale.jpg',
    specifications: ['6-cylinder marine diesel series', '295–405 kW across listed marine variants', 'Rated speeds: 1,800–2,100 rpm', 'Fuel system: mechanical pump or high-pressure common rail, depending on variant'],
    specsSource: 'https://client123.en.made-in-china.com/product/WJKrPgYcZCkd/China-Weichai-Wp12-Propulsion-Marine-Diesel-Engine-350HP-to-550HP-with-300-Gear-Box-for-Boats-on-Sale.html',
    specsCredit: 'listing details',
  },
  {
    id: 'cummins-kta19',
    name: 'Cummins KTA19',
    description: 'Heavy-duty inline six-cylinder, 19-litre marine diesel for propulsion and auxiliary applications. Cummins lists marine ratings from 500 to 700 hp (373–522 kW); the rating depends on the exact configuration.',
    image: 'https://file.infoservision.com/1567704563029540865/1574290619635277825.webp',
    specifications: ['Inline 6-cylinder · 19 L displacement', '500–700 hp (373–522 kW) marine ratings', 'Turbocharged and aftercooled', 'Propulsion and auxiliary configurations'],
    specsSource: 'https://www.cummins.com/en-na/engines/products/kta19?v=741',
    specsCredit: 'Cummins specifications',
  },
  {
    id: 'cummins-kta38',
    name: 'Cummins KTA38',
    description: 'V12, 38-litre marine diesel with turbocharged and aftercooled aspiration. Cummins lists propulsion ratings from 850 to 1,500 hp (634–1,119 kW), depending on engine variant and duty rating.',
    image: 'https://image.made-in-china.com/2f0j00oJLVdNeWpkbi/Cummins-Marine-Engine-Kt38-M-Kta38-M0-Kta38-M1-Kta38-M2-800HP-900HP-1000HP-1200HP.webp',
    specifications: ['V12 · 38 L displacement', '850–1,500 hp (634–1,119 kW) marine ratings', 'Turbocharged and aftercooled', 'Propulsion and auxiliary configurations'],
    specsSource: 'https://www.cummins.com/en-apac/engines/products/kta38',
    specsCredit: 'Cummins specifications',
  },
  {
    id: 'yuchai-yc6mk',
    name: 'Yuchai YC6MK',
    description: 'Six-cylinder, 10.338-litre marine main engine series for transport and fishing vessels. Listed ratings span 220–300 kW at 1,500–2,100 rpm across the cited variants.',
    image: 'https://www.yuchaiinternational.com/uploads/42293/yc6mk-marine-main-engine311cb.jpg',
    specifications: ['6 cylinders · 10.338 L displacement', '192–300 kW across listed variants', 'Rated speeds depend on model: 1,500–2,100 rpm', 'For transport ships and fishing vessels'],
    specsSource: 'https://www.yuchaiinternational.com/engine/marine-engine/yc6mk-marine-main-engine.html',
    specsCredit: 'Yuchai specifications',
  },
  {
    id: 'caterpillar-c18',
    name: 'Caterpillar C18',
    description: 'Marine propulsion engine for commercial and recreational applications. Cat lists commercial ratings from 454 to 1,136 bhp and high-performance ratings up to 1,136 bhp, depending on application.',
    image: 'https://www.industrialmarinepower.com/img/caterpillar-c18-marine-propulsion-engine-15201_333.jpg',
    specifications: ['Inline 6-cylinder · 18.1 L displacement', '454–1,136 bhp across marine configurations', 'Turbocharged and aftercooled', 'Commercial and high-performance versions have different ratings'],
    specsSource: 'https://www.cat.com/en_GB/products/new/power-systems/marine-power-systems/commercial-propulsion-engines/18493267.html',
    specsCredit: 'Cat specifications',
  },
  {
    id: 'man-d2862-v12',
    name: 'MAN D2862 V12',
    description: 'V12 marine diesel propulsion engine for professional vessels and workboats. Available output depends on the D2862 variant and duty rating; confirm the model code and vessel application.',
    image: 'https://img.nauticexpo.es/images_ne/photo-g/23543-10638848.jpg',
    specifications: ['V12 · 24.24 L displacement', 'D2862 LE44x example: 735 kW (1,000 HP) at 1,800 rpm', '4-stroke marine diesel with turbocharging and charge-air cooling', 'Output and emissions depend on the full engine variant'],
    specsSource: 'https://www.nauticexpo.es/prod/man-truck-bus-se-engines-components/product-23543-228085.html',
    specsCredit: 'engine details',
  },
];

export const marineGearboxModels: EquipmentModel[] = [
  {
    id: 'fada-fd170',
    name: 'FADA FD170',
    description: 'Marine gearbox with a 1.97–5.88 reduction ratio range, 1,000–2,500 rpm input speed, and 0.027–0.039 kW/rpm transmission capacity.',
    image: 'https://fada-gearbox.com/wp-content/uploads/2023/08/fd170-fada-marine-gearbox.png',
  },
  {
    id: 'fada-fd135-fd135a',
    name: 'FADA FD135 / FD135A',
    description: 'Marine gearbox series with 2.03–5.81 reduction ratios, 750–2,000 rpm input speed, and 0.070–0.100 kW/rpm transmission capacity.',
    image: 'https://fada-gearbox.com/wp-content/uploads/2023/08/fd135a-fada-marine-gearbox.png',
  },
  {
    id: 'fada-fd142',
    name: 'FADA FD142',
    description: 'Marine gearbox with a 1.97–5.47 reduction ratio range, 1,500–2,500 rpm input speed, and 0.013–0.030 kW/rpm transmission capacity.',
    image: 'https://fadagearbox.com/wp-content/uploads/2025/01/FADA-FD142-Marine-Gearbox-ProductImage-510x376.png',
  },
  {
    id: 'fada-fd16',
    name: 'FADA FD16',
    description: 'Compact marine gearbox with 2.07–3.83 reduction ratios, 1,000–2,100 rpm input speed, and 0.012 kW/rpm transmission capacity.',
    image: 'https://fada-gearbox.com/wp-content/uploads/2023/07/FD16-fada-marine-gearbox.png',
  },
  {
    id: 'fada-fd06',
    name: 'FADA FD06',
    description: 'Compact marine gearbox with 2.52–3.50 reduction ratios, 1,000–2,100 rpm input speed, and 0.0044 kW/rpm transmission capacity.',
    image: 'https://fada-gearbox.com/wp-content/uploads/2023/07/FD06-fada-marine-gearbox.png',
  },
];

export const heavyMachineryModels: EquipmentModel[] = [
  {
    id: 'lonking-cdm833-wheel-loader',
    name: 'Lonking CDM833 Wheel Loader',
    description: 'Heavy machinery model powered by a Weichai WP6G125E22 diesel engine. Confirm year, configuration, and engine specification before ordering.',
    image: 'https://image.made-in-china.com/202f0j00yQVUKbilLwov/Lonking-Wheel-Loader-Cdm833-for-Sale.webp',
  },
  {
    id: 'caterpillar-c7-1',
    name: 'Caterpillar C7.1',
    description: 'A 7.01-litre inline-six industrial diesel with turbocharged, aftercooled aspiration. Cat offers configurable ratings for construction, mining, and material-handling equipment; output depends on the configuration.',
    image: 'https://i.ebayimg.com/images/g/ncYAAeSwEP1o4748/s-l960.jpg',
  },
  {
    id: 'cummins-qsb6-7',
    name: 'Cummins QSB6.7',
    description: 'A 6.7-litre inline-six industrial diesel platform used in construction and off-highway equipment. Power and emissions ratings vary by engine tier and configuration.',
    image: 'https://rebuiltcumminsenginesales.com/uploaded_images/model/model_2101.jpg',
  },
  {
    id: 'weichai-wp6g',
    name: 'Weichai WP6G',
    description: 'Industrial diesel engine series for construction and other machinery applications. Confirm the full engine code, power rating, and equipment compatibility before ordering.',
    image: 'https://product.hstatic.net/200000700339/product/h1d8a25f1510d4d0bb94129d803f30e0ed_d1e6b05f675f4d61b3d77268a951f797_master.jpg',
  },
  {
    id: 'perkins-1106d-e70ta',
    name: 'Perkins 1106D-E70TA',
    description: 'A six-cylinder, 7.01-litre industrial diesel engine with turbocharged, aftercooled aspiration. Available power and emissions configurations depend on the engine specification.',
    image: 'https://profmotors.ru/thumb/2/dTzS8DWJ0uG0EJKUgs09BQ/921r921/d/pw82788_1106d-e70ta.jpg',
  },
  {
    id: 'john-deere-6068-powertech',
    name: 'John Deere 6068 PowerTech',
    description: 'A 6.8-litre industrial diesel engine family for off-highway equipment. Ratings, emissions certification, and accessories vary by 6068 engine code.',
    image: 'https://www.deere.ca/assets/images/common/industries/engines-and-drivetrain/product/GEN_FT4_6068HFG09_RtFt_large_813a9581b51cfe73a6bbe1559c5008542c1cbbb9.png',
  },
];

export const EQUIPMENT_PRODUCTS: Product[] = [
  ...marineEngineModels,
  ...marineGearboxModels,
  ...heavyMachineryModels,
].map((model) => ({
  id: model.id,
  name: model.name,
  description: model.description,
  category: 'equipment',
  images: [model.image],
  specifications: model.specifications,
  imageSourceUrl: '',
  imageCredit: '',
  imageLicense: '',
  imageLicenseUrl: '',
}));
