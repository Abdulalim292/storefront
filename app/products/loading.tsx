export default function Loading() {
  return (
    <div className="sheet-light">
      <div className="container flex min-h-[60vh] flex-col items-center justify-center gap-4 py-24 text-center">
        <div className="h-12 w-12 animate-spin border border-rule-2 border-t-accent" aria-hidden="true" />
        <p className="font-outlier text-xs text-muted">Loading products</p>
      </div>
    </div>
  );
}
