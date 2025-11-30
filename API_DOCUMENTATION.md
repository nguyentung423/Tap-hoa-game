# API Documentation - Tạp Hoá Game

## Overview

Tài liệu này mô tả các API endpoints cần thiết cho backend. Frontend đã được setup sẵn để đấu nối.

**Base URL:** `/api/v1`

**Authentication:** Bearer Token (JWT) trong header `Authorization`

---

## 1. Authentication APIs

> **Lưu ý:** Frontend dùng NextAuth.js với Google OAuth.  
> Backend chỉ cần sync user info sau khi Google đăng nhập thành công.

### POST `/auth/google/sync`

Sync user từ Google OAuth. Frontend gọi sau khi NextAuth đăng nhập thành công.
Backend sẽ tạo user/shop mới nếu chưa có.

**Request:**

```json
{
  "email": "seller@gmail.com",
  "name": "Nguyễn Văn A",
  "image": "https://lh3.googleusercontent.com/..."
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "string",
      "email": "seller@gmail.com",
      "name": "Nguyễn Văn A",
      "avatar": "string",
      "role": "seller" | "admin",
      "status": "pending" | "approved" | "rejected" | "banned",
      "shopId": "string | null",
      "createdAt": "ISO date",
      "updatedAt": "ISO date"
    },
    "isNewUser": true
  }
}
```

### POST `/auth/logout`

Đăng xuất (invalidate tokens).

### GET `/auth/me`

Lấy thông tin user hiện tại.

---

## 2. Games APIs

### GET `/games`

Lấy danh sách tất cả games.

**Query params:**

- `activeOnly`: boolean (optional)

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "name": "Liên Quân Mobile",
      "slug": "lien-quan",
      "icon": "⚔️",
      "color": "#1e90ff",
      "isActive": true,
      "fields": [
        {
          "key": "rank",
          "label": "Rank",
          "type": "select",
          "options": ["Đồng", "Bạc", ...],
          "required": true
        }
      ]
    }
  ]
}
```

### GET `/games/active`

Lấy chỉ các games đang active.

### GET `/games/:slug`

Lấy thông tin 1 game.

---

## 3. Accs APIs (Public)

### GET `/accs`

Lấy danh sách accs đang bán.

**Query params:**

- `page`: number (default: 1)
- `pageSize`: number (default: 12)
- `gameSlug`: string
- `minPrice`: number
- `maxPrice`: number
- `search`: string
- `sortBy`: "newest" | "oldest" | "price-asc" | "price-desc" | "popular"

**Response:**

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "string",
        "title": "Acc Liên Quân Cao Thủ",
        "slug": "acc-lien-quan-cao-thu",
        "description": "string",
        "price": 5500000,
        "originalPrice": 6500000,
        "gameId": "string",
        "gameSlug": "lien-quan",
        "gameName": "Liên Quân Mobile",
        "images": ["url1", "url2"],
        "thumbnail": "url",
        "attributes": [{ "label": "Rank", "value": "Cao Thủ" }],
        "status": "approved",
        "isVip": false,
        "isHot": true,
        "views": 1250,
        "shop": {
          "id": "string",
          "slug": "shop-game-pro",
          "name": "Shop Game Pro",
          "avatar": "url",
          "rating": 4.9,
          "totalSales": 523,
          "isVerified": true
        },
        "createdAt": "ISO date",
        "updatedAt": "ISO date"
      }
    ],
    "total": 100,
    "page": 1,
    "pageSize": 12,
    "hasMore": true
  }
}
```

### GET `/accs/hot`

Lấy danh sách accs hot.

**Query params:**

- `limit`: number (default: 8)

### GET `/accs/game/:gameSlug`

Lấy accs theo game.

### GET `/accs/shop/:shopSlug`

Lấy accs của một shop.

### GET `/accs/:slug`

Lấy chi tiết 1 acc.

### GET `/accs/search`

Tìm kiếm accs.

**Query params:**

- `q`: string (required)
- Các params như GET `/accs`

---

## 4. Shops APIs (Public)

### GET `/shops`

Lấy danh sách shops.

**Query params:**

- `page`: number
- `pageSize`: number
- `search`: string
- `gameSlug`: string
- `verified`: boolean
- `sortBy`: "newest" | "rating" | "sales" | "popular"

