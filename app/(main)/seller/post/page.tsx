"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  ArrowLeft,
  Upload,
  X,
  Plus,
  ImageIcon,
  Sparkles,
  Info,
  Check,
  Loader2,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Game {
  id: string;
  name: string;
  slug: string;
  icon: string;
  fields: any[];
  isActive: boolean;
}

interface FormData {
  gameId: string;
  title: string;
  description: string;
  price: string;
  originalPrice: string;
  images: string[];
  attributes: Record<string, string>;
}

const initialFormData: FormData = {
  gameId: "",
  title: "",
  description: "",
  price: "",
  originalPrice: "",
  images: [],
  attributes: {},
};

export default function PostAccPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [games, setGames] = useState<Game[]>([]);
  const [isLoadingGames, setIsLoadingGames] = useState(true);

  const selectedGame = games.find((g: any) => g.id === formData.gameId);

  // Check shop status before allowing access
  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      router.replace("/seller");
      return;
    }

    if (session?.user && !session.user.shopName) {
      router.replace("/seller/welcome");
      return;
    }

    // Check if shop is approved
    const checkShopStatus = async () => {
      try {
        const res = await fetch("/api/v1/seller/shop");
        const json = await res.json();

        if (json.success && json.data) {
          const { status: shopStatus } = json.data;

          // If not approved, redirect to pending page
          if (shopStatus !== "APPROVED") {
            router.replace("/seller/pending");
            return;
          }
        }
      } catch (error) {
        console.error("Error checking shop status:", error);
      }
    };

    checkShopStatus();
  }, [session, status, router]);

  // Fetch games from API
  useEffect(() => {
    const fetchGames = async () => {
      setIsLoadingGames(true);
      try {
        const res = await fetch("/api/v1/games", {
          next: { revalidate: 60 }, // Cache 60s
        });
        if (res.ok) {
          const data = await res.json();
          setGames(data.data || data || []);
        }
      } catch (error) {
        console.error("Error fetching games:", error);
      } finally {
        setIsLoadingGames(false);
      }
    };
    fetchGames();
  }, []);

  const handleGameSelect = (gameId: string) => {
    setFormData({ ...formData, gameId, attributes: {} });
    setStep(2);
  };

  // Compress image before upload
  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = document.createElement("img");
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_SIZE = 1920; // Tăng từ 800 -> 1920px (Full HD)
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_SIZE) {
              height *= MAX_SIZE / width;
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width *= MAX_SIZE / height;
              height = MAX_SIZE;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File([blob], file.name, {
                  type: "image/jpeg",
                  lastModified: Date.now(),
                });
                resolve(compressedFile);
              } else {
                reject(new Error("Canvas to Blob failed"));
              }
            },
            "image/jpeg",
            0.92 // Tăng từ 0.7 -> 0.92 (92% quality)
          );
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setIsUploading(true);

    // Upload in batches of 3 to avoid overwhelming the server
    const fileArray = Array.from(files);
    const batchSize = 3;
    const allUrls: string[] = [];

    for (let i = 0; i < fileArray.length; i += batchSize) {
      const batch = fileArray.slice(i, i + batchSize);

      const uploadPromises = batch.map(async (file) => {
        try {
          // Compress image first
          const compressedFile = await compressImage(file);

          const formDataUpload = new FormData();
          formDataUpload.append("file", compressedFile);

          const response = await fetch("/api/upload", {
            method: "POST",
            body: formDataUpload,
          });

          if (response.ok) {
            const data = await response.json();
            return data.url;
          } else {
            console.error("Upload error:", response.status);
            return null;
          }
        } catch (error) {
          console.error("Upload error:", error);
          return null;
        }
      });

      const batchUrls = await Promise.all(uploadPromises);
      const validUrls = batchUrls.filter((url) => url !== null) as string[];
      allUrls.push(...validUrls);
    }

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...allUrls].slice(0, 15),
    }));

    setIsUploading(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    const files = e.dataTransfer.files;
    if (!files) return;

    setIsUploading(true);

    // Upload in batches of 3
    const fileArray = Array.from(files).filter((file) =>
      file.type.startsWith("image/")
    );
    const batchSize = 3;
    const allUrls: string[] = [];

    for (let i = 0; i < fileArray.length; i += batchSize) {
      const batch = fileArray.slice(i, i + batchSize);

      const uploadPromises = batch.map(async (file) => {
        try {
          // Compress image first
          const compressedFile = await compressImage(file);

          const formDataUpload = new FormData();
          formDataUpload.append("file", compressedFile);

          const response = await fetch("/api/upload", {
            method: "POST",
            body: formDataUpload,
          });

          if (response.ok) {
            const data = await response.json();
            return data.url;
          } else {
            console.error("Upload error:", response.status);
            return null;
          }
        } catch (error) {
          console.error("Upload error:", error);
          return null;
        }
      });

      const batchUrls = await Promise.all(uploadPromises);
      const validUrls = batchUrls.filter((url) => url !== null) as string[];
      allUrls.push(...validUrls);
    }

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...allUrls].slice(0, 15),
    }));

    setIsUploading(false);
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    console.log("Submitting form data:", formData);
    setIsSubmitting(true);

    try {
      // Get the game slug from config
      const gameSlug = selectedGame?.slug || formData.gameId;

      const response = await fetch("/api/v1/seller/accs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gameId: gameSlug, // Send slug instead of config id
          title: formData.title,
          description: formData.description,
          price: parseInt(formData.price) || 0,
          originalPrice: formData.originalPrice
            ? parseInt(formData.originalPrice)
            : null,
          images: formData.images,
          attributes: formData.attributes,
        }),
      });

      const data = await response.json();
      console.log("API Response:", response.status, data);

      if (!response.ok) {
        alert(data.error || "Đăng acc thất bại");
        throw new Error(data.error || "Failed to create acc");
      }

      router.push("/seller/dashboard?success=true");
    } catch (error) {
      console.error("Error creating acc:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceedStep2 =
    formData.title && formData.price && formData.images.length > 0;

  // Check if all required fields are filled
  const requiredFieldsFilled =
    selectedGame?.fields
      .filter((f) => f.required)
      .every((f) => formData.attributes[f.key]?.trim()) ?? false;

  const canSubmit = canProceedStep2 && formData.description.trim().length >= 10;

  // Debug log
  console.log(
    "Step:",
    step,
    "canSubmit:",
    canSubmit,
    "requiredFieldsFilled:",
    requiredFieldsFilled
  );
  console.log("Attributes:", formData.attributes);
  console.log(
    "Selected game fields:",
    selectedGame?.fields.filter((f) => f.required)
  );

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-6">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => (step > 1 ? setStep(step - 1) : router.back())}
              className="p-2 -ml-2 rounded-xl hover:bg-muted transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1">
              <h1 className="font-bold text-lg">Đăng bán acc mới</h1>
              <p className="text-sm text-muted-foreground">
                Bước {step}/2 • {step === 1 ? "Chọn game" : "Thông tin acc"}
              </p>
            </div>
          </div>

          {/* Progress */}
          <div className="flex gap-2 mt-4">
            {[1, 2].map((s) => (
              <div
                key={s}
                className={cn(
                  "h-1 flex-1 rounded-full transition-colors",
                  s <= step ? "bg-primary" : "bg-muted"
                )}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="container py-6">
        {/* Step 1: Select Game */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Chọn game</h2>
              <p className="text-muted-foreground">
                Bạn muốn bán acc game nào?
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {isLoadingGames
                ? Array.from({ length: 8 }).map((_, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-2xl border-2 border-border bg-card animate-pulse"
                    >
                      <div className="w-16 h-16 mx-auto mb-3 rounded-xl bg-muted" />
                      <div className="h-4 bg-muted rounded mx-auto w-3/4" />
                    </div>
                  ))
                : games
                    .filter((g: any) => g.isActive)
                    .map((game: any) => (
                      <button
                        key={game.id}
                        onClick={() => handleGameSelect(game.id)}
                        className={cn(
                          "relative group p-4 rounded-2xl border-2 transition-all text-left",
                          formData.gameId === game.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50 bg-card"
                        )}
                      >
                        <div className="w-16 h-16 mx-auto mb-3 rounded-xl bg-muted flex items-center justify-center text-4xl">
                          {game.icon}
                        </div>
                        <h3 className="font-semibold text-center text-sm line-clamp-2">
                          {game.name}
                        </h3>
                        {formData.gameId === game.id && (
                          <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                            <Check className="w-4 h-4 text-primary-foreground" />
                          </div>
                        )}
                      </button>
                    ))}
            </div>
          </div>
        )}

        {/* Step 2: Basic Info */}
        {step === 2 && (
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Selected Game */}
            <div className="glass-card rounded-2xl p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-3xl shrink-0">
                {selectedGame?.icon}
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Game đã chọn</p>
                <p className="font-semibold">{selectedGame?.name}</p>
              </div>
              <button
                onClick={() => setStep(1)}
                className="text-sm text-primary hover:underline"
              >
                Đổi game
              </button>
            </div>

            {/* Image Upload */}
            <div className="space-y-3">
              <label className="font-semibold flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-primary" />
                Hình ảnh acc <span className="text-red-500">*</span>
                <span className="text-xs text-muted-foreground font-normal ml-auto">
                  {formData.images.length}/15
                </span>
              </label>

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                className={cn(
                  "border-2 border-dashed rounded-2xl p-6 transition-all text-center",
                  dragOver
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                )}
              >
                {formData.images.length === 0 ? (
                  <>
                    <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                    <p className="font-medium mb-1">Kéo thả ảnh vào đây</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      hoặc click để chọn file
                    </p>
                    {isUploading ? (
                      <div className="space-y-2">
                        <div className="flex items-center justify-center gap-2">
                          <Loader2 className="w-5 h-5 animate-spin text-primary" />
                          <span className="text-sm font-medium text-primary">
                            Đang tải ảnh chất lượng cao...
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Ảnh được tối ưu Full HD để hiển thị đẹp nhất cho khách
                          hàng
                        </p>
                      </div>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Chọn ảnh
                      </Button>
                    )}
                  </>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                    {formData.images.map((img, i) => (
                      <div
                        key={i}
                        className="relative aspect-square rounded-xl overflow-hidden group"
                      >
                        <Image
                          src={img}
                          alt={`Image ${i + 1}`}
                          fill
                          sizes="(max-width: 640px) 33vw, 20vw"
                          className="object-cover"
                        />
                        <button
                          onClick={() => removeImage(i)}
                          className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3 text-white" />
                        </button>
                        {i === 0 && (
                          <div className="absolute bottom-1 left-1 px-2 py-0.5 rounded bg-primary text-[10px] font-bold text-primary-foreground">
                            Ảnh bìa
                          </div>
                        )}
                      </div>
                    ))}
                    {formData.images.length < 15 && (
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="aspect-square rounded-xl border-2 border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed p-2"
                      >
                        {isUploading ? (
                          <>
                            <Loader2 className="w-6 h-6 text-primary animate-spin mb-1" />
                            <span className="text-[10px] text-center text-muted-foreground">
                              Đang tải HD...
                            </span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-6 h-6 text-muted-foreground mb-1" />
                            <span className="text-[10px] text-muted-foreground">
                              Thêm ảnh
                            </span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                )}

                {isUploading && formData.images.length > 0 && (
                  <div className="flex items-center gap-2 text-sm text-primary mt-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Đang tải ảnh chất lượng cao (Full HD)...</span>
                  </div>
                )}

                <p className="text-xs text-muted-foreground mt-2">
                  💡 Ảnh được tự động tối ưu Full HD để hiển thị sắc nét cho
                  khách hàng
                </p>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                💡 Tip: Ảnh đầu tiên sẽ làm ảnh bìa. Chụp rõ rank, tướng, skin
                để acc dễ bán hơn!
              </p>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <label className="font-semibold">
                Tiêu đề <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="VD: Acc LMHT Thách Đấu 500LP - Full skin hiếm"
                className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
              <p className="text-xs text-muted-foreground">
                Tiêu đề hấp dẫn giúp acc được nhiều người xem hơn
              </p>
            </div>

            {/* Price */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="font-semibold">
                  Giá bán <span className="text-red-500">*</span>
                  <span className="text-xs text-muted-foreground font-normal ml-2">
                    (Giá khách hàng sẽ mua)
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.price}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      setFormData({ ...formData, price: value });
                    }}
                    placeholder="0"
                    className="w-full px-4 py-3 pr-12 rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                    đ
                  </span>
                </div>
                {formData.price && (
                  <p className="text-sm text-primary font-medium">
                    {parseInt(formData.price).toLocaleString("vi-VN")}đ
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="font-semibold text-muted-foreground">
                  Giá gốc
                  <span className="text-xs font-normal ml-2">
                    (Để so sánh, khách thấy được giảm giá)
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.originalPrice}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      setFormData({ ...formData, originalPrice: value });
                    }}
                    placeholder="0"
                    className="w-full px-4 py-3 pr-12 rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                    đ
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="font-semibold">
                Mô tả chi tiết <span className="text-red-500">*</span>
                <span className="text-xs text-muted-foreground font-normal ml-2">
                  (Tối thiểu 10 ký tự)
                </span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Mô tả thêm về acc: thông tin rank, tướng, skin, lịch sử tài khoản..."
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
              />
              {formData.description && formData.description.length < 10 && (
                <p className="text-xs text-red-500">
                  Vui lòng nhập ít nhất 10 ký tự ({formData.description.length}
                  /10)
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              disabled={!canSubmit || isSubmitting}
              className="w-full h-14 text-base gap-2 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Đang đăng...
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  Đăng acc ngay
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
