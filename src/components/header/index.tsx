"use client";
import { useMotionValueEvent, useScroll } from "motion/react";
import Link from "next/link";
import { usePathname /* useRouter */ } from "next/navigation";
import { useRef } from "react";
import { getManualChange, setHeaderShown } from "@/lib/headerVisibility";
import { Brace } from "../svgs/brace";
import { Juji } from "../svgs/juji";
import { Semicolon } from "../svgs/semicolon";
import { Menu } from "./menu";
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

    if (latest >= 0.5) {
      setHeaderShown(true);
    } else {
      setHeaderShown(false);
    }
  });

  const pathname = usePathname();
  // const router = useRouter();
  const isHome = pathname === "/";
  // function goBack() {
  //   // if (typeof window === "undefined") return;
  //   // window.history.back();
  //   router.back();
  // }

  return (
    <>
      <header className={styles.header}>
        <div className={styles.content}>
          <div className={styles.left}>
            <Link
              // just a quick way to go back to home, while preserving the view transition
              // ideally we would use router.back() or window.history.back()
              // but the view transition won't work if we use history.back or router.back
              // i guess this is the way for react? hopefully something better in the future
              // like, make it work with the native history.back ... like svelte does
              href="/#work"
              // onClick={goBack}
              aria-label="go back"
              type="button"
              className={`${styles.backButton} ${isHome ? "" : styles.visible}`}
            >
              <svg
                height="16"
                strokeLinejoin="round"
                viewBox="0 0 16 16"
                width="16"
                aria-hidden="true"
              >
                <title>Back arrow</title>
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M5.50001 1.93933L6.03034 2.46966L10.8536 7.29288C11.2441 7.68341 11.2441 8.31657 10.8536 8.7071L6.03034 13.5303L5.50001 14.0607L4.43935 13L4.96968 12.4697L9.43935 7.99999L4.96968 3.53032L4.43935 2.99999L5.50001 1.93933Z"
                  fill="currentColor"
                ></path>
              </svg>
            </Link>
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
          </div>
          <Menu />
        </div>
      </header>
      <div ref={scrollRef} style={{ position: "fixed", top: "100vh" }}></div>
    </>
  );
}
