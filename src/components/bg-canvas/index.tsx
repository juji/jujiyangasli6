"use client";
import { useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useRef } from "react";
import styles from "./style.module.css";

// Uncomment to enable parameter controls
// import { ParamsControls } from "./params-controls";

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

  // Handle parameter changes from controls (if enabled)
  // const handleParamsChange = (params: {
  //   temperature?: number;
  //   tint?: number;
  //   contrast?: number;
  //   brightness?: number;
  //   gamma?: number;
  //   saturation?: number;
  //   vibrance?: number;
  //   lift?: number;
  //   gain?: number;
  //   exposure?: number;
  //   clarity?: number;
  // }) => {
  //   workerRef.current?.postMessage({
  //     type: "params",
  //     payload: params,
  //   });
  // };

  useMotionValueEvent(scrollYProgress, "change", () => {
    const value = scrollYProgress.get();

    // change --visibility in container
    containerRef.current?.style.setProperty("--visibility", `${value}`);

    workerRef.current?.postMessage({
      type: "scroll",
      payload: {
        scrollY: value,
      },
    });

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
      if (canvasInit.current && workerRef.current) {
        workerRef.current.postMessage({
          type: "resize",
          payload: {
            width: window.innerWidth,
            height: window.innerHeight,
          },
        });
      }
    }
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // biome-ignore-start lint/correctness/useExhaustiveDependencies: scrollYProgress.get should not trigger re-runs
  useEffect(() => {
    if (!canvasRef.current || canvasInit.current) return;

    try {
      // transfer to offscreen canvas
      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight;
      const offscreen = canvasRef.current.transferControlToOffscreen();
      const worker = new Worker(
        new URL("../../worker/webgl", import.meta.url),
        {
          type: "module",
        },
      );
      workerRef.current = worker;

      worker.addEventListener("message", (event) => {
        const { type } = event.data;

        if (type === "started") {
          // set animation-play-state to running
          if (containerRef.current) {
            containerRef.current.style.setProperty("--running", "running");
          }
        }

        if (type === "init") {
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

          if (scrollYProgress.get() === 0) {
            started.current = true;
            workerRef.current?.postMessage({
              type: "start",
            });
          }

          return;
        }

        if (type === "error") {
          return;
        }
      });
    } catch (error) {
      console.warn(
        "Canvas transfer failed, canvas may already be transferred:",
        error,
      );
      return;
    }

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
      canvasInit.current = false;
      started.current = false;
    };
  }, []);
  // biome-ignore-end lint/correctness/useExhaustiveDependencies: scrollYProgress.get should not trigger re-runs

  return (
    <>
      <div className={styles.container} ref={containerRef}>
        <canvas
          key={`canvas-${Date.now()}`}
          className={styles.canvas}
          ref={canvasRef}
        />
        <div className={styles.bg} />
      </div>
      <div className={styles.scrollPos} ref={scrollRef}></div>
      {/* <ParamsControls onParamsChange={handleParamsChange} /> */}
    </>
  );
}
