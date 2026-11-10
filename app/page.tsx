import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Cog, Construction, MapPin, PhoneCall, Ship } from 'lucide-react';
import { ContactForm } from '@/components/chat/ContactForm';
import { CatalogImage } from '@/components/ui/CatalogImage';
import {
  marineEngineModels,
  marineGearboxModels,
  heavyMachineryModels,
  featuredMarineEngine,
  featuredMarineGearbox,
  featuredHeavyMachinery,
} from '@/data/equipment';
import { BRANCHES } from '@/data/branches';
import { CATEGORY_LANDINGS, getCategoryImageSource, getCategoryProducts } from '@/data/categories';
import { formatBangladeshPhone, toBangladeshTel } from '@/lib/phone';
import { cleanDash, splitMeta } from '@/lib/copy';
import { PinnedEquipmentStory } from '@/components/home/PinnedEquipmentStory';
import { EquipmentCarousel } from '@/components/home/EquipmentCarousel';
import { BrandLogo } from '@/components/home/BrandLogo';

const equipmentCards = [
  {
    id: 'marine-engine-models',
    href: '/categories/marine-engines',
    title: 'Marine engines',
    note: 'Propulsion and auxiliary power',
    description: 'Diesel engine platforms for commercial vessels, workboats, and demanding days at sea.',
    image: featuredMarineEngine.image,
    productId: featuredMarineEngine.id,
    icon: Ship,
    imageClass: 'object-contain p-8 sm:p-12',
  },
  {
    id: 'gearboxes',
    href: '/categories/marine-gearboxes',
    title: 'Marine gearboxes',
    note: 'Transmission and reduction',
    description: 'Find a gearbox to suit your engine output, vessel, and operating conditions.',
    image: featuredMarineGearbox.image,
    productId: featuredMarineGearbox.id,
    icon: Cog,
    imageClass: 'object-contain p-6 sm:p-8',
  },
  {
    id: 'heavy-machinery',
    href: '/categories/heavy-machinery',
    title: 'Heavy machinery',
    note: 'Equipment and spare parts',
    description: 'Reliable machinery and components for industrial and construction work.',
    image: featuredHeavyMachinery.image,
    productId: featuredHeavyMachinery.id,
    icon: Construction,
    imageClass: 'object-cover',
  },
];

const partCategoryCards = CATEGORY_LANDINGS.filter((category) => category.kind === 'parts');

const brands = [
  { name: 'Zichai', logo: '/brand/zichai.png' },
  { name: 'Weichai', logo: '/brand/weichai.svg' },
  { name: 'Cummins', logo: '/brand/cummins.svg' },
  { name: 'Hino', logo: '/brand/hino.svg' },
  { name: 'Isuzu', logo: '/brand/isuzu.svg' },
  { name: 'Perkins', logo: '/brand/perkins.svg' },
  { name: 'Doosan', logo: '/brand/doosan.svg' },
  { name: 'John Deere', logo: '/brand/john-deere.webp' },
  { name: 'MAN', logo: '/brand/man.svg' },
  { name: 'FADA', logo: '/brand/fada.png' },
];

const showroomMapQuery = 'Modina Arzoo Complex, 107 Nawabpur Road, Dhaka 1100, Bangladesh';

const engineSpecs = featuredMarineEngine.specifications ?? [];
const displacement = engineSpecs
  .flatMap((spec) => splitMeta(spec))
  .find((part) => /displacement/i.test(part)) ?? '19 L displacement';
