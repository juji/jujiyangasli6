"use client";

import PhotoSwipeLightbox from "@juji/photoswipe/lightbox";
import { useEffect, useRef } from "react";
import type { WorkImage } from "@/data/works/types";
import "@juji/photoswipe/style.css";
import styles from "./block-gallery.module.css";
import "@juji/photoswipe/basic-dark.css";
import { unstable_ViewTransition as ViewTransition } from "react";

interface BlockGalleryProps {
  images: WorkImage[];
  title: string;
  workId: string;
}

export function BlockGallery({ images, title, workId }: BlockGalleryProps) {
  const lightboxRef = useRef<PhotoSwipeLightbox | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      lightboxRef.current = new PhotoSwipeLightbox({
        gallery: "#block-gallery",
        children: "a",
        pswpModule: () => import("@juji/photoswipe"),
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

  useEffect(() => {
    // auto scroll
    let currentIndex = 0;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    const blockGallery = document.getElementById("block-gallery");
    const windowWidthLimit = 768;

    function listener() {
      if (timeoutId) {
        clearInterval(timeoutId);
        timeoutId = null;
      }

      if (window.innerWidth < windowWidthLimit) {
        const galleryAnchorEl = document.querySelectorAll("#block-gallery a");
        if (galleryAnchorEl.length <= 1) return;

        timeoutId = setInterval(() => {
          if (!blockGallery) return;
          currentIndex = (currentIndex + 1) % galleryAnchorEl.length;
          const targetEl = galleryAnchorEl[currentIndex] as HTMLElement;
          const centerOffset =
            (blockGallery.clientWidth - targetEl.clientWidth) / 2;
          blockGallery.scrollTo({
            left: targetEl.offsetLeft - centerOffset,
            behavior: "smooth",
          });
        }, 3000);
      } else {
        currentIndex = 0;
      }
    }

    let redoAutoScrollTimeoutId: ReturnType<typeof setTimeout> | null = null;
    function cancelAutoScroll() {
      if (window.innerWidth >= windowWidthLimit) return;

      if (timeoutId) {
        clearInterval(timeoutId);
        timeoutId = null;
      }

      if (redoAutoScrollTimeoutId) {
        clearTimeout(redoAutoScrollTimeoutId);
        redoAutoScrollTimeoutId = null;
      }

      redoAutoScrollTimeoutId = setTimeout(() => {
        redoAutoScroll();
      }, 5000); // resume auto scroll after 5 seconds of inactivity
    }

    function redoAutoScroll() {
      if (window.innerWidth >= windowWidthLimit) return;

      // get current visible image index
      const galleryAnchorEl = document.querySelectorAll("#block-gallery a");
      if (galleryAnchorEl.length <= 1) return;

      let visibleIndex = 0;
      galleryAnchorEl.forEach((el, idx) => {
        const rect = el.getBoundingClientRect();
        if (rect.left >= 0 && rect.right <= window.innerWidth) {
          visibleIndex = idx;
        }
      });

      currentIndex = visibleIndex;

      listener();
    }

    blockGallery?.addEventListener("pointerdown", cancelAutoScroll);
    window.addEventListener("resize", listener);
    listener();

    return () => {
      window.removeEventListener("resize", listener);
      blockGallery?.removeEventListener("pointerdown", cancelAutoScroll);
      if (timeoutId) {
        clearInterval(timeoutId);
        timeoutId = null;
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
                media="(width >= 500px and width < 768px)"
                srcSet={img.thumbnail}
                width={img.dimension.thumb.width}
                height={img.dimension.thumb.height}
              />
              <source
                media="(width >= 768px)"
                srcSet={img.small}
                width={img.dimension.small.width}
                height={img.dimension.small.height}
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
                  media="(width >= 500px and width < 768px)"
                  srcSet={img.thumbnail}
                  width={img.dimension.thumb.width}
                  height={img.dimension.thumb.height}
                />
                <source
                  media="(width >= 768px)"
                  srcSet={img.small}
                  width={img.dimension.small.width}
                  height={img.dimension.small.height}
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
