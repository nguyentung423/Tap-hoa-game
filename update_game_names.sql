-- Cập nhật tên game trong database
-- Liên Minh Tốc Chiến -> Liên Minh Huyền Thoại
UPDATE "games" 
SET "name" = 'Liên Minh Huyền Thoại', 
    "isActive" = true 
WHERE "slug" = 'lien-minh-toc-chien';

-- Tốc Chiến -> Đấu Trường Chân Lý  
UPDATE "games" 
SET "name" = 'Đấu Trường Chân Lý',
    "isActive" = true
WHERE "slug" = 'toc-chien';
