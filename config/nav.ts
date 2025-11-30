import { Home, Search, PlusCircle, User, Bell } from "lucide-react";

export const mainNav = [
  {
    title: "Trang chủ",
    href: "/",
  },
  {
    title: "Mua Acc",
    href: "/acc",
  },
  {
    title: "Đăng bán",
    href: "/post",
  },
];

export const mobileNav = [
  {
    title: "Trang chủ",
    href: "/",
    icon: Home,
  },
  {
    title: "Tìm kiếm",
    href: "/acc",
    icon: Search,
  },
  {
    title: "Đăng bán",
    href: "/post",
    icon: PlusCircle,
  },
  {
    title: "Thông báo",
    href: "/notifications",
    icon: Bell,
  },
  {
    title: "Tài khoản",
    href: "/profile",
    icon: User,
  },
];

export const userNav = [
  {
    title: "Tài khoản của tôi",
    href: "/user/settings",
  },
  {
    title: "Acc đã đăng",
    href: "/user/my-accs",
  },
  {
    title: "Giao dịch",
    href: "/user/my-deals",
  },
  {
    title: "Ví tiền",
    href: "/user/wallet",
  },
];
