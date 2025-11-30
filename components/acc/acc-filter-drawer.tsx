"use client";

import { useState } from "react";
import { X, SlidersHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { AccFilters } from "@/types/acc";

interface AccFilterDrawerProps {
  filters: AccFilters;
  onFiltersChange: (filters: AccFilters) => void;
}

export function AccFilterDrawer({ filters, onFiltersChange }: AccFilterDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground shadow-lg"
      >
        <SlidersHorizontal className="w-4 h-4" />
        <span>Lọc</span>
      </button>

      {/* Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50"
              onClick={() => setIsOpen(false)}
            />

            {/* Drawer content */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-background rounded-t-3xl max-h-[80vh] overflow-hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h3 className="font-semibold">Bộ lọc</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full hover:bg-muted"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 overflow-y-auto max-h-[calc(80vh-8rem)]">
                {/* Filter content */}
                <p className="text-muted-foreground text-center py-8">
                  Bộ lọc sẽ được thêm vào đây
                </p>
              </div>

              <div className="p-4 border-t border-border">
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-medium"
                >
                  Áp dụng
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
