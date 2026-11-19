export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-10" aria-busy="true" aria-label="Loading">
      <div className="h-10 w-64 animate-pulse rounded-xl bg-card" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="h-40 animate-pulse rounded-2xl border border-line bg-card" />
        ))}
      </div>
    </div>
  );
}
