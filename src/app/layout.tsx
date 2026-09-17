import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Outfit } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toast";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://meggi.dev"),
  title: {
    default: "MeGGi dev — fast web apps",
    template: "%s | MeGGi dev",
  },
  description:
    "MeGGi dev builds fast web apps. Full-stack Next.js developer. Clean UI, solid architecture, no bloat.",
  applicationName: "MeGGi dev",
  authors: [{ name: "MeGGi dev" }],
  creator: "MeGGi dev",
  keywords: ["MeGGi dev", "Next.js", "React", "portfolio", "web developer"],
  alternates: { canonical: "/" },
  openGraph: {
    title: "MeGGi dev — fast web apps",
    description:
      "Full-stack Next.js developer. Clean UI, solid architecture, no bloat.",
    url: "/",
    siteName: "MeGGi dev",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MeGGi dev — fast web apps",
    description:
      "Full-stack Next.js developer. Clean UI, solid architecture, no bloat.",
  },
  icons: {
    icon: [
      { url: "/favicons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      {
        url: "/favicons/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/favicons/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    shortcut: "/favicon.ico",
    apple: [
      {
        url: "/favicons/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  manifest: "/favicons/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        outfit.variable,
      )}
    >
      <body>
        {children}

        <Toaster />
      </body>
    </html>
  );
}
