"use client";

import PhotoSwipeLightbox from "photoswipe/lightbox";
import { useEffect, useRef } from "react";
import type { WorkImage } from "@/data/works/types";
import "photoswipe/style.css";
import styles from "./block-gallery.module.css";
import "./pswp.css";

interface BlockGalleryProps {
  images: WorkImage[];
  title: string;
}

export function BlockGallery({ images, title }: BlockGalleryProps) {
  const lightboxRef = useRef<PhotoSwipeLightbox | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      lightboxRef.current = new PhotoSwipeLightbox({
        gallery: "#block-gallery",
        children: "a",
        pswpModule: () => import("photoswipe"),
      });

      lightboxRef.current.on("openingAnimationEnd", () => {
        document.querySelector(".pswp__container")?.classList.add("stabilized");
      });

      lightboxRef.current.on("closingAnimationStart", () => {
        document
          .querySelector(".pswp__container")
          ?.classList.remove("stabilized");
      });

      lightboxRef.current.init();
    }

    return () => {
      if (lightboxRef.current) {
        lightboxRef.current.destroy();
        lightboxRef.current = null;
      }
    };
  }, []);

  return (
    <div id="block-gallery" className={styles.blockGallery}>
      {images.map((img, idx) => (
        <a
          key={img.url}
          href={img.url}
          data-pswp-width={img.dimension.image.width}
          data-pswp-height={img.dimension.image.height}
          data-cropped="true"
          target="_blank"
          rel="noreferrer"
        >
          <picture>
            <source
              media="(width < 500px)"
              srcSet={img.small}
              width={img.dimension.small.width}
              height={img.dimension.small.height}
            />
            <source
              media="(width >= 500px)"
              srcSet={img.thumbnail}
              width={img.dimension.thumb.width}
              height={img.dimension.thumb.height}
            />
            <img
              src={img.url}
              alt={`${title} - ${img.title || `Image ${idx + 1}`}`}
              loading="lazy"
              decoding="async"
            />
          </picture>
        </a>
      ))}
    </div>
  );
}
