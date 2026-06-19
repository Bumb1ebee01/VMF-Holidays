"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Global smooth-scroll driver (Lenis) for the public site.
 * Disabled when the user prefers reduced motion.
 * Listens for `vmf:scroll-lock` / `vmf:scroll-unlock` CustomEvents so
 * overlays (menu, modals) can freeze the page without fighting Lenis.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ smoothWheel: true, lerp: 0.1 });
    let frame = 0;

    function raf(time: number) {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    }
    frame = requestAnimationFrame(raf);

    const lock = () => lenis.stop();
    const unlock = () => lenis.start();
    window.addEventListener("vmf:scroll-lock", lock);
    window.addEventListener("vmf:scroll-unlock", unlock);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("vmf:scroll-lock", lock);
      window.removeEventListener("vmf:scroll-unlock", unlock);
      lenis.destroy();
    };
  }, []);

  return null;
}
