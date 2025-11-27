"use client";

import { fpsState, useFPSAbove60 } from "@/lib/fps-manager";

// Example component showing how to use the atomic FPS manager
export function FPSIndicator() {
  // Method 1: Using the React hook (recommended for React components)
  const isAbove60 = useFPSAbove60();

  const getStatus = () => {
    if (isAbove60 === null) return "Measuring...";
    return isAbove60 ? "≥60 FPS" : "<60 FPS";
  };

  const getColor = () => {
    if (isAbove60 === null) return "gray";
    return isAbove60 ? "green" : "red";
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: 10,
        right: 10,
        backgroundColor: getColor(),
        color: "white",
        padding: "8px 12px",
        borderRadius: "4px",
        fontSize: "12px",
        zIndex: 9999,
      }}
    >
      FPS: {getStatus()}
    </div>
  );
}

// Alternative: Direct usage without React hook (for non-React code)
export function logFPSToConsole() {
  const unsubscribe = fpsState.subscribe((isAbove60) => {
    if (isAbove60 === null) {
      console.log("FPS: Measuring...");
    } else {
      console.log(
        `FPS ${isAbove60 ? "above" : "below"} 60:`,
        fpsState.getFPS(),
      );
    }
  });

  // Call unsubscribe() when you want to stop listening
  return unsubscribe;
}
