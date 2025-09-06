import Link from "next/link";
import { Brace } from "@/components/svgs/brace";

import { Juji } from "@/components/svgs/juji";
import { Semicolon } from "@/components/svgs/semicolon";
import styles from "./style.module.css";

export function Hero() {
  return (
    <div className={styles.hero}>
      <h1 className={styles.heading} aria-label="Juji, Web Developer">
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
      </h1>
    </div>
  );
}
