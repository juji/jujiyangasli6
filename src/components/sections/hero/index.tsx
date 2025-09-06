"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Brace } from "@/components/svgs/brace";
import { Juji } from "@/components/svgs/juji";
import { Semicolon } from "@/components/svgs/semicolon";
import styles from "./style.module.scss";

const colors = ["#bfe600", "#00dee6", "#fb0", "#ff67e9", "#57bcff", "#fcf122"];

export function Hero() {
  const [color, setColor] = useState("");
  useEffect(() => {
    setColor(colors[Math.floor(Math.random() * colors.length)]);
  }, []);

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

      <p className={styles.subheading}>
        <span className={styles.big}>
          Hi, I'm a
          <span className={color ? styles.hasColor : ""} style={{ color }}>
            <span>w</span>
            <span>e</span>
            <span>b</span>
            <span> </span>
            <span>d</span>
            <span>e</span>
            <span>v</span>
            <span>e</span>
            <span>l</span>
            <span>o</span>
            <span>p</span>
            <span>e</span>
            <span>r</span>
          </span>
          .
        </span>
        <span>My name is Tri Rahmat Gunadi,</span>
        <span>but people call me juji..</span>
      </p>
    </div>
  );
}
