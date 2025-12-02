import Parser from "rss-parser";

const parser = new Parser();

async function testRSS() {
  console.log("🔍 Testing VnExpress Số Hóa RSS...\n");

  try {
    const rss = await parser.parseURL("https://vnexpress.net/rss/so-hoa.rss");

    console.log(`✅ Found ${rss.items.length} items\n`);

    rss.items.slice(0, 5).forEach((item, i) => {
      console.log(`${i + 1}. ${item.title}`);
      const content = item.contentSnippet || item.content || "";
      const titleLower = item.title?.toLowerCase() || "";
      const contentLower = content.toLowerCase();

      // Check game keywords
      const games = {
        "Liên Quân": ["liên quân", "lien quan", "aov", "arena of valor"],
        "Liên Minh": ["liên minh", "lien minh", "lol", "league of legends"],
        "Free Fire": ["free fire", "ff", "garena free fire"],
        PUBG: ["pubg", "playerunknown", "battlegrounds"],
        Roblox: ["roblox"],
      };

      let matchedGame = null;
      for (const [game, keywords] of Object.entries(games)) {
        if (
          keywords.some(
            (k) => titleLower.includes(k) || contentLower.includes(k)
          )
        ) {
          matchedGame = game;
          break;
        }
      }

      console.log(`   Game match: ${matchedGame || "❌ None"}`);
      console.log(`   Link: ${item.link}\n`);
    });
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

testRSS();
