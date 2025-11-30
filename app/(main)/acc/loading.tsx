export default function Loading() {
  return (
    <div className="container py-8">
      <div className="animate-pulse space-y-4">
        <div className="h-10 bg-muted rounded w-full max-w-md" />
        <div className="flex gap-2 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-10 w-24 bg-muted rounded-full shrink-0" />
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] bg-muted rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
