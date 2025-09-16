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
      <div className={styles.content} id="contact">
        <h5>About Me</h5>
        <br />
        <p>my name is Tri Rahmat Gunadi</p>
        <p>But people call me juji..</p>
        <br />
        <address>
          <p>
            <a href="mailto:him@jujiyangasli.com">him@jujiyangasli.com</a>
          </p>
          <p>Tangerang, Indonesia</p>
        </address>
        <br />
        <a
          href="/juji-cv.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className={`outgoing`}
        >
          Download CV
        </a>
        <br />
        <br />
        <div>
          <a
            href="https://jujiplay.com"
            target="_blank"
            rel="noreferrer noopener"
          >
            https://jujiplay.com
          </a>
        </div>
        <div>
          <a
            href="https://blog.jujiyangasli.com"
            target="_blank"
            rel="noreferrer noopener"
          >
            https://blog.jujiyangasli.com
          </a>
        </div>
        <br />

        <div className={styles.icons}>
          <div className={styles.icon}>
            <a
              href="https://github.com/juji"
              target="_blank"
              rel="noreferrer noopener"
              aria-label="github link"
            >
              <img
                src="/images/contact-logo/github.svg"
                width="98"
                height="96"
                alt="github"
              />
            </a>
          </div>
          <div className={styles.icon}>
            <a
              href="https://www.npmjs.com/~juji_"
              target="_blank"
              rel="noreferrer noopener"
              aria-label="npm link"
            >
              <img
                src="/images/contact-logo/npm.svg"
                width="540"
                height="210"
                alt="npm"
              />
            </a>
          </div>
        </div>
        <br />
        <p>@ {new Date().getFullYear()} by Tri Rahmat Gunadi</p>
        <p>
          Made with ♥️ +{" "}
          <a
            href="https://nextjs.org/"
            rel="noreferrer noopener"
            target="_blank"
          >
            Next.js
          </a>
        </p>
      </div>
    </footer>
  );
}
