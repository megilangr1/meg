"use client";

import { useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { Slide } from "yet-another-react-lightbox";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowDown,
  ArrowUp,
  Download,
  FileText,
  ImageOff,
  Trash2,
  Upload,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Spinner } from "@/components/ui/spinner";
import { doAlert } from "@/helpers/client/client.helper";
import { PROJECT_NETWORK_ERROR_MESSAGE } from "@/modules/project/project.errors";

const GalleryLightbox = dynamic(
  () => import("@/components/shared/gallery-lightbox").then((mod) => mod.GalleryLightbox),
  { ssr: false },
);

export type ProjectAssetRow = {
  id: string;
  kind: "image" | "video" | "document";
  path: string;
  mime: string;
  caption: string | null;
  sortOrder: number;
  originalName: string | null;
  size: number;
};

type MediaKind = ProjectAssetRow["kind"];

const GALLERIES: {
  kind: MediaKind;
  title: string;
  hint: string;
  accept: string;
}[] = [
  {
    kind: "image",
    title: "Galeri Gambar",
    hint: "jpeg, png, webp, avif · maks 20 MB per file",
    accept: "image/jpeg,image/png,image/webp,image/avif",
  },
  {
    kind: "video",
    title: "Galeri Video",
    hint: "mp4, webm · maks 20 MB per file",
    accept: "video/mp4,video/webm",
  },
  {
    kind: "document",
    title: "Dokumen",
    hint: "pdf saja · maks 20 MB per file",
    accept: "application/pdf",
  },
];

async function request(url: string, init: RequestInit) {
  const response = await fetch(url, init);
  const body = (await response.json().catch(() => ({}))) as { error?: string };
  if (!response.ok) throw new Error(body.error ?? "Permintaan gagal.");
}

/** URL unduhan: `?download=1` membuat route /media mengirim Content-Disposition attachment. */
function downloadHref(asset: ProjectAssetRow) {
  const params = new URLSearchParams({ download: "1" });
  if (asset.originalName) params.set("filename", asset.originalName);
  return `/media/${asset.path}?${params}`;
}

function bytes(size: number) {
  return size > 1024 * 1024
    ? `${(size / 1024 / 1024).toFixed(1)} MB`
    : `${Math.max(Math.round(size / 1024), 1)} KB`;
}

