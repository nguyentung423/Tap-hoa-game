export type GameSlug =
  | "lien-minh"
  | "genshin-impact"
  | "valorant"
  | "pubg-mobile"
  | "lien-quan"
  | "free-fire"
  | "dau-truong-chan-ly"
  | "honkai-star-rail"
  | "toc-chien"
  | "fifa-online"
  | "khac";

export interface Game {
  id: string;
  name: string;
  slug: GameSlug;
  icon: string;
  color: string;
  bgImage?: string;
  isActive?: boolean;
  fields: GameField[];
}

export interface GameField {
  key: string;
  label: string;
  type: "text" | "number" | "select" | "multiselect" | "checkbox";
  options?: string[];
  required?: boolean;
  placeholder?: string;
}

export const GAMES: Game[] = [
  {
    id: "5",
    name: "Liên Quân Mobile",
    slug: "lien-quan",
    icon: "⚔️",
    color: "#1e90ff",
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
      { key: "heroes", label: "Số tướng", type: "number" },
      { key: "skins", label: "Số skin", type: "number" },
      { key: "gold", label: "Vàng", type: "number" },
    ],
  },
  {
    id: "1",
    name: "Liên Minh Huyền Thoại",
    slug: "lien-minh",
    icon: "🎮",
    color: "#c4a04b",
    isActive: false,
    fields: [
      {
        key: "rank",
        label: "Rank",
        type: "select",
        options: [
          "Sắt",
          "Đồng",
          "Bạc",
          "Vàng",
          "Bạch Kim",
          "Kim Cương",
          "Cao Thủ",
          "Đại Cao Thủ",
          "Thách Đấu",
        ],
        required: true,
      },
      { key: "level", label: "Level", type: "number", required: true },
      { key: "champions", label: "Số tướng", type: "number", required: true },
      { key: "skins", label: "Số skin", type: "number", required: true },
      { key: "blueEssence", label: "Tinh hoa xanh", type: "number" },
      { key: "rp", label: "RP", type: "number" },
    ],
  },
  {
    id: "2",
    name: "Genshin Impact",
    slug: "genshin-impact",
    icon: "⚔️",
    color: "#5c8cd4",
    isActive: false,
    fields: [
      { key: "ar", label: "Adventure Rank", type: "number", required: true },
      { key: "worldLevel", label: "World Level", type: "number" },
      {
        key: "fiveStarChars",
        label: "Nhân vật 5★",
        type: "multiselect",
        options: [
          "Nahida",
          "Raiden",
          "Zhongli",
          "Kazuha",
          "Hu Tao",
          "Ayaka",
          "Yelan",
          "Neuvillette",
          "Furina",
          "Alhaitham",
        ],
      },
      { key: "fiveStarWeapons", label: "Vũ khí 5★", type: "number" },
      { key: "primogems", label: "Nguyên thạch", type: "number" },
    ],
  },
  {
    id: "3",
    name: "Valorant",
    slug: "valorant",
    icon: "🎯",
    color: "#ff4654",
    isActive: false,
    fields: [
      {
        key: "rank",
        label: "Rank",
        type: "select",
        options: [
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
      { key: "level", label: "Level", type: "number" },
      { key: "skins", label: "Số skin", type: "number" },
      { key: "agents", label: "Số agent", type: "number" },
      { key: "vp", label: "VP", type: "number" },
    ],
  },
  {
    id: "4",
    name: "PUBG Mobile",
    slug: "pubg-mobile",
    icon: "🔫",
    color: "#f2a900",
    isActive: false,
    fields: [
      {
        key: "tier",
        label: "Tier",
        type: "select",
        options: [
          "Đồng",
          "Bạc",
          "Vàng",
          "Bạch Kim",
          "Kim Cương",
          "Crown",
          "Ace",
          "Ace Master",
          "Conqueror",
        ],
        required: true,
      },
      { key: "level", label: "Level", type: "number" },
      { key: "uc", label: "UC", type: "number" },
      { key: "outfits", label: "Số trang phục", type: "number" },
      { key: "gunSkins", label: "Số skin súng", type: "number" },
      { key: "vehicles", label: "Số skin xe", type: "number" },
    ],
  },
  {
    id: "7",
    name: "Free Fire",
    slug: "free-fire",
    icon: "🔥",
    color: "#ff5722",
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
    id: "8",
    name: "Đấu Trường Chân Lý",
    slug: "dau-truong-chan-ly",
    icon: "🎲",
    color: "#00bcd4",
    isActive: false,
    fields: [
      {
        key: "rank",
        label: "Rank",
        type: "select",
        options: [
          "Sắt",
          "Đồng",
          "Bạc",
          "Vàng",
          "Bạch Kim",
          "Kim Cương",
          "Cao Thủ",
          "Đại Cao Thủ",
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
    id: "6",
    name: "Honkai: Star Rail",
    slug: "honkai-star-rail",
    icon: "🚂",
    color: "#4a90d9",
    isActive: false,
    fields: [
      {
        key: "trailblaze",
        label: "Trailblaze Level",
        type: "number",
        required: true,
      },
      {
        key: "fiveStarChars",
        label: "Nhân vật 5★",
        type: "multiselect",
        options: [
          "Firefly",
          "Acheron",
          "Robin",
          "Aventurine",
          "Sparkle",
          "Ruan Mei",
          "Fu Xuan",
          "Kafka",
          "Blade",
          "Seele",
        ],
      },
      { key: "jades", label: "Stellar Jades", type: "number" },
    ],
  },
];

export const getGameBySlug = (slug: string): Game | undefined => {
  return GAMES.find((game) => game.slug === slug);
};

export const getGameById = (id: string): Game | undefined => {
  return GAMES.find((game) => game.id === id);
};
