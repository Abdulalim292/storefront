import Link from 'next/link';
import { ResilientImage } from '@/components/ui/ResilientImage';
import { BRANCHES } from '@/data/branches';
import {
  ArrowRight,
  ArrowUpRight,
  Anchor,
  Check,
  Cog,
  Construction,
  Gauge,
  PhoneCall,
  Ship,
  Wrench,
} from 'lucide-react';

const equipment = [
  {
    id: 'marine-engine-models',
    number: '01',
    title: 'Marine engines',
    description:
      'Main propulsion and auxiliary engine options for commercial vessels, workboats, and marine operations.',
    detail: 'Propulsion · Auxiliary power · Engine parts',
    icon: Ship,
  },
  {
    id: 'gearboxes',
    number: '02',
    title: 'Marine gearboxes',
    description:
      'Transmission solutions selected to match engine output, vessel requirements, and operating conditions.',
    detail: 'Marine transmissions · Reduction gears · Components',
    icon: Cog,
  },
  {
    id: 'heavy-machinery',
    number: '03',
    title: 'Heavy machinery',
    description:
      'Machinery and equipment for demanding industrial, construction, and marine support applications.',
    detail: 'Industrial equipment · Construction · Spares',
    icon: Construction,
  },
];

const marineEngineModels = [
  {
    name: 'WD615 Series',
    description: 'Weichai WD615 marine diesel engine series. Confirm the exact variant, rated power, and vessel application when requesting a quote.',
    image: 'https://cdn.merheinflare.com/public-site/products/weichai-wd615-series-marine-diesel-engine/0.jpg',
    imageSource: 'https://merhein.com/products/marine-diesel-engine-wd615-series',
    imageCredit: 'Merhein',
  },
  {
    name: 'WD618 / WD12 Series',
    description: 'Weichai WD618 marine diesel engine series, also referred to as WD12. Confirm the exact engine model and rating for your vessel.',
    image: 'https://image.made-in-china.com/2f0j00ubFqtTKaIEcY/Turbocharged-Marine-Engine-Is-Certified-CCS-Weichai-Wd618.jpg',
    imageSource: 'https://sdflames.en.made-in-china.com/product/kKJnogvlZMrd/China-Turbocharged-Marine-Engine-Is-Certified-CCS-Weichai-Wd618.html',
    imageCredit: 'Weifang Haichuan Power via Made-in-China.com',
  },
  {
    name: 'Weichai WP10',
    description: 'Six-cylinder, four-stroke marine diesel platform used for propulsion. Available ratings and equipment vary by WP10 variant; confirm rated speed, power, and gearbox compatibility.',
    image: 'https://image.made-in-china.com/2f0j00zjfMpAJgZGoD/Weichai-Wp10-Factory-Machinery-Dedicated-Weichai-Engine-Series-Marine-Diesel-Engine.webp',
    imageSource: 'https://truckparts-china.en.made-in-china.com/product/irtYCXlVJnkp/China-Weichai-Wp10-Factory-Machinery-Dedicated-Weichai-Engine-Series-Marine-Diesel-Engine.html',
    imageCredit: 'Truckparts-China via Made-in-China.com',
    specsSource: 'https://truckparts-china.en.made-in-china.com/product/irtYCXlVJnkp/China-Weichai-Wp10-Factory-Machinery-Dedicated-Weichai-Engine-Series-Marine-Diesel-Engine.html',
    specsCredit: 'listing details',
  },
  {
    name: 'Weichai WP12',
    description: 'Six-cylinder marine diesel engine series offered for propulsion applications. Power and rated speed depend on the selected configuration; confirm the exact build before ordering.',
    image: 'https://image.made-in-china.com/2f0j00uCfqBEUgsbcW/Weichai-Wp12-Propulsion-Marine-Diesel-Engine-350HP-to-550HP-with-300-Gear-Box-for-Boats-on-Sale.jpg',
    imageSource: 'https://client123.en.made-in-china.com/product/WJKrPgYcZCkd/China-Weichai-Wp12-Propulsion-Marine-Diesel-Engine-350HP-to-550HP-with-300-Gear-Box-for-Boats-on-Sale.html',
    imageCredit: 'Client123 via Made-in-China.com',
    specsSource: 'https://client123.en.made-in-china.com/product/WJKrPgYcZCkd/China-Weichai-Wp12-Propulsion-Marine-Diesel-Engine-350HP-to-550HP-with-300-Gear-Box-for-Boats-on-Sale.html',
    specsCredit: 'listing details',
  },
  {
    name: 'Cummins KTA19',
    description: 'Heavy-duty inline six-cylinder, 19-litre marine diesel for propulsion and auxiliary applications. Cummins lists marine ratings from 500 to 700 hp (373–522 kW); the rating depends on the exact configuration.',
    image: 'https://file.infoservision.com/1567704563029540865/1574290619635277825.webp',
    imageSource: 'https://www.enginetc.com/item/chongqing-cummins-kta-19-m3-engine-manufacturer',
    imageCredit: 'EngineTC',
    specsSource: 'https://www.cummins.com/en-na/engines/products/kta19?v=741',
    specsCredit: 'Cummins specifications',
  },
  {
    name: 'Cummins KTA38',
    description: 'V12, 38-litre marine diesel with turbocharged and aftercooled aspiration. Cummins lists propulsion ratings from 850 to 1,500 hp (634–1,119 kW), depending on engine variant and duty rating.',
    image: 'https://image.made-in-china.com/2f0j00oJLVdNeWpkbi/Cummins-Marine-Engine-Kt38-M-Kta38-M0-Kta38-M1-Kta38-M2-800HP-900HP-1000HP-1200HP.webp',
    imageSource: 'https://m.made-in-china.com/product/Cummins-Marine-Engine-Kt38-M-Kta38-M0-Kta38-M1-Kta38-M2-800HP-900HP-1000HP-1200HP-1982140875.html',
    imageCredit: 'Made-in-China.com',
    specsSource: 'https://www.cummins.com/en-apac/engines/products/kta38',
    specsCredit: 'Cummins specifications',
  },
  {
    name: 'Yuchai YC6MK',
    description: 'Six-cylinder, 10.338-litre marine main engine series for transport and fishing vessels. Listed ratings span 220–300 kW at 1,500–2,100 rpm across the cited variants.',
    image: 'https://www.yuchaiinternational.com/uploads/42293/yc6mk-marine-main-engine311cb.jpg',
    imageSource: 'https://www.yuchaiinternational.com/engine/marine-engine/yc6mk-marine-main-engine.html',
    imageCredit: 'Yuchai International',
    specsSource: 'https://www.yuchaiinternational.com/engine/marine-engine/yc6mk-marine-main-engine.html',
    specsCredit: 'Yuchai specifications',
  },
  {
    name: 'Caterpillar C18',
    description: 'Marine propulsion engine for commercial and recreational applications. Cat lists commercial ratings from 454 to 1,136 bhp and high-performance ratings up to 1,136 bhp, depending on application.',
    image: 'https://www.industrialmarinepower.com/img/caterpillar-c18-marine-propulsion-engine-15201_333.jpg',
    imageSource: 'https://www.industrialmarinepower.com/caterpillar-c18-marine-propulsion-engine-15201/',
    imageCredit: 'Industrial Marine Power',
    specsSource: 'https://www.cat.com/en_GB/products/new/power-systems/marine-power-systems/commercial-propulsion-engines/18493267.html',
    specsCredit: 'Cat specifications',
  },
  {
    name: 'MAN D2862 V12',
    description: 'V12 marine diesel propulsion engine for professional vessels and workboats. Available output depends on the D2862 variant and duty rating; confirm the model code and vessel application.',
    image: 'https://img.nauticexpo.es/images_ne/photo-g/23543-10638848.jpg',
    imageSource: 'https://www.nauticexpo.es/prod/man-truck-bus-se-engines-components/product-23543-228085.html',
    imageCredit: 'MAN Truck & Bus via NauticExpo',
    specsSource: 'https://www.nauticexpo.es/prod/man-truck-bus-se-engines-components/product-23543-228085.html',
    specsCredit: 'engine details',
  },
];

