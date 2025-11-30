"use client";

import { Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { AccGrid } from "@/components/acc";
import { GAMES } from "@/types/game";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  // TODO: Fetch search results
  const accs: any[] = [];

  return (
    <div className="container py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">
          Kết quả tìm kiếm: &quot;{query}&quot;
        </h1>
        <p className="text-muted-foreground">
          Tìm thấy các tài khoản phù hợp với từ khóa của bạn
        </p>
      </div>

      {/* Quick filters */}
      <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar mb-6">
        {GAMES.slice(0, 6).map((game) => (
          <a
            key={game.id}
            href={`/acc?game=${game.id}&search=${query}`}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border hover:border-primary whitespace-nowrap"
          >
            <span>{game.icon}</span>
            <span className="text-sm">{game.name}</span>
          </a>
        ))}
      </div>

      {/* Results */}
      {accs.length > 0 ? (
        <AccGrid accs={accs} />
      ) : (
        <div className="text-center py-12">
          <Search className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Không tìm thấy kết quả nào</p>
        </div>
      )}
    </div>
  );
}
