-- =====================================================
-- ACCVIP DATABASE SCHEMA - COMPLETE VERSION
-- Tạo đầy đủ 7 tables theo Prisma Schema
-- =====================================================

-- Create ENUM types
CREATE TYPE "UserRole" AS ENUM ('SELLER', 'ADMIN');
CREATE TYPE "UserStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'BANNED');
CREATE TYPE "AccStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'SOLD');

-- =====================================================
-- TABLE 1: users (Seller/Admin accounts)
-- =====================================================
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    
    -- Google OAuth
    "email" TEXT NOT NULL UNIQUE,
    "name" TEXT NOT NULL,
    "avatar" TEXT,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    
    -- Shop info
    "shopName" TEXT,
    "shopSlug" TEXT UNIQUE,
    "shopDesc" TEXT,
    "shopAvatar" TEXT,
    "shopCover" TEXT,
    "featuredGames" TEXT[] DEFAULT '{}',
    
    -- Shop VIP features
    "isVipShop" BOOLEAN NOT NULL DEFAULT false,
    "vipShopEndTime" TIMESTAMP(3),
    "commissionRate" DOUBLE PRECISION NOT NULL DEFAULT 5.0,
    
    -- Strategic Partner features
    "isStrategicPartner" BOOLEAN NOT NULL DEFAULT false,
    "partnerTier" TEXT,
    "partnerSince" TIMESTAMP(3),
    
    -- Role & Status
    "role" "UserRole" NOT NULL DEFAULT 'SELLER',
    "status" "UserStatus" NOT NULL DEFAULT 'PENDING',
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    
    -- Stats
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 5.0,
    "totalReviews" INTEGER NOT NULL DEFAULT 0,
    "totalSales" INTEGER NOT NULL DEFAULT 0,
    "totalViews" INTEGER NOT NULL DEFAULT 0,
    
    -- Timestamps
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approvedAt" TIMESTAMP(3),
    "lastActiveAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLE 2: games (Game categories)
-- =====================================================
CREATE TABLE "games" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL UNIQUE,
    "icon" TEXT NOT NULL,
    "image" TEXT,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    
    -- Dynamic fields for game attributes
    "fields" JSONB NOT NULL DEFAULT '[]',
    
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLE 3: accs (Game accounts for sale)
-- =====================================================
CREATE TABLE "accs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    
    -- Basic info
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL UNIQUE,
    "description" TEXT,
    
    -- Pricing
    "price" INTEGER NOT NULL,
    "originalPrice" INTEGER,
    
    -- Game relation
    "gameId" TEXT NOT NULL,
    
    -- Images
    "images" TEXT[] NOT NULL DEFAULT '{}',
    "thumbnail" TEXT NOT NULL,
    
    -- Dynamic attributes (JSON)
    "attributes" JSONB NOT NULL DEFAULT '[]',
    
    -- Status
    "status" "AccStatus" NOT NULL DEFAULT 'PENDING',
    
    -- Promotion flags
    "isVip" BOOLEAN NOT NULL DEFAULT false,
    "isHot" BOOLEAN NOT NULL DEFAULT false,
    "vipEndTime" TIMESTAMP(3),
    
    -- Stats
    "views" INTEGER NOT NULL DEFAULT 0,
    
    -- Seller
    "sellerId" TEXT NOT NULL,
    
    -- Timestamps
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approvedAt" TIMESTAMP(3),
    "soldAt" TIMESTAMP(3),
    
    -- Admin note
    "adminNote" TEXT,
    
    CONSTRAINT "accs_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "games"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "accs_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- =====================================================
-- TABLE 4: reviews (Seller reviews)
-- =====================================================
CREATE TABLE "reviews" (
    "id" TEXT NOT NULL PRIMARY KEY,
    
    -- Target seller
    "sellerId" TEXT NOT NULL,
    
    -- Buyer info (no account needed)
    "buyerName" TEXT NOT NULL,
    "buyerPhone" TEXT,
    
    -- Content
    "rating" INTEGER NOT NULL,
    "content" TEXT,
    
    -- Verification
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    
    -- Timestamp
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT "reviews_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "reviews_rating_check" CHECK ("rating" >= 1 AND "rating" <= 5)
);

-- =====================================================
-- TABLE 5: site_settings (Website configuration)
-- =====================================================
CREATE TABLE "site_settings" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'main',
    
    -- Admin contact
    "adminZaloId" TEXT NOT NULL DEFAULT '',
    "adminZaloName" TEXT NOT NULL DEFAULT '',
    "adminPhone" TEXT NOT NULL DEFAULT '',
    
    -- Site info
    "siteName" TEXT NOT NULL DEFAULT 'AccVip',
    "siteDesc" TEXT NOT NULL DEFAULT 'Mua bán acc game uy tín',
    
    -- Fee settings
    "feePercent" DOUBLE PRECISION NOT NULL DEFAULT 5.0,
    "feeMin" INTEGER NOT NULL DEFAULT 10000,
    
    -- Social links
    "facebookUrl" TEXT,
    "youtubeUrl" TEXT,
    "tiktokUrl" TEXT,
    
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLE 6: otp_verifications (Email OTP)
-- =====================================================
CREATE TABLE "otp_verifications" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- INDEXES - Optimize query performance
-- =====================================================

