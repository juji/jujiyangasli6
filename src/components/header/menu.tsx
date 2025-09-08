"use client";

import Link from "next/link";
import type { RefObject } from "react";
import { useEffect, useRef, useState } from "react";
import { useOnClickOutside } from "usehooks-ts";
import styles from "./menu.module.css";

export function Menu() {
  const menuRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  function close() {
    setOpen(false);
  }

  function toggle() {
    setOpen((prev) => !prev);
  }

  useOnClickOutside(menuRef as RefObject<HTMLDivElement>, close);

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        close();
      }
    }

    function handleScroll() {
      close();
    }

    document.addEventListener("keydown", handleEscape);
    document.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("scroll", handleScroll);
    };

    // biome-ignore lint/correctness/useExhaustiveDependencies: close changes on every re-render and should not be used as a hook dependency
  }, [close]);

  return (
    <div className={styles.menu} ref={menuRef}>
      <div className={`${styles.menuList} ${open ? styles.opened : ""}`}>
        <h3 style={{ ["--i" as string]: 0 }}>Menu</h3>
        <Link href="/" onClick={close} style={{ ["--i" as string]: 1 }}>
          Home
        </Link>
        <Link href="/#works" onClick={close} style={{ ["--i" as string]: 2 }}>
          Works
        </Link>
        <Link href="/#play" onClick={close} style={{ ["--i" as string]: 3 }}>
          Play
        </Link>
        <Link href="#contact" onClick={close} style={{ ["--i" as string]: 4 }}>
          Contact
        </Link>
        <hr style={{ ["--i" as string]: 5 }} />
        <Link
          href="https://blog.jujiyangasli.com"
          target="_blank"
          rel="noreferrer"
          className="outgoing"
          onClick={close}
          style={{ ["--i" as string]: 6 }}
        >
          Blog
        </Link>
        <Link
          href="https://github.com/jujiyangasli"
          target="_blank"
          rel="noreferrer"
          className="outgoing"
          onClick={close}
          style={{ ["--i" as string]: 7 }}
        >
          GitHub
        </Link>
      </div>

      <button
        onClick={toggle}
        type="button"
        aria-label="Toggle Menu"
        className={`${styles.menuButton} ${open ? styles.opened : ""}`}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>
  );
}
