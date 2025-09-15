"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Brace } from "@/components/svgs/brace";
import { Juji } from "@/components/svgs/juji";
import { Semicolon } from "@/components/svgs/semicolon";
import styles from "./style.module.css";

const colors = ["#bfe600", "#00dee6", "#fb0", "#ff67e9", "#57bcff", "#fcf122"];
const webDeveloper = "web developer"
  .split("")
  .map((v) => ({ char: v, id: Math.random().toString(36).substring(2, 9) }));

export function Hero() {
  const [color, setColor] = useState("");
  useEffect(() => {
    setColor(colors[Math.floor(Math.random() * colors.length)]);
  }, []);

  return (
    <section className={styles.hero}>
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
            {webDeveloper.map((char, index) => (
              <span
                key={`${char.id}`}
                className={color ? styles.hasColor : ""}
                style={{ color, "--index": index + 1 } as React.CSSProperties}
              >
                {char.char}
              </span>
            ))}
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
    </section>
  );
}
