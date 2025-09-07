"use client";

import lightGallery from "lightgallery";
import lgZoom from "lightgallery/plugins/zoom";
import { useEffect, useRef } from "react";
import type { WorkImage } from "@/data/works/types";
import styles from "./lightgallery.module.css";

// Import lightgallery styles
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css";

interface LightGalleryProps {
  images: WorkImage[];
  title: string;
}

export function LightGallery({ images, title }: LightGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lgRef = useRef<ReturnType<typeof lightGallery> | null>(null);

  useEffect(() => {
    if (containerRef.current && !lgRef.current) {
      lgRef.current = lightGallery(containerRef.current, {
        plugins: [lgZoom],
        speed: 500,
        hideScrollbar: true,
        closable: true,
        showMaximizeIcon: false,
        slideDelay: 400,
        autoplayFirstVideo: false,
        loop: true,
        controls: true,
        thumbWidth: 100,
        thumbHeight: "100",
        thumbMargin: 5,
        appendSubHtmlTo: ".lg-item",
        keyPress: true,
        escKey: true,
        swipeThreshold: 50,
        enableDrag: true,
        // Zoom settings
        zoom: true,
        scale: 1,
        actualSize: true,
        showZoomInOutIcons: true,
        enableZoomAfter: 300,
        zoomFromOrigin: true,
        allowMediaOverlap: false,
        toggleThumb: true,
        mobileSettings: {
          controls: false,
          showCloseIcon: true,
          download: false,
          zoom: true,
          scale: 1,
          actualSize: false,
          showZoomInOutIcons: false,
        },
      });
    }

    return () => {
      if (lgRef.current) {
        lgRef.current.destroy();
        lgRef.current = null;
      }
    };
  }, []);

  return (
    <div ref={containerRef} className={styles.lightgallery}>
      {images.map((img, idx) => (
        <a
          key={img.url}
          href={img.url}
          data-lg-size={`${img.dimension.image.width}-${img.dimension.image.height}`}
          data-src={img.url}
          data-thumb={img.thumbnail}
          target="_blank"
          rel="noreferrer"
          data-sub-html={`<h4>${img.title || `Image ${idx + 1}`}</h4><p>${title}</p>`}
        >
          <picture>
            <source
              media="(width < 500px)"
              srcSet={img.small}
              width={img.dimension.small.width}
              height={img.dimension.small.height}
            />
            <source
              media="(width < 700px)"
              srcSet={img.thumbnail}
              width={img.dimension.thumb.width}
              height={img.dimension.thumb.height}
            />
            <source
              media="(width >= 700px)"
              srcSet={img.url}
              width={img.dimension.image.width}
              height={img.dimension.image.height}
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
