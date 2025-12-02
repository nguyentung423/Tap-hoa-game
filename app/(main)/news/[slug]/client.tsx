"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft,
  Eye,
  Calendar,
  ExternalLink,
  Loader2,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  thumbnail: string | null;
  game: string | null;
  tags: string[];
  sourceUrl: string | null;
  sourceName: string | null;
  views: number;
  publishedAt: string | null;
  createdAt: string;
}

export default function PostDetailClient({ slug }: { slug: string }) {
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const fetchPost = async () => {
    try {
      const res = await fetch(`/api/v1/posts/${slug}`);

      if (!res.ok) {
        router.push("/news");
        return;
      }

      const data = await res.json();
      setPost(data);
    } catch (error) {
      console.error("Error fetching post:", error);
      router.push("/news");
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
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/news")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Article Header */}
        <article className="rounded-xl bg-card border border-border overflow-hidden">
          {/* Featured Image */}
          {post.thumbnail && (
            <div className="aspect-video relative bg-muted">
              <Image
                src={post.thumbnail}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          <div className="p-6 md:p-8 space-y-6">
            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              {post.game && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20">
                  <Tag className="w-4 h-4 text-primary" />
                  <span className="text-primary font-medium">{post.game}</span>
                </div>
              )}

              <div className="flex items-center gap-1.5">
                <Eye className="w-4 h-4" />
                <span>{post.views.toLocaleString()} lượt xem</span>
              </div>

              {post.publishedAt && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(post.publishedAt)}</span>
                </div>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
              {post.title}
            </h1>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-lg text-muted-foreground leading-relaxed">
                {post.excerpt}
              </p>
            )}

            {/* Divider */}
            <div className="border-t border-border my-6" />

            {/* Content */}
            <div
              className="prose prose-lg max-w-none
                prose-headings:text-foreground prose-headings:font-bold
                prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
                prose-p:text-foreground/80 prose-p:leading-relaxed prose-p:my-4
                prose-a:text-primary hover:prose-a:text-primary/80
                prose-strong:text-foreground prose-strong:font-semibold
                prose-em:text-foreground/80
                prose-img:rounded-lg prose-img:border prose-img:border-border prose-img:my-6
                prose-ul:text-foreground/80 prose-ol:text-foreground/80
                prose-li:my-2
                [&>*]:text-foreground/80
                [&_p]:text-foreground/80 [&_p]:leading-relaxed
                [&_h1]:text-foreground [&_h2]:text-foreground [&_h3]:text-foreground
                [&_strong]:text-foreground [&_b]:text-foreground
                [&_a]:text-primary [&_a:hover]:text-primary/80
                [&_img]:rounded-lg [&_img]:border [&_img]:border-border
                [&_ul]:list-disc [&_ul]:pl-6
                [&_ol]:list-decimal [&_ol]:pl-6
                [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_blockquote]:italic
                [&_table]:border [&_table]:border-border
                [&_td]:border [&_td]:border-border [&_td]:p-2
                [&_th]:border [&_th]:border-border [&_th]:p-2 [&_th]:bg-muted"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Source */}
            {post.sourceUrl && post.sourceName && (
              <div className="mt-8 pt-6 border-t border-border">
                <p className="text-sm text-muted-foreground mb-2">Nguồn:</p>
                <a
                  href={post.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
                >
                  <span>{post.sourceName}</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            )}

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-6 border-t border-border">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-full bg-muted border border-border text-sm text-muted-foreground"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </article>

        {/* Back to News */}
        <div className="mt-8 text-center">
          <Button variant="outline" onClick={() => router.push("/news")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Xem thêm tin tức khác
          </Button>
        </div>
      </div>
    </div>
  );
}
