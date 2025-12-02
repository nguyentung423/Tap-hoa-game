import Parser from "rss-parser";

const parser = new Parser({
  timeout: 10000,
});

const RSS_FEEDS = [
  { url: "https://gamek.vn/tin-game.rss", name: "GameK Tin Game" },
  { url: "https://gamek.vn/esports.rss", name: "GameK eSports" },
  { url: "https://genk.vn/games.rss", name: "GenK Games" },
  { url: "https://kenh14.vn/game.rss", name: "Kenh14 Game" },
  { url: "https://www.24h.com.vn/game-24h-rss.rss", name: "24h Game" },
  { url: "https://gamek.vn/feed", name: "GameK Main" },
];

async function testAllRSS() {
  console.log("🔍 Testing RSS feeds...\n");

  for (const feed of RSS_FEEDS) {
    try {
      console.log(`${feed.name}:`);
      const rss = await parser.parseURL(feed.url);
      console.log(
        `   ✅ ${rss.items.length} items - ${rss.items[0]?.title?.substring(
          0,
          50
        )}...\n`
      );
    } catch (error) {
      console.log(`   ❌ ${error.message}\n`);
    }
  }
}

testAllRSS();
