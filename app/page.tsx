import Link from 'next/link';
import { ResilientImage } from '@/components/ui/ResilientImage';
import { BRANCHES } from '@/data/branches';
import { marineEngineModels, marineGearboxModels, heavyMachineryModels } from '@/data/equipment';
import { formatBangladeshPhone, toBangladeshTel } from '@/lib/phone';
import {
  ArrowRight,
  ArrowUpRight,
  Anchor,
  Check,
  Cog,
  Construction,
  Gauge,
  MapPin,
  PhoneCall,
  Ship,
  Wrench,
  ExternalLink,
} from 'lucide-react';
import { ContactForm } from '@/components/chat/ContactForm';

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
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:gap-14 sm:px-6 sm:py-28 lg:grid-cols-[1.1fr_.9fr] lg:items-center lg:px-8 lg:py-32">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-200/10 px-3 py-2 text-xs font-medium text-white sm:mb-7 sm:px-4 sm:text-sm">
              <Anchor className="h-4 w-4" />
              Marine &amp; industrial equipment
            </div>
            <h1 className="max-w-3xl break-words text-[clamp(2rem,9vw,4.5rem)] font-bold leading-[1.08] tracking-tight">
              Powering work on the water <span className="text-white">and on land.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white sm:mt-7 sm:text-xl sm:leading-8">
              Noor Alam Machineries helps businesses source marine engines, gearboxes, and heavy machinery for demanding work and long days in service.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:gap-4">
              <Link
                href="#equipment"
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 sm:w-auto sm:px-6 sm:py-3.5"
              >
                Explore equipment <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="#about"
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md border border-white/25 px-5 py-3 font-semibold text-white transition hover:bg-white/10 sm:w-auto sm:px-6 sm:py-3.5"
              >
                About our approach
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
            <div className="absolute -inset-5 rounded-[2rem] border border-cyan-200/10" />
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/75 p-4 shadow-2xl shadow-black/30 backdrop-blur sm:p-8">
              <div className="flex items-center justify-between border-b border-white/10 pb-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white">Equipment focus</p>
                  <p className="mt-1 text-sm text-white">Built around your operation</p>
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
                    className="group flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-3 transition hover:border-cyan-300/40 hover:bg-white/[0.08] sm:items-center sm:gap-4 sm:p-4"
                  >
                    <div className="rounded-lg bg-cyan-300/10 p-2.5 text-cyan-200 sm:p-3">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-white">{number}</span>
                        <h2 className="font-semibold text-white">{title}</h2>
                      </div>
                      <p className="mt-1 whitespace-normal text-xs leading-5 text-white">{detail}</p>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-white transition group-hover:text-white" />
                  </a>
                ))}
              </div>
              <p className="flex items-center gap-2 border-t border-white/10 pt-5 text-sm text-white">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Equipment choices start with the job and specifications.
              </p>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 bg-black/10 text-white">
          <div className="mx-auto grid max-w-7xl gap-4 px-4 py-5 text-sm font-medium text-white sm:grid-cols-3 sm:px-6 lg:px-8">
            <p className="flex items-center gap-2"><Check className="h-4 w-4 text-cyan-300" /> Marine propulsion systems</p>
            <p className="flex items-center gap-2"><Check className="h-4 w-4 text-cyan-300" /> Gearboxes and transmissions</p>
            <p className="flex items-center gap-2"><Check className="h-4 w-4 text-cyan-300" /> Heavy-duty machinery</p>
          </div>
        </div>
      </section>

      <section id="equipment" className="scroll-mt-20 py-16 sm:scroll-mt-24 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-700">What we work with</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-5xl">Machinery for demanding work</h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              From vessel propulsion to heavy equipment on shore, the right machinery begins with understanding how it will be used.
            </p>
          </div>
          <div id="marine-engine-models" className="mt-14 scroll-mt-20 sm:mt-20 sm:scroll-mt-28">
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-700">Marine diesel engines</p>
              <h3 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">Engine models</h3>
              <p className="mt-3 leading-7 text-slate-600">Ask us about availability and matching the engine variant to your vessel and gearbox.</p>
            </div>
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {marineEngineModels.map((model) => (
                <Link key={model.id} href={`/products/${model.id}`} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-cyan-300 hover:shadow-md">
                  <div className="relative aspect-[16/10] bg-slate-100">
                    <ResilientImage src={model.image} alt={`${model.name} marine diesel engine`} sizes="(max-width: 767px) calc(100vw - 2rem), (max-width: 1023px) calc((100vw - 3rem) / 2), 400px" className="object-contain p-2" />
                  </div>
                  <div className="p-5 sm:p-6">
                    <h4 className="text-xl font-bold text-slate-950">{model.name}</h4>
                    <p className="mt-2 leading-6 text-slate-600">{model.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div id="gearboxes" className="mt-14 scroll-mt-20 sm:mt-20 sm:scroll-mt-28">
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-700">Marine gearboxes</p>
              <h3 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">FADA gearbox models</h3>
              <p className="mt-3 leading-7 text-slate-600">Compare input speed and reduction ratio ranges, then confirm the correct gearbox against your engine and vessel requirements.</p>
            </div>
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {marineGearboxModels.map((model) => (
                <Link key={model.id} href={`/products/${model.id}`} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-cyan-300 hover:shadow-md">
                  <div className="relative aspect-[16/10] bg-slate-100">
                    <ResilientImage src={model.image} alt={`${model.name} marine gearbox`} sizes="(max-width: 767px) calc(100vw - 2rem), (max-width: 1023px) calc((100vw - 3rem) / 2), 400px" className="object-contain p-2" />
                  </div>
                  <div className="p-5 sm:p-6">
                    <h4 className="text-xl font-bold text-slate-950">{model.name}</h4>
                    <p className="mt-2 leading-6 text-slate-600">{model.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div id="heavy-machinery" className="mt-14 scroll-mt-20 sm:mt-20 sm:scroll-mt-28">
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-700">Heavy machinery</p>
              <h3 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">Heavy machinery &amp; engines</h3>
            </div>
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {heavyMachineryModels.map((model) => (
                <Link key={model.id} href={`/products/${model.id}`} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-cyan-300 hover:shadow-md">
                  <div className="relative aspect-[16/10] bg-slate-100">
                    <ResilientImage src={model.image} alt={`${model.name} photo`} sizes="(max-width: 767px) calc(100vw - 2rem), (max-width: 1023px) calc((100vw - 3rem) / 2), 400px" className="object-contain p-2" />
                  </div>
                  <div className="p-5 sm:p-6">
                    <h4 className="text-xl font-bold text-slate-950">{model.name}</h4>
                    <p className="mt-2 leading-6 text-slate-600">{model.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="scroll-mt-20 bg-slate-50 py-16 sm:scroll-mt-24 sm:py-28">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:gap-14 sm:px-6 lg:grid-cols-[.9fr_1.1fr] lg:items-center lg:px-8">
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
              <div key={title} className="flex gap-4 rounded-xl border border-slate-200 bg-white p-4 sm:gap-5 sm:p-6">
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

      <section id="contact" className="scroll-mt-20 bg-slate-950 py-14 text-white sm:scroll-mt-24 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-white">Start a conversation</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Looking for an engine, gearbox, or machinery?</h2>
            <p className="mt-4 leading-7 text-white">Share the equipment type and the specifications you have. Noor Alam Machineries can help you take the next step.</p>
            <div className="mt-5 flex flex-col gap-2 text-sm text-white">
              <a href="mailto:noornoobi80@gmail.com" className="w-fit transition hover:text-white">noornoobi80@gmail.com</a>
              <a href="https://www.nooralammachinery.com" target="_blank" rel="noreferrer" className="w-fit transition hover:text-white">www.nooralammachinery.com</a>
            </div>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
            <a href={toBangladeshTel('01728-079359')} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md border border-white/25 px-4 py-3 font-semibold text-white transition hover:bg-white/10 sm:w-auto sm:px-5 sm:py-3.5">
              <PhoneCall className="h-5 w-5" /> {formatBangladeshPhone('01728-079359')}
            </a>
            <Link href="/products" className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 sm:w-auto sm:px-6 sm:py-3.5">
              Browse engine parts <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
          </div>
          <div className="mt-10 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] lg:grid lg:grid-cols-[0.8fr_1.2fr]">
            <div className="flex flex-col items-start justify-center p-5 sm:p-7">
              <ContactForm />
            </div>
            <div className="relative min-h-[280px] overflow-hidden bg-slate-200 sm:min-h-[360px]">
              <iframe
                title="Map to Noor Alam Machineries main showroom in Dhaka"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(`Noor Alam Machineries, ${BRANCHES[0].address.join(', ')}, Bangladesh`)}&output=embed`}
                className="absolute inset-0 h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
          <div className="mt-14 border-t border-white/10 pt-10">
            <h3 className="text-2xl font-bold tracking-tight">Visit our locations</h3>
            <div className="mt-6 grid gap-5 md:grid-cols-3">
              {BRANCHES.map((branch) => (
                <article key={branch.name} className="rounded-xl bg-white p-5 text-slate-900 shadow-lg sm:p-6">
                  <h4 className="text-lg font-bold">{branch.name}</h4>
                  <address className="mt-3 space-y-1 text-sm not-italic leading-6 text-slate-600">
                    {branch.address.map((line) => <p key={line}>{line}</p>)}
                  </address>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`Noor Alam Machineries, ${branch.address.join(', ')}, Bangladesh`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-cyan-800 underline decoration-cyan-200 underline-offset-4 hover:text-cyan-950"
                  >
                    <MapPin className="h-4 w-4" /> View on map
                  </a>
                  <ul className="mt-4 space-y-2 border-t border-slate-100 pt-4">
                    {branch.phones.map((phone) => (
                      <li key={phone}>
                        <a href={toBangladeshTel(phone)} className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-800 hover:text-cyan-950">
                          <PhoneCall className="h-4 w-4" /> {formatBangladeshPhone(phone)}
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
