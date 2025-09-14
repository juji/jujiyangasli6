"use client";

import { useEffect, useRef } from "react";
import Markdown from "react-markdown";
import rehypeExternalLinks from "rehype-external-links";
import type { Work } from "@/data/works/types";
import { setHeaderShown } from "@/lib/headerVisibility";
import { BlockGallery } from "./block-gallery";

import styles from "./style.module.css";

const externalLinks = () =>
  rehypeExternalLinks({ target: "_blank", rel: ["noopener", "noreferrer"] });

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
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 200);
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
        workTextRef.current.style.setProperty(
          "--top-sticky-offset",
          `calc(-${rect.bottom - vh}px + var(--top-sticky-margin))`,
        );
      } else {
        workTextRef.current.style.setProperty("--top-sticky-offset", `0px`);
      }
    }

    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <main className={styles.workPage}>
      <div className={styles.workPageContent}>
        <div className={styles.workText} ref={workTextRef}>
          <h3>{work.title}</h3>
          <a href={work.url} target="_blank" rel="noopener noreferrer">
            {work.url}
          </a>
          <br />
          <br />
          <div className={styles.workContentText}>
            <Markdown rehypePlugins={[externalLinks]}>{content}</Markdown>
          </div>
          ``
        </div>
        <div className={styles.workGallery}>
          <BlockGallery images={work.images} title={work.title} />
        </div>
      </div>
    </main>
  );
}