-- Users indexes
CREATE INDEX "users_email_idx" ON "users"("email");
CREATE INDEX "users_shopSlug_idx" ON "users"("shopSlug");
CREATE INDEX "users_status_role_idx" ON "users"("status", "role");
CREATE INDEX "users_isVerified_idx" ON "users"("isVerified");
CREATE INDEX "users_isVipShop_rating_idx" ON "users"("isVipShop", "rating");

-- Accs indexes (most important for performance)
CREATE INDEX "accs_gameId_idx" ON "accs"("gameId");
CREATE INDEX "accs_sellerId_idx" ON "accs"("sellerId");
CREATE INDEX "accs_status_idx" ON "accs"("status");
CREATE INDEX "accs_price_idx" ON "accs"("price");
CREATE INDEX "accs_createdAt_idx" ON "accs"("createdAt" DESC);
CREATE INDEX "accs_isVip_createdAt_idx" ON "accs"("isVip", "createdAt");
CREATE INDEX "accs_status_gameId_idx" ON "accs"("status", "gameId");
CREATE INDEX "accs_status_sellerId_idx" ON "accs"("status", "sellerId");

-- Reviews indexes
CREATE INDEX "reviews_sellerId_idx" ON "reviews"("sellerId");

-- OTP indexes
CREATE INDEX "otp_verifications_email_code_idx" ON "otp_verifications"("email", "code");

-- =====================================================
-- INSERT DEFAULT DATA
-- =====================================================

-- Insert default site settings
INSERT INTO "site_settings" ("id", "siteName", "siteDesc", "adminZaloId", "adminZaloName", "adminPhone", "feePercent", "feeMin", "updatedAt")
VALUES ('main', 'AccVip', 'Mua bán acc game uy tín #1 Việt Nam', '', 'Admin', '', 5.0, 10000, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO NOTHING;

-- Insert popular games
INSERT INTO "games" ("id", "name", "slug", "icon", "image", "description", "isActive", "order", "fields", "createdAt", "updatedAt")
VALUES 
-- Game 1: Liên Quân Mobile
('lqm001', 'Liên Quân Mobile', 'lien-quan-mobile', 
'⚔️',
'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200',
'MOBA 5v5 hàng đầu Việt Nam', true, 1,
'[
  {"name": "rank", "label": "Rank", "type": "select", "options": ["Đồng", "Bạc", "Vàng", "Bạch Kim", "Kim Cương", "Cao Thủ", "Thách Đấu"]},
  {"name": "tuong", "label": "Số Tướng", "type": "number"},
  {"name": "skin", "label": "Số Skin", "type": "number"},
  {"name": "ngoc", "label": "Ngọc Cấp", "type": "select", "options": ["Cấp 3", "Cấp 4", "Cấp 5"]}
]'::jsonb,
CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Game 2: Free Fire
('ff001', 'Free Fire', 'free-fire',
'🔥',
'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200',
'Game Battle Royale hot nhất', true, 2,
'[
  {"name": "rank", "label": "Rank", "type": "select", "options": ["Đồng", "Bạc", "Vàng", "Bạch Kim", "Kim Cương", "Cao Thủ", "Đại Cao Thủ"]},
  {"name": "pet", "label": "Số Pet", "type": "number"},
  {"name": "skin_sung", "label": "Skin Súng", "type": "number"},
  {"name": "skin_quan_ao", "label": "Skin Quần Áo", "type": "number"}
]'::jsonb,
CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Game 3: PUBG Mobile
('pubg001', 'PUBG Mobile', 'pubg-mobile',
'🎯',
'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200',
'Battle Royale kinh điển', true, 3,
'[
  {"name": "rank", "label": "Rank", "type": "select", "options": ["Đồng", "Bạc", "Vàng", "Bạch Kim", "Kim Cương", "Cao Thủ", "Chinh Phục"]},
  {"name": "outfit", "label": "Số Outfit", "type": "number"},
  {"name": "skin_sung", "label": "Skin Súng", "type": "number"}
]'::jsonb,
CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Game 4: Liên Minh: Tốc Chiến
('lmtc001', 'Liên Minh Tốc Chiến', 'lien-minh-toc-chien',
'🛡️',
'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200',
'MOBA từ Riot Games', true, 4,
'[
  {"name": "rank", "label": "Rank", "type": "select", "options": ["Sắt", "Đồng", "Bạc", "Vàng", "Bạch Kim", "Kim Cương", "Cao Thủ", "Đại Cao Thủ"]},
  {"name": "tuong", "label": "Số Tướng", "type": "number"},
  {"name": "skin", "label": "Số Skin", "type": "number"}
]'::jsonb,
CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Game 5: Tốc Chiến 
('tc001', 'Tốc Chiến', 'toc-chien',
'🎲',
NULL,
'Game MOBA tốc độ cao', false, 5,
'[]'::jsonb,

