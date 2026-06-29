"use client";

import { useEffect, useRef } from "react";

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js";

declare global {
  interface Window {
    turnstile?: {
      render: (
        el: HTMLElement,
        opts: {
          sitekey: string;
          callback: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
        }
      ) => string;
      reset: (id?: string) => void;
    };
  }
}

/**
 * Cloudflare Turnstile widget. Renders nothing (and the form works as before)
 * until NEXT_PUBLIC_TURNSTILE_SITE_KEY is set. Calls `onVerify` with the token
 * (or "" when it expires/errors); the parent submits that token for verification.
 */
export default function Turnstile({ onVerify }: { onVerify: (token: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const rendered = useRef(false);
  const cb = useRef(onVerify);

  useEffect(() => {
    cb.current = onVerify;
  }, [onVerify]);

  useEffect(() => {
    if (!SITE_KEY) return;
    let cancelled = false;

    const tryRender = () => {
      if (cancelled || rendered.current || !ref.current || !window.turnstile) return;
      rendered.current = true;
      window.turnstile.render(ref.current, {
        sitekey: SITE_KEY,
        callback: (token) => cb.current(token),
        "expired-callback": () => cb.current(""),
        "error-callback": () => cb.current(""),
      });
    };

    if (!document.querySelector(`script[src="${SCRIPT_SRC}"]`)) {
      const s = document.createElement("script");
      s.src = SCRIPT_SRC;
      s.async = true;
      s.defer = true;
      s.addEventListener("load", tryRender);
      document.head.appendChild(s);
    }

    tryRender();
    const id = setInterval(() => {
      if (cancelled || rendered.current) {
        clearInterval(id);
        return;
      }
      tryRender();
    }, 250);

    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  if (!SITE_KEY) return null;
  return <div ref={ref} style={{ marginTop: 4 }} />;
}
