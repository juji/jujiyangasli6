"use client";

import { fpsState, useFPSAbove60 } from "@/lib/fps-manager";

// Example component showing how to use the atomic FPS manager
export function FPSIndicator() {
  // Method 1: Using the React hook (recommended for React components)
  const isAbove60 = useFPSAbove60();

  return (
    <div
      style={{
        position: "fixed",
        bottom: 10,
        right: 10,
        backgroundColor: isAbove60 ? "green" : "red",
        color: "white",
        padding: "8px 12px",
        borderRadius: "4px",
        fontSize: "12px",
        zIndex: 9999,
      }}
    >
      FPS: {isAbove60 ? "≥60" : "<60"}
    </div>
  );
}

// Alternative: Direct usage without React hook (for non-React code)
export function logFPSToConsole() {
  const unsubscribe = fpsState.subscribe((isAbove60) => {
    console.log(`FPS ${isAbove60 ? "above" : "below"} 60:`, fpsState.getFPS());
  });

  // Call unsubscribe() when you want to stop listening
  return unsubscribe;
}
