"use client";

import { useEffect } from "react";

export function VersionPrinter() {
  useEffect(() => {
    console.log(`Jujiyangasli v6.4`);
  }, []);
  return null;
}
