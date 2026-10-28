import { ImageResponse } from "next/og";

import { siteConfig } from "@/lib/site";

export const alt = siteConfig.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          padding: "72px",
          background: "#09090b",
          color: "#fafafa",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: 999,
              background: "#f97316",
            }}
          />
          <span style={{ fontSize: 28, letterSpacing: -0.5 }}>
            {siteConfig.name}
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <span
            style={{
              fontSize: 72,
              fontWeight: 700,
              letterSpacing: -2,
              lineHeight: 1.05,
            }}
          >
            Fast web apps.
          </span>
          <span style={{ fontSize: 30, color: "#a1a1aa", maxWidth: 900 }}>
            Full-stack Next.js developer. Clean UI, solid architecture, no
            bloat.
          </span>
        </div>

        <span style={{ fontSize: 24, color: "#71717a" }}>
          {siteConfig.url.replace(/^https?:\/\//, "")}
        </span>
      </div>
    ),
    { ...size },
  );
}
