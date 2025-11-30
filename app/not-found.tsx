import Link from "next/link";
import { Home, Search, ArrowLeft, Gamepad2 } from "lucide-react";
import { Button } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center max-w-lg">
        {/* 404 Graphic */}
        <div className="relative mb-8">
          <div className="text-[150px] md:text-[200px] font-bold leading-none text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary opacity-20">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 backdrop-blur-sm flex items-center justify-center border border-primary/30">
              <Gamepad2 className="w-12 h-12 text-primary" />
            </div>
          </div>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold mb-3">
          Trang không tồn tại
        </h1>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Có vẻ như bạn đã lạc vào một trang không tồn tại. Trang này có thể đã
          bị xóa hoặc bạn đã nhập sai địa chỉ.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild className="gap-2">
            <Link href="/">
              <Home className="w-4 h-4" />
              Về trang chủ
            </Link>
          </Button>
          <Button variant="outline" asChild className="gap-2">
            <Link href="/acc">
              <Search className="w-4 h-4" />
              Tìm tài khoản
            </Link>
          </Button>
        </div>

        {/* Quick Links */}
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground mb-4">
            Hoặc khám phá acc game:
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Link
              href="/acc?game=lien-quan"
              className="px-3 py-1.5 rounded-full text-sm bg-primary text-primary-foreground hover:bg-primary/80 transition-colors"
            >
              Liên Quân Mobile
            </Link>
            {[
              { name: "LMHT", soon: true },
              { name: "Genshin", soon: true },
              { name: "Valorant", soon: true },
            ].map((game) => (
              <span
                key={game.name}
                className="px-3 py-1.5 rounded-full text-sm bg-card border border-border opacity-50 cursor-not-allowed flex items-center gap-1"
              >
                {game.name}
                <span className="px-1 py-0.5 rounded text-[9px] bg-amber-500/20 text-amber-500 font-bold">
                  Soon
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
