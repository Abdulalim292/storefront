export default function Loading() {
  return (
    <div className="mx-auto max-w-[1440px] px-5 py-24 sm:px-8 lg:px-12">
      <div className="flex flex-col items-center justify-center gap-4 text-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#dfddd5] border-t-[#a78b5f]" />
        <p className="text-base font-medium text-[#59615c]">Loading products…</p>
      </div>
    </div>
  );
}
