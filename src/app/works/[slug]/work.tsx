"use client";

import { useEffect } from "react";
import Markdown from "react-markdown";
import type { Work } from "@/data/works/types";
import { setHeaderShown } from "@/lib/headerVisibility";
import { PhotoSwipeGallery } from "./photoswipe-gallery";

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

  return (
    <div className={styles.workPage}>
      <div className={styles.workPageContent}>
        <h1>{work.title}</h1>
        <a href={work.url} target="_blank" rel="noopener noreferrer">
          {work.url}
        </a>
        <br />
        <br />
        <div className={styles.workContentText}>
          <Markdown>{content}</Markdown>
        </div>

        <PhotoSwipeGallery images={work.images} title={work.title} />
      </div>
    </div>
  );
}
