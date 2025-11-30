// Site configuration

export const siteConfig = {
  name: "Tạp hoá game",
  shortName: "THG",
  description: "Chợ mua bán acc game uy tín - Giao dịch trung gian an toàn",
  tagline: "Nơi hội tụ các shop game uy tín",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",

  // Admin Zalo - QUAN TRỌNG: Thay bằng số của bạn
  admin: {
    zaloPhone: process.env.NEXT_PUBLIC_ADMIN_ZALO || "0912345678",
    zaloName: "Tạp hoá game - Trung Gian",
  },

  // Fee settings
  fee: {
    percent: 5, // 5% phí giao dịch
    min: 10000, // Tối thiểu 10k
  },

  // Social links
  social: {
    facebook: "https://facebook.com/accvip",
    youtube: "",
    tiktok: "",
  },
};

// Generate Zalo deep link to contact admin
export function getAdminZaloLink(
  accTitle?: string,
  accPrice?: number,
  accUrl?: string
): string {
  const phone = siteConfig.admin.zaloPhone;

  let message = "Xin chào Admin, tôi muốn mua acc game qua trung gian.";

  if (accTitle && accPrice) {
    const priceFormatted = new Intl.NumberFormat("vi-VN").format(accPrice);
    message = `Xin chào Admin,\n\nTôi muốn mua acc này qua trung gian:\n\n📦 ${accTitle}\n💰 Giá: ${priceFormatted}đ`;
    if (accUrl) {
      message += `\n🔗 Link: ${accUrl}`;
    }
    message += "\n\nNhờ Admin tạo nhóm giao dịch giúp mình nhé!";
  } else if (accTitle) {
    // Just asking about a shop
    message = `Xin chào Admin,\n\nTôi muốn hỏi về: ${accTitle}`;
    if (accUrl) {
      message += `\n🔗 Link: ${accUrl}`;
    }
  }

  const encodedMessage = encodeURIComponent(message);
  return `https://zalo.me/${phone}?text=${encodedMessage}`;
}
