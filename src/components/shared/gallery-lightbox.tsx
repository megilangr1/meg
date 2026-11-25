"use client";

import Lightbox, { type Slide } from "yet-another-react-lightbox";
import Video from "yet-another-react-lightbox/plugins/video";
import "yet-another-react-lightbox/styles.css"; // v3.33: style video plugin sudah termasuk di file ini

/**
 * Diimpor lewat `next/dynamic({ ssr: false })` dari `project-media.tsx`,
 * jadi JS + CSS lightbox baru diunduh saat pengunjung membuka slide pertama.
 */
export function GalleryLightbox({
  slides,
  index,
  onClose,
}: {
  slides: Slide[];
  index: number;
  onClose: () => void;
}) {
  return (
    <Lightbox
      open
      close={onClose}
      index={index}
      slides={slides}
      plugins={[Video]}
      carousel={{ finite: true, padding: 0 }}
      animation={{ swipe: 250 }}
      controller={{ closeOnBackdropClick: true }}
      render={{ buttonPrev: slides.length > 1 ? undefined : () => null, buttonNext: slides.length > 1 ? undefined : () => null }}
    />
  );
}
