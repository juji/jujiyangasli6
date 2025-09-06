"use client";

import { useEffect, useRef, useState } from "react";

export function FpsChecker() {
  const performanceRef = useRef<number[]>([]);
  const [fps, setFps] = useState(0);
  const [highestTime, setHighestTime] = useState(0);

  useEffect(() => {
    let frame: number | null = null;
    function checkFPS() {
      const now = performance.now();
      performanceRef.current.push(now);

      // runs for 3 seconds
      if (now - performanceRef.current[0] < 3000) {
        frame = requestAnimationFrame(checkFPS);
      } else {
        const times = performanceRef.current;
        const fps =
          times.length / ((times[times.length - 1] - times[0]) / 1000);
        setFps(fps);
        setHighestTime(
          Math.max(...times.map((t, i) => (i === 0 ? 0 : t - times[i - 1]))),
        );
        performanceRef.current = [];
      }
    }
    frame = requestAnimationFrame(checkFPS);

    return () => {
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        right: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        color: "white",
        padding: "0.5rem",
        fontSize: "0.75rem",
        zIndex: 9999,
      }}
    >
      <div>FPS: {fps.toFixed(1)}</div>
      <div>Highest: {highestTime.toFixed(1)} ms</div>
    </div>
  );
}
