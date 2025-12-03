"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { ChevronLeft, ChevronRight, Eye, CheckCircle2, X } from "lucide-react";
import { Acc } from "@/types";
import { BuyButton, SafetyPolicyButton } from "@/components/acc";
import { formatPrice } from "@/lib/utils";

interface Props {
  acc: Acc;
}

export function AccDetailClient({ acc }: Props) {
  const [currentImage, setCurrentImage] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);

  const discountPercent = acc.originalPrice
    ? Math.round(((acc.originalPrice - acc.price) / acc.originalPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen pb-24">
      {/* Back button */}
      <div className="container py-4">
        <Link
          href="/acc"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Quay lại</span>
        </Link>
      </div>

      <div className="container">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <motion.div
              className="relative aspect-video rounded-2xl overflow-hidden bg-muted cursor-zoom-in"
              onClick={() => setShowLightbox(true)}
              whileHover={{ scale: 1.01 }}
            >
              <Image
                src={acc.images[currentImage] || acc.thumbnail}
                alt={acc.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 800px"
                className="object-cover"
                priority
              />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex gap-2">
                {acc.isVip && (
                  <span className="px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-sm font-bold rounded-full">
                    VIP
                  </span>
                )}
                {acc.isHot && (
                  <span className="px-3 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-bold rounded-full">
                    HOT
                  </span>
                )}
              </div>

              {/* Navigation */}
              {acc.images.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImage((prev) =>
                        prev === 0 ? acc.images.length - 1 : prev - 1
                      );
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImage((prev) =>
                        prev === acc.images.length - 1 ? 0 : prev + 1
                      );
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </motion.div>

            {/* Thumbnails */}
            {acc.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {acc.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImage(idx)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition ${
                      currentImage === idx
                        ? "border-primary"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${acc.title} - ${idx + 1}`}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-6">
            {/* Game badge */}
            <Link
              href={`/acc?game=${acc.gameSlug}`}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-muted rounded-full text-sm hover:bg-muted/80 transition"
            >
              <span>{acc.gameName}</span>
            </Link>

            {/* Title */}
            <h1 className="text-2xl lg:text-3xl font-bold">{acc.title}</h1>

            {/* Price */}
            <div className="flex items-end gap-3">
              <span className="text-3xl lg:text-4xl font-bold text-primary">
                {formatPrice(acc.price)}
              </span>
              {acc.originalPrice && (
                <>
                  <span className="text-xl text-muted-foreground line-through">
                    {formatPrice(acc.originalPrice)}
                  </span>
                  <span className="px-2 py-1 bg-red-500/10 text-red-500 text-sm font-semibold rounded">
                    -{discountPercent}%
                  </span>
                </>
              )}
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{acc.views} lượt xem</span>
              </div>
            </div>

            {/* Attributes */}
            <div className="grid grid-cols-2 gap-3">
              {(Array.isArray(acc.attributes) ? acc.attributes : []).map(
                (attr, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-muted/50 rounded-xl border border-border/50"
                  >
                    <div className="text-xs text-muted-foreground mb-1">
                      {attr.label}
                    </div>
                    <div className="font-semibold">{attr.value}</div>
                  </div>
                )
              )}
            </div>

            {/* Description */}
            {acc.description && (
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <h3 className="text-lg font-semibold mb-2">Mô tả</h3>
                <p className="text-muted-foreground whitespace-pre-line">
                  {acc.description}
                </p>
              </div>
            )}

            {/* Shop info */}
            <Link
              href={`/shop/${acc.shop.slug}`}
              className="block p-4 bg-muted/30 rounded-xl border border-border/50 hover:border-primary/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-muted overflow-hidden">
                  {acc.shop.avatar ? (
                    <Image
                      src={acc.shop.avatar}
                      alt={acc.shop.name}
                      width={48}
                      height={48}
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xl font-bold text-muted-foreground">
                      {acc.shop.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-semibold">{acc.shop.name}</div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    {acc.shop.isVerified && (
                      <div className="flex items-center gap-1 text-green-500">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span className="font-medium">Đã xác minh</span>
                      </div>
                    )}
                    <span>{acc.shop.totalSales} đã bán</span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
            </Link>

            {/* Buy button - Fixed on mobile */}
            <div className="hidden lg:block space-y-3">
              <BuyButton acc={acc} size="lg" className="w-full" />
              <SafetyPolicyButton className="w-full justify-center" />
            </div>
          </div>
        </div>
      </div>

      {/* Fixed bottom bar on mobile */}
      <div className="fixed bottom-16 left-0 right-0 bg-background border-t border-border lg:hidden z-50">
        <div className="flex items-center gap-2 px-3 py-2">
          <SafetyPolicyButton className="shrink-0 h-11 px-3" />
          <BuyButton acc={acc} size="md" className="flex-1 h-11 min-w-0" />
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {showLightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
            onClick={() => setShowLightbox(false)}
          >
            {/* Close button */}
            <button
              onClick={() => setShowLightbox(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition z-10"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Image counter */}
            <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-white/10 text-white text-sm font-medium">
              {currentImage + 1} / {acc.images.length}
            </div>

            {/* Navigation arrows */}
            {acc.images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImage((prev) =>
                      prev === 0 ? acc.images.length - 1 : prev - 1
                    );
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition z-10"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImage((prev) =>
                      prev === acc.images.length - 1 ? 0 : prev + 1
                    );
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition z-10"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Main image */}
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <TransformWrapper
                initialScale={1}
                minScale={1}
                maxScale={3}
                doubleClick={{ disabled: false, mode: "zoomIn" }}
                wheel={{ step: 0.1 }}
                pinch={{ step: 5 }}
                panning={{ disabled: false }}
                limitToBounds={true}
                centerOnInit={true}
              >
                <TransformComponent
                  wrapperStyle={{
                    width: "100%",
                    height: "100%",
                  }}
                  contentStyle={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Image
                    src={acc.images[currentImage] || acc.thumbnail}
                    alt={acc.title}
                    width={1200}
                    height={800}
                    className="max-w-[90vw] max-h-[85vh] object-contain"
                    onClick={(e) => e.stopPropagation()}
                  />
                </TransformComponent>
              </TransformWrapper>
            </div>

            {/* Thumbnails at bottom */}
            {acc.images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-[90vw] overflow-x-auto px-4 py-2 rounded-xl bg-black/50">
                {acc.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImage(idx);
                    }}
                    className={`relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 border-2 transition ${
                      currentImage === idx
                        ? "border-primary"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${acc.title} - ${idx + 1}`}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
