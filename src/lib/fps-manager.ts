"use client";

import { useEffect, useState } from "react";

// Simple FPS state management without React context
class FPSManager {
  private fps = 0;
  private isAbove60 = true;
  private listeners: Set<(isAbove60: boolean) => void> = new Set();
  private performanceRef = [] as number[];
  private idleCallbackRef: number | null = null;
  private isRunning = false;

  constructor() {
    this.startMonitoring();
  }

  private scheduleIdleCallback(callback: () => void) {
    if (typeof requestIdleCallback !== "undefined") {
      return requestIdleCallback(callback);
    } else {
      // Fallback: use setTimeout with a small delay (~60fps)
      return setTimeout(callback, 16) as any;
    }
  }

  private cancelIdleCallback(id: number) {
    if (typeof window.cancelIdleCallback !== "undefined") {
      window.cancelIdleCallback(id);
    } else {
      clearTimeout(id);
    }
  }

  private checkFPS = () => {
    const now = performance.now();
    this.performanceRef.push(now);

    // Run for 3 seconds to get accurate measurement
    if (now - this.performanceRef[0] < 3000) {
      this.idleCallbackRef = this.scheduleIdleCallback(this.checkFPS);
    } else {
      const times = this.performanceRef;
      this.fps = times.length / ((times[times.length - 1] - times[0]) / 1000);
      const newIsAbove60 = this.fps >= 60;

      if (newIsAbove60 !== this.isAbove60) {
        this.isAbove60 = newIsAbove60;
        // Notify all listeners
        for (const listener of this.listeners) {
          listener(this.isAbove60);
        }
      }

      this.performanceRef = [];

      // Schedule next check after a delay
      setTimeout(() => {
        if (this.isRunning) {
          this.idleCallbackRef = this.scheduleIdleCallback(this.checkFPS);
        }
      }, 5000); // Check every 5 seconds
    }
  };

  private startMonitoring() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.idleCallbackRef = this.scheduleIdleCallback(this.checkFPS);
  }

  private stopMonitoring() {
    this.isRunning = false;
    if (this.idleCallbackRef) {
      this.cancelIdleCallback(this.idleCallbackRef);
      this.idleCallbackRef = null;
    }
  }

  // Public API
  getIsAbove60(): boolean {
    return this.isAbove60;
  }

  getFPS(): number {
    return this.fps;
  }

  subscribe(callback: (isAbove60: boolean) => void): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  destroy() {
    this.stopMonitoring();
    this.listeners.clear();
  }
}

// Singleton instance
const fpsManager = new FPSManager();

// React hook for easy usage
export function useFPSAbove60() {
  const [isAbove60, setIsAbove60] = useState(fpsManager.getIsAbove60());

  useEffect(() => {
    const unsubscribe = fpsManager.subscribe(setIsAbove60);
    return unsubscribe;
  }, []);

  return isAbove60;
}

// Direct access functions for non-React usage
export const fpsState = {
  getIsAbove60: () => fpsManager.getIsAbove60(),
  getFPS: () => fpsManager.getFPS(),
  subscribe: (callback: (isAbove60: boolean) => void) =>
    fpsManager.subscribe(callback),
  destroy: () => fpsManager.destroy(),
};
