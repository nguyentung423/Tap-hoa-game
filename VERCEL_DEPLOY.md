# 🚀 HƯỚNG DẪN DEPLOY LÊN VERCEL

## Checklist Trước Khi Deploy

- [x] Code đã push lên GitHub
- [ ] Database Supabase đã setup
- [ ] Google OAuth credentials đã tạo
- [ ] Environment variables đã chuẩn bị
- [ ] Domain đã sẵn sàng

---

## BƯỚC 1: Setup Database (Supabase)

### 1.1. Tạo Project Supabase

1. Truy cập: https://supabase.com
2. Click **New Project**
3. Chọn region: **Southeast Asia (Singapore)** (gần VN nhất)
4. Đặt password mạnh và lưu lại

### 1.2. Lấy Connection String

1. Vào **Settings** → **Database**
2. Scroll xuống **Connection String** → chọn **URI**
3. Copy và thay `[YOUR-PASSWORD]` bằng password thật
4. Ví dụ:
   ```
   postgresql://postgres.xxxxx:yourpassword@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true
   ```

### 1.3. Chạy Migration

1. Cập nhật file `.env` local với `DATABASE_URL` từ Supabase
2. Chạy lệnh:
   ```bash
   npm run db:push
   ```
3. Hoặc vào **SQL Editor** trên Supabase và chạy file `create_database.sql`

---

## BƯỚC 2: Tạo Secret Keys

Chạy trong terminal:

```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32

# Generate ADMIN_JWT_SECRET
openssl rand -base64 32
```

**Lưu lại 2 keys này!**

---

## BƯỚC 3: Setup Google OAuth

### 3.1. Tạo OAuth Client

1. Truy cập: https://console.cloud.google.com
2. Tạo project mới hoặc chọn project có sẵn
3. Vào **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth 2.0 Client ID**
5. Chọn **Web application**

### 3.2. Cấu hình URLs

**Authorized JavaScript origins:**

```
http://localhost:3000
https://taphoagame.online
https://tap-hoa-game.vercel.app
```

**Authorized redirect URIs:**

```
http://localhost:3000/api/auth/callback/google
https://taphoagame.online/api/auth/callback/google
https://tap-hoa-game.vercel.app/api/auth/callback/google
```

### 3.3. Lưu Credentials

- Copy **Client ID**
- Copy **Client Secret**

---

## BƯỚC 4: Deploy lên Vercel

### 4.1. Import Project

1. Truy cập: https://vercel.com
2. Click **Add New...** → **Project**
3. Chọn **Import Git Repository**
4. Tìm repository: **nguyentung423/Tap-hoa-game**
5. Click **Import**

### 4.2. Configure Project

- **Framework Preset**: Next.js (auto-detect)
- **Root Directory**: `./`
- **Build Command**: `prisma generate && next build`
- **Install Command**: `npm install`

### 4.3. Thêm Environment Variables

Click **Environment Variables** và thêm:

```bash
# === DATABASE ===
DATABASE_URL=postgresql://postgres.xxxxx:yourpassword@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true

# === NEXTAUTH ===
NEXTAUTH_URL=https://taphoagame.online
NEXTAUTH_SECRET=<key-từ-bước-2>

# === GOOGLE OAUTH ===
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxxxx

# === ADMIN ===
ADMIN_JWT_SECRET=<key-từ-bước-2>
ADMIN_EMAIL=tungnh.vspace@gmail.com
ADMIN_PASSWORD=<password-mạnh>

# === PUBLIC ===
NEXT_PUBLIC_ADMIN_ZALO=0374918396
NEXT_PUBLIC_APP_URL=https://taphoagame.online

# === CLOUDINARY (Optional) ===
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

**Lưu ý**:

- Chọn **All Environments** để áp dụng cho cả Production, Preview, Development
- Hoặc tách riêng cho Production nếu cần

### 4.4. Deploy

Click **Deploy** và đợi 2-3 phút

---

## BƯỚC 5: Configure Domain

### 5.1. Thêm Domain Custom

1. Sau khi deploy xong, vào project
2. Click **Settings** → **Domains**
3. Click **Add Domain**
4. Nhập: `taphoagame.online`
5. Click **Add**

### 5.2. Cấu hình DNS

Vercel sẽ hướng dẫn thêm DNS records:

**Option 1: Nameservers (Khuyến nghị)**

```
ns1.vercel-dns.com
ns2.vercel-dns.com
```

**Option 2: A Record**

```
Type: A
Name: @
Value: 76.76.21.21
```

**Option 3: CNAME**

```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### 5.3. Đợi DNS Propagation

- Thời gian: 5 phút - 48 giờ (thường 10-30 phút)
- Check tại: https://dnschecker.org

---

## BƯỚC 6: Cập nhật Google OAuth

