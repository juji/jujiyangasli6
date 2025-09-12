"use client";
import { useCallback, useEffect, useRef } from "react";
import styles from "./style.module.css";

export function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const glowState = useRef({
    started: false,
    deltaAlpha: 0,
    minAlpha: 0.1,
    delta: 0.03 * 0.7,
    timeEffect: 0.99,
    rid: 0,
  });

  const start = useCallback(() => {
    if (glowState.current.rid) cancelAnimationFrame(glowState.current.rid);
    glowState.current.rid = requestAnimationFrame(function anim() {
      if (!glowState.current.started) return;
      if (!footerRef.current) return;

      // draw
      footerRef.current.style.setProperty(
        "--gradient-glow",
        `${glowState.current.minAlpha + glowState.current.deltaAlpha}`,
      );

      // done
      if (!glowState.current.deltaAlpha) {
        glowState.current.started = false;
        return;
      }

      // set & loop
      glowState.current.deltaAlpha *= glowState.current.timeEffect;
      if (glowState.current.deltaAlpha <= 0.001)
        glowState.current.deltaAlpha = 0;
      glowState.current.rid = requestAnimationFrame(anim);
    });
  }, []);

  const addOffset = useCallback(
    (amount: number = 1) => {
      glowState.current.deltaAlpha += glowState.current.delta * amount;

      if (!glowState.current.started) {
        glowState.current.started = true;
        start();
      }
    },
    [start],
  );

  useEffect(() => {
    function wheelListener(e: WheelEvent) {
      if (
        e.deltaY < 0 ||
        window.scrollY < document.body.offsetHeight - window.innerHeight
      )
        return;
      addOffset();
    }

    function onTouchStart(init: TouchEvent) {
      if (
        window.scrollY <
        document.body.offsetHeight - window.innerHeight - 200 // 200 is est. adressbar
      )
        return;

      const initY = init.touches[0].clientY;
      const onPointerMove = (e: TouchEvent) => {
        if (e.touches[0].clientY < initY) addOffset(0.3);
      };
      const onPointerUp = (_e: TouchEvent) => {
        window.removeEventListener("touchmove", onPointerMove);
        window.removeEventListener("touchend", onPointerUp);
        window.removeEventListener("touchcancel", onPointerUp);
      };
      window.addEventListener("touchmove", onPointerMove);
      window.addEventListener("touchend", onPointerUp);
      window.addEventListener("touchcancel", onPointerUp);
    }

    window.addEventListener("wheel", wheelListener, { passive: true });
    window.addEventListener("touchstart", onTouchStart);

    return () => {
      window.removeEventListener("wheel", wheelListener);
      window.removeEventListener("touchstart", onTouchStart);
    };
  }, [addOffset]);

  return (
    <footer className={styles.footer} ref={footerRef}>
      <div className={styles.content}>© 2024 Juji</div>
    </footer>
  );
}
