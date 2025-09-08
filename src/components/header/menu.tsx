"use client";

import Link from "next/link";
import type { RefObject } from "react";
import { useRef } from "react";
import { useOnClickOutside } from "usehooks-ts";
import styles from "./menu.module.css";

export function Menu() {
  const menuRef = useRef<HTMLDivElement>(null);

  function open() {
    if (!menuRef.current) return;
    menuRef.current.classList.add(styles.opened);
  }

  function close() {
    if (!menuRef.current) return;
    menuRef.current.classList.remove(styles.opened);
  }

  useOnClickOutside(menuRef as RefObject<HTMLDivElement>, close);

  return (
    <div className={styles.menu}>
      <div className={styles.menuList} ref={menuRef}>
        <h3>Menu</h3>
        <Link
          href="/"
          onClick={() => {
            if (menuRef.current)
              menuRef.current.classList.remove(styles.opened);
          }}
        >
          Home
        </Link>
        <Link
          href="/#works"
          onClick={() => {
            if (menuRef.current)
              menuRef.current.classList.remove(styles.opened);
          }}
        >
          Works
        </Link>
        <Link
          href="/#play"
          onClick={() => {
            if (menuRef.current)
              menuRef.current.classList.remove(styles.opened);
          }}
        >
          Play
        </Link>
        <Link
          href="#contact"
          onClick={() => {
            if (menuRef.current)
              menuRef.current.classList.remove(styles.opened);
          }}
        >
          Contact
        </Link>
        <hr />
        <Link
          href="https://blog.jujiyangasli.com"
          target="_blank"
          rel="noreferrer"
          className="outgoing"
          onClick={() => {
            if (menuRef.current)
              menuRef.current.classList.remove(styles.opened);
          }}
        >
          Blog
        </Link>
        <Link
          href="https://github.com/jujiyangasli"
          target="_blank"
          rel="noreferrer"
          className="outgoing"
          onClick={() => {
            if (menuRef.current)
              menuRef.current.classList.remove(styles.opened);
          }}
        >
          GitHub
        </Link>
      </div>

      {/* <div className={styles.menuListAnchor}></div> */}

      <button
        onClick={open}
        type="button"
        aria-label="Toggle Menu"
        className={styles.menuButton}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>
  );
}
