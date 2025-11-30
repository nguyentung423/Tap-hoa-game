import { PrismaClient } from "@prisma/client";
import { GAMES } from "../config/games";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Seed games
  for (const game of GAMES) {
    await prisma.game.upsert({
      where: { slug: game.slug },
      update: {
        name: game.name,
        icon: game.icon,
        description: game.description,
        isActive: game.isActive,
        fields: game.fields,
      },
      create: {
        name: game.name,
        slug: game.slug,
        icon: game.icon,
        description: game.description,
        isActive: game.isActive,
        fields: game.fields,
      },
    });
    console.log(`✓ Game: ${game.name}`);
  }

  console.log("\n✅ Seed completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
