"use client";
import { useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useRef } from "react";
import styles from "./style.module.css";

export function BgCanvas() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const workerRef = useRef<Worker | null>(null);
  const canvasInit = useRef(false);
  const started = useRef(false);
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start end", "start start"],
  });

  useMotionValueEvent(scrollYProgress, "change", () => {
    const value = scrollYProgress.get();
    console.log("Scroll position:", value);

    // change --visibility in container
    containerRef.current?.style.setProperty("--visibility", `${value}`);

    if (value < 1 && !started.current) {
      started.current = true;
      workerRef.current?.postMessage({
        type: "start",
      });
    } else if (value === 1 && started.current) {
      started.current = false;
      workerRef.current?.postMessage({
        type: "stop",
      });
    }
  });

  useEffect(() => {
    function onResize() {
      workerRef.current?.postMessage({
        type: "resize",
        payload: {
          width: window.innerWidth,
          height: window.innerHeight,
        },
      });
    }
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    // transfer to offscreen canvas
    canvasRef.current.width = window.innerWidth;
    canvasRef.current.height = window.innerHeight;
    const offscreen = canvasRef.current.transferControlToOffscreen();
    const worker = new Worker(new URL("../../worker/init", import.meta.url), {
      type: "module",
    });
    workerRef.current = worker;

    worker.addEventListener("message", (event) => {
      const { type, payload } = event.data;

      if (type === "init") {
        console.log("Worker initialized");
        canvasInit.current = true;
        worker.postMessage(
          {
            type: "init",
            payload: {
              canvas: offscreen,
              width: canvasRef.current?.width,
              height: canvasRef.current?.height,
            },
          },
          [offscreen],
        );

        console.log('scrollYProgress.get()', scrollYProgress.get())
        if(scrollYProgress.get() === 0){
          started.current = true;
          workerRef.current?.postMessage({
            type: "start",
          });
        }

        return;
      }

      if (type === "error") {
        console.log("Worker error:", payload);
        return;
      }
    });
  }, []);

  return (
    <>
      <div className={styles.container} ref={containerRef}>
        <canvas className={styles.canvas} ref={canvasRef} />
        <div className={styles.bg} />
      </div>
      <div className={styles.scrollPos} ref={scrollRef}></div>
    </>
  );
}
