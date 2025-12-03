import { Search } from "lucide-react";
import { AccGrid } from "@/components/acc";
import { GAMES } from "@/types/game";
import { prisma } from "@/lib/db/prisma";

export const revalidate = 60;

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q || "";

  // Fetch search results if query exists
  let accs: any[] = [];
  if (query.trim()) {
    const results = await prisma.acc.findMany({
      where: {
        status: "APPROVED",
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
          { game: { name: { contains: query, mode: "insensitive" } } },
        ],
      },
      take: 20,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        slug: true,
        title: true,
        price: true,
        images: true,
        status: true,
        createdAt: true,
        game: {
          select: {
            name: true,
          },
        },
        seller: {
          select: {
            id: true,
            shopName: true,
            shopSlug: true,
            isVipShop: true,
          },
        },
      },
    });

    accs = results.map((acc) => ({
      ...acc,
      gameName: acc.game?.name,
      createdAt: acc.createdAt.toISOString(),
    }));
  }

  return (
    <div className="container py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">
          Kết quả tìm kiếm: &quot;{query}&quot;
        </h1>
        <p className="text-muted-foreground">
          {accs.length > 0
            ? `Tìm thấy ${accs.length} tài khoản phù hợp`
            : "Tìm thấy các tài khoản phù hợp với từ khóa của bạn"}
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
            <span className="text-xl">{game.icon}</span>
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
          <p className="text-muted-foreground">
            {query.trim()
              ? "Không tìm thấy kết quả nào"
              : "Nhập từ khóa để tìm kiếm"}
          </p>
        </div>
      )}
    </div>
  );
}