const marineGearboxModels = [
  {
    name: 'FADA FD170',
    description: 'Marine gearbox with a 1.97–5.88 reduction ratio range, 1,000–2,500 rpm input speed, and 0.027–0.039 kW/rpm transmission capacity.',
    image: 'https://fada-gearbox.com/wp-content/uploads/2023/08/fd170-fada-marine-gearbox.png',
  },
  {
    name: 'FADA FD135 / FD135A',
    description: 'Marine gearbox series with 2.03–5.81 reduction ratios, 750–2,000 rpm input speed, and 0.070–0.100 kW/rpm transmission capacity.',
    image: 'https://fada-gearbox.com/wp-content/uploads/2023/08/fd135a-fada-marine-gearbox.png',
  },
  {
    name: 'FADA FD142',
    description: 'Marine gearbox with a 1.97–5.47 reduction ratio range, 1,500–2,500 rpm input speed, and 0.013–0.030 kW/rpm transmission capacity.',
    image: 'https://fadagearbox.com/wp-content/uploads/2025/01/FADA-FD142-Marine-Gearbox-ProductImage-510x376.png',
  },
  {
    name: 'FADA FD16',
    description: 'Compact marine gearbox with 2.07–3.83 reduction ratios, 1,000–2,100 rpm input speed, and 0.012 kW/rpm transmission capacity.',
    image: 'https://fada-gearbox.com/wp-content/uploads/2023/07/FD16-fada-marine-gearbox.png',
  },
  {
    name: 'FADA FD06',
    description: 'Compact marine gearbox with 2.52–3.50 reduction ratios, 1,000–2,100 rpm input speed, and 0.0044 kW/rpm transmission capacity.',
    image: 'https://fada-gearbox.com/wp-content/uploads/2023/07/FD06-fada-marine-gearbox.png',
  },
];

