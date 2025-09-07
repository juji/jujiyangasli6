"use client";

import { useEffect, useRef } from "react";
import Markdown from "react-markdown";
import type { Work } from "@/data/works/types";
import { setHeaderShown } from "@/lib/headerVisibility";
import { BlockGallery } from "./block-gallery";

import styles from "./style.module.css";

export function WorkPage({ content, work }: { content: string; work: Work }) {
  useEffect(() => {
    setHeaderShown(true, true);

    // set project color css variable on root
    document.documentElement.style.setProperty(
      "--project-color",
      work.gradientColor,
    );

    return () => {
      setHeaderShown(false, false);
    };
  }, [work.gradientColor]);

  useEffect(() => {
    // scroll to top on mount
    window.scrollTo(0, 0);
  }, []);

  const workTextRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onResize() {
      if (!workTextRef.current) return;
      const rect = workTextRef.current.getBoundingClientRect();
      const vh = Math.max(
        document.documentElement.clientHeight || 0,
        window.innerHeight || 0,
      );
      if (rect.bottom > vh) {
        console.log("setting top sticky", rect.bottom, vh);
        workTextRef.current.style.setProperty(
          "--top-sticky-offset",
          `-${rect.bottom - vh + 48}px`,
        );
      } else {
        console.log("resetting top sticky", rect.bottom, vh);
        workTextRef.current.style.setProperty("--top-sticky-offset", `0px`);
      }
    }

    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div className={styles.workPage}>
      <div className={styles.workPageContent}>
        <div className={styles.workText} ref={workTextRef}>
          <h1>{work.title}</h1>
          <a href={work.url} target="_blank" rel="noopener noreferrer">
            {work.url}
          </a>
          <br />
          <br />
          <div className={styles.workContentText}>
            <Markdown>{content}</Markdown>
          </div>
        </div>
        <div className={styles.workGallery}>
          <BlockGallery images={work.images} title={work.title} />
        </div>
      </div>
    </div>
  );
}
