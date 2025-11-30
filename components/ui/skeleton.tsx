import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-shimmer rounded-md bg-gradient-to-r from-dark-lighter via-dark-hover to-dark-lighter bg-[length:200%_100%]",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
