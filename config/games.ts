export interface Game {
  id: string;
  name: string;
  slug: string;
  icon: string;
  banner: string;
  description: string;
  fields: AccField[];
  isActive: boolean;
}

export interface AccField {
  key: string;
  label: string;
  type: "text" | "number" | "select" | "boolean";
  options?: string[];
  required?: boolean;
  placeholder?: string;
}

export const GAMES: Game[] = [
  {
    id: "lqm",
    name: "Liên Quân Mobile",
    slug: "lien-quan-mobile",
    icon: "⚔️",
    banner: "",
    description: "Mua bán acc Liên Quân Mobile",
    isActive: true,
    fields: [
      {
        key: "rank",
        label: "Rank",
        type: "select",
        options: [
          "Đồng",
          "Bạc",
          "Vàng",
          "Bạch Kim",
          "Kim Cương",
          "Tinh Anh",
          "Cao Thủ",
          "Thách Đấu",
        ],
        required: true,
      },
      { key: "champions", label: "Số tướng", type: "number", required: true },
      { key: "skins", label: "Số skin", type: "number" },
      { key: "gems", label: "Quân Huy", type: "number" },
    ],
  },
  {
    id: "lmht",
    name: "Liên Minh Huyền Thoại",
    slug: "lien-minh-huyen-thoai",
    icon: "🎮",
    banner: "",
    description: "Mua bán acc Liên Minh Huyền Thoại",
    isActive: false,
    fields: [
      {
        key: "rank",
        label: "Rank",
        type: "select",
        options: [
          "Unrank",
          "Sắt",
          "Đồng",
          "Bạc",
          "Vàng",
          "Bạch Kim",
          "Kim Cương",
          "Cao Thủ",
          "Thách Đấu",
        ],
        required: true,
      },
      { key: "champions", label: "Số tướng", type: "number", required: true },
      { key: "skins", label: "Số skin", type: "number", required: true },
      { key: "blueEssence", label: "Tinh Hoa Xanh", type: "number" },
      { key: "rp", label: "RP", type: "number" },
    ],
  },
  {
    id: "tft",
    name: "Đấu Trường Chân Lý",
    slug: "dau-truong-chan-ly",
    icon: "♟️",
    banner: "",
    description: "Mua bán acc Đấu Trường Chân Lý",
    isActive: false,
    fields: [
      {
        key: "rank",
        label: "Rank",
        type: "select",
        options: [
          "Unrank",
          "Sắt",
          "Đồng",
          "Bạc",
          "Vàng",
          "Bạch Kim",
          "Kim Cương",
          "Cao Thủ",
          "Thách Đấu",
        ],
        required: true,
      },
      { key: "level", label: "Level", type: "number" },
      { key: "littleLegends", label: "Số Linh Thú", type: "number" },
      { key: "arenas", label: "Số Đấu Trường", type: "number" },
      { key: "booms", label: "Số Boom", type: "number" },
    ],
  },
  {
    id: "ff",
    name: "Free Fire",
    slug: "free-fire",
    icon: "🔥",
    banner: "",
    description: "Mua bán acc Free Fire",
    isActive: false,
    fields: [
      {
        key: "rank",
        label: "Rank",
        type: "select",
        options: [
          "Đồng",
          "Bạc",
          "Vàng",
          "Bạch Kim",
          "Kim Cương",
          "Anh Hùng",
          "Huyền Thoại",
          "Thách Đấu",
        ],
        required: true,
      },
      { key: "level", label: "Level", type: "number", required: true },
      { key: "characters", label: "Số nhân vật", type: "number" },
      { key: "gunSkins", label: "Số skin súng", type: "number" },
      { key: "outfits", label: "Số trang phục", type: "number" },
      { key: "diamonds", label: "Kim cương", type: "number" },
      { key: "pets", label: "Số pet", type: "number" },
    ],
  },
  {
    id: "pubgm",
    name: "PUBG Mobile",
    slug: "pubg-mobile",
    icon: "🎯",
    banner: "",
    description: "Mua bán acc PUBG Mobile",
    isActive: false,
    fields: [
      {
        key: "rank",
        label: "Rank",
        type: "select",
        options: [
          "Đồng",
          "Bạc",
          "Vàng",
          "Bạch Kim",
          "Kim Cương",
          "Vương Giả",
          "Ace",
          "Ace Master",
          "Chinh Phục",
        ],
        required: true,
      },
      { key: "level", label: "Level", type: "number" },
      { key: "outfits", label: "Số trang phục", type: "number" },
      { key: "gunSkins", label: "Số skin súng", type: "number" },
      { key: "vehicles", label: "Số skin xe", type: "number" },
      { key: "uc", label: "UC", type: "number" },
    ],
  },
  {
    id: "valorant",
    name: "Valorant",
    slug: "valorant",
    icon: "💥",
    banner: "",
    description: "Mua bán acc Valorant",
    isActive: false,
    fields: [
      {
        key: "rank",
        label: "Rank",
        type: "select",
        options: [
          "Unrank",
          "Sắt",
          "Đồng",
          "Bạc",
          "Vàng",
          "Bạch Kim",
          "Kim Cương",
          "Bất Tử",
          "Radiant",
        ],
        required: true,
      },
      { key: "agents", label: "Số Agent", type: "number", required: true },
      { key: "skins", label: "Số skin", type: "number" },
      { key: "vp", label: "VP", type: "number" },
    ],
  },
  {
    id: "genshin",
    name: "Genshin Impact",
    slug: "genshin-impact",
    icon: "⭐",
    banner: "",
    description: "Mua bán acc Genshin Impact",
    isActive: false,
    fields: [
      { key: "ar", label: "Adventure Rank", type: "number", required: true },
      {
        key: "characters5",
        label: "Số nhân vật 5*",
        type: "number",
        required: true,
      },
      { key: "weapons5", label: "Số vũ khí 5*", type: "number" },
      { key: "primogems", label: "Nguyên Thạch", type: "number" },
    ],
  },
  {
    id: "hsr",
    name: "Honkai Star Rail",
    slug: "honkai-star-rail",
    icon: "🚀",
    banner: "",
    description: "Mua bán acc Honkai Star Rail",
    isActive: false,
    fields: [
      { key: "tl", label: "Trailblaze Level", type: "number", required: true },
      {
        key: "characters5",
        label: "Số nhân vật 5*",
        type: "number",
        required: true,
      },
      { key: "lightCones5", label: "Số Nón Ánh Sáng 5*", type: "number" },
      { key: "jades", label: "Stellar Jade", type: "number" },
    ],
  },
];

export function getGameBySlug(slug: string): Game | undefined {
  return GAMES.find((game) => game.slug === slug);
}

export function getGameById(id: string): Game | undefined {
  return GAMES.find((game) => game.id === id);
}
