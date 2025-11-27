"use client";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
} from "motion/react";
import { useRef } from "react";

type AnimDivProps = {
  in?: boolean;
  out?: boolean;
};

export function AnimDiv(
  props: AnimDivProps & React.ComponentPropsWithoutRef<typeof motion.div>,
) {
  const { in: inProp = true, out = true, ...restProps } = props;

  const ref = useRef(null);
  const { scrollYProgress: scrollYProgressShow } = useScroll({
    target: ref,
    offset: ["start end", "start 40%"],
  });

  const { scrollYProgress: scrollYProgressHide } = useScroll({
    target: ref,
    offset: ["end 50%", "end start"],
  });

  const rotateX = useMotionValue(inProp ? "-90deg" : "0deg");
  const scale = useMotionValue(inProp ? 0.3 : 1);
  const opacity = useMotionValue(1);
  const translateY = useMotionValue(0);

  useMotionValueEvent(scrollYProgressShow, "change", (latest) => {
    if (!inProp) return;
    rotateX.set(`calc(-90deg + ${latest * 90}deg)`);
    scale.set(0.3 + latest * 0.7);
  });

  useMotionValueEvent(scrollYProgressHide, "change", (latest) => {
    if (!out) return;
    scale.set(1.0 - latest);
    opacity.set(1.0 - latest * 2);
    translateY.set(latest * 300);
  });

  return (
    <div
      style={{
        perspective: "1000px",
        perspectiveOrigin: "50% 0%",
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
        }}
      />
    </div>
  );
}
