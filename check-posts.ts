import { prisma } from "./lib/db/prisma";

async function testCrawl() {
  console.log("📊 Checking posts in database...\n");

  const posts = await prisma.post.findMany({
    take: 10,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      game: true,
      sourceName: true,
      status: true,
      createdAt: true,
    },
  });

  if (posts.length === 0) {
    console.log("❌ No posts found. Crawl may not have run yet.\n");
  } else {
    console.log(`✅ Found ${posts.length} posts:\n`);
    posts.forEach((post, i) => {
      console.log(`${i + 1}. ${post.title}`);
      console.log(`   Game: ${post.game || "N/A"}`);
      console.log(`   Source: ${post.sourceName || "N/A"}`);
      console.log(`   Status: ${post.status}`);
      console.log(`   Created: ${post.createdAt.toLocaleString("vi-VN")}\n`);
    });
  }

  const stats = await prisma.post.groupBy({
    by: ["status"],
    _count: true,
  });

  console.log("📈 Stats by status:");
  stats.forEach((stat) => {
    console.log(`   ${stat.status}: ${stat._count} posts`);
  });

  await prisma.$disconnect();
}

testCrawl().catch(console.error);
