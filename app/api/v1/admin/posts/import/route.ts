import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import * as cheerio from "cheerio";

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function detectGame(title: string, content: string): string | null {
  const text = (title + " " + content).toLowerCase();

  const GAME_KEYWORDS: Record<string, string[]> = {
    "Liên Quân": ["liên quân", "lien quan", "aov", "arena of valor"],
    "Liên Minh": ["liên minh", "lien minh", "lol", "league of legends"],
    "Free Fire": ["free fire", "ff", "garena free fire"],
    PUBG: ["pubg", "playerunknown", "battlegrounds"],
    Roblox: ["roblox"],
  };

  for (const [game, keywords] of Object.entries(GAME_KEYWORDS)) {
    if (keywords.some((keyword) => text.includes(keyword))) {
      return game;
    }
  }

  return null;
}

async function scrapeArticle(url: string) {
  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const html = await response.text();
  const $ = cheerio.load(html);

  // Debug: Log available selectors
  console.log("=== DEBUG SCRAPING ===");
  console.log("URL:", url);
  console.log("h1 count:", $("h1").length);
  console.log("article count:", $("article").length);
  console.log(
    "Main content classes found:",
    $("[class*='content']")
      .map((i, el) => $(el).attr("class"))
      .get()
      .slice(0, 10)
  );

  // Extract title
  let title =
    $("h1.detail-title").first().text().trim() ||
    $("h1").first().text().trim() ||
    $('meta[property="og:title"]').attr("content") ||
    "";

  console.log("Title found:", title);

  // Extract full article content - try multiple selectors
  let content = "";
  const contentSelectors = [
    ".rightdetail_content", // GameK .chn pages
    ".detail-content-body",
    ".detail-content",
    ".article-content",
    ".content-detail",
    ".fck_detail",
    ".knswli-paragraph",
    "article .content",
    "article",
    ".knsw-content",
    ".article-body",
  ];

  for (const selector of contentSelectors) {
    const elem = $(selector);
    if (elem.length > 0) {
      console.log(
        `Found content with selector: ${selector}, length: ${
          elem.text().length
        }`
      );
      // Remove ads, related articles, social buttons
      elem
        .find(
          "script, style, iframe, .ads, .related, .social-share, .box-category"
        )
        .remove();
      content = elem.html() || "";
      if (content.length > 500) {
        console.log(`Using content from: ${selector}`);
        break; // Found substantial content
      }
    }
  }

  console.log("Final content length:", content.length);

  // Fallback to meta description if content too short
  if (content.length < 500) {
    const metaDesc = $('meta[property="og:description"]').attr("content") || "";
    content = `<p>${metaDesc}</p>`;
  }

  let thumbnail =
    $('meta[property="og:image"]').attr("content") ||
    $("article img").first().attr("src") ||
    $(".detail-content img").first().attr("src") ||
    $(".thumb-art img").first().attr("src") ||
    "";

  // Extract text for excerpt
  const $content = cheerio.load(content);
  $content("img, script, style").remove();
  const textContent = $content.text().trim().replace(/\s+/g, " ");
  const excerpt =
    textContent.substring(0, 200) + (textContent.length > 200 ? "..." : "");

  // Get source name from URL
  const urlObj = new URL(url);
  const sourceName = urlObj.hostname.replace("www.", "").split(".")[0];

  return {
    title,
    content,
    excerpt,
    thumbnail: thumbnail.startsWith("http") ? thumbnail : null,
    sourceName: sourceName.charAt(0).toUpperCase() + sourceName.slice(1),
  };
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { url } = await request.json();

    if (!url || !url.startsWith("http")) {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    // Scrape article
    const article = await scrapeArticle(url);

    if (!article.title) {
      return NextResponse.json(
        { error: "Could not extract article title" },
        { status: 400 }
      );
    }

    const slug = generateSlug(article.title);

    // Check if already exists
    const existing = await prisma.post.findUnique({
      where: { slug },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Article already exists" },
        { status: 409 }
      );
    }

    // Detect game
    const game = detectGame(article.title, article.content);

    // Create post
    const post = await prisma.post.create({
      data: {
        title: article.title,
        slug,
        content: article.content,
        excerpt: article.excerpt,
        thumbnail: article.thumbnail,
        game,
        sourceUrl: url,
        sourceName: article.sourceName,
        status: "DRAFT",
        publishedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      post: {
        id: post.id,
        title: post.title,
        slug: post.slug,
        game: post.game,
      },
      message: "Article imported successfully",
    });
  } catch (error) {
    console.error("POST /api/v1/admin/posts/import error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to import article",
      },
      { status: 500 }
    );
  }
}
