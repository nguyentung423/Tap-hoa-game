"use client";

import { Shop } from "@/types";
import { ShopCard } from "./shop-card";

interface ShopGridProps {
  shops: Shop[];
  emptyMessage?: string;
}

export function ShopGrid({
  shops,
  emptyMessage = "Không có shop nào",
}: ShopGridProps) {
  if (shops.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {shops.map((shop) => (
        <ShopCard key={shop.id} shop={shop} />
      ))}
    </div>
  );
}
