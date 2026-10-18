import { PRODUCTS } from '@/data/products';
import { heavyMachineryModels, marineEngineModels, marineGearboxModels } from '@/data/equipment';

const productCredits = PRODUCTS.map((product) => ({
  name: product.name,
  credit: product.imageCredit,
  source: product.imageSourceUrl,
  license: product.imageLicense,
  licenseUrl: product.imageLicenseUrl,
}));

const equipmentCredits = [
  ...marineEngineModels,
  ...marineGearboxModels,
  ...heavyMachineryModels,
].filter((item) => item.imageCredit).map((item) => ({
  name: item.name,
  credit: item.imageCredit!,
  source: item.imageSource,
  license: 'Source attribution',
  licenseUrl: undefined,
}));

const credits = [...productCredits, ...equipmentCredits].filter((item, index, all) =>
  all.findIndex((candidate) =>
    candidate.source && item.source
      ? candidate.source === item.source
      : candidate.credit === item.credit && candidate.license === item.license
  ) === index
);

export default function ImageCreditsPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Image credits</h1>
      <p className="mt-3 max-w-2xl text-slate-600">
        Image sources and license information for product and equipment photos.
      </p>

      <ul className="mt-8 divide-y divide-slate-200 border-y border-slate-200">
        {credits.map((item) => (
          <li key={`${item.source ?? item.credit}-${item.name}`} className="py-4">
            <p className="font-medium text-slate-900">{item.name}</p>
            <p className="mt-1 text-sm text-slate-600">
              Photo: {item.credit}
              {item.license !== 'Source attribution' && <> · {item.license}</>}
            </p>
            <div className="mt-1 flex gap-4 text-sm">
              {item.source && <a className="text-indigo-700 underline underline-offset-2" href={item.source} target="_blank" rel="noreferrer">Image source</a>}
              {item.licenseUrl && <a className="text-indigo-700 underline underline-offset-2" href={item.licenseUrl} target="_blank" rel="noreferrer">License</a>}
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