const heavyMachineryModels = [
  {
    name: 'Lonking CDM833 Wheel Loader',
    description: 'Heavy machinery model powered by a Weichai WP6G125E22 diesel engine. Confirm year, configuration, and engine specification before ordering.',
    image: 'https://mmaks.ru/sites/default/files/dsc_0177.jpg',
    imageSource: 'https://mmaks.ru/product/frontalnyy-pogruzchik-lonking-cdm833',
    imageCredit: 'MiroMax',
  },
  {
    name: 'Caterpillar C7.1',
    description: 'A 7.01-litre inline-six industrial diesel with turbocharged, aftercooled aspiration. Cat offers configurable ratings for construction, mining, and material-handling equipment; output depends on the configuration.',
    image: 'https://i.ebayimg.com/images/g/ncYAAeSwEP1o4748/s-l960.jpg',
    imageSource: 'https://www.ebay.com/itm/326805944400',
    imageCredit: 'eBay listing',
  },
  {
    name: 'Cummins QSB6.7',
    description: 'A 6.7-litre inline-six industrial diesel platform used in construction and off-highway equipment. Power and emissions ratings vary by engine tier and configuration.',
    image: 'https://rebuiltcumminsenginesales.com/uploaded_images/model/model_2101.jpg',
    imageSource: 'https://www.rebuiltcumminsenginesales.com/cummins_engines/Cummins_QSB6.7_engines.aspx',
    imageCredit: 'Rebuilt Cummins Engine Sales',
  },
  {
    name: 'Weichai WP6G',
    description: 'Industrial diesel engine series for construction and other machinery applications. Confirm the full engine code, power rating, and equipment compatibility before ordering.',
    image: 'https://product.hstatic.net/200000700339/product/h1d8a25f1510d4d0bb94129d803f30e0ed_d1e6b05f675f4d61b3d77268a951f797_master.jpg',
    imageSource: 'https://chima.vn/products/dong-co-may-weichai-wp6g',
    imageCredit: 'Chima',
  },
  {
    name: 'Perkins 1106D-E70TA',
    description: 'A six-cylinder, 7.01-litre industrial diesel engine with turbocharged, aftercooled aspiration. Available power and emissions configurations depend on the engine specification.',
    image: 'https://profmotors.ru/thumb/2/dTzS8DWJ0uG0EJKUgs09BQ/921r921/d/pw82788_1106d-e70ta.jpg',
    imageSource: 'https://www.perkins.com/en_GB/products/new/perkins/industrial/industrial-diesel-engines/1000002180.html',
    imageCredit: 'Perkins',
  },
  {
    name: 'John Deere 6068 PowerTech',
    description: 'A 6.8-litre industrial diesel engine family for off-highway equipment. Ratings, emissions certification, and accessories vary by 6068 engine code.',
    image: 'https://www.deere.ca/assets/images/common/industries/engines-and-drivetrain/product/GEN_FT4_6068HFG09_RtFt_large_813a9581b51cfe73a6bbe1559c5008542c1cbbb9.png',
    imageSource: 'https://www.deere.ca/en/generator-drive-engines/final-tier-4-stage-v/6068cg550/',
    imageCredit: 'John Deere',
  },
];

const approach = [
  {
    title: 'Understand the application',
    description: 'Share the vessel or equipment type, operating conditions, and the job the machinery needs to do.',
    icon: Gauge,
  },
  {
    title: 'Match the right equipment',
    description: 'We help narrow the options using the technical details and specifications you provide.',
    icon: Cog,
  },
  {
    title: 'Plan your requirements',
    description: 'Discuss equipment, compatible parts, and the next steps for your project with our team.',
    icon: Wrench,
  },
];

