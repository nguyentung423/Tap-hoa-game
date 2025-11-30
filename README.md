# AccVIP - Sàn Giao Dịch Tài Khoản Game #1 Việt Nam

![AccVIP Banner](./public/images/og-image.png)

## 🎮 Giới Thiệu

AccVIP là nền tảng mua bán tài khoản game uy tín hàng đầu Việt Nam. Với giao diện hiện đại, trải nghiệm người dùng tối ưu và tích hợp thanh toán an toàn qua Zalo Escrow.

### ✨ Tính Năng Nổi Bật

- 🌙 **Dark Neon Theme** - Giao diện gaming đẹp mắt với hiệu ứng neon
- 📱 **Mobile First** - Tối ưu hoàn hảo cho điện thoại
- ⚡ **Next.js 15** - Hiệu năng cao với App Router
- 🔒 **Zalo Escrow** - Thanh toán an toàn, bảo vệ người mua
- 🎨 **Framer Motion** - Animations mượt mà
- 🔍 **SEO Optimized** - Tối ưu cho công cụ tìm kiếm

## 🚀 Bắt Đầu

### Yêu Cầu

- Node.js 18.17 hoặc cao hơn
- npm, yarn, hoặc pnpm

### Cài Đặt

```bash
# Clone repository
git clone https://github.com/your-username/accvip.git
cd accvip

# Cài đặt dependencies
npm install

# Chạy development server
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) để xem kết quả.

### Scripts

```bash
npm run dev      # Chạy development server
npm run build    # Build production
npm run start    # Chạy production server
npm run lint     # Kiểm tra linting
npm run format   # Format code với Prettier
```

## 📁 Cấu Trúc Thư Mục

```
accvip/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth routes (login, register)
│   ├── (main)/            # Main routes với layout chung
│   │   ├── (home)/        # Trang chủ
│   │   ├── acc/           # Danh sách & chi tiết acc
│   │   ├── post/          # Đăng bán acc
│   │   └── profile/       # Trang cá nhân
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── acc/              # Acc-related components
│   ├── layout/           # Header, Footer, Navigation
│   ├── pwa/              # PWA components
│   ├── search/           # Search components
│   └── ui/               # shadcn/ui components
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities và configs
├── providers/             # React Context providers
├── stores/                # Zustand stores
├── types/                 # TypeScript types
└── public/               # Static assets
```

## 🎨 Design System

### Colors

```css
/* Primary - Neon Green */
--neon-green: #00ff9d;

/* Secondary - Neon Purple */
--neon-purple: #8b5cf6;

/* Background */
--dark-bg: #0f172a;
--dark-card: #1e293b;
```

### Typography

- **Display Font**: Orbitron (Gaming style)
- **Body Font**: Inter

### Components

Sử dụng [shadcn/ui](https://ui.shadcn.com/) với custom theme neon.

## 🔧 Tech Stack

| Category         | Technology            |
| ---------------- | --------------------- |
| Framework        | Next.js 15            |
| Language         | TypeScript            |
| Styling          | Tailwind CSS          |
| UI Components    | shadcn/ui             |
| Animations       | Framer Motion         |
| State Management | Zustand               |
| Icons            | Lucide React          |
| Forms            | React Hook Form + Zod |

## 📱 PWA Support

AccVIP hỗ trợ Progressive Web App:

- Cài đặt trên màn hình điện thoại
- Hoạt động offline
- Push notifications (coming soon)

## 🔒 Bảo Mật

- Thanh toán qua Zalo Escrow
- OTP verification
- Rate limiting trên API
- Input sanitization

## 📦 Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Docker

```bash
docker build -t accvip .
docker run -p 3000:3000 accvip
```

## 🤝 Đóng Góp

Chúng tôi hoan nghênh mọi đóng góp! Vui lòng đọc [CONTRIBUTING.md](./CONTRIBUTING.md) để biết thêm chi tiết.

## 📄 License

MIT License - xem [LICENSE](./LICENSE) để biết thêm chi tiết.

## 📞 Liên Hệ

- Website: [accvip.vn](https://accvip.vn)
- Zalo: 0912 345 678
- Email: support@accvip.vn

---

Made with ❤️ by AccVIP Team