export function ProjectMedia({
  projectId,
  banner,
  assets,
}: {
  projectId: string;
  banner: { path: string | null; alt: string | null };
  assets: ProjectAssetRow[];
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const imageAssets = useMemo(
    () => assets.filter((asset) => asset.kind === "image"),
    [assets],
  );
  const videoAssets = useMemo(
    () => assets.filter((asset) => asset.kind === "video"),
    [assets],
  );

  // Urutan slide = banner, gambar, video. Slide dokumen tidak ikut (pdf tidak dirender lightbox).
  const slides = useMemo<Slide[]>(
    () => [
      ...(banner.path
        ? [{ src: `/media/${banner.path}`, alt: banner.alt ?? "Banner project" }]
        : []),
      ...imageAssets.map((asset) => ({
        src: `/media/${asset.path}`,
        alt: asset.caption ?? asset.originalName ?? "Gambar project",
      })),
      ...videoAssets.map((asset) => ({
        type: "video" as const,
        width: 1280,
        height: 720,
        sources: [{ src: `/media/${asset.path}`, type: asset.mime }],
      })),
    ],
    [banner, imageAssets, videoAssets],
  );

  const imageIndex = (position: number) => (banner.path ? 1 : 0) + position;
  const videoIndex = (position: number) =>
    (banner.path ? 1 : 0) + imageAssets.length + position;

  async function run(key: string, task: () => Promise<void>) {
    setBusy(key);
    try {
      await task();
      router.refresh();
    } catch (error) {
      doAlert(error instanceof Error ? error.message : PROJECT_NETWORK_ERROR_MESSAGE);
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <BannerCard
        projectId={projectId}
        banner={banner}
        run={run}
        busy={busy}
        onOpen={banner.path ? () => setOpenIndex(0) : undefined}
      />

      {GALLERIES.map((gallery) => (
        <GalleryCard
          key={gallery.kind}
          gallery={gallery}
          projectId={projectId}
          assets={assets.filter((asset) => asset.kind === gallery.kind)}
          run={run}
          busy={busy}
          onOpen={
            gallery.kind === "image"
              ? (position) => setOpenIndex(imageIndex(position))
              : gallery.kind === "video"
                ? (position) => setOpenIndex(videoIndex(position))
                : undefined
          }
        />
      ))}

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

/** Tombol pilih file: input native disembunyikan supaya tampilannya seragam dan nama file bisa dipotong rapi. */
function FilePicker({
  accept,
  fileRef,
  fileName,
  onPick,
  disabled,
}: {
  accept: string;
  fileRef: React.RefObject<HTMLInputElement | null>;
  fileName: string | null;
  onPick: (name: string | null) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-1">
      <input
        ref={fileRef}
        type="file"
        accept={accept}
        className="sr-only"
        disabled={disabled}
        onChange={(event) => onPick(event.target.files?.[0]?.name ?? null)}
      />
      <Button
        type="button"
        variant="outline"
        className="w-full justify-start gap-2"
        disabled={disabled}
        onClick={() => fileRef.current?.click()}
      >
        <Upload data-icon="inline-start" />
        <span className="truncate">{fileName ?? "Pilih file"}</span>
      </Button>
    </div>
  );
}

function BannerCard({
  projectId,
  banner,
  run,
  busy,
  onOpen,
}: {
  projectId: string;
  banner: { path: string | null; alt: string | null };
  run: (key: string, task: () => Promise<void>) => Promise<void>;
  busy: string | null;
  onOpen?: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  return (
    <Card className="gap-0">
      <CardHeader className="border-b">
        <CardTitle>Banner</CardTitle>
        <CardDescription>Gambar utama di halaman detail project.</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 p-4 lg:flex-row lg:items-start">
        {banner.path ? (
          <button
            type="button"
            onClick={onOpen}
            aria-label="Buka banner di lightbox"
            className="relative aspect-video w-full cursor-zoom-in overflow-hidden rounded-lg border focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none lg:w-64 lg:shrink-0"
          >
            <Image
              src={`/media/${banner.path}`}
              alt={banner.alt ?? "Banner project"}
              fill
              sizes="(max-width: 1024px) 100vw, 256px"
              className="object-cover"
            />
          </button>
        ) : (
          <Empty className="w-full border lg:w-64 lg:shrink-0">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <ImageOff />
              </EmptyMedia>
              <EmptyTitle>Belum ada banner</EmptyTitle>
              <EmptyDescription>Unggah satu gambar.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}

        <div className="flex w-full min-w-0 flex-col gap-2">
          <Input placeholder="Alt text banner (opsional)" defaultValue={banner.alt ?? ""} />
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <FilePicker
              accept="image/jpeg,image/png,image/webp,image/avif"
              fileRef={fileRef}
              fileName={fileName}
              onPick={setFileName}
              disabled={busy === "banner-upload"}
            />
            <Button
              type="button"
              className="w-full sm:w-auto"
              disabled={busy === "banner-upload"}
              onClick={() =>
                run("banner-upload", async () => {
                  const file = fileRef.current?.files?.[0];
                  if (!file) throw new Error("Pilih gambar dulu.");
                  const body = new FormData();
                  body.set("file", file);
                  body.set("alt", "");
                  await request(`/api/projects/${projectId}/banner`, { method: "POST", body });
                  if (fileRef.current) fileRef.current.value = "";
                  setFileName(null);
                  doAlert("Banner disimpan", 1);
                })
              }
            >
              {busy === "banner-upload" ? (
                <Spinner data-icon="inline-start" />
              ) : (
                <Upload data-icon="inline-start" />
              )}
              Unggah
            </Button>
            {banner.path && (
              <Button
                type="button"
                variant="destructive"
                className="w-full sm:w-auto"
                disabled={busy === "banner-delete"}
                onClick={() =>
                  run("banner-delete", async () => {
                    await request(`/api/projects/${projectId}/banner`, { method: "DELETE" });
                    doAlert("Banner dilepas", 1);
                  })
                }
              >
                <Trash2 data-icon="inline-start" />
                Lepas
              </Button>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            jpeg, png, webp, avif · maks 20 MB
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function GalleryCard({
  gallery,
  projectId,
  assets,
  run,
  busy,
  onOpen,
}: {
  gallery: (typeof GALLERIES)[number];
  projectId: string;
  assets: ProjectAssetRow[];
  run: (key: string, task: () => Promise<void>) => Promise<void>;
  busy: string | null;
  onOpen?: (position: number) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const captionRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  return (
    <Card className="gap-0">
      <CardHeader className="border-b">
        <CardTitle>{gallery.title}</CardTitle>
        <CardDescription>
          {assets.length} file · {gallery.hint}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-3 p-4">
        <div className="flex flex-col gap-2 rounded-lg border border-dashed p-3 sm:flex-row sm:items-center">
          <FilePicker
            accept={gallery.accept}
            fileRef={fileRef}
            fileName={fileName}
            onPick={setFileName}
            disabled={busy === `${gallery.kind}-upload`}
          />
          <Input
            ref={captionRef}
            placeholder="Keterangan (opsional)"
            className="w-full sm:max-w-56"
          />
          <Button
            type="button"
            className="w-full sm:w-auto"
            disabled={busy === `${gallery.kind}-upload`}
            onClick={() =>
              run(`${gallery.kind}-upload`, async () => {
                const file = fileRef.current?.files?.[0];
                if (!file) throw new Error("Pilih file dulu.");
                const body = new FormData();
                body.set("file", file);
                body.set("caption", captionRef.current?.value ?? "");
                await request(`/api/projects/${projectId}/assets`, { method: "POST", body });
                if (fileRef.current) fileRef.current.value = "";
                if (captionRef.current) captionRef.current.value = "";
                setFileName(null);
                doAlert(`${gallery.title}: file diunggah`, 1);
              })
            }
          >
            {busy === `${gallery.kind}-upload` ? (
              <Spinner data-icon="inline-start" />
            ) : (
              <Upload data-icon="inline-start" />
            )}
            Unggah
          </Button>
        </div>

        {assets.length === 0 ? (
          <Empty className="py-8">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FileText />
              </EmptyMedia>
              <EmptyTitle>Belum ada file</EmptyTitle>
              <EmptyDescription>{gallery.hint}</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <ItemGroup>
            {assets.map((asset, index) => (
              <Item
                key={asset.id}
                variant="outline"
                className="flex-col items-stretch gap-3 sm:flex-row sm:items-center"
              >
                <ItemMedia variant="image" className="self-start">
                  {onOpen && asset.kind !== "document" ? (
                    <button
                      type="button"
                      onClick={() => onOpen(index)}
                      aria-label={`Buka ${asset.kind === "video" ? "video" : "gambar"} di lightbox`}
                      className="cursor-zoom-in rounded-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                    >
                      <AssetThumb asset={asset} />
                    </button>
                  ) : asset.kind === "document" ? (
                    <a
                      href={downloadHref(asset)}
                      download={asset.originalName ?? true}
                      aria-label={`Unduh ${asset.originalName ?? "dokumen"}`}
                      className="cursor-pointer rounded-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                    >
                      <AssetThumb asset={asset} />
                    </a>
                  ) : (
                    <AssetThumb asset={asset} />
                  )}
                </ItemMedia>

                <ItemContent className="min-w-0">
                  <ItemTitle className="w-full">
                    <AssetCaption projectId={projectId} asset={asset} run={run} busy={busy} />
                  </ItemTitle>
                  <ItemDescription className="truncate">
                    {asset.originalName ?? asset.path} · {bytes(asset.size)}
                  </ItemDescription>
                </ItemContent>

                <ItemActions className="justify-end gap-1 sm:justify-start">
                  {asset.kind === "document" && (
                    <Button
                      size="icon-sm"
                      variant="outline"
                      aria-label="Unduh file"
                      render={
                        <a
                          href={downloadHref(asset)}
                          download={asset.originalName ?? true}
                        />
                      }
                      nativeButton={false}
                    >
                      <Download />
                    </Button>
                  )}
                  <Button
                    size="icon-sm"
                    variant="outline"
                    aria-label="Naikkan urutan"
                    disabled={index === 0 || busy !== null}
                    onClick={() =>
                      run(`move-${asset.id}`, () => reorder(projectId, assets, index, index - 1))
                    }
                  >
                    <ArrowUp />
                  </Button>
                  <Button
                    size="icon-sm"
                    variant="outline"
                    aria-label="Turunkan urutan"
                    disabled={index === assets.length - 1 || busy !== null}
                    onClick={() =>
                      run(`move-${asset.id}`, () => reorder(projectId, assets, index, index + 1))
                    }
                  >
                    <ArrowDown />
                  </Button>
                  <Button
                    size="icon-sm"
                    variant="destructive"
                    aria-label="Hapus file"
                    disabled={busy !== null}
                    onClick={() =>
                      run(`delete-${asset.id}`, async () => {
                        await request(`/api/projects/${projectId}/assets/${asset.id}`, {
                          method: "DELETE",
                        });
                        doAlert("File dihapus dari daftar", 1);
                      })
                    }
                  >
                    <Trash2 />
                  </Button>
                </ItemActions>
              </Item>
            ))}
          </ItemGroup>
        )}
      </CardContent>
    </Card>
  );
}

function AssetThumb({ asset }: { asset: ProjectAssetRow }) {
  if (asset.kind === "image")
    return (
      <Image
        src={`/media/${asset.path}`}
        alt={asset.caption ?? asset.originalName ?? ""}
        width={56}
        height={56}
        className="size-14 rounded-md object-cover"
      />
    );

  if (asset.kind === "video")
    return (
      <video
        src={`/media/${asset.path}`}
        className="size-14 rounded-md object-cover"
        muted
        preload="metadata"
      />
    );

  return <FileText className="text-muted-foreground" />;
}

/** Kirim urutan penuh sekaligus — server menulis dalam satu transaksi, jadi tidak bisa setengah tertukar. */
async function reorder(projectId: string, assets: ProjectAssetRow[], from: number, to: number) {
  const ids = assets.map((asset) => asset.id);
  [ids[from], ids[to]] = [ids[to], ids[from]];

  await request(`/api/projects/${projectId}/assets/reorder`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids }),
  });
}

function AssetCaption({
  projectId,
  asset,
  run,
  busy,
}: {
  projectId: string;
  asset: ProjectAssetRow;
  run: (key: string, task: () => Promise<void>) => Promise<void>;
  busy: string | null;
}) {
  const [value, setValue] = useState(asset.caption ?? "");
  const dirty = value.trim() !== (asset.caption ?? "");

  return (
    <span className="flex w-full flex-col gap-2 sm:flex-row sm:items-center">
      <Input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Keterangan file"
        aria-label="Keterangan file"
        className="min-w-0 flex-1"
      />
      {dirty && (
        <Button
          size="sm"
          className="w-full sm:w-auto"
          disabled={busy === `caption-${asset.id}`}
          onClick={() =>
            run(`caption-${asset.id}`, async () => {
              await request(`/api/projects/${projectId}/assets/${asset.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ caption: value }),
              });
              doAlert("Keterangan disimpan", 1);
            })
          }
        >
          Simpan
        </Button>
      )}
    </span>
  );
}
