"use client";
import { useAtom } from "jotai";
import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { scrollActive } from "@/atom/scroll";

export function ScrollListener() {
  // use lenis,
  // on paage change, destroy and re-init
  // so that it resets the scroll position to top
  // and also re-calculate the scroll position
  // otherwise it will keep the scroll position from previous page
  const pathname = usePathname();
  const [isScrollActive] = useAtom(scrollActive);

  // biome-ignore lint/correctness/useExhaustiveDependencies: because it is what we want
  useEffect(() => {
    let lenis: Lenis | null = null;
    if (isScrollActive) {
      lenis = new Lenis({
        autoRaf: true,
        // lerp: 0.05,
      });
    }

    return () => {
      if (!lenis) return;
      lenis.stop();
      lenis.destroy();
    };
  }, [pathname, isScrollActive]);

  return null;
}
