"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Newspaper,
  Eye,
  Calendar,
  Check,
  X,
  Trash2,
  ExternalLink,
  Loader2,
  Filter,
  Plus,
  Link as LinkIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  thumbnail: string | null;
  game: string | null;
  status: string;
  views: number;
  sourceName: string | null;
  publishedAt: string | null;
  createdAt: string;
}

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("DRAFT");
  const [gameFilter, setGameFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [importUrl, setImportUrl] = useState("");
  const [importing, setImporting] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, [statusFilter, gameFilter, page]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        status: statusFilter,
        page: page.toString(),
      });

      if (gameFilter !== "all") {
        params.append("game", gameFilter);
      }

      const res = await fetch(`/api/v1/admin/posts?${params}`);

      console.log("Fetching:", `/api/v1/admin/posts?${params}`);
      console.log("Response status:", res.status);

      const data = await res.json();

      console.log("API Response:", data);
      console.log("Posts count:", data.posts?.length);
      console.log("Current filters:", { statusFilter, gameFilter, page });

      if (data.posts) {
        setPosts(data.posts);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (
    id: string,
    action: "approve" | "reject" | "delete"
  ) => {
    try {
      if (action === "delete") {
        if (!confirm("Bạn có chắc muốn xóa bài viết này?")) return;

        await fetch(`/api/v1/admin/posts/${id}`, {
          method: "DELETE",
        });

        alert("✅ Đã xóa bài viết");
      } else {
        await fetch(`/api/v1/admin/posts/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action }),
        });

        // Auto switch to appropriate filter after action
        if (action === "approve") {
          alert("✅ Đã duyệt bài viết");
          setStatusFilter("PUBLISHED");
        } else if (action === "reject") {
          alert("✅ Đã từ chối bài viết");
          setStatusFilter("REJECTED");
        }
      }

      fetchPosts();
    } catch (error) {
      console.error("Error updating post:", error);
      alert("Có lỗi xảy ra");
    }
  };

  const handleImportUrl = async () => {
    if (!importUrl.trim()) return;

    setImporting(true);
    try {
      const res = await fetch("/api/v1/admin/posts/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: importUrl }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Import failed");
        return;
      }

      alert(`✅ Đã import: ${data.post.title}`);
      setImportUrl("");
      setShowImportDialog(false);
      fetchPosts();
    } catch (error) {
      console.error("Error importing:", error);
      alert("Có lỗi xảy ra khi import");
    } finally {
      setImporting(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý Bài viết</h1>
          <p className="text-muted-foreground mt-1">
            Duyệt và quản lý bài viết được crawl tự động
          </p>
        </div>

        <div className="flex gap-2">
          <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Import từ URL
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Import bài viết từ URL</DialogTitle>
                <DialogDescription>
                  Nhập link bài viết game từ các trang tin tức
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="https://gamek.vn/..."
                    value={importUrl}
                    onChange={(e) => setImportUrl(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleImportUrl()}
                  />
                  <Button onClick={handleImportUrl} disabled={importing}>
                    {importing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Đang import...
                      </>
                    ) : (
                      <>
                        <LinkIcon className="w-4 h-4 mr-2" />
                        Import
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Hỗ trợ GameK, GenK, Kenh14, 24h, VnExpress...
                </p>
              </div>
            </DialogContent>
          </Dialog>

          <Button variant="outline" onClick={fetchPosts} className="gap-2">
            <Newspaper className="w-4 h-4" />
            Làm mới
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 p-4 rounded-lg bg-muted/50">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">Lọc:</span>
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="DRAFT">Chờ duyệt</SelectItem>
            <SelectItem value="PUBLISHED">Đã duyệt</SelectItem>
            <SelectItem value="REJECTED">Đã từ chối</SelectItem>
          </SelectContent>
        </Select>

        <Select value={gameFilter} onValueChange={setGameFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả game</SelectItem>
            <SelectItem value="Liên Quân">Liên Quân</SelectItem>
            <SelectItem value="Liên Minh">Liên Minh</SelectItem>
            <SelectItem value="Free Fire">Free Fire</SelectItem>
            <SelectItem value="PUBG">PUBG</SelectItem>
            <SelectItem value="Roblox">Roblox</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Posts List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 border rounded-lg">
          <Newspaper className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Không có bài viết nào</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="p-4 rounded-lg border bg-card hover:border-primary/50 transition-colors"
            >
              <div className="flex gap-4">
                {/* Thumbnail */}
                <div className="flex-shrink-0 w-32 h-24 rounded-lg bg-muted relative overflow-hidden">
                  {post.thumbnail ? (
                    <Image
                      src={post.thumbnail}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Newspaper className="w-8 h-8 text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg line-clamp-2 mb-1">
                        {post.title}
                      </h3>

                      {post.excerpt && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {post.excerpt}
                        </p>
                      )}
                    </div>

                    {/* Status Badge */}
                    <div
                      className={`px-2 py-1 rounded-md text-xs font-medium flex-shrink-0 ${
                        post.status === "PUBLISHED"
                          ? "bg-green-500/10 text-green-500"
                          : post.status === "REJECTED"
                          ? "bg-red-500/10 text-red-500"
                          : "bg-yellow-500/10 text-yellow-500"
                      }`}
                    >
                      {post.status === "PUBLISHED"
                        ? "Đã duyệt"
                        : post.status === "REJECTED"
                        ? "Từ chối"
                        : "Chờ duyệt"}
                    </div>
                  </div>

                  {/* Meta */}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                    {post.game && (
                      <span className="px-2 py-1 rounded bg-primary/10 text-primary font-medium">
                        {post.game}
                      </span>
                    )}

                    {post.sourceName && (
                      <div className="flex items-center gap-1">
                        <ExternalLink className="w-3 h-3" />
                        <span>{post.sourceName}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      <span>{post.views.toLocaleString()}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(post.createdAt)}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2">
                    <Link href={`/news/${post.slug}`} target="_blank">
                      <Button variant="outline" size="sm" className="gap-2">
                        <ExternalLink className="w-3 h-3" />
                        Xem
                      </Button>
                    </Link>

                    {post.status === "DRAFT" && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAction(post.id, "approve")}
                          className="gap-2 text-green-600 hover:text-green-700"
                        >
                          <Check className="w-3 h-3" />
                          Duyệt
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAction(post.id, "reject")}
                          className="gap-2 text-red-600 hover:text-red-700"
                        >
                          <X className="w-3 h-3" />
                          Từ chối
                        </Button>
                      </>
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAction(post.id, "delete")}
                      className="gap-2 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-3 h-3" />
                      Xóa
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Trước
          </Button>

          <div className="flex items-center gap-2 px-4 text-sm text-muted-foreground">
            Trang {page} / {totalPages}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Sau
          </Button>
        </div>
      )}
    </div>
  );
}
