# Auto-crawl News Cron Job Setup

## Hướng dẫn setup cron job tự động crawl tin tức mỗi ngày

### Bước 1: Thêm CRON_SECRET vào .env

```bash
# Tạo secret key
openssl rand -base64 32

# Thêm vào file .env
echo "CRON_SECRET=<your-generated-key>" >> .env
```

### Bước 2: Setup Cron Job (chọn 1 trong các cách)

#### Option 1: Vercel Cron Jobs (Khuyến nghị - Miễn phí)

1. Tạo file `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/fetch-news",
      "schedule": "0 8 * * *"
    }
  ]
}
```

2. Deploy lên Vercel - cron sẽ tự động chạy lúc 8h sáng mỗi ngày

#### Option 2: GitHub Actions (Miễn phí)

1. Tạo file `.github/workflows/cron-news.yml`:

```yaml
name: Crawl News Daily

on:
  schedule:
    - cron: "0 8 * * *" # 8AM UTC daily
  workflow_dispatch: # Allow manual trigger

jobs:
  crawl:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger News Crawl
        run: |
          curl -X GET \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}" \
            https://your-domain.com/api/cron/fetch-news
```

2. Thêm secret `CRON_SECRET` vào GitHub repo settings

#### Option 3: Cron-job.org (Miễn phí)

1. Đăng ký tài khoản tại https://cron-job.org
2. Tạo cron job mới:
   - URL: `https://your-domain.com/api/cron/fetch-news`
   - Schedule: `0 8 * * *` (8AM daily)
   - Headers: `Authorization: Bearer <your-cron-secret>`

#### Option 4: Local Cron (Server riêng)

```bash
# Mở crontab
crontab -e

# Thêm dòng này (chạy lúc 8h sáng mỗi ngày)
0 8 * * * curl -H "Authorization: Bearer YOUR_CRON_SECRET" https://your-domain.com/api/cron/fetch-news
```

### Bước 3: Test thử

```bash
# Test crawl ngay
curl -H "Authorization: Bearer YOUR_CRON_SECRET" \
  http://localhost:3000/api/cron/fetch-news

# Hoặc test trên production
curl -H "Authorization: Bearer YOUR_CRON_SECRET" \
  https://your-domain.com/api/cron/fetch-news
```

### Nguồn tin được crawl

Hiện tại crawl từ 8 nguồn:

1. **GameK** - gamek.vn
2. **Thế Giới Game** - thegioigame.vn
3. **Game8** - game8.vn
4. **VnExpress Số Hóa** - vnexpress.net
5. **GenK Game** - genk.vn
6. **Soha Game** - soha.vn
7. **Ngôi Sao GameZone** - ngoisao.net
8. **CafeF Game** - cafef.vn

### Cách hoạt động

1. Cron job chạy → Gọi API `/api/cron/fetch-news`
2. API crawl 5 bài mới nhất từ mỗi nguồn (tổng ~40 bài)
3. Lọc chỉ giữ bài liên quan đến 5 game: Liên Quân, Liên Minh, Free Fire, PUBG, Roblox
4. Lưu vào database với status `DRAFT`
5. Admin vào `/admin/posts` để duyệt/từ chối
6. Bài được duyệt sẽ hiện ở `/news`

### Monitoring

Check logs để xem kết quả crawl:

```json
{
  "success": true,
  "fetched": 40,
  "saved": 15,
  "message": "Fetched 40 articles, saved 15 new posts"
}
```

### Notes

- **Tránh trùng lặp**: API tự động check slug trước khi insert
- **Filter theo game**: Chỉ lưu bài liên quan 5 game chính
- **Bảo mật**: Bắt buộc có Authorization header với CRON_SECRET
- **Rate limit**: Crawl 5 bài/nguồn để tránh quá tải
