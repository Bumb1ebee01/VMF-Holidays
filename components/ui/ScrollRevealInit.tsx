"use client";
import { useEffect } from "react";

const SELECTOR = ".reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-clip";

export default function ScrollRevealInit() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    const observe = (el: Element) => {
      if (!el.classList.contains("revealed")) observer.observe(el);
    };

    const scan = (root: ParentNode) => {
      if (root instanceof Element && root.matches(SELECTOR)) observe(root);
      root.querySelectorAll?.(SELECTOR).forEach(observe);
    };

    scan(document);

    // Client components (e.g. the destinations filter) and streamed content add
    // reveal elements after the first scan; without this they'd stay clipped and
    // invisible forever. Watch for them and start observing as they appear.
    const mutationObserver = new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.addedNodes.forEach((node) => {
          if (node.nodeType === 1) scan(node as Element);
        });
      }
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return null;
}