**Response:**

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "string",
        "slug": "shop-game-pro",
        "name": "Shop Game Pro",
        "description": "string",
        "avatar": "url",
        "coverImage": "url",
        "zaloPhone": "0901234567",
        "status": "approved",
        "isVerified": true,
        "rating": 4.9,
        "totalReviews": 156,
        "totalSales": 523,
        "totalAccs": 45,
        "featuredGames": ["lien-quan", "free-fire"],
        "ownerId": "string",
        "createdAt": "ISO date",
        "lastActiveAt": "ISO date"
      }
    ],
    "total": 50,
    "page": 1,
    "pageSize": 12,
    "hasMore": true
  }
}
```

### GET `/shops/featured`

Lấy danh sách shops nổi bật.

### GET `/shops/:slug`

Lấy chi tiết shop.

---

## 5. Seller APIs

**⚠️ Requires Authentication**

### GET `/seller/stats`

Lấy thống kê dashboard.

**Response:**

```json
{
  "success": true,
  "data": {
    "totalAccs": 24,
    "pendingAccs": 3,
    "approvedAccs": 18,
    "soldAccs": 3,
    "totalViews": 12500,
    "totalRevenue": 45600000
  }
}
```

### GET `/seller/shop`

Lấy thông tin shop của seller.

### PUT `/seller/shop`

Cập nhật thông tin shop.

**Request:**

```json
{
  "name": "string",
  "description": "string",
  "avatar": "url",
  "coverImage": "url",
  "zaloPhone": "string"
}
```

### GET `/seller/accs`

Lấy danh sách accs của seller.

**Query params:**

- `page`: number
- `pageSize`: number
- `status`: "pending" | "approved" | "rejected" | "sold"
- `gameSlug`: string
- `search`: string

### GET `/seller/accs/:id`

Lấy chi tiết 1 acc của seller.

### POST `/seller/accs`

Tạo acc mới.

**Request:**

```json
{
  "gameId": "string",
  "title": "string",
  "description": "string",
  "price": 5500000,
  "originalPrice": 6500000,
  "images": ["url1", "url2"],
  "attributes": {
    "rank": "Cao Thủ",
    "level": "30",
    "champions": "50"
  }
}
```

### PUT `/seller/accs/:id`

Cập nhật acc.

### DELETE `/seller/accs/:id`

Xóa acc.

---

## 6. Admin APIs

**⚠️ Requires Admin Role**

### GET `/admin/stats`

Lấy thống kê admin dashboard.

**Response:**

```json
{
  "success": true,
  "data": {
    "totalShops": 156,
    "pendingShops": 12,
    "totalAccs": 2345,
    "pendingAccs": 89,
    "totalUsers": 1234,
    "totalGames": 10,
    "activeGames": 1
  }
}
```

### Games Management

- `GET /admin/games` - List all games
- `PUT /admin/games/:id` - Update game
- `PATCH /admin/games/:id/toggle` - Toggle game active status

### Shops Management

- `GET /admin/shops` - List shops (với filters)
- `GET /admin/shops/:id` - Get shop detail
- `POST /admin/shops/:id/approve` - Approve shop
- `POST /admin/shops/:id/reject` - Reject shop (với reason)
- `PATCH /admin/shops/:id/verify` - Toggle verify status
- `POST /admin/shops/:id/ban` - Ban shop

### Accs Management

- `GET /admin/accs` - List accs (với filters)
- `GET /admin/accs/:id` - Get acc detail
- `POST /admin/accs/:id/approve` - Approve acc
- `POST /admin/accs/:id/reject` - Reject acc (với reason)
- `PATCH /admin/accs/:id/feature` - Toggle hot/featured

### Users Management

- `GET /admin/users` - List users
- `GET /admin/users/:id` - Get user detail

### Settings

- `GET /admin/settings` - Get settings
- `PUT /admin/settings` - Update settings

---

## 7. Upload APIs

### POST `/upload/image`

Upload 1 ảnh.

**Request:** `multipart/form-data`

- `file`: File
- `folder`: string (optional, e.g., "accs", "shops", "avatars")

**Response:**

```json
{
  "success": true,
  "data": {
    "url": "https://cloudinary.com/.../image.jpg",
    "filename": "image.jpg",
    "size": 123456
  }
}
```

### POST `/upload/images`

Upload nhiều ảnh.

**Request:** `multipart/form-data`

- `files`: File[]
- `folder`: string (optional)

**Response:**

```json
{
  "success": true,
  "data": {
    "files": [{ "url": "...", "filename": "...", "size": 123 }]
  }
}
```

---

## Error Response Format

Tất cả errors trả về format:

```json
{
  "success": false,
  "error": "Error message here"
}
```

**HTTP Status Codes:**

- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error

---

## Notes for Backend Developer

1. **Database Schema:** Xem file `prisma/schema.prisma` để tham khảo

2. **Types:** Tất cả types được định nghĩa trong `/types/*.ts`

3. **Mock Data:** Xem `/data/mock-*.ts` để hiểu structure data

4. **Switch API:** Frontend dùng biến `NEXT_PUBLIC_USE_REAL_API` để switch giữa mock và real API

5. **Image Upload:** Recommend dùng Cloudinary hoặc AWS S3

6. **Auth:** Recommend dùng JWT với refresh token pattern

7. **Pagination:** Sử dụng cursor-based pagination cho performance tốt hơn (optional)
