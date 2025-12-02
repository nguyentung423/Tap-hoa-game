import { prisma } from "./lib/db/prisma";

async function checkSlug() {
  const url = process.argv[2];

  if (!url) {
    console.log("Usage: tsx check-slug.ts <url>");
    process.exit(1);
  }

  // Generate slug same way as import
  const title = url.split("/").pop()?.replace(".chn", "") || "";
  const slug = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();

  console.log("Checking slug:", slug);

  const existing = await prisma.post.findUnique({
    where: { slug },
  });

  if (existing) {
    console.log("Found existing post:", existing);
  } else {
    console.log("No post found with this slug");
  }

  await prisma.$disconnect();
}

checkSlug();
