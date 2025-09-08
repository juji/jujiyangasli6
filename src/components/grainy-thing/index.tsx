"use client";

import { animate, scroll } from "motion";
import { useEffect, useRef, useState } from "react";
import { Ball } from "./ball";
import { randomColor } from "./randomColor";
import { isSafariOrWebkit } from "./safari";
import styles from "./styles.module.css";

export function GrainyThing() {
  const dBallsRef = useRef<Ball[]>([]);
  const overlayRef = useRef<HTMLDivElement>(null);
  const ballsContainerRef = useRef<HTMLDivElement>(null);

  const width = 800;
  const height = 520;
  const translateX = 500;
  const translateY = 220;

  const [offscreen, setOffscreen] = useState(false);
  const animationFrameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    // if screen width < 1536, just use 3 balls
    let _smaller = false;
    const ballClass = `.${styles.ball}`;
    if (Math.max(window.innerWidth, window.innerHeight) <= 1536) {
      document.querySelectorAll(ballClass).forEach((v) => {
        if (v.classList.contains("remove")) v.remove();
        else v.classList.add("small");
      });
      _smaller = true;
    }

    // set dBalls
    if (!dBallsRef.current.length && ballsContainerRef.current) {
      const jsBalls: Ball[] = [];
      const balls = ballsContainerRef.current.querySelectorAll(ballClass);
      const colors: string[] = [];
      balls.forEach(() => {
        colors.push(randomColor(colors));
      });
      balls.forEach((ball, i) => {
        const dball = new Ball(ball as HTMLDivElement, colors[i], {
          width,
          height,
        });
        jsBalls.push(dball);
      });
      console.log("Created balls:", jsBalls.length);
      dBallsRef.current = jsBalls;
    }
  }, []);

  useEffect(() => {
    if (offscreen) return;
    console.log(
      "Starting animation with",
      dBallsRef.current.length,
      "balls, offscreen:",
      offscreen,
    );
    const draw = () => {
      dBallsRef.current.forEach((v) => {
        v.update();
        v.render();
      });

      if (offscreen) return;
      animationFrameRef.current = requestAnimationFrame(draw);
    };
    animationFrameRef.current = requestAnimationFrame(draw);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [offscreen]);

  useEffect(() => {
    const hMult = 1.2;
    const safari = isSafariOrWebkit();
    const minimumOpacity =
      safari.usesSafariWebKit || safari.isSafari || safari.isIOS ? 0.1 : 0;

    // scroll overlay's opacity
    const overlayCancel = overlayRef.current
      ? scroll(
          animate(overlayRef.current, {
            opacity: [minimumOpacity, 1],
          }),
          { offset: [0, `${100 * hMult}vh`] },
        )
      : () => {};

    // is offscreen?
    const offscreenCancel = scroll((_, info) => {
      setOffscreen(info.y.current >= window.innerHeight * hMult);
    });

    return () => {
      offscreenCancel();
      overlayCancel();
    };
  }, []);

  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={styles.hidden}
        aria-hidden="true"
      >
        <title>Gooey filter effect</title>
        <filter id="goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="1 0 0 0 0
                    0 1 0 0 0
                    0 0 1 0 0
                    0 0 0 3 -1"
          />
        </filter>
      </svg>
      <div
        className={`${styles.wrapper} ${!offscreen ? styles.wrapperShown : ""}`}
      >
        <div className={styles.grain}>
          <div
            ref={ballsContainerRef}
            className={styles.balls}
            style={
              {
                "--translateX": `${translateX}px`,
                "--translateY": `${translateY}px`,
              } as React.CSSProperties
            }
          >
            <div
              style={
                {
                  "--delay": "0ms",
                  "--pos-x": "50%",
                  "--pos-y": "50%",
                  "--color": "6,82,221",
                  "--diameter": "860px",
                } as React.CSSProperties
              }
              className={styles.ball}
            ></div>
            <div
              style={
                {
                  "--delay": "0ms",
                  "--pos-x": "56%",
                  "--pos-y": "6%",
                  "--color": "234,32,39",
                  "--diameter": "676px",
                } as React.CSSProperties
              }
              className={styles.ball}
            ></div>
            <div
              style={
                {
                  "--delay": "0ms",
                  "--pos-x": "18%",
                  "--pos-y": "40%",
                  "--color": "153,128,250",
                  "--diameter": "698px",
                } as React.CSSProperties
              }
              className={styles.ball}
            ></div>
            <div
              style={
                {
                  "--delay": "0ms",
                  "--pos-x": "67%",
                  "--pos-y": "34%",
                  "--color": "163,203,56",
                  "--diameter": "676px",
                } as React.CSSProperties
              }
              className={`${styles.ball} remove`}
            ></div>
            <div
              style={
                {
                  "--delay": "0ms",
                  "--pos-x": "43%",
                  "--pos-y": "23%",
                  "--color": "253,167,223",
                  "--diameter": "646px",
                } as React.CSSProperties
              }
              className={`${styles.ball} remove`}
            ></div>
          </div>
        </div>
      </div>
      <div ref={overlayRef} className={styles.overlay}></div>
      <div
        className={styles.debug}
        style={
          {
            "--width": `${width}px`,
            "--height": `${height}px`,
            "--translateX": `${translateX}px`,
            "--translateY": `${translateY}px`,
          } as React.CSSProperties
        }
      ></div>
    </>
  );
}
