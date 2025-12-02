"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Store,
  ShoppingBag,
  TrendingUp,
  Gamepad2,
  Clock,
  CheckCircle,
  ArrowUpRight,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Stats {
  totalShops: number;
  pendingShops: number;
  approvedShops: number;
  totalAccs: number;
  approvedAccs: number;
  rejectedAccs: number;
  soldAccs: number;
  totalGames: number;
}

interface PendingShop {
  id: string;
  email: string;
  name: string;
  shopName: string;
  shopAvatar: string | null;
  createdAt: string;
}

interface RejectedAcc {
  id: string;
  title: string;
  price: number;
  thumbnail: string;
  adminNote: string | null;
  createdAt: string;
  seller: {
    id: string;
    shopName: string;
  };
  game: {
    id: string;
    name: string;
    icon: string;
  };
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("vi-VN").format(price) + "đ";
}

function formatTime(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 60) return `${minutes} phút trước`;
  if (hours < 24) return `${hours} giờ trước`;
  return `${days} ngày trước`;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [pendingShops, setPendingShops] = useState<PendingShop[]>([]);
  const [rejectedAccs, setRejectedAccs] = useState<RejectedAcc[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/v1/admin/stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
        setPendingShops(data.recentPendingShops || []);
        setRejectedAccs(data.recentRejectedAccs || []);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const statsDisplay = [
    {
      title: "Tổng Shops",
      value: stats?.totalShops || 0,
      sub: `${stats?.pendingShops || 0} chờ duyệt`,
      icon: Store,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "Tổng Accs",
      value: stats?.totalAccs || 0,
      sub: `${stats?.rejectedAccs || 0} bị từ chối`,
      icon: ShoppingBag,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      title: "Đã bán",
      value: stats?.soldAccs || 0,
      sub: `${stats?.approvedAccs || 0} đang bán`,
      icon: TrendingUp,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
    {
      title: "Games",
      value: stats?.totalGames || 0,
      sub: "Đang hoạt động",
      icon: Gamepad2,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
    },
  ];
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Tổng quan hệ thống quản trị</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statsDisplay.map((stat) => (
          <div
            key={stat.title}
            className="p-4 rounded-2xl bg-card border border-border"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-xl ${stat.bg}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.title}</p>
            <p className="text-xs text-primary mt-1">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Pending Actions */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Pending Shops */}
        <div className="rounded-2xl bg-card border border-border overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-500" />
              <h2 className="font-semibold">Shops chờ duyệt</h2>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 text-xs font-bold">
                {stats?.pendingShops || 0}
              </span>
            </div>
            <Link href="/admin/shops?status=PENDING">
              <Button variant="ghost" size="sm" className="gap-1">
                Xem tất cả
                <ArrowUpRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          <div className="divide-y divide-border">
            {pendingShops.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
                <p>Không có shop nào chờ duyệt</p>
              </div>
            ) : (
              pendingShops.map((shop) => (
                <div
                  key={shop.id}
                  className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                >
                  <div>
                    <p className="font-medium">{shop.shopName}</p>
                    <p className="text-xs text-muted-foreground">
                      {shop.email}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">
                      {formatTime(shop.createdAt)}
                    </p>
                    <Link href={`/admin/shops?status=PENDING`}>
                      <Button size="sm" className="mt-1 h-7 text-xs">
                        Duyệt
                      </Button>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Rejected Accs */}
        <div className="rounded-2xl bg-card border border-border overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-red-500" />
              <h2 className="font-semibold">Accs bị từ chối</h2>
              <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 text-xs font-bold">
                {stats?.rejectedAccs || 0}
              </span>
            </div>
            <Link href="/admin/accs?status=REJECTED">
              <Button variant="ghost" size="sm" className="gap-1">
                Xem tất cả
                <ArrowUpRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          <div className="divide-y divide-border max-h-[300px] overflow-y-auto">
            {rejectedAccs.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
                <p>Không có acc nào bị từ chối</p>
              </div>
            ) : (
              rejectedAccs.map((acc) => (
                <div
                  key={acc.id}
                  className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{acc.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {acc.seller?.shopName || "N/A"} • {formatPrice(acc.price)}
                    </p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-xs text-muted-foreground">
                      {formatTime(acc.createdAt)}
                    </p>
                    <Link href={`/admin/accs?status=REJECTED`}>
                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-1 h-7 text-xs"
                      >
                        Xem
                      </Button>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
