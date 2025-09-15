"use client";
import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function ScrollListener() {
  // use lenis,
  // on paage change, destroy and re-init
  // so that it resets the scroll position to top
  // and also re-calculate the scroll position
  // otherwise it will keep the scroll position from previous page
  const pathname = usePathname();

  // biome-ignore lint/correctness/useExhaustiveDependencies: because it is what we want
  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: true,
    });

    return () => {
      lenis.stop();
      lenis.destroy();
    };
  }, [pathname]);

  // asdf

  return null;
}
