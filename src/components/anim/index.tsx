"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import type { AnimDivProps } from "./type";

const AnimDivChild = dynamic(
  () => import("./child").then((v) => v.AnimDivChild),
  {
    ssr: false,
  },
);

// Define motion.div props without importing motion
type MotionDivProps = {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  [key: string]: unknown;
};

export function AnimDiv(props: AnimDivProps & MotionDivProps) {
  const { children } = props;
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    // Check if animations should be enabled
    const isMobile = Math.min(window.innerWidth, window.innerHeight) < 768;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    setShouldAnimate(!isMobile && !prefersReducedMotion);
  }, []);

  if (!shouldAnimate) {
    return <>{children}</>;
  }

  return <AnimDivChild {...props} />;
}
