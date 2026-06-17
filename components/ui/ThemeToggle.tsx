"use client";

import { useEffect, useState } from "react";
import styles from "./ThemeToggle.module.css";

interface Props {
  onLight?: boolean;
}

export default function ThemeToggle({ onLight = false }: Props) {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const saved = localStorage.getItem("vmf-theme");
    const isDark = saved ? saved === "dark" : mq.matches;
    setDark(isDark);
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
    setMounted(true);

    function onOsChange(e: MediaQueryListEvent) {
      if (localStorage.getItem("vmf-theme")) return;
      setDark(e.matches);
      document.documentElement.setAttribute("data-theme", e.matches ? "dark" : "light");
    }
    mq.addEventListener("change", onOsChange);
    return () => mq.removeEventListener("change", onOsChange);
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    localStorage.setItem("vmf-theme", next ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
  }

  if (!mounted) return <div className={styles.placeholder} />;

  return (
    <button
      className={`${styles.btn} ${dark ? styles.dark : ""} ${onLight ? styles.onLight : ""}`}
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <div className={styles.track}>
        <div className={styles.thumb}>
          {dark ? (
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          ) : (
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          )}
        </div>
      </div>
    </button>
  );
}
