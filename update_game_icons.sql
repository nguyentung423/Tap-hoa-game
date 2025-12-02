-- Update game icons to emoji
UPDATE "games" SET "icon" = '⚔️' WHERE "slug" = 'lien-quan-mobile';
UPDATE "games" SET "icon" = '🔥' WHERE "slug" = 'free-fire';
UPDATE "games" SET "icon" = '🎯' WHERE "slug" = 'pubg-mobile';
UPDATE "games" SET "icon" = '🛡️' WHERE "slug" = 'lien-minh-toc-chien';
UPDATE "games" SET "icon" = '🎲' WHERE "slug" = 'toc-chien';

-- Verify the update
SELECT slug, icon FROM "games" ORDER BY "order";
