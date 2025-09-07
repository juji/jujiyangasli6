"use client";
import { useMotionValueEvent, useScroll } from "motion/react";
import Link from "next/link";
import { useRef } from "react";
import { getManualChange, setHeaderShown } from "@/lib/headerVisibility";
import { Brace } from "../svgs/brace";
import { Juji } from "../svgs/juji";
import { Semicolon } from "../svgs/semicolon";
import styles from "./style.module.css";

export function Header() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start end", "start start"],
  });
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (getManualChange()) {
      console.log("manual change, skip auto header show/hide");
      return;
    }

    if (latest >= 1) {
      setHeaderShown(true);
    } else {
      setHeaderShown(false);
    }
  });

  return (
    <>
      <header className={styles.header}>
        <div className={styles.content}>
          <Link href="/" aria-label="Home">
            <span className={styles.logo}>
              <Juji />
            </span>
            <span className={styles.brace}>
              <Brace />
            </span>
            <span className={styles.semicolon}>
              <Semicolon />
            </span>
          </Link>
          <button type="button" aria-label="Toggle Menu">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>
      <div ref={scrollRef} style={{ position: "fixed", top: "100vh" }}></div>
    </>
  );
}
