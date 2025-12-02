import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import Parser from "rss-parser";

// RSS feeds for Vietnamese game news sites
const RSS_FEEDS = [
  {
    url: "https://gamek.vn/tin-game.rss",
    name: "GameK Tin Game",
  },
  {
    url: "https://gamek.vn/esports.rss",
    name: "GameK eSports",
  },
  {
    url: "https://genk.vn/games.rss",
    name: "GenK Games",
  },
  {
    url: "https://kenh14.vn/game.rss",
    name: "Kenh14 Game",
  },
  {
    url: "https://www.24h.com.vn/game-24h-rss.rss",
    name: "24h Game",
  },
];

// Game keywords mapping
const GAME_KEYWORDS: Record<string, string[]> = {
  "Liên Quân": ["liên quân", "lien quan", "aov", "arena of valor"],
  "Liên Minh": ["liên minh", "lien minh", "lol", "league of legends"],
  "Free Fire": ["free fire", "ff", "garena free fire"],
  PUBG: ["pubg", "playerunknown", "battlegrounds"],
  Roblox: ["roblox"],
};

function detectGame(title: string, content: string): string | null {
  const text = (title + " " + content).toLowerCase();

  for (const [game, keywords] of Object.entries(GAME_KEYWORDS)) {
    if (keywords.some((keyword) => text.includes(keyword))) {
      return game;
    }
  }

  return null;
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function extractExcerpt(content: string, maxLength: number = 200): string {
  // Remove HTML tags
  const text = content.replace(/<[^>]*>/g, "");

  if (text.length <= maxLength) return text;

  return text.substring(0, maxLength).trim() + "...";
}

export async function GET(request: Request) {
  try {
    // Verify cron secret (for security)
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET || "your-secret-key";

    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const parser = new Parser();
    let totalFetched = 0;
    let totalSaved = 0;
    const errors: string[] = [];

    for (const feed of RSS_FEEDS) {
      try {
        console.log(`📰 Fetching from ${feed.name}...`);
        const rss = await parser.parseURL(feed.url);

        for (const item of rss.items.slice(0, 5)) {
          // Get 5 latest from each source
          if (!item.title || !item.link) continue;

          totalFetched++;

          const slug = generateSlug(item.title);

          // Check if already exists
          const existing = await prisma.post.findUnique({
            where: { slug },
          });

          if (existing) {
            console.log(`⏭️  Skip existing: ${item.title}`);
            continue;
          }

          const content = item.contentSnippet || item.content || "";
          const game = detectGame(item.title, content);

          // Only save if related to one of our games
          if (!game) {
            console.log(`⚠️  No game match: ${item.title}`);
            continue;
          }

          console.log(`✅ Saving: ${item.title} (Game: ${game})`);

          await prisma.post.create({
            data: {
              title: item.title,
              slug,
              content: item.content || item.contentSnippet || "",
              excerpt: extractExcerpt(content),
              thumbnail: item.enclosure?.url || null,
              game,
              sourceUrl: item.link,
              sourceName: feed.name,
              status: "DRAFT",
              publishedAt: item.pubDate ? new Date(item.pubDate) : null,
            },
          });

          totalSaved++;
        }
      } catch (error) {
        console.error(`❌ Error fetching ${feed.name}:`, error);
        errors.push(
          `${feed.name}: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }

    return NextResponse.json({
      success: true,
      fetched: totalFetched,
      saved: totalSaved,
      errors: errors.length > 0 ? errors : undefined,
      message: `Fetched ${totalFetched} articles, saved ${totalSaved} new posts`,
    });
  } catch (error) {
    console.error("Cron job error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
