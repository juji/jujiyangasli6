import { useEffect, useRef, useState } from "react";

export function useFpsCounter() {
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
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, []);

  return {
    fps,
    highestTime,
  };
}
