import { prisma } from "@/lib/db/prisma";
import NewsClient from "./news-client";

/**
 * News Page - Server Component
 * Fetches posts on server for instant FCP
 */
export const revalidate = 60;

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<{ game?: string; page?: string }>;
}) {
  const params = await searchParams;
  const gameFilter = params.game || "all";
  const page = parseInt(params.page || "1");
  const limit = 12;

  const where: any = {
    status: "PUBLISHED",
  };

  if (gameFilter && gameFilter !== "all") {
    where.game = gameFilter;
  }

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        thumbnail: true,
        game: true,
        views: true,
        publishedAt: true,
      },
    }),
    prisma.post.count({ where }),
  ]);

  // Serialize dates
  const serializedPosts = posts.map((post) => ({
    ...post,
    publishedAt: post.publishedAt?.toISOString() || null,
  }));

  return (
    <NewsClient
      initialPosts={serializedPosts}
      initialGame={gameFilter}
      initialPage={page}
      totalPages={Math.ceil(total / limit)}
    />
  );
}
