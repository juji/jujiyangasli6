"use client";

import { useEffect, useRef } from "react";
import Markdown from "react-markdown";
import type { Work } from "@/data/works/types";
import { setHeaderShown } from "@/lib/headerVisibility";
import { LightGallery } from "./lightgallery";

import styles from "./style.module.css";

export function WorkPage({ content, work }: { content: string; work: Work }) {
  useEffect(() => {
    setHeaderShown(true, true);

    // set project color css variable on root
    document.documentElement.style.setProperty(
      "--project-color",
      work.gradientColor,
    );
  }, [work.gradientColor]);

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

        <LightGallery images={work.images} title={work.title} />
      </div>
    </div>
  );
}
