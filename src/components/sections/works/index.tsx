"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { works } from "@/data/works";
import styles from "./style.module.css";

export function Works() {
  const mousePos = useRef({
    realtime: { x: 0, y: 0 },
    current: { x: 0, y: 0 },
  });

  const mouseInside = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frm: null | number = null;
    const factor = 0.02;
    function updateFrame() {
      mousePos.current.current.x +=
        (mousePos.current.realtime.x - mousePos.current.current.x) * factor;
      mousePos.current.current.y +=
        (mousePos.current.realtime.y - mousePos.current.current.y) * factor;
      if (
        Math.abs(mousePos.current.realtime.x - mousePos.current.current.x) >
          0.1 ||
        Math.abs(mousePos.current.realtime.y - mousePos.current.current.y) > 0.1
      ) {
        frm = requestAnimationFrame(updateFrame);
      }

      const items = document.querySelectorAll(`.${styles.workContainer}`);
      items.forEach((item: Element) => {
        const i = item as HTMLElement;
        const rect = i.getBoundingClientRect();
        const x = mousePos.current.current.x - rect.left;
        const y = mousePos.current.current.y - rect.top;
        i.style.setProperty("--circle-pos-x", `${x}px`);
        i.style.setProperty("--circle-pos-y", `${y}px`);
      });
    }

    function updateMousePosition(e: MouseEvent) {
      if (!mouseInside.current) return;
      mousePos.current.realtime.x = e.clientX;
      mousePos.current.realtime.y = e.clientY;
      if (frm) cancelAnimationFrame(frm);
      updateFrame();
    }
    document.addEventListener("mousemove", updateMousePosition);

    return () => {
      document.removeEventListener("mousemove", updateMousePosition);
    };
  }, []);

  function handleMouseEnter() {
    mouseInside.current = true;
    containerRef.current?.style.setProperty("--circle-opacity", "1");
  }

  function handleMouseLeave() {
    mouseInside.current = false;
    containerRef.current?.style.setProperty("--circle-opacity", "0");
  }

  return (
    <div
      className={styles.works}
      id="works"
      role="listbox"
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <h2>Works</h2>

      <div className={styles.worksContainer}>
        {works.map((work) => (
          <div key={work.id} className={styles.workContainer}>
            <div className={styles.workItem}>
              <Link
                href={`/works/${work.id}`}
                className={styles.workLink}
                aria-label={work.title}
              ></Link>
              <picture>
                <source
                  media="(width < 500px)"
                  srcSet={work.images[0].small}
                  width={work.images[0].dimension.small.width}
                  height={work.images[0].dimension.small.height}
                />
                <source
                  media="(width < 700px)"
                  srcSet={work.images[0].thumbnail}
                  width={work.images[0].dimension.thumb.width}
                  height={work.images[0].dimension.thumb.height}
                />
                <source
                  media="(width >= 700px)"
                  srcSet={work.images[0].url}
                  width={work.images[0].dimension.image.width}
                  height={work.images[0].dimension.image.height}
                />
                <img
                  src={work.images[0].url}
                  alt={work.title}
                  loading="lazy"
                  decoding="async"
                />
              </picture>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
