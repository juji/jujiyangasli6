"use client";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import styles from "./menu.module.css";

export function Menu() {
  const pathname = usePathname();
  const _isHome = pathname === "/";
  const menuRef = useRef<HTMLDivElement>(null);

  function onTouchStart() {
    if (!menuRef.current) return;
    menuRef.current.classList.toggle(styles.opened);
  }

  return (
    <div className={styles.menu} ref={menuRef}>
      <button
        onTouchStart={onTouchStart}
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
