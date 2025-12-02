import * as cheerio from "cheerio";

async function testScrape(url: string) {
  console.log("Fetching:", url);

  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    },
  });

  const html = await response.text();
  const $ = cheerio.load(html);

  console.log("\n=== PAGE STRUCTURE ===");
  console.log("Title:", $("title").text());
  console.log("H1:", $("h1").text());
  console.log("\nAll classes containing 'content':");
  $(
    "[class*='content'], [class*='detail'], [class*='article'], [class*='body']"
  ).each((i, el) => {
    const className = $(el).attr("class");
    const textLength = $(el).text().length;
    if (textLength > 100) {
      console.log(`  .${className} - ${textLength} chars`);
    }
  });

  console.log("\n=== TESTING SELECTORS ===");
  const selectors = [
    ".detail-content-body",
    ".detail-content",
    ".article-content",
    ".content-detail",
    ".knsw-content",
    ".article-body",
    "article",
    ".knswli-paragraph",
  ];

  for (const selector of selectors) {
    const elem = $(selector);
    if (elem.length > 0) {
      const text = elem.text().trim();
      console.log(`${selector}: ${elem.length} elements, ${text.length} chars`);
      if (text.length > 200) {
        console.log(`  Preview: ${text.substring(0, 200)}...`);
      }
    }
  }

  // Try to find main content paragraphs
  console.log("\n=== PARAGRAPH ANALYSIS ===");
  const paragraphs = $("p");
  console.log(`Total <p> tags: ${paragraphs.length}`);

  let totalText = "";
  paragraphs.each((i, el) => {
    const text = $(el).text().trim();
    if (text.length > 50) {
      totalText += text + "\n\n";
    }
  });
  console.log(`Total paragraph text: ${totalText.length} chars`);
  console.log(`Preview:\n${totalText.substring(0, 500)}...`);
}

const url =
  process.argv[2] ||
  "https://gamek.vn/cuoc-dai-chien-trong-dem-chung-ket-dtcv-mua-dong-2025-da-an-dinh-ket-qua-kho-doan-178241202112824157.chn";
testScrape(url).catch(console.error);
