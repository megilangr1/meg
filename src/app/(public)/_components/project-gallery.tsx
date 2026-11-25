"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import type { Slide } from "yet-another-react-lightbox";
import { Download, FileText, Play } from "lucide-react";

import { Button } from "@/components/ui/button";

const GalleryLightbox = dynamic(
  () => import("@/components/shared/gallery-lightbox").then((mod) => mod.GalleryLightbox),
  { ssr: false },
);

export type GalleryMedia = {
  path: string;
  mime: string;
  caption: string | null;
  originalName: string | null;
  size: number;
};

function bytes(size: number) {
  return size > 1024 * 1024
    ? `${(size / 1024 / 1024).toFixed(1)} MB`
    : `${Math.max(Math.round(size / 1024), 1)} KB`;
}

function downloadHref(asset: GalleryMedia) {
  const params = new URLSearchParams({ download: "1" });
  if (asset.originalName) params.set("filename", asset.originalName);
  return `/media/${asset.path}?${params}`;
}

export function ProjectGallery({
  images,
  videos,
  documents,
}: {
  images: GalleryMedia[];
  videos: GalleryMedia[];
  documents: GalleryMedia[];
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const slides = useMemo<Slide[]>(
    () => [
      ...images.map((image) => ({
        src: `/media/${image.path}`,
        alt: image.caption ?? image.originalName ?? "Gambar project",
      })),
      ...videos.map((video) => ({
        type: "video" as const,
        width: 1280,
        height: 720,
        sources: [{ src: `/media/${video.path}`, type: video.mime }],
      })),
    ],
    [images, videos],
  );

  return (
    <div className="flex flex-col gap-10">
      {images.length > 0 && (
        <section className="flex flex-col gap-4">
          <h2 className="font-display font-medium text-2xl">Galeri</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((image, index) => (
              <button
                key={image.path}
                type="button"
                onClick={() => setOpenIndex(index)}
                aria-label="Buka gambar di lightbox"
                className="group relative aspect-4/3 cursor-zoom-in overflow-hidden border border-border bg-muted/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                <Image
                  src={`/media/${image.path}`}
                  alt={image.caption ?? image.originalName ?? "Gambar project"}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                />
                {image.caption && (
                  <span className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 to-transparent p-3 text-left text-xs text-white">
                    {image.caption}
                  </span>
                )}
              </button>
            ))}
          </div>
        </section>
      )}

      {videos.length > 0 && (
        <section className="flex flex-col gap-4">
          <h2 className="font-display font-medium text-2xl">Video</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {videos.map((video, index) => (
              <button
                key={video.path}
                type="button"
                onClick={() => setOpenIndex(images.length + index)}
                aria-label="Putar video"
                className="group relative aspect-video cursor-pointer overflow-hidden border border-border bg-muted/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                <video
                  src={`/media/${video.path}`}
                  className="size-full object-cover"
                  muted
                  preload="metadata"
                />
                <span className="absolute inset-0 flex items-center justify-center bg-black/30 text-white transition-colors group-hover:bg-black/40">
                  <Play className="size-10" />
                </span>
              </button>
            ))}
          </div>
        </section>
      )}

      {documents.length > 0 && (
        <section className="flex flex-col gap-4">
          <h2 className="font-display font-medium text-2xl">Dokumen</h2>
          <ul className="flex flex-col gap-2">
            {documents.map((document) => (
              <li key={document.path}>
                <Button
                  variant="outline"
                  className="h-auto w-full justify-start gap-3 py-3 text-left"
                  render={
                    <a
                      href={downloadHref(document)}
                      download={document.originalName ?? true}
                    />
                  }
                  nativeButton={false}
                >
                  <FileText data-icon="inline-start" />
                  <span className="flex min-w-0 flex-col">
                    <span className="truncate">
                      {document.caption ?? document.originalName ?? document.path}
                    </span>
                    <span className="text-xs font-normal text-muted-foreground">
                      {bytes(document.size)}
                    </span>
                  </span>
                  <Download data-icon="inline-end" />
                </Button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {openIndex !== null && (
        <GalleryLightbox
          slides={slides}
          index={openIndex}
          onClose={() => setOpenIndex(null)}
        />
      )}
    </div>
  );
}
