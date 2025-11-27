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
  const [isMobile, setIsMobile] = useState(true);

  // check screen size
  useEffect(() => {
    setIsMobile(Math.min(window.innerWidth, window.innerHeight) < 768);
  }, []);

  if (isMobile) {
    return <>{children}</>;
  }

  return <AnimDivChild {...props} />;
}