const power = (engineSpecs
  .flatMap((spec) => splitMeta(spec))
  .find((part) => /\bhp\b/i.test(part)) ?? '500 to 700 hp')
  .replace(/\s*\(.*$/, '');

export default function HomePage() {
  return (
    <main>
      <section className="hero-stage flex flex-col sheet">
        <div className="container flex flex-1 flex-col">
          <div className="grid flex-1 items-center gap-10 py-8 lg:grid-cols-12 lg:gap-12 lg:py-10">
            <div className="lg:col-span-6">
              <p className="mb-5 flex items-center gap-3 font-outlier text-xs text-accent">
                <span className="h-px w-10 bg-accent" aria-hidden="true" />
                Equipment register
              </p>
              <h1 className="max-w-[15ch] text-[clamp(2.5rem,4.4vw,4.5rem)] text-ink">
                Marine engines, gearboxes, and spares.
              </h1>
              <p className="lead mt-4 max-w-[44ch] sm:mt-6">
                The right engine, transmission, or machine starts with understanding the work. We help you source equipment and parts for the conditions you face.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row">
                <Link href="#equipment" className="btn">
                  Explore equipment <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link href="#contact" className="btn btn--quiet">
                  Talk to our team <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
              <div className="mt-8 hidden border-y border-rule-2 font-outlier text-xs sm:mt-10 sm:grid sm:grid-cols-[1fr_1fr_1.4fr] sm:divide-x sm:divide-rule-2">
                <div className="px-3 py-2 first:pl-0">
                  <span className="block text-xs text-accent">01</span>
                  <span className="mt-0.5 block text-ink-2">Noor Alam Machineries</span>
                </div>
                <div className="px-3 py-2">
                  <span className="block text-xs text-accent">02</span>
                  <span className="mt-0.5 block text-ink-2">Dhaka and Chittagong</span>
                </div>
                <div className="px-3 py-2">
                  <span className="block text-xs text-accent">03</span>
                  <span className="mt-0.5 block text-ink-2">Equipment, spares, guidance</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="plate plate--brass aspect-[4/3] w-full lg:aspect-auto lg:h-[min(64vh,calc(100dvh-20rem))]">
                <span className="absolute right-4 top-4 z-[3] border border-rule-2 bg-paper px-2 py-0.5 font-outlier text-xs text-ink">N-01</span>
                <CatalogImage
                  productId={featuredMarineEngine.id}
                  src={featuredMarineEngine.image}
                  alt={`${featuredMarineEngine.name} marine diesel engine`}
                  sizes="(max-width: 1023px) calc(100vw - 2rem), 58vw"
                  loading="eager"
                  preload
                  className="h-full w-full object-contain p-6 sm:p-10"
                />
              </div>
              <div className="mt-6">
                <p className="dim-value">{featuredMarineEngine.name} marine rating</p>
                <div className="dim-row hero-dim">
                  <span className="font-outlier text-xs text-ink-2">{cleanDash(displacement)}</span>
                  <span className="dim" aria-hidden="true" />
                  <span className="font-outlier text-xs text-ink-2">{power}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between gap-3 border-t border-rule-2 py-4 font-outlier text-xs text-muted sm:flex-row sm:items-center">
            <span>Serving marine and industry</span>
            <span className="hidden sm:block">Equipment, spares, guidance</span>
            <a
              href="https://commons.wikimedia.org/wiki/File:CSIRO_ScienceImage_7992_The_engine_room_on_the_RV_Southern_Surveyor.jpg"
              target="_blank"
              rel="noreferrer"
              className="hover:text-accent"
            >
              Photo: Simon Torok / CSIRO, CC BY 3.0
            </a>
          </div>
        </div>
      </section>

      <section id="equipment" className="section scroll-mt-24">
        <div className="container">
          <div className="mb-10 grid gap-6 md:grid-cols-12 md:items-end">
            <h2 className="md:col-span-7">Three groups: engines, gearboxes, machines.</h2>
            <p className="max-w-md text-base leading-7 text-muted md:col-span-5">
              Explore our core equipment categories. Every recommendation starts with your application, operating conditions, and technical requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
            <EquipmentCard card={equipmentCards[0]} lead />
            <div className="flex flex-col gap-5 lg:col-span-5">
              {equipmentCards.slice(1).map((card) => (
                <EquipmentCard key={card.id} card={card} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section--s band border-y border-rule-2" aria-label="Equipment brands">
        <div className="container">
          <div className="grid grid-cols-2 border-l border-t border-rule-2 sm:grid-cols-5">
            {brands.map((brand) => (
              <div key={brand.name} className="brand-cell">
                <BrandLogo name={brand.name} src={brand.logo} />
                <span className="text-ink-2">{brand.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PinnedEquipmentStory models={[featuredMarineEngine, featuredMarineGearbox, featuredHeavyMachinery]} />
      <EquipmentCarousel models={[...marineEngineModels, ...marineGearboxModels, ...heavyMachineryModels]} />

      <section className="section--s border-y border-rule-2">
        <div className="container">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <h2>Keep the equipment working.</h2>
            <Link href="/categories" prefetch={false} className="link">
              All categories <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <ol className="border-t border-rule">
            {partCategoryCards.map((category, index) => {
              const count = getCategoryProducts(category).length;
              return (
                <li key={category.slug} className="border-b border-rule-2">
                  <Link
                    href={`/categories/${category.slug}`}
                    prefetch={false}
                    className="grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-4 py-4 transition-colors hover:bg-paper-2 sm:grid-cols-[3rem_1fr_2fr_auto]"
                  >
                    <span className="font-outlier text-xs text-muted">{String(index + 1).padStart(2, '0')}</span>
                    <h3 className="text-lg font-medium text-ink">{category.label}</h3>
                    <span className="col-start-2 text-sm leading-6 text-muted sm:col-start-3">{cleanDash(category.description)}</span>
                    <span className="col-start-3 row-start-1 flex items-center gap-3 font-outlier text-xs text-muted sm:col-start-4">
                      {count} {count === 1 ? 'part' : 'parts'}
                      <ArrowUpRight className="h-4 w-4 text-accent" aria-hidden="true" />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <section id="about" className="section band">
        <div className="container">
          <div className="grid gap-6 md:grid-cols-12 md:items-end">
            <h2 className="md:col-span-7">Four checks before you order.</h2>
            <p className="max-w-md text-base leading-7 text-muted md:col-span-5">
              Tell us what the equipment needs to do. We will help identify suitable options, clarify the specifications, and map out the next step.
            </p>
          </div>

          <div className="plate mt-10 aspect-[21/9]">
            <Image
              src="/photos/engine-room.jpg"
              alt="Engine room of the RV Southern Surveyor"
              fill
              sizes="(max-width: 1023px) 100vw, 1312px"
              quality={70}
              className="object-cover"
            />
          </div>
          <p className="mt-3 font-outlier text-xs text-muted">
            Photo: Simon Torok / CSIRO, CC BY 3.0
          </p>

          <ol className="mt-12 grid gap-6 border-t border-rule pt-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ['Understand the job', 'Start with the vessel, machine, operating conditions, and work ahead.'],
              ['Match the equipment', 'Compare model details and technical requirements with your application.'],
              ['Check compatibility', 'Confirm the engine, gearbox, dimensions, and part numbers before ordering.'],
              ['Plan the next step', 'Discuss availability, compatible parts, and the information needed to proceed.'],
            ].map(([title, description], index) => (
              <li key={title} className="min-w-0">
                <span className="font-outlier text-xs text-accent">{String(index + 1).padStart(2, '0')}</span>
                <h3 className="mt-3 text-xl text-ink">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="contact" className="section scroll-mt-24">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-5">
              <h2>Tell us the machine and the job.</h2>
              <p className="mt-5 max-w-lg text-base leading-7 text-muted">
                Send the equipment model and the specifications you have. Our team can help you take the next step.
              </p>
              <div className="mt-7 space-y-3 text-sm">
                <a href={toBangladeshTel('01728-079359')} className="flex items-center gap-3 text-ink hover:text-accent">
                  <PhoneCall className="h-4 w-4" aria-hidden="true" />{formatBangladeshPhone('01728-079359')}
                </a>
                <a href="mailto:noornoobi80@gmail.com" className="flex items-center gap-3 text-ink hover:text-accent">
                  noornoobi80@gmail.com
                </a>
              </div>

              <div className="mt-10 border-t border-rule-2 pt-6">
                <p className="mb-4 text-sm font-medium text-ink">Visit our locations</p>
                <div className="space-y-5">
                  {BRANCHES.map((branch) => {
                    const [place, city] = splitMeta(branch.name);
                    return (
                      <div key={branch.name} className="flex gap-3 text-sm text-muted">
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                        <p className="m-0 max-w-none">
                          <span className="block font-medium text-ink">{place}</span>
                          {city && <span className="block text-ink-2">{city}</span>}
                          <span className="block leading-6">{branch.address.join(', ')}</span>
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="self-start border border-rule-2 lg:col-span-7">
              <div className="grid lg:grid-cols-[1.3fr_.7fr]">
                <div className="p-5 sm:p-7"><ContactForm /></div>
                <div className="flex min-h-[320px] flex-col border-t border-rule-2 lg:border-l lg:border-t-0">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-rule-2 bg-paper-2 px-4 py-2.5">
                    <p className="font-outlier text-xs text-muted">Main showroom, Dhaka</p>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(showroomMapQuery)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="font-outlier text-xs text-accent hover:text-ink"
                    >
                      Open in Google Maps
                    </a>
                  </div>
                  <iframe
                    title="Map to Noor Alam Machineries main showroom in Dhaka"
                    src={`https://www.google.com/maps?q=${encodeURIComponent(showroomMapQuery)}&z=17&output=embed`}
                    className="min-h-0 w-full flex-1 border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 flex flex-col justify-between gap-3 border-t border-rule-2 pt-5 font-outlier text-xs text-muted sm:flex-row">
            <span>Noor Alam Machineries</span>
            <span>Dhaka and Chittagong, Bangladesh</span>
            <Link href="/products" className="inline-flex items-center gap-2 text-ink hover:text-accent">
              Browse engine parts <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function EquipmentCard({ card, lead = false }: { card: (typeof equipmentCards)[number]; lead?: boolean }) {
  const { href, productId, title, note, description, image, icon: Icon, imageClass } = card;
  const category = CATEGORY_LANDINGS.find((entry) => entry.slug === href.replace('/categories/', ''));
  const count = category ? getCategoryProducts(category).length : 0;

  const meta = (
    <div className="flex items-center justify-between gap-4">
      <span className="flex items-center gap-2 font-outlier text-xs text-muted">
        <Icon className="h-4 w-4 text-accent" aria-hidden="true" />
        {note}
      </span>
      <span className="font-outlier text-xs text-muted">{count} products</span>
    </div>
  );

  if (lead) {
    return (
      <Link
        href={href}
        prefetch={false}
        className="plate-link group flex min-w-0 flex-col border border-rule-2 lg:col-span-7"
      >
        <div className="plate aspect-[4/3]">
          <CatalogImage
            productId={productId}
            src={image}
            alt=""
            sizes="(max-width: 1023px) 100vw, 58vw"
            className={`h-full w-full ${imageClass}`}
            loading="eager"
          />
        </div>
        <div className="flex flex-1 flex-col border-t border-rule-2 p-5 sm:p-6">
          {meta}
          <div className="mt-4 flex items-end justify-between gap-4">
            <div>
              <h3 className="text-2xl text-ink sm:text-3xl">{title}</h3>
              <p className="mt-2 max-w-md text-sm leading-6 text-muted">{description}</p>
            </div>
            <ArrowUpRight className="mb-1 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      prefetch={false}
      className="plate-link group grid min-w-0 flex-1 grid-cols-1 border border-rule-2 sm:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)]"
    >
      <div className="plate aspect-[4/3] border-b border-rule-2 sm:aspect-auto sm:min-h-[200px] sm:border-b-0 sm:border-r">
        <CatalogImage
          productId={productId}
          src={image}
          alt=""
          sizes="(max-width: 639px) 100vw, (max-width: 1023px) 40vw, 24vw"
          className="h-full w-full object-contain p-5"
          loading="lazy"
        />
      </div>
      <div className="flex flex-1 flex-col justify-between gap-4 p-5">
        {meta}
        <div>
          <h3 className="text-xl text-ink">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
        </div>
        <span className="inline-flex items-center gap-2 font-outlier text-xs text-accent">
          View category <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}
