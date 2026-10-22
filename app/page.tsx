import Image from 'next/image';
import Link from 'next/link';
import { ArrowDown, ArrowRight, ArrowUpRight, Cog, Construction, MapPin, PhoneCall, Ship } from 'lucide-react';
import { ContactForm } from '@/components/chat/ContactForm';
import { CatalogImage } from '@/components/ui/CatalogImage';
import { marineEngineModels, marineGearboxModels, heavyMachineryModels } from '@/data/equipment';
import { BRANCHES } from '@/data/branches';
import { formatBangladeshPhone, toBangladeshTel } from '@/lib/phone';
import { PinnedEquipmentStory } from '@/components/home/PinnedEquipmentStory';
import { EquipmentCarousel } from '@/components/home/EquipmentCarousel';
import { ScrollRevealedText } from '@/components/home/ScrollRevealedText';
import { BrandLogo } from '@/components/home/BrandLogo';
import { cn } from '@/lib/utils';

const equipmentCards = [
  {
    id: 'marine-engine-models',
    title: 'Marine engines',
    note: 'Propulsion and auxiliary power',
    description: 'Diesel engine platforms for commercial vessels, workboats, and demanding days at sea.',
    image: marineEngineModels[4].image,
    productId: marineEngineModels[4].id,
    icon: Ship,
    className: 'col-span-2 row-span-1 lg:col-span-2 lg:row-span-2',
    imageClass: 'object-contain p-8 sm:p-12',
  },
  {
    id: 'gearboxes',
    title: 'Marine gearboxes',
    note: 'Transmission and reduction',
    description: 'Find a gearbox to suit your engine output, vessel, and operating conditions.',
    image: marineGearboxModels[0].image,
    productId: marineGearboxModels[0].id,
    icon: Cog,
    className: 'col-span-2 row-span-1',
    imageClass: 'object-contain p-4 sm:p-7',
  },
  {
    id: 'heavy-machinery',
    title: 'Heavy machinery',
    note: 'Equipment and spare parts',
    description: 'Reliable machinery and components for industrial and construction work.',
    image: heavyMachineryModels[0].image,
    productId: heavyMachineryModels[0].id,
    icon: Construction,
    className: 'col-span-2 row-span-1',
    imageClass: 'object-cover',
  },
];

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

