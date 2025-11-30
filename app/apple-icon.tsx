import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 120,
          background: "linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "40px",
        }}
      >
        <span
          style={{
            background: "linear-gradient(135deg, #00ff9d 0%, #8b5cf6 100%)",
            backgroundClip: "text",
            color: "transparent",
            fontWeight: "bold",
          }}
        >
          A
        </span>
      </div>
    ),
    {
      ...size,
    }
  );
}
