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
          padding: "64px",
          background: "#121110",
          color: "#f2eee5",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid #322e28",
            paddingBottom: 20,
          }}
        >
          <span style={{ fontSize: 24, letterSpacing: 4 }}>
            {siteConfig.name.toUpperCase()}
          </span>
          <span
            style={{
              fontSize: 20,
              color: "#a39b8d",
              fontFamily: "monospace",
              letterSpacing: 2,
            }}
          >
            {siteConfig.location.toUpperCase()}
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <span
            style={{
              fontSize: 78,
              lineHeight: 1,
              letterSpacing: -2,
              maxWidth: 980,
            }}
          >
            Sistem web, dari database sampai production.
          </span>
          <span
            style={{
              fontSize: 26,
              color: "#a39b8d",
              fontFamily: "monospace",
              letterSpacing: 1,
            }}
          >
            Laravel · MySQL · REST API · React/Next.js · Linux
          </span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid #322e28",
            paddingTop: 20,
            color: "#a39b8d",
            fontFamily: "monospace",
            fontSize: 20,
          }}
        >
          <span>{siteConfig.url.replace(/^https?:\/\//, "")}</span>
          <span style={{ color: "#f08a62" }}>→</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
