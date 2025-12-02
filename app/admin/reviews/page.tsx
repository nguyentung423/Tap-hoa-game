"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Star,
  Search,
  Plus,
  Trash2,
  Loader2,
  RefreshCw,
  Store,
  User,
  Calendar,
  MessageSquare,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Review {
  id: string;
  rating: number;
  content: string | null;
  buyerName: string;
  createdAt: string;
  seller: {
    id: string;
    shopName: string | null;
    shopSlug: string | null;
  };
}

interface Shop {
  id: string;
  shopName: string | null;
  shopSlug: string | null;
  rating: number;
  totalReviews: number;
}

interface ShopWithReviews extends Shop {
  reviews: Review[];
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedShopId, setSelectedShopId] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [buyerName, setBuyerName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedShops, setExpandedShops] = useState<Set<string>>(new Set());

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/v1/admin/reviews");
      if (res.ok) {
        const data = await res.json();
        console.log("Fetched reviews:", data.reviews); // Debug
        setReviews(data.reviews || []);
      } else {
        toast.error("Không thể tải danh sách đánh giá");
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast.error("Có lỗi xảy ra khi tải đánh giá");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchShops = async () => {
    try {
      const res = await fetch("/api/v1/admin/shops");
      if (res.ok) {
        const data = await res.json();
        console.log("Fetched shops data:", data); // Debug full response
        // API có thể trả về data.shops hoặc data.data.shops
        const shopsList = data.shops || data.data?.shops || [];
        console.log("Shops list:", shopsList); // Debug
        setShops(shopsList);
      } else {
        console.error("Failed to fetch shops:", res.status);
      }
    } catch (error) {
      console.error("Error fetching shops:", error);
    }
  };

  useEffect(() => {
    fetchReviews();
    fetchShops();
  }, []);

  // Group reviews by shop
  const shopsWithReviews = useMemo(() => {
    const shopMap = new Map<string, ShopWithReviews>();

    // Initialize all shops
    shops.forEach((shop) => {
      shopMap.set(shop.id, {
        ...shop,
        reviews: [],
      });
    });

    // Add reviews to their shops
    reviews.forEach((review) => {
      const shop = shopMap.get(review.seller.id);
      if (shop) {
        shop.reviews.push(review);
      }
    });

    const result = Array.from(shopMap.values());
    console.log("Shops with reviews:", result); // Debug
    return result;
  }, [shops, reviews]);

  // Filter shops
  const filteredShops = useMemo(() => {
    if (!searchQuery) return shopsWithReviews;

    const query = searchQuery.toLowerCase();
    return shopsWithReviews.filter((shop) => {
      const matchShopName = shop.shopName?.toLowerCase().includes(query);
      const matchReviews = shop.reviews.some(
        (r) =>
          r.buyerName.toLowerCase().includes(query) ||
          r.content?.toLowerCase().includes(query)
      );
      return matchShopName || matchReviews;
    });
  }, [shopsWithReviews, searchQuery]);

  const toggleShop = (shopId: string) => {
    const newExpanded = new Set(expandedShops);
    if (newExpanded.has(shopId)) {
      newExpanded.delete(shopId);
    } else {
      newExpanded.add(shopId);
    }
    setExpandedShops(newExpanded);
  };

  const handleAddReview = async () => {
    if (!selectedShopId || !buyerName.trim()) {
      toast.error("Vui lòng chọn shop và nhập tên người mua");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/v1/admin/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shopId: selectedShopId,
          rating,
          comment: comment.trim() || null,
          buyerName: buyerName.trim(),
        }),
      });

      if (res.ok) {
        toast.success("Đã thêm đánh giá!");
        setShowAddModal(false);
        setSelectedShopId("");
        setRating(5);
        setComment("");
        setBuyerName("");
        fetchReviews();
      } else {
        const error = await res.json();
        toast.error(error.message || "Không thể thêm đánh giá");
      }
    } catch (error) {
      console.error("Error adding review:", error);
      toast.error("Có lỗi xảy ra");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm("Bạn chắc chắn muốn xóa đánh giá này?")) return;

    try {
      const res = await fetch(`/api/v1/admin/reviews/${reviewId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Đã xóa đánh giá!");
        fetchReviews();
      } else {
        toast.error("Không thể xóa đánh giá");
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error("Có lỗi xảy ra");
    }
  };

  const filteredReviews = reviews.filter((review) => {
    const query = searchQuery.toLowerCase();
    return (
      review.seller.shopName?.toLowerCase().includes(query) ||
      review.buyerName.toLowerCase().includes(query) ||
      review.content?.toLowerCase().includes(query)
    );
  });

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Quản lý Đánh giá</h1>
        <p className="text-muted-foreground mt-1">
          Thêm và quản lý đánh giá cho các shop
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Tìm theo shop, người mua, nội dung..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchReviews}
            disabled={isLoading}
          >
            <RefreshCw
              className={cn("w-4 h-4 mr-2", isLoading && "animate-spin")}
            />
            Làm mới
          </Button>
          <Button size="sm" onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Thêm đánh giá
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Star className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{reviews.length}</p>
              <p className="text-sm text-muted-foreground">Tổng đánh giá</p>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {reviews.length > 0
                  ? (
                      reviews.reduce((sum, r) => sum + r.rating, 0) /
                      reviews.length
                    ).toFixed(1)
                  : "0.0"}
              </p>
              <p className="text-sm text-muted-foreground">Đánh giá TB</p>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <Store className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {new Set(reviews.map((r) => r.seller.id)).size}
              </p>
              <p className="text-sm text-muted-foreground">Shop có đánh giá</p>
            </div>
          </div>
        </div>
      </div>

      {/* Shops List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : filteredShops.length === 0 ? (
        <div className="text-center py-12 glass-card rounded-xl">
          <Store className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            {searchQuery ? "Không tìm thấy shop nào" : "Chưa có shop nào"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredShops.map((shop) => (
            <div
              key={shop.id}
              className="glass-card rounded-xl overflow-hidden border hover:border-primary/50 transition-colors"
            >
              {/* Shop Header */}
              <div
                className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => toggleShop(shop.id)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Store className="w-5 h-5 text-primary" />
                      <h3 className="font-semibold text-lg">
                        {shop.shopName || shop.shopSlug || "Unknown Shop"}
                      </h3>
                    </div>

                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">
                          {shop.rating.toFixed(1)}
                        </span>
                      </div>
                      <div className="text-muted-foreground">
                        {shop.totalReviews} đánh giá
                      </div>
                    </div>
                  </div>

                  <Button variant="ghost" size="sm">
                    {expandedShops.has(shop.id) ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Reviews */}
              {expandedShops.has(shop.id) && (
                <div className="border-t border-border bg-muted/20">
                  {shop.reviews.length === 0 ? (
                    <div className="p-6 text-center text-sm text-muted-foreground">
                      Chưa có đánh giá
                    </div>
                  ) : (
                    <div className="divide-y divide-border">
                      {shop.reviews.map((review) => (
                        <div key={review.id} className="p-4">
                          <div className="flex justify-between gap-4">
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center gap-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={cn(
                                      "w-4 h-4",
                                      i < review.rating
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-gray-300"
                                    )}
                                  />
                                ))}
                                <span className="ml-2 font-semibold text-sm">
                                  {review.rating}/5
                                </span>
                              </div>
                              {review.content && (
                                <p className="text-sm">{review.content}</p>
                              )}
                              <div className="flex gap-3 text-xs text-muted-foreground">
                                <span>👤 {review.buyerName}</span>
                                <span>📅 {formatDate(review.createdAt)}</span>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteReview(review.id)}
                              className="text-red-500 hover:bg-red-500/10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Review Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="glass-card rounded-xl p-6 max-w-md w-full space-y-4">
            <h2 className="text-xl font-bold">Thêm đánh giá mới</h2>

            {/* Shop select */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Chọn shop <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedShopId}
                onChange={(e) => setSelectedShopId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">-- Chọn shop --</option>
                {shops.map((shop) => (
                  <option key={shop.id} value={shop.id}>
                    {shop.shopName || shop.shopSlug || "Unknown"}
                  </option>
                ))}
              </select>
            </div>

            {/* Buyer name */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Tên người mua <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                placeholder="Ví dụ: Nguyễn Văn A"
                className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Rating */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Số sao <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setRating(i + 1)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={cn(
                        "w-8 h-8",
                        i < rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      )}
                    />
                  </button>
                ))}
                <span className="ml-2 font-semibold">{rating}/5</span>
              </div>
            </div>

            {/* Comment */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Nhận xét (tùy chọn)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Nhập nhận xét của người mua..."
                rows={3}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddModal(false);
                  setSelectedShopId("");
                  setRating(5);
                  setComment("");
                  setBuyerName("");
                }}
                disabled={isSubmitting}
              >
                Hủy
              </Button>
              <Button onClick={handleAddReview} disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Plus className="w-4 h-4 mr-2" />
                )}
                Thêm đánh giá
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
