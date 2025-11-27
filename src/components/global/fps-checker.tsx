"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

// FPS Store Context
interface FPSContextType {
  fps: number;
  highestTime: number;
}

const FPSContext = createContext<FPSContextType | undefined>(undefined);

// FPS Provider Component
export function FPSProvider({ children }: { children: ReactNode }) {
  const [fps, setFps] = useState(0);
  const [highestTime, setHighestTime] = useState(0);
  const performanceRef = useRef<number[]>([]);
  const idleCallbackRef = useRef<number | null>(null);

  useEffect(() => {
    // Fallback for browsers that don't support requestIdleCallback (like Safari)
    const scheduleIdleCallback = (callback: () => void) => {
      if (typeof requestIdleCallback !== "undefined") {
        return requestIdleCallback(callback);
      } else {
        // Fallback: use setTimeout with a small delay
        return setTimeout(callback, 16) as any; // ~60fps
      }
    };

    const cancelIdleCallback = (id: number) => {
      if (typeof window.cancelIdleCallback !== "undefined") {
        window.cancelIdleCallback(id);
      } else {
        clearTimeout(id);
      }
    };

    function checkFPS() {
      const now = performance.now();
      performanceRef.current.push(now);

      // runs for 3 seconds
      if (now - performanceRef.current[0] < 3000) {
        idleCallbackRef.current = scheduleIdleCallback(checkFPS);
      } else {
        const times = performanceRef.current;
        const calculatedFps =
          times.length / ((times[times.length - 1] - times[0]) / 1000);
        setFps(calculatedFps);
        setHighestTime(
          Math.max(...times.map((t, i) => (i === 0 ? 0 : t - times[i - 1]))),
        );
        performanceRef.current = [];

        // Don't schedule next check - run only once
      }
    } // Start FPS checking when idle
    idleCallbackRef.current = scheduleIdleCallback(checkFPS);

    return () => {
      if (idleCallbackRef.current) {
        cancelIdleCallback(idleCallbackRef.current);
      }
    };
  }, []);

  return (
    <FPSContext.Provider value={{ fps, highestTime }}>
      {children}
    </FPSContext.Provider>
  );
}

// Hook to use FPS values
export function useFPS() {
  const context = useContext(FPSContext);
  if (context === undefined) {
    throw new Error("useFPS must be used within a FPSProvider");
  }
  return context;
}

// FPS Display Component (optional, for debugging)
export function FpsChecker() {
  const { fps, highestTime } = useFPS();

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
