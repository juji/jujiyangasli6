"use client";
import { useRef } from "react";
import { techs } from "@/data/techs/data.server";
import styles from "./style.module.css";

const borderColors = [
  "#f97316",
  "#eab308",
  "#10b981",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
];

export function Techs() {
  const containerRef = useRef<HTMLDivElement>(null);

  function setBorderColor() {
    const index = Math.floor(Math.random() * borderColors.length);
    containerRef.current?.style.setProperty(
      "--border-color",
      borderColors[index % borderColors.length],
    );
  }

  function noHover() {
    return (
      !window.matchMedia("(hover: none)") ||
      window.matchMedia("(hover: none)").matches
    );
  }

  function onMouseEnter(e: React.MouseEvent) {
    if (noHover()) return true;

    const anchor = e.currentTarget as HTMLAnchorElement;
    const bound = anchor.getBoundingClientRect();

    // use height, since we have overflown children
    // it's a square
    let relativeMouseX = (e.clientX - bound.x) / bound.height;
    anchor.style.setProperty("--relative-mouse-x", `${relativeMouseX}`);
    function onMove(mouse: MouseEvent) {
      relativeMouseX = (mouse.clientX - bound.x) / bound.height;
      anchor.style.setProperty("--relative-mouse-x", `${relativeMouseX}`);
    }

    function onOut(mouse: MouseEvent) {
      const relativeMouse = (mouse.clientX - bound.x) / bound.height;
      if (relativeMouse < 0.5)
        anchor.style.setProperty("--relative-mouse-x", "0");
      else anchor.style.setProperty("--relative-mouse-x", "1");
      window.removeEventListener("mousemove", onMove);
      anchor.removeEventListener("mouseleave", onOut);
    }

    window.addEventListener("mousemove", onMove);
    anchor.addEventListener("mouseleave", onOut);
  }

  return (
    <>
      {/* biome-ignore lint/a11y/noSvgWithoutTitle: This SVG is purely decorative and used for filter effects */}
      <svg xmlns="http://www.w3.org/2000/svg" className={styles.svgFilter}>
        <filter id="gootech">
          <feGaussianBlur
            in="SourceGraphic"
            stdDeviation="1"
            result="blurtech"
          />
          <feColorMatrix
            in="blurtech"
            type="matrix"
            values="1 0 0 0 0  
                  0 1 0 0 0  
                  0 0 1 0 0  
                  0 0 0 7 -2"
          />
          {/* <!-- 0 0 0 6 -2 is realistic --> */}
          {/* <!-- 0 0 0 7 -2 is more dreamy --> */}
        </filter>
      </svg>
      {/* biome-ignore lint/a11y/noStaticElementInteractions: This section is interactive and requires mouse events */}
      <section
        onMouseEnter={setBorderColor}
        className={styles.techs}
        ref={containerRef}
        id="techs"
      >
        <h2>Techs</h2>
        <br />
        <p>Still learning a bunch of stuff</p>
        <div className={styles.techGrid}>
          {techs.map((item) => (
            <a
              key={item.id}
              className={styles.techItem}
              href={item.url}
              target="_blank"
              rel="noreferrer noopener"
              onMouseEnter={onMouseEnter}
            >
              <img
                src={item.image}
                alt={item.title}
                width={item.width}
                height={item.height}
                loading="lazy"
                decoding="async"
              />
              <span
                style={{ ["--mask-image" as string]: `url(${item.image})` }}
                className={"metalic matte"}
              ></span>
            </a>
          ))}
        </div>
      </section>
    </>
  );
}
