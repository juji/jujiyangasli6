"use client";

import PhotoSwipeLightbox from "photoswipe/lightbox";
import { useEffect, useRef } from "react";
import type { WorkImage } from "@/data/works/types";
import "photoswipe/style.css";
import styles from "./block-gallery.module.css";
import "./pswp.css";
import { unstable_ViewTransition as ViewTransition } from "react";

interface BlockGalleryProps {
  images: WorkImage[];
  title: string;
  workId: string;
}

function postOpenPhotoSwipe(lightbox: PhotoSwipeLightbox) {
  // Add animated class to container on arrow button clicks
  lightbox.on("openingAnimationEnd", () => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    document
      .querySelectorAll(
        ".pswp__button--arrow--prev, .pswp__button--arrow--next",
      )
      .forEach((btn) => {
        (btn as HTMLElement).addEventListener("pointerdown", (e) => {
          e.preventDefault();
          if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
            document
              .querySelector(".pswp__container")
              ?.classList.remove("animated");
          }

          document.querySelector(".pswp__container")?.classList.add("animated");
        });
        (btn as HTMLElement).addEventListener("pointerup", (e) => {
          e.preventDefault();
          timeoutId = setTimeout(() => {
            document
              .querySelector(".pswp__container")
              ?.classList.remove("animated");
            timeoutId = null;
          }, 500);
        });
      });
  });
}

export function BlockGallery({ images, title, workId }: BlockGalleryProps) {
  const lightboxRef = useRef<PhotoSwipeLightbox | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      lightboxRef.current = new PhotoSwipeLightbox({
        gallery: "#block-gallery",
        children: "a",
        pswpModule: () => import("photoswipe"),
      });

      postOpenPhotoSwipe(lightboxRef.current);

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
          {idx ? (
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
          ) : (
            <ViewTransition name={`work-transition-${workId}`}>
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
            </ViewTransition>
          )}
        </a>
      ))}
    </div>
  );
}
