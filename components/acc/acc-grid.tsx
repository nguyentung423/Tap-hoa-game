"use client";

import { useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { AccCard } from "./acc-card";
import { AccGridSkeleton } from "./acc-card-skeleton";
import { Acc } from "@/types";

interface AccGridProps {
  accs: Acc[];
  isLoading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

export function AccGrid({
  accs,
  isLoading,
  hasMore,
  onLoadMore,
}: AccGridProps) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && hasMore && !isLoading && onLoadMore) {
        onLoadMore();
      }
    },
    [hasMore, isLoading, onLoadMore]
  );

  useEffect(() => {
    const element = loadMoreRef.current;
    if (!element) return;

    observerRef.current = new IntersectionObserver(handleObserver, {
      threshold: 0.1,
      rootMargin: "100px",
    });

    observerRef.current.observe(element);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleObserver]);

  if (isLoading && accs.length === 0) {
    return <AccGridSkeleton count={8} />;
  }

  return (
    <div className="space-y-4">
      <motion.div
        className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4"
        layout
      >
        <AnimatePresence mode="popLayout">
          {accs.map((acc, index) => (
            <AccCard
              key={acc.id}
              acc={acc}
              index={index}
              priority={index < 4}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Load more trigger */}
      <div ref={loadMoreRef} className="h-10">
        {isLoading && accs.length > 0 && (
          <div className="flex items-center justify-center gap-2 py-4">
            <div className="h-2 w-2 animate-bounce rounded-full bg-neon-green [animation-delay:-0.3s]" />
            <div className="h-2 w-2 animate-bounce rounded-full bg-neon-green [animation-delay:-0.15s]" />
            <div className="h-2 w-2 animate-bounce rounded-full bg-neon-green" />
          </div>
        )}
      </div>

      {!hasMore && accs.length > 0 && (
        <p className="py-8 text-center text-sm text-muted-foreground">
          Đã hiển thị tất cả {accs.length} acc
        </p>
      )}
    </div>
  );
}

export default AccGrid;
