"use client";

import { useState, useRef, use, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
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
  Save,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { GAMES, type AccField } from "@/config/games";

interface AccData {
  id: string;
  gameId: string;
  title: string;
  description: string;
  price: number;
  originalPrice: number | null;
  images: string[];
  attributes: Record<string, string>;
  status: string;
  rejectionReason?: string;
}

interface Props {
  params: Promise<{ id: string }>;
}

export default function EditAccPage({ params }: Props) {
  const { id } = use(params);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [accData, setAccData] = useState<AccData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    gameId: "",
    title: "",
    description: "",
    price: "",
    originalPrice: "",
    images: [] as string[],
    attributes: {} as Record<string, string>,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  // Fetch acc data from API
  useEffect(() => {
    const fetchAcc = async () => {
      try {
        const response = await fetch(`/api/v1/seller/accs/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch acc");
        }
        const data = await response.json();
        setAccData(data);
        setFormData({
          gameId: data.gameId,
          title: data.title,
          description: data.description || "",
          price: data.price?.toString() || "",
          originalPrice: data.originalPrice?.toString() || "",
          images: data.images || [],
          attributes: data.attributes || {},
        });
      } catch (error) {
        console.error("Error fetching acc:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAcc();
  }, [id]);

  const selectedGame = GAMES.find((g) => g.id === formData.gameId);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, reader.result as string].slice(0, 15),
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    const files = e.dataTransfer.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = () => {
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, reader.result as string].slice(0, 15),
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/v1/seller/accs/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
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
      if (!response.ok) {
        throw new Error("Failed to save");
      }
      router.push("/seller/dashboard?updated=true");
    } catch (error) {
      console.error("Error saving acc:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/v1/seller/accs/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete");
      }
      router.push("/seller/dashboard?deleted=true");
    } catch (error) {
      console.error("Error deleting acc:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!accData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Không tìm thấy acc</h2>
          <Button onClick={() => router.push("/seller/dashboard")}>
            Về Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-6">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 -ml-2 rounded-xl hover:bg-muted transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1">
              <h1 className="font-bold text-lg">Chỉnh sửa acc</h1>
              <p className="text-sm text-muted-foreground">ID: {id}</p>
            </div>
            <Button onClick={handleSave} disabled={isSaving} className="gap-2">
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">Lưu thay đổi</span>
              <span className="sm:hidden">Lưu</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="container py-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Status Banner */}
          {accData.status === "REJECTED" && (
            <div className="glass-card rounded-2xl p-4 bg-red-500/10 border-red-500/20">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-500">Acc bị từ chối</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Lý do:{" "}
                    {accData.rejectionReason ||
                      "Không đáp ứng yêu cầu, vui lòng chỉnh sửa và gửi lại."}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Sau khi sửa, acc sẽ được gửi lại để Admin duyệt.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Selected Game */}
          <div className="glass-card rounded-2xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-muted overflow-hidden relative shrink-0">
              <Image
                src={selectedGame?.icon || ""}
                alt={selectedGame?.name || ""}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Game</p>
              <p className="font-semibold">{selectedGame?.name}</p>
            </div>
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
                "border-2 border-dashed rounded-2xl p-4 transition-all",
                dragOver
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              )}
            >
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
                    className="aspect-square rounded-xl border-2 border-dashed border-border hover:border-primary/50 flex items-center justify-center transition-colors"
                  >
                    <Plus className="w-6 h-6 text-muted-foreground" />
                  </button>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>
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
              className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>

          {/* Price */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="font-semibold">
                Giá bán <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.price}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    setFormData({ ...formData, price: value });
                  }}
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
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.originalPrice}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    setFormData({ ...formData, originalPrice: value });
                  }}
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
            <label className="font-semibold">Mô tả chi tiết</label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
              className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
            />
          </div>

          {/* Game Fields */}
          {selectedGame && (
            <div className="glass-card rounded-2xl p-6 space-y-6">
              <h2 className="font-bold text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Thông tin {selectedGame.name}
              </h2>

              <div className="space-y-4">
                {selectedGame.fields.map((field) => (
                  <FieldInput
                    key={field.key}
                    field={field}
                    value={formData.attributes[field.key] || ""}
                    onChange={(value) =>
                      setFormData({
                        ...formData,
                        attributes: {
                          ...formData.attributes,
                          [field.key]: value,
                        },
                      })
                    }
                  />
                ))}
              </div>
            </div>
          )}

          {/* Delete Section */}
          <div className="glass-card rounded-2xl p-4 border-red-500/20">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-red-500">Xóa acc này</h3>
                <p className="text-sm text-muted-foreground">
                  Hành động này không thể hoàn tác
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="text-red-500 border-red-500/30 hover:bg-red-500/10"
                onClick={() => setShowDeleteConfirm(true)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Xóa
              </Button>
            </div>
          </div>

          {/* Note */}
          <p className="text-xs text-center text-muted-foreground">
            <Info className="w-3 h-3 inline mr-1" />
            Thay đổi sẽ được Admin duyệt lại nếu acc đang pending
          </p>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setShowDeleteConfirm(false)}
          />
          <div className="relative glass-card rounded-2xl p-6 max-w-sm w-full">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-lg font-bold mb-2">Xóa acc này?</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Bạn có chắc chắn muốn xóa acc "{formData.title}"? Hành động này
                không thể hoàn tác.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Hủy
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={handleDelete}
                >
                  Xóa
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface FieldInputProps {
  field: AccField;
  value: string;
  onChange: (value: string) => void;
}

function FieldInput({ field, value, onChange }: FieldInputProps) {
  return (
    <div className="space-y-2">
      <label className="font-medium text-sm flex items-center gap-2">
        {field.label}
        {field.required && <span className="text-red-500">*</span>}
      </label>

      {field.type === "select" ? (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-primary transition-all"
        >
          <option value="">Chọn {field.label.toLowerCase()}</option>
          {field.options?.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ) : field.type === "boolean" ? (
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => onChange("true")}
            className={cn(
              "flex-1 py-3 rounded-xl border-2 transition-all font-medium",
              value === "true"
                ? "border-primary bg-primary/10 text-primary"
                : "border-border hover:border-primary/50"
            )}
          >
            Có
          </button>
          <button
            type="button"
            onClick={() => onChange("false")}
            className={cn(
              "flex-1 py-3 rounded-xl border-2 transition-all font-medium",
              value === "false"
                ? "border-primary bg-primary/10 text-primary"
                : "border-border hover:border-primary/50"
            )}
          >
            Không
          </button>
        </div>
      ) : (
        <input
          type={field.type === "number" ? "number" : "text"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder || `Nhập ${field.label.toLowerCase()}`}
          className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary transition-all"
        />
      )}
    </div>
  );
}
