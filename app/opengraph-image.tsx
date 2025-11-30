import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export const alt = "Tạp hoá game - Chợ Mua Bán Acc Game Uy Tín";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Logo */}
        <div
          style={{
            fontSize: 80,
            fontWeight: "bold",
            background: "linear-gradient(135deg, #00ff9d 0%, #8b5cf6 100%)",
            backgroundClip: "text",
            color: "transparent",
            marginBottom: 20,
          }}
        >
          Tạp hoá game
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 36,
            color: "#a1a1aa",
          }}
        >
          Chợ Mua Bán Acc Game Uy Tín
        </div>

        {/* Stats */}
        <div
          style={{
            display: "flex",
            gap: 80,
            marginTop: 60,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <span
              style={{ fontSize: 48, color: "#00ff9d", fontWeight: "bold" }}
            >
              10K+
            </span>
            <span style={{ fontSize: 20, color: "#71717a" }}>Tài khoản</span>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <span
              style={{ fontSize: 48, color: "#8b5cf6", fontWeight: "bold" }}
            >
              5K+
            </span>
            <span style={{ fontSize: 20, color: "#71717a" }}>Giao dịch</span>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <span
              style={{ fontSize: 48, color: "#00ff9d", fontWeight: "bold" }}
            >
              99%
            </span>
            <span style={{ fontSize: 20, color: "#71717a" }}>Hài lòng</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
