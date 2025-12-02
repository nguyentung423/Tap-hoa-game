-- ============================================
-- POSTS TABLE MIGRATION
-- Copy toàn bộ code này vào Supabase SQL Editor
-- ============================================

-- Bước 1: Tạo enum PostStatus (nếu chưa có)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'PostStatus') THEN
        CREATE TYPE "PostStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'REJECTED');
    END IF;
END $$;

-- Bước 2: Tạo bảng posts (nếu chưa có)
CREATE TABLE IF NOT EXISTS "posts" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "excerpt" TEXT,
    "thumbnail" TEXT,
    "game" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "sourceUrl" TEXT,
    "sourceName" TEXT,
    "status" "PostStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "views" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- Bước 3: Tạo indexes (nếu chưa có)
CREATE UNIQUE INDEX IF NOT EXISTS "posts_slug_key" ON "posts"("slug");
CREATE INDEX IF NOT EXISTS "posts_game_idx" ON "posts"("game");
CREATE INDEX IF NOT EXISTS "posts_status_idx" ON "posts"("status");
CREATE INDEX IF NOT EXISTS "posts_publishedAt_idx" ON "posts"("publishedAt");

-- Hoàn tất!
SELECT 'Posts table created successfully!' as result;
