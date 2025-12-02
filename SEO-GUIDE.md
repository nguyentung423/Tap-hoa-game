# Hướng dẫn SEO cho Tạp hoá game

## ✅ Đã làm

### 1. **Technical SEO**

- ✅ Sitemap.xml tự động (bao gồm tất cả bài viết news)
- ✅ Robots.txt cho phép crawl
- ✅ Metadata cơ bản (title, description, keywords)
- ✅ Open Graph tags (Facebook, Zalo share đẹp)
- ✅ Twitter Cards
- ✅ Dynamic metadata cho từng bài viết
- ✅ Responsive design (mobile-friendly)
- ✅ Fast loading (Next.js 15)

### 2. **Content SEO**

- ✅ URL thân thiện (slug tiếng Việt)
- ✅ Heading hierarchy (H1, H2, H3)
- ✅ Alt text cho ảnh
- ✅ Internal linking (trang news → chi tiết)
- ✅ Structured content

## 📋 Cần làm thêm

### 1. **Submit to Search Engines**

#### Google Search Console

```bash
1. Truy cập: https://search.google.com/search-console
2. Add property: taphoagame.vn
3. Verify ownership (chọn 1 trong các cách):
   - HTML file upload
   - DNS TXT record (khuyến nghị)
   - Google Analytics
4. Submit sitemap: https://taphoagame.vn/sitemap.xml
```

#### Bing Webmaster Tools

```bash
1. Truy cập: https://www.bing.com/webmasters
2. Add site: taphoagame.vn
3. Submit sitemap
```

### 2. **Google Analytics** (theo dõi traffic)

```bash
1. Tạo tài khoản GA4: https://analytics.google.com
2. Lấy Measurement ID (G-XXXXXXXXXX)
3. Thêm vào file .env.local:
   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

Sau đó thêm code vào `app/layout.tsx`:

```tsx
import Script from "next/script";

// Trong component:
{
  process.env.NEXT_PUBLIC_GA_ID && (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
      `}
      </Script>
    </>
  );
}
```

### 3. **Schema.org Structured Data** (nâng cao)

Thêm vào từng bài viết để hiển thị Rich Snippets trên Google:

```tsx
// Trong client.tsx, thêm:
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      headline: post.title,
      image: post.thumbnail,
      datePublished: post.publishedAt,
      author: {
        "@type": "Organization",
        name: post.sourceName || "Tạp hoá game",
      },
      publisher: {
        "@type": "Organization",
        name: "Tạp hoá game",
        logo: {
          "@type": "ImageObject",
          url: "https://taphoagame.vn/logo.png",
        },
      },
    }),
  }}
/>
```

### 4. **Content Marketing**

- 📝 Đăng bài đều đặn (ít nhất 3-5 bài/tuần)
- 🎯 Tập trung keywords: "tin [tên game]", "acc [tên game]"
- 🔗 Share bài lên group Facebook, Zalo
- 📱 Tạo Fanpage Facebook, đăng lại bài từ web

### 5. **Backlinks** (quan trọng nhất)

Cách lấy backlink:

- Trao đổi link với các web game khác
- Đăng bài guest post
- Comment trên diễn đàn game
- Đăng ký directory (top10vietnam.com, etc)

### 6. **Performance Optimization**

```bash
# Check performance
npm run build
npm run start

# Test SEO
- Google PageSpeed Insights: https://pagespeed.web.dev
- GTmetrix: https://gtmetrix.com
```

### 7. **Social Signals**

Thêm nút share xã hội vào bài viết:

- Facebook Share
- Zalo Share
- Copy Link

## 🎯 Keywords Strategy

### Primary Keywords (target)

- "mua acc game"
- "bán acc game"
- "tin tức game"
- "tin liên quân"
- "tin liên minh"

### Long-tail Keywords

- "mua acc liên quân giá rẻ"
- "shop acc game uy tín"
- "tin tức esports việt nam"

## 📊 Tracking Success

Theo dõi hàng tuần:

1. **Google Search Console**: Impressions, Clicks, CTR
2. **Google Analytics**: Sessions, Users, Bounce Rate
3. **Rankings**: Vị trí keywords trên Google (dùng tools miễn phí như Ubersuggest)

## ⏱️ Timeline

- **Tuần 1-2**: Submit sitemap, setup GA
- **Tuần 3-4**: Xuất hiện trên Google (index)
- **Tháng 2-3**: Bắt đầu có traffic tự nhiên
- **Tháng 6+**: Ranking tốt nếu content chất lượng

## 💡 Tips

1. **Title tốt**: Dưới 60 ký tự, có keyword chính
2. **Description**: 150-160 ký tự, hấp dẫn
3. **URL**: Ngắn, có keyword, không dấu
4. **Images**: Nén nhẹ (<200KB), có alt text
5. **Internal links**: Link các bài liên quan
6. **Fresh content**: Cập nhật tin mới thường xuyên

## 🚀 Quick Start

```bash
# 1. Submit sitemap
curl https://taphoagame.vn/sitemap.xml

# 2. Test robots.txt
curl https://taphoagame.vn/robots.txt

# 3. Verify metadata
curl -I https://taphoagame.vn/news

# 4. Check Google index
site:taphoagame.vn
```

## 📞 Support

Nếu cần hỗ trợ thêm:

- Google Search Console Help
- Google Analytics Help
- Facebook Business Help Center