export default function HomePage() {
  return (
    <main className="w-full max-w-full overflow-x-hidden">
      <section className="hero-panel relative isolate overflow-hidden bg-[#101b19] text-white">
        <div className="hero-photo absolute inset-0 -z-20">
          <Image
            src="https://picsum.photos/seed/marine-engine-room/1920/1080"
            alt=""
            fill
            priority
            sizes="100vw"
            quality={70}
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(10,18,17,.97)_0%,rgba(10,18,17,.88)_42%,rgba(10,18,17,.22)_100%),linear-gradient(0deg,rgba(10,18,17,.72),transparent_50%)]" />
        <div className="mx-auto grid min-h-[690px] max-w-[1440px] items-center gap-12 px-5 pb-16 pt-20 sm:px-8 lg:min-h-[760px] lg:grid-cols-[1.05fr_.95fr] lg:gap-16 lg:px-12 lg:py-24">
          <div className="relative z-10 max-w-3xl">
            <p className="mb-7 flex items-center gap-3 text-xs font-semibold uppercase tracking-[.24em] text-[#d6b983] sm:text-sm">
              <span className="h-px w-10 bg-[#d6b983]" />Marine &amp; industrial machinery
            </p>
            <h1 className="max-w-6xl text-[clamp(3rem,5vw,5.5rem)] font-semibold leading-[.98] tracking-[-.055em] text-white">
              Powering work that keeps us moving.
            </h1>
            <p className="mt-7 max-w-xl text-base leading-7 text-white/75 sm:text-lg sm:leading-8">
              The right engine, transmission, or machine starts with understanding the work. We help you source equipment and parts for the conditions you face.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="#equipment" className="inline-flex min-h-14 items-center justify-center gap-3 bg-[#d7bd8d] px-6 text-sm font-semibold text-[#17201c] transition-colors hover:bg-[#ebd8b2]">
                Explore equipment <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="#contact" className="inline-flex min-h-14 items-center justify-center gap-3 border border-white/40 px-6 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-[#17201c]">
                Talk to our team <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
            <p className="mt-12 flex items-center gap-3 text-xs uppercase tracking-[.18em] text-white/60">
              <span className="grid h-9 w-9 place-items-center rounded-full border border-white/25"><ArrowDown className="h-4 w-4" /></span>
              A considered match for every application
            </p>
          </div>
          <div className="relative hidden h-[490px] lg:block">
            <div className="absolute right-[8%] top-[3%] h-[88%] w-[76%] overflow-hidden rounded-t-[48%] border border-white/20 bg-[#263331]/60">
              <Image src={marineEngineModels[4].image} alt="Cummins KTA19 marine diesel engine" fill loading="lazy" sizes="(min-width: 1024px) 40vw, 0px" className="object-contain p-8 mix-blend-luminosity" />
            </div>
            <div className="absolute bottom-[3%] left-0 w-[46%] border border-white/20 bg-[#111d1b]/90 p-5 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-[.2em] text-[#d7bd8d]">Built around your operation</p>
              <p className="mt-3 text-sm leading-6 text-white/75">Share the vessel, machine, or model details. We’ll help you narrow the right fit.</p>
            </div>
          </div>
        </div>
        <div className="hero-bottom-rule mx-auto flex max-w-[1440px] items-center justify-between border-t border-white/20 px-5 py-5 text-[11px] uppercase tracking-[.16em] text-white/70 sm:px-8 lg:px-12">
          <span>Serving marine &amp; industry</span><span className="hidden sm:block">Dhaka · Chittagong</span><span>Equipment · Spares · Guidance</span>
        </div>
      </section>

      <section id="equipment" className="scroll-mt-20 bg-[#f4f2ec] py-24 sm:py-32 lg:py-40">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <div className="mb-12 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <p className="section-kicker">Equipment for real work</p>
              <h2 className="mt-5 max-w-3xl text-4xl font-semibold leading-[1.02] tracking-[-.045em] text-[#16211e] sm:text-6xl">A capable machine begins with a considered choice.</h2>
            </div>
            <p className="max-w-md text-base leading-7 text-[#58625c]">Explore our core equipment categories. Every recommendation starts with your application, operating conditions, and technical requirements.</p>
          </div>

          <div className="grid grid-flow-dense grid-cols-2 grid-rows-[minmax(220px,1fr)_minmax(220px,1fr)] gap-3 sm:gap-5 lg:grid-cols-4 lg:grid-rows-[minmax(230px,1fr)_minmax(230px,1fr)]">
            {equipmentCards.map(({ id, productId, title, note, description, image, icon: Icon, className, imageClass }, index) => (
              <Link key={id} href={`/#${id}`} className={`group relative isolate min-h-[280px] overflow-hidden bg-[#dfe2dc] ${className} ${index === 0 ? 'min-h-[440px] lg:min-h-[470px]' : ''}`}>
                <div className={cn(
                  "relative w-full h-full",
                  index === 0 ? "aspect-[4/3] lg:aspect-auto" : "aspect-video"
                )}>
                  <CatalogImage productId={productId} src={image} alt="" sizes="(max-width: 767px) 50vw, (max-width: 1023px) 70vw, 50vw" className={`${imageClass} transition-transform duration-700 ease-out group-hover:scale-105`} loading="lazy" />
                </div>
                <div className="absolute inset-0 -z-0 bg-gradient-to-t from-[#121c19]/90 via-[#121c19]/15 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-7">
                  <div className="mb-5 flex items-center justify-between"><span className="text-[11px] uppercase tracking-[.18em] text-white/75">{note}</span><Icon className="h-5 w-5 text-[#dfc99d]" strokeWidth={1.5} /></div>
                  <div className="flex items-end justify-between gap-4"><div><h3 className="text-2xl font-medium tracking-tight sm:text-3xl">{title}</h3><p className="mt-2 max-w-md text-sm leading-6 text-white/75">{description}</p></div><ArrowUpRight className="mb-1 h-5 w-5 shrink-0 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" /></div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="overflow-hidden border-y border-[#e2e0d8] bg-[#f8f7f3] py-4" aria-label="Equipment brands">
        <div className="brand-marquee flex w-max items-center gap-6 sm:gap-10" aria-hidden="true">
          {[...brands, ...brands].map((brand, index) => (
            <span key={`${brand.name}-${index}`} className="flex items-center gap-6 sm:gap-10">
              <span className="inline-flex items-center gap-2 whitespace-nowrap">
                <BrandLogo name={brand.name} src={brand.logo} />
                <span className="text-sm font-semibold tracking-[-.03em] text-[#38433d] sm:text-base">{brand.name}</span>
              </span>
              <span className="h-1 w-1 rounded-full bg-[#a78b5f]" />
            </span>
          ))}
        </div>
        <ul className="sr-only">{brands.map(({ name }) => <li key={name}>{name}</li>)}</ul>
      </section>

      <PinnedEquipmentStory models={[marineEngineModels[4], marineGearboxModels[0], heavyMachineryModels[0]]} />
      <EquipmentCarousel models={[...marineEngineModels, ...marineGearboxModels, ...heavyMachineryModels]} />

      <section id="about" className="bg-[#17221f] py-24 text-white sm:py-32 lg:py-40">
        <div className="mx-auto grid max-w-[1440px] gap-14 px-5 sm:px-8 lg:grid-cols-[.9fr_1.1fr] lg:gap-24 lg:px-12">
          <div>
            <p className="section-kicker section-kicker-light">How we work</p>
            <h2 className="mt-5 max-w-xl text-4xl font-medium leading-[1.05] tracking-[-.04em] sm:text-6xl">Good advice starts with the details.</h2>
              <ScrollRevealedText>Tell us what the equipment needs to do. We’ll help identify suitable options, clarify the specifications, and map out the next step.</ScrollRevealedText>
            <Link href="#contact" className="mt-9 inline-flex min-h-12 items-center gap-3 border-b border-[#d7bd8d] pb-2 text-sm font-semibold text-[#e6d3ac] transition-colors hover:text-white">Discuss a requirement <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="grid gap-px bg-white/15 sm:grid-cols-2">
            {[
              ['Understand the job', 'Start with the vessel, machine, operating conditions, and work ahead.'],
              ['Match the equipment', 'Compare model details and technical requirements with your application.'],
              ['Check compatibility', 'Confirm the engine, gearbox, dimensions, and part numbers before ordering.'],
              ['Plan the next step', 'Discuss availability, compatible parts, and the information needed to proceed.'],
            ].map(([title, description], index) => (
              <article key={title} className="bg-[#17221f] p-7 sm:p-9">
                <span className="font-mono text-xs text-[#d7bd8d]">0{index + 1}</span>
                <h3 className="mt-8 text-xl font-medium">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/60">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="scroll-mt-20 bg-[#e7e3d8] py-24 sm:py-32 lg:py-40">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <div className="grid gap-14 lg:grid-cols-[.85fr_1.15fr] lg:gap-24">
            <div>
              <p className="section-kicker">Start a conversation</p>
              <h2 className="mt-5 max-w-2xl text-4xl font-semibold leading-[1.02] tracking-[-.045em] text-[#17221f] sm:text-6xl">Let’s find the right fit for the work.</h2>
              <p className="mt-6 max-w-lg text-base leading-7 text-[#59615c]">Send the equipment model and the specifications you have. Our team can help you take the next step.</p>
              <div className="mt-9 space-y-4 text-sm">
                <a href={toBangladeshTel('01728-079359')} className="flex items-center gap-3 text-[#17221f] hover:underline"><PhoneCall className="h-4 w-4" />{formatBangladeshPhone('01728-079359')}</a>
                <a href="mailto:noornoobi80@gmail.com" className="flex items-center gap-3 text-[#17221f] hover:underline">noornoobi80@gmail.com</a>
              </div>
              <div className="mt-12 border-t border-[#c5c1b7] pt-7">
                <p className="mb-5 text-xs font-semibold uppercase tracking-[.18em] text-[#71756d]">Visit our locations</p>
                <div className="space-y-5">
                  {BRANCHES.map((branch) => <div key={branch.name} className="flex gap-3 text-sm text-[#4b554f]"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#88714b]" /><p><span className="font-semibold text-[#1b2521]">{branch.name}</span><br />{branch.address.join(', ')}</p></div>)}
                </div>
              </div>
            </div>
            <div className="grid overflow-hidden bg-[#18231f] text-white lg:grid-cols-[1fr_.85fr]">
              <div className="p-6 sm:p-9"><ContactForm /></div>
              <div className="relative min-h-[260px] bg-[#d6d4cd] lg:min-h-full">
                <iframe title="Map to Noor Alam Machineries main showroom in Dhaka" src={`https://www.google.com/maps?q=${encodeURIComponent(showroomMapQuery)}&z=17&output=embed`} className="absolute inset-0 h-full w-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
                <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(showroomMapQuery)}`} target="_blank" rel="noreferrer" className="absolute bottom-3 right-3 z-10 bg-white px-3 py-2 text-xs font-semibold text-[#17221f] shadow-md hover:bg-[#f1efe8]">Open in Google Maps</a>
              </div>
            </div>
          </div>
          <div className="mt-20 flex flex-col justify-between gap-6 border-t border-[#c5c1b7] pt-7 text-xs uppercase tracking-[.16em] text-[#74796f] sm:flex-row"><span>Noor Alam Machineries</span><span>Dhaka · Chittagong · Bangladesh</span><Link href="/products" className="inline-flex items-center gap-2 text-[#17221f]">Browse engine parts <ArrowRight className="h-3.5 w-3.5" /></Link></div>
        </div>
      </section>
    </main>
  );
}
