import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface AccSkeletonProps {
  count?: number;
}

export function AccCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-dark-card">
      {/* Image skeleton */}
      <Skeleton className="aspect-[4/3] w-full" />

      {/* Content skeleton */}
      <div className="p-3">
        {/* Title */}
        <Skeleton className="mb-2 h-4 w-3/4" />
        <Skeleton className="mb-3 h-4 w-1/2" />

        {/* Attributes */}
        <div className="mb-3 flex gap-1">
          <Skeleton className="h-5 w-16 rounded-md" />
          <Skeleton className="h-5 w-20 rounded-md" />
          <Skeleton className="h-5 w-14 rounded-md" />
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-4 w-12" />
        </div>
      </div>
    </div>
  );
}

export function AccGridSkeleton({ count = 8 }: AccSkeletonProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <AccCardSkeleton key={i} />
      ))}
    </div>
  );
}

export default AccCardSkeleton;
