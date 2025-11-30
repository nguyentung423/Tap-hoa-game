const fs = require("fs");
const path = require("path");

// Minimal 1x1 green PNG as base64
const greenPixelPng = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M/wnwEAAh8BIoA5UgAAAABJRU5ErkJggg==",
  "base64"
);

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const iconsDir = path.join(__dirname, "../public/icons");

// Ensure directory exists
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

sizes.forEach((size) => {
  const filename = `icon-${size}x${size}.png`;
  const filepath = path.join(iconsDir, filename);

  // Write placeholder PNG (same 1x1 pixel for now, browser will scale)
  fs.writeFileSync(filepath, greenPixelPng);
  console.log(`Created ${filename}`);
});

console.log("All icons created!");
