export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-12 lg:px-8">
      <div className="flex flex-col items-center justify-center gap-4 text-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-cyan-500"></div>
        <p className="text-lg font-medium text-slate-600">Loading products...</p>
      </div>
    </div>
  );
}
