"use client";
import Lenis from "lenis";
import { useEffect } from "react";

export function ScrollListener() {
  useEffect(() => {
    new Lenis({
      autoRaf: true,
    });
  }, []);

  return null;
}
