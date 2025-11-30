export default function Loading() {
  return (
    <div className="container py-8 max-w-2xl mx-auto">
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-muted rounded w-1/2" />
        <div className="h-2 bg-muted rounded w-full" />
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 bg-muted rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}
