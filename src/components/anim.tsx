"use client";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "motion/react";
import { useEffect, useRef, useState } from "react";

export type AnimDivProps = {
  in?: boolean;
  out?: boolean;
};

export function AnimDiv(
  props: AnimDivProps & React.ComponentPropsWithoutRef<typeof motion.div>,
) {
  const { in: inProp = true, out = true, id, ...restProps } = props;
  const shouldReduceMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    setIsMobile(Math.min(window.innerWidth, window.innerHeight) < 768);
  }, []);

  const ref = useRef(null);
  const { scrollYProgress: scrollYProgressShow } = useScroll({
    target: ref,
    offset: ["start end", "start 40%"],
  });

  const { scrollYProgress: scrollYProgressHide } = useScroll({
    target: ref,
    offset: ["end 50%", "end start"],
  });

  const rotateX = useMotionValue(
    inProp && !shouldReduceMotion && !isMobile ? "-90deg" : "0deg",
  );
  const scale = useMotionValue(
    inProp && !shouldReduceMotion && !isMobile ? 0.3 : 1,
  );
  const opacity = useMotionValue(1);
  const translateY = useMotionValue(0);

  useMotionValueEvent(scrollYProgressShow, "change", (latest) => {
    if (!inProp) return;
    if (shouldReduceMotion) return;
    if (isMobile) return;
    rotateX.set(`calc(-90deg + ${latest * 90}deg)`);
    scale.set(0.3 + latest * 0.7);
  });

  useMotionValueEvent(scrollYProgressHide, "change", (latest) => {
    if (!out) return;
    if (shouldReduceMotion) return;
    if (isMobile) return;
    scale.set(1.0 - latest);
    opacity.set(1.0 - latest * 2);
    translateY.set(latest * 300);
  });

  return (
    <div
      id={id}
      style={{
        perspective: "1000px",
        perspectiveOrigin: "center top",
        // outline: '1px solid red',
      }}
    >
      <motion.div
        {...restProps}
        ref={ref}
        style={{
          rotateX,
          scale,
          opacity,
          translateY,
          // outline: '1px solid yellow',
        }}
      />
    </div>
  );
}
