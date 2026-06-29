"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

/**
 * Global smooth-scroll driver (Lenis) for the public site.
 * Disabled when the user prefers reduced motion.
 *
 * Lenis keeps its own scroll position, so on a client-side navigation we must
 * tell it to jump to the top — otherwise a shorter new page opens scrolled down
 * (the "page loads at the bottom" bug). Components that move between in-page
 * steps (e.g. the Trip Builder) dispatch `vmf:scroll-top` to reset cleanly
 * without a raw window.scrollTo that would desync Lenis.
 *
 * Also listens for `vmf:scroll-lock` / `vmf:scroll-unlock` so overlays (menu,
 * modals) can freeze the page without fighting Lenis.
 */
export default function SmoothScroll() {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let lenis: Lenis | null = null;
    let frame = 0;

    if (!reduced) {
      lenis = new Lenis({ smoothWheel: true, lerp: 0.1 });
      lenisRef.current = lenis;
      const raf = (time: number) => {
        lenis!.raf(time);
        frame = requestAnimationFrame(raf);
      };
      frame = requestAnimationFrame(raf);
    }

    const lock = () => lenis?.stop();
    const unlock = () => lenis?.start();
    const toTop = () => {
      if (lenis) lenis.scrollTo(0, { immediate: true });
      else window.scrollTo(0, 0);
    };
    window.addEventListener("vmf:scroll-lock", lock);
    window.addEventListener("vmf:scroll-unlock", unlock);
    window.addEventListener("vmf:scroll-top", toTop);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("vmf:scroll-lock", lock);
      window.removeEventListener("vmf:scroll-unlock", unlock);
      window.removeEventListener("vmf:scroll-top", toTop);
      lenis?.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Snap to the top on every client-side navigation.
  useEffect(() => {
    if (lenisRef.current) lenisRef.current.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