export default function HomePage() {
  return (
    <div className="overflow-hidden bg-white">
      <section className="relative isolate bg-slate-950 text-white">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_75%_40%,rgba(14,116,144,0.28),transparent_48%),linear-gradient(120deg,#020617_12%,#0f172a_65%,#164e63)]" />
        <div className="absolute inset-0 -z-10 opacity-[0.12] [background-image:linear-gradient(rgba(255,255,255,.15)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.15)_1px,transparent_1px)] [background-size:64px_64px]" />
        <div className="mx-auto grid max-w-7xl gap-14 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-[1.1fr_.9fr] lg:items-center lg:px-8 lg:py-32">
          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-200/10 px-4 py-2 text-sm font-medium text-cyan-100">
              <Anchor className="h-4 w-4" />
              Marine &amp; industrial equipment
            </div>
            <h1 className="max-w-3xl text-4xl font-bold leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
              Powering work on the water <span className="text-cyan-300">and on land.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
              Noor Alam Machineries helps businesses source marine engines, gearboxes, and heavy machinery for demanding work and long days in service.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="#equipment"
                className="inline-flex items-center gap-2 rounded-md bg-cyan-400 px-6 py-3.5 font-semibold text-slate-950 transition hover:bg-cyan-300"
              >
                Explore equipment <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="#about"
                className="inline-flex items-center gap-2 rounded-md border border-white/25 px-6 py-3.5 font-semibold text-white transition hover:bg-white/10"
              >
                About our approach
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
            <div className="absolute -inset-5 rounded-[2rem] border border-cyan-200/10" />
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/75 p-6 shadow-2xl shadow-black/30 backdrop-blur sm:p-8">
              <div className="flex items-center justify-between border-b border-white/10 pb-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">Equipment focus</p>
                  <p className="mt-1 text-sm text-slate-400">Built around your operation</p>
                </div>
                <div className="rounded-full border border-cyan-300/20 bg-cyan-300/10 p-3 text-cyan-200">
                  <Gauge className="h-5 w-5" />
                </div>
              </div>
              <div className="space-y-3 py-5">
                {equipment.map(({ id, number, title, detail, icon: Icon }) => (
                  <a
                    key={id}
                    href={`#${id}`}
                    className="group flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.04] p-4 transition hover:border-cyan-300/40 hover:bg-white/[0.08]"
                  >
                    <div className="rounded-lg bg-cyan-300/10 p-3 text-cyan-200">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-cyan-300">{number}</span>
                        <h2 className="font-semibold text-white">{title}</h2>
                      </div>
                      <p className="mt-1 truncate text-xs text-slate-400">{detail}</p>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-slate-500 transition group-hover:text-cyan-200" />
                  </a>
                ))}
              </div>
              <p className="flex items-center gap-2 border-t border-white/10 pt-5 text-sm text-slate-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Equipment choices start with the job and specifications.
              </p>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 bg-black/10">
          <div className="mx-auto grid max-w-7xl gap-4 px-4 py-5 text-sm font-medium text-slate-300 sm:grid-cols-3 sm:px-6 lg:px-8">
            <p className="flex items-center gap-2"><Check className="h-4 w-4 text-cyan-300" /> Marine propulsion systems</p>
            <p className="flex items-center gap-2"><Check className="h-4 w-4 text-cyan-300" /> Gearboxes and transmissions</p>
            <p className="flex items-center gap-2"><Check className="h-4 w-4 text-cyan-300" /> Heavy-duty machinery</p>
          </div>
        </div>
      </section>

      <section id="equipment" className="scroll-mt-24 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-700">What we work with</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-5xl">Machinery for demanding work</h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              From vessel propulsion to heavy equipment on shore, the right machinery begins with understanding how it will be used.
            </p>
          </div>
          <div id="marine-engine-models" className="mt-20 scroll-mt-28">
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-700">Marine diesel engines</p>
              <h3 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">Engine models</h3>
              <p className="mt-3 leading-7 text-slate-600">Ask us about availability and matching the engine variant to your vessel and gearbox.</p>
            </div>
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {marineEngineModels.map((model) => (
                <article key={model.name} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="relative aspect-[16/10] bg-slate-100">
                    <ResilientImage src={model.image} alt={`${model.name} marine diesel engine`} sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-contain p-2" />
                  </div>
                  <div className="p-6">
                    <h4 className="text-xl font-bold text-slate-950">{model.name}</h4>
                    <p className="mt-2 leading-6 text-slate-600">{model.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div id="gearboxes" className="mt-20 scroll-mt-28">
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-700">Marine gearboxes</p>
              <h3 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">FADA gearbox models</h3>
              <p className="mt-3 leading-7 text-slate-600">Compare input speed and reduction ratio ranges, then confirm the correct gearbox against your engine and vessel requirements.</p>
            </div>
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {marineGearboxModels.map((model) => (
                <article key={model.name} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="relative aspect-[16/10] bg-slate-100">
                    <ResilientImage src={model.image} alt={`${model.name} marine gearbox`} sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-contain p-2" />
                  </div>
                  <div className="p-6">
                    <h4 className="text-xl font-bold text-slate-950">{model.name}</h4>
                    <p className="mt-2 leading-6 text-slate-600">{model.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div id="heavy-machinery" className="mt-20 scroll-mt-28">
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-700">Heavy machinery</p>
              <h3 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">Heavy machinery &amp; engines</h3>
            </div>
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {heavyMachineryModels.map((model) => (
                <article key={model.name} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="relative aspect-[16/10] bg-slate-100">
                    <ResilientImage src={model.image} alt={`${model.name} photo`} sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-contain p-2" />
                  </div>
                  <div className="p-6">
                    <h4 className="text-xl font-bold text-slate-950">{model.name}</h4>
                    <p className="mt-2 leading-6 text-slate-600">{model.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="scroll-mt-24 bg-slate-50 py-20 sm:py-28">
        <div className="mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-[.9fr_1.1fr] lg:items-center lg:px-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-700">A practical approach</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-5xl">The right fit matters.</h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              Noor Alam Machineries is led by Managing Director Md. Noor Nabi. We import, wholesale, and retail marine diesel engines, marine gearboxes, generators, and heavy equipment spare parts, helping customers match equipment to their requirements.
            </p>
            <p className="mt-4 text-sm font-semibold uppercase leading-6 tracking-wide text-slate-500">
              Zichai · Hino · Isuzu · Cummins · Perkins · Doosan · John Deere · MAN · Fadda
            </p>
            <Link href="#contact" className="mt-8 inline-flex items-center gap-2 font-semibold text-cyan-800 hover:text-cyan-950">
              Discuss your requirements <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="space-y-4">
            {approach.map(({ title, description, icon: Icon }, index) => (
              <div key={title} className="flex gap-5 rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-slate-950 text-cyan-300"><Icon className="h-5 w-5" /></div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Step 0{index + 1}</p>
                  <h3 className="mt-1 font-bold text-slate-950">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="scroll-mt-24 bg-slate-950 py-16 text-white sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-300">Start a conversation</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Looking for an engine, gearbox, or machinery?</h2>
            <p className="mt-4 leading-7 text-slate-300">Share the equipment type and the specifications you have. Noor Alam Machineries can help you take the next step.</p>
            <div className="mt-5 flex flex-col gap-2 text-sm text-slate-300">
              <a href="mailto:noornoobi80@gmail.com" className="w-fit transition hover:text-cyan-200">noornoobi80@gmail.com</a>
              <a href="https://www.nooralammachinery.com" target="_blank" rel="noreferrer" className="w-fit transition hover:text-cyan-200">www.nooralammachinery.com</a>
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <a href="tel:+8801728079359" className="inline-flex items-center justify-center gap-2 rounded-md border border-white/25 px-5 py-3.5 font-semibold text-white transition hover:bg-white/10">
              <PhoneCall className="h-5 w-5" /> 01728-079359
            </a>
            <Link href="/products" className="inline-flex items-center justify-center gap-2 rounded-md bg-cyan-400 px-6 py-3.5 font-semibold text-slate-950 transition hover:bg-cyan-300">
              Browse engine parts <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
          </div>
          <div className="mt-14 border-t border-white/10 pt-10">
            <h3 className="text-2xl font-bold tracking-tight">Visit our locations</h3>
            <div className="mt-6 grid gap-5 md:grid-cols-3">
              {BRANCHES.map((branch) => (
                <article key={branch.name} className="rounded-xl bg-white p-6 text-slate-900 shadow-lg">
                  <h4 className="text-lg font-bold">{branch.name}</h4>
                  <address className="mt-3 space-y-1 text-sm not-italic leading-6 text-slate-600">
                    {branch.address.map((line) => <p key={line}>{line}</p>)}
                  </address>
                  <ul className="mt-4 space-y-2 border-t border-slate-100 pt-4">
                    {branch.phones.map((phone) => (
                      <li key={phone}>
                        <a href={`tel:${phone.replaceAll('-', '')}`} className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-800 hover:text-cyan-950">
                          <PhoneCall className="h-4 w-4" /> {phone}
                        </a>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
