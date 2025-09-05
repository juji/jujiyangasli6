"use client";
import Lenis from "lenis";
import { useEffect } from "react";

export function ScrollListener() {
  useEffect(() => {
    new Lenis({
      autoRaf: true,
    });

    // Listen for the scroll event and log the event data
    // lenis.on('scroll', (e) => {
    //   console.log(e);
    // });

    // listen to scroll event using window
    // this works
    // window.addEventListener('scroll', (e) => {
    //   console.log(e);
    // });
  }, []);

  return null;
}
