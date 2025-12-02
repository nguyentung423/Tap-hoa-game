"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Newspaper, Eye, Calendar, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  thumbnail: string | null;
  game: string | null;
  views: number;
  publishedAt: string | null;
}

const GAMES = [
  "Tất cả",
  "Liên Quân",
  "Liên Minh",
  "Free Fire",
  "PUBG",
  "Roblox",
];

export default function NewsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGame, setSelectedGame] = useState("Tất cả");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchPosts();
  }, [selectedGame, page]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const gameParam = selectedGame === "Tất cả" ? "all" : selectedGame;
      const res = await fetch(`/api/v1/posts?game=${gameParam}&page=${page}`);
      const data = await res.json();

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

  const formatDate = (date: string | null) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50">
        <div className="px-4 py-6 md:max-w-7xl md:mx-auto md:py-8">
          {/* Mobile: Simple title left */}
          <div className="md:hidden">
            <h1 className="text-xl font-bold text-foreground">Tin Tức Game</h1>
            <p className="text-xs text-muted-foreground mt-1 hidden sm:block">
              Cập nhật tin tức mới nhất về các game hot hiện nay
            </p>
          </div>

          {/* Desktop: Icon + title right aligned */}
          <div className="hidden md:flex items-center gap-3 justify-end">
            <div className="p-2 rounded-lg bg-primary/10 shrink-0">
              <Newspaper className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground text-right">
                Tin Tức Game
              </h1>
              <p className="text-sm text-muted-foreground mt-1 text-right">
                Cập nhật tin tức mới nhất về các game hot hiện nay
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Game Filter */}
        <div className="mb-8 flex items-center gap-2 overflow-x-auto pb-2">
          <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          {GAMES.map((game) => (
            <Button
              key={game}
              variant={selectedGame === game ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setSelectedGame(game);
                setPage(1);
              }}
              className="flex-shrink-0"
            >
              {game}
            </Button>
          ))}
        </div>

        {/* Posts Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="rounded-xl bg-card border border-border overflow-hidden animate-pulse"
              >
                <div className="aspect-video bg-muted" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-full" />
                  <div className="h-3 bg-muted rounded w-5/6" />
                </div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <Newspaper className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Chưa có bài viết nào</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/news/${post.slug}`}
                  className="group rounded-xl bg-card border border-border overflow-hidden hover:border-primary transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
                >
                  {/* Thumbnail */}
                  <div className="aspect-video bg-muted relative overflow-hidden">
                    {post.thumbnail ? (
                      <Image
                        src={post.thumbnail}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Newspaper className="w-12 h-12 text-white/20" />
                      </div>
                    )}

                    {/* Game Tag */}
                    {post.game && (
                      <div className="absolute top-2 right-2 px-2 py-1 rounded-md bg-primary/90 backdrop-blur-sm">
                        <span className="text-xs font-medium text-primary-foreground">
                          {post.game}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-3">
                    <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>

                    {post.excerpt && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {post.excerpt}
                      </p>
                    )}

                    {/* Meta */}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        <span>{post.views.toLocaleString()}</span>
                      </div>
                      {post.publishedAt && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(post.publishedAt)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center gap-2">
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
          </>
        )}
      </div>
    </div>
  );
}
