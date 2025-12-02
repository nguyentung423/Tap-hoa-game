"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Gamepad2,
  Plus,
  Edit,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Search,
  ShoppingBag,
  GripVertical,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Game {
  id: string;
  name: string;
  slug: string;
  icon: string;
  image: string | null;
  description: string | null;
  isActive: boolean;
  order: number;
  fields: unknown[];
  _count?: {
    accs: number;
  };
}

export default function AdminGamesPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/v1/admin/games");
      if (res.ok) {
        const data = await res.json();
        setGames(data.data.games || []);
      }
    } catch (error) {
      console.error("Error fetching games:", error);
      toast.error("Không thể tải danh sách games");
    } finally {
      setIsLoading(false);
    }
  };

  // Filter games
  const filteredGames = games.filter((game) =>
    game.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Toggle game active status
  const toggleGameStatus = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/v1/admin/games/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (res.ok) {
        setGames((prev) =>
          prev.map((g) =>
            g.id === id ? { ...g, isActive: !currentStatus } : g
          )
        );
        toast.success(currentStatus ? "Đã tắt game" : "Đã bật game");
      } else {
        toast.error("Không thể cập nhật trạng thái");
      }
    } catch {
      toast.error("Có lỗi xảy ra");
    }
  };

  // Delete game
  const deleteGame = async (id: string) => {
    if (!confirm("Xác nhận xóa game này?")) return;

    try {
      const res = await fetch(`/api/v1/admin/games/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setGames((prev) => prev.filter((g) => g.id !== id));
        toast.success("Đã xóa game");
      } else {
        const data = await res.json();
        toast.error(data.error || "Không thể xóa game");
      }
    } catch {
      toast.error("Có lỗi xảy ra");
    }
  };

  // Save game (add/edit)
  const handleSaveGame = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const icon = formData.get("icon") as string;
    const description = formData.get("description") as string;

    try {
      if (editingGame) {
        // Update
        const res = await fetch(`/api/v1/admin/games/${editingGame.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, icon, description }),
        });

        if (res.ok) {
          const data = await res.json();
          setGames((prev) =>
            prev.map((g) =>
              g.id === editingGame.id ? { ...g, ...data.data.game } : g
            )
          );
          toast.success("Đã cập nhật game");
          setEditingGame(null);
        } else {
          toast.error("Không thể cập nhật");
        }
      } else {
        // Create
        const res = await fetch("/api/v1/admin/games", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            slug,
            icon,
            description,
            isActive: false,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          setGames((prev) => [...prev, data.data.game]);
          toast.success("Đã thêm game mới");
          setShowAddModal(false);
        } else {
          const data = await res.json();
          toast.error(data.error || "Không thể thêm game");
        }
      }
    } catch {
      toast.error("Có lỗi xảy ra");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Quản lý Games</h1>
          <p className="text-muted-foreground">
            Quản lý danh mục game trên hệ thống
          </p>
        </div>
        <Button className="gap-2" onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4" />
          Thêm Game
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-2xl font-bold">{games.length}</p>
          <p className="text-sm text-muted-foreground">Tổng games</p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-2xl font-bold text-green-500">
            {games.filter((g) => g.isActive).length}
          </p>
          <p className="text-sm text-muted-foreground">Đang hoạt động</p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-2xl font-bold text-muted-foreground">
            {games.filter((g) => !g.isActive).length}
          </p>
          <p className="text-sm text-muted-foreground">Đã tắt</p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-2xl font-bold text-primary">
            {games.reduce((sum, g) => sum + (g._count?.accs || 0), 0)}
          </p>
          <p className="text-sm text-muted-foreground">Tổng accs</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Tìm game..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary transition-all"
        />
      </div>

      {/* Games List */}
      <div className="rounded-2xl bg-card border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 text-sm font-medium text-muted-foreground w-12">
                  #
                </th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                  Game
                </th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground hidden sm:table-cell">
                  Slug
                </th>
                <th className="text-center p-4 text-sm font-medium text-muted-foreground">
                  Accs
                </th>
                <th className="text-center p-4 text-sm font-medium text-muted-foreground">
                  Trạng thái
                </th>
                <th className="text-right p-4 text-sm font-medium text-muted-foreground">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredGames.map((game, index) => (
                <tr
                  key={game.id}
                  className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <GripVertical className="w-4 h-4 cursor-grab" />
                      <span className="text-sm">{index + 1}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-primary/10 overflow-hidden">
                        <span className="text-xl">{game.icon}</span>
                      </div>
                      <div>
                        <p className="font-medium">{game.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {game.slug}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 hidden sm:table-cell">
                    <code className="text-xs px-2 py-1 rounded bg-muted">
                      {game.slug}
                    </code>
                  </td>
                  <td className="p-4 text-center">
                    <span className="inline-flex items-center gap-1 text-sm">
                      <ShoppingBag className="w-3.5 h-3.5" />
                      {game._count?.accs || 0}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => toggleGameStatus(game.id, game.isActive)}
                      className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors",
                        game.isActive
                          ? "bg-green-500/10 text-green-500"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {game.isActive ? (
                        <>
                          <ToggleRight className="w-4 h-4" />
                          Hoạt động
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="w-4 h-4" />
                          Đã tắt
                        </>
                      )}
                    </button>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditingGame(game)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-500 hover:text-red-500 hover:bg-red-500/10"
                        onClick={() => deleteGame(game.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || editingGame) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-md bg-card border border-border rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-border">
              <h2 className="font-semibold">
                {editingGame ? "Chỉnh sửa Game" : "Thêm Game mới"}
              </h2>
            </div>
            <form className="p-4 space-y-4" onSubmit={handleSaveGame}>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Tên game
                </label>
                <input
                  type="text"
                  name="name"
                  defaultValue={editingGame?.name}
                  placeholder="VD: Liên Minh Huyền Thoại"
                  className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary"
                  required
                />
              </div>
              {!editingGame && (
                <div>
                  <label className="block text-sm font-medium mb-2">Slug</label>
                  <input
                    type="text"
                    name="slug"
                    placeholder="VD: lien-minh-huyen-thoai"
                    className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Icon (emoji)
                </label>
                <input
                  type="text"
                  name="icon"
                  defaultValue={editingGame?.icon}
                  placeholder="⚔️"
                  className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary text-center text-xl"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Mô tả</label>
                <textarea
                  name="description"
                  defaultValue={editingGame?.description || ""}
                  placeholder="Mô tả ngắn về game..."
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary resize-none"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingGame(null);
                  }}
                >
                  Hủy
                </Button>
                <Button type="submit" className="flex-1" disabled={isSaving}>
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : editingGame ? (
                    "Lưu"
                  ) : (
                    "Thêm"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
