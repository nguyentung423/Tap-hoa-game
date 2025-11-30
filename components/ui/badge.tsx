import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-neon-green/20 text-neon-green",
        secondary: "border-transparent bg-neon-purple/20 text-neon-purple",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground",
        outline: "border-white/20 text-foreground",
        vip: "border-transparent bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 text-black font-bold animate-pulse",
        hot: "border-transparent bg-gradient-to-r from-red-500 to-pink-500 text-white",
        sale: "border-transparent bg-neon-green text-black font-bold",
        new: "border-transparent bg-neon-cyan/20 text-neon-cyan",
        game: "border-white/10 bg-white/5 text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
