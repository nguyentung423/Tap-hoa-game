import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import PostDetailClient from "./client";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug, status: "PUBLISHED" },
    select: {
      title: true,
      excerpt: true,
      thumbnail: true,
      game: true,
      tags: true,
      sourceName: true,
    },
  });

  if (!post) {
    return {
      title: "Bài viết không tồn tại",
    };
  }

  return {
    title: post.title,
    description: post.excerpt || `Tin tức ${post.game || "game"} mới nhất`,
    keywords: [
      post.game || "",
      "tin tức game",
      "tin game",
      ...post.tags,
    ].filter(Boolean),
    openGraph: {
      title: post.title,
      description: post.excerpt || "",
      type: "article",
      images: post.thumbnail
        ? [
            {
              url: post.thumbnail,
              width: 1200,
              height: 630,
              alt: post.title,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt || "",
      images: post.thumbnail ? [post.thumbnail] : [],
    },
  };
}

export default function PostDetailPage({ params }: Props) {
  return <PostDetailClient slug={params.slug} />;
}