Sau khi domain active, quay lại Google Console:

1. Vào **Credentials** → chọn OAuth Client đã tạo
2. Thêm redirect URI mới:
   ```
   https://taphoagame.online/api/auth/callback/google
   ```
3. Click **Save**

---

## BƯỚC 7: Test & Verify

### 7.1. Test Website

- Truy cập: https://taphoagame.online
- Kiểm tra trang chủ load
- Test navigation

### 7.2. Test Authentication

- Click **Đăng nhập**
- Đăng nhập bằng Google
- Kiểm tra session

### 7.3. Test Admin Panel

- Truy cập: https://taphoagame.online/admin/login
- Đăng nhập bằng admin email/password
- Kiểm tra dashboard

### 7.4. Test Database Connection

- Tạo shop mới
- Post acc mới
- Import news article
- Kiểm tra data lưu vào Supabase

---

## BƯỚC 8: SEO Setup

### 8.1. Google Search Console

1. Truy cập: https://search.google.com/search-console
2. Click **Add Property** → nhập `taphoagame.online`
3. Verify ownership (DNS hoặc HTML file)
4. Submit sitemap: `https://taphoagame.online/sitemap.xml`

### 8.2. Google Analytics (Optional)

1. Tạo property tại: https://analytics.google.com
2. Lấy Measurement ID (G-XXXXXXXXXX)
3. Thêm vào Vercel env: `NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX`
4. Redeploy

---

## BƯỚC 9: Post-Deploy Tasks

### 9.1. Import Initial Content

1. Vào Admin Panel → **Tin tức**
2. Import 5-10 bài viết đầu tiên
3. Approve và publish

### 9.2. Create Admin Account

1. Đăng nhập bằng Google với email admin
2. Vào Supabase → **Table Editor** → `User`
3. Update role của user thành `ADMIN`

### 9.3. Invite Beta Shops

1. Mời 3-5 shop đầu tiên đăng ký
2. Approve shop của họ
3. Hỗ trợ họ đăng acc

---

## Troubleshooting

### Lỗi Build Failed

```bash
# Check logs tại Vercel Dashboard
# Thường do:
- Missing env variables
- Prisma schema issue
- TypeScript errors
```

**Fix**:

1. Kiểm tra tất cả env vars đã đủ chưa
2. Đảm bảo `DATABASE_URL` đúng format
3. Check build logs để tìm lỗi cụ thể

### Lỗi Database Connection

```
Error: Can't reach database server
```

**Fix**:

1. Kiểm tra `DATABASE_URL` có đúng không
2. Đảm bảo dùng connection pooler (port 6543)
3. Check Supabase project có đang pause không
4. Restart Supabase project nếu cần

### Lỗi Google OAuth

```
Error: redirect_uri_mismatch
```

**Fix**:

1. Vào Google Console → Credentials
2. Thêm chính xác redirect URI:
   ```
   https://taphoagame.online/api/auth/callback/google
   ```
3. Đợi vài phút để Google cập nhật

### Lỗi 404 trên Dynamic Routes

```
Page not found: /shop/[slug]
```

**Fix**:

1. Redeploy project
2. Check Next.js config có đúng không
3. Xóa `.next` cache trên Vercel

---

## Monitoring & Maintenance

### Daily Checks

- [ ] Website accessibility
- [ ] Database connection
- [ ] Error logs (Vercel Dashboard)

### Weekly Tasks

- [ ] Check analytics
- [ ] Moderate new shops
- [ ] Import new posts
- [ ] Review user feedback

### Monthly Tasks

- [ ] Performance audit
- [ ] Security updates
- [ ] Backup database
- [ ] Update dependencies

---

## Useful Commands

```bash
# Local development
npm run dev

# Build locally (test before deploy)
npm run build

# Push database schema
npm run db:push

# Open Prisma Studio
npm run db:studio

# Generate Prisma Client
npx prisma generate

# Check environment
vercel env ls

# Pull env from Vercel to local
vercel env pull
```

---

## Support Links

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Supabase Dashboard**: https://app.supabase.com
- **Google Console**: https://console.cloud.google.com
- **GitHub Repo**: https://github.com/nguyentung423/Tap-hoa-game
- **Domain Manager**: (tùy nhà cung cấp)

---

## Next Steps After Deploy

1. ✅ Website live tại taphoagame.online
2. ✅ Admin có thể login và quản lý
3. ✅ Users có thể đăng ký làm seller
4. ✅ Sellers có thể đăng acc
5. ✅ News system hoạt động
6. 📱 Share link lên social media
7. 🎯 Bắt đầu marketing
8. 💰 Onboard shops và bắt đầu kiếm tiền!

---

**🎉 Chúc mừng! Website của bạn đã LIVE! 🎉**
