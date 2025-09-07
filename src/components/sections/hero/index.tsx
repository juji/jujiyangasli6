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
          <span>
            <span className={color ? styles.hasColor : ""} style={{ color }}>
              w
            </span>
            <span className={color ? styles.hasColor : ""} style={{ color }}>
              e
            </span>
            <span className={color ? styles.hasColor : ""} style={{ color }}>
              b
            </span>
            <span className={color ? styles.hasColor : ""} style={{ color }}>
              {" "}
            </span>
            <span className={color ? styles.hasColor : ""} style={{ color }}>
              d
            </span>
            <span className={color ? styles.hasColor : ""} style={{ color }}>
              e
            </span>
            <span className={color ? styles.hasColor : ""} style={{ color }}>
              v
            </span>
            <span className={color ? styles.hasColor : ""} style={{ color }}>
              e
            </span>
            <span className={color ? styles.hasColor : ""} style={{ color }}>
              l
            </span>
            <span className={color ? styles.hasColor : ""} style={{ color }}>
              o
            </span>
            <span className={color ? styles.hasColor : ""} style={{ color }}>
              p
            </span>
            <span className={color ? styles.hasColor : ""} style={{ color }}>
              e
            </span>
            <span className={color ? styles.hasColor : ""} style={{ color }}>
              r
            </span>
            .
          </span>
        </span>
        <span>My name is Tri&nbsp;Rahmat&nbsp;Gunadi,</span>
        <span>but people call me juji..</span>
      </p>

      <p className={styles.links}>
        <Link href="/#works" className={styles.link}>
          Works
        </Link>
        <Link href="/#play" className={styles.link}>
          Play
        </Link>
        <Link href="/#techs" className={styles.link}>
          Techs
        </Link>
        <Link href="/#contact" className={styles.link}>
          Contact
        </Link>
        <Link
          href="https://blog.jujiyangasli.com"
          className={`${styles.link} outgoing`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Blog
        </Link>
      </p>

      <p className={styles.note}>
        <a
          href="https://github.com/juji/jujiyangasli6"
          target="_blank"
          rel="noopener noreferrer"
          className={`outgoing`}
        >
          Checkout the source of this site on GitHub.
        </a>
      </p>
    </div>
  );
}
