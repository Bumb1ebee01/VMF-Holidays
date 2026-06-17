"use client";
import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import styles from "./PageLoader.module.css";

export default function PageLoader() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);
  const [barKey, setBarKey] = useState(0);
  const firstLoadDone = useRef(false);
  const prevPathname = useRef(pathname);

  // Initial load — hide after 2s
  useEffect(() => {
    const t = setTimeout(() => {
      firstLoadDone.current = true;
      setVisible(false);
    }, 2000);
    return () => clearTimeout(t);
  }, []);

  // Show loader when an internal link is clicked
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!firstLoadDone.current) return;
      const anchor = (e.target as HTMLElement).closest("a[href]") as HTMLAnchorElement | null;
      if (!anchor) return;
      const href = anchor.getAttribute("href") ?? "";
      if (
        !href ||
        href.startsWith("http") ||
        href.startsWith("//") ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        anchor.getAttribute("target") === "_blank"
      ) return;
      setBarKey((k) => k + 1);
      setVisible(true);
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  // Hide once the new page has rendered (pathname changed)
  useEffect(() => {
    if (!firstLoadDone.current) return;
    if (pathname === prevPathname.current) return;
    prevPathname.current = pathname;
    const t = setTimeout(() => setVisible(false), 300);
    return () => clearTimeout(t);
  }, [pathname]);

  return (
    <div className={`${styles.loader} ${!visible ? styles.hidden : ""}`} aria-hidden="true">
      <div className={styles.logo}>
        <Image
          src="/logo-white.png"
          alt="VMF Holidays"
          width={200}
          height={83}
          priority
          className={styles.logoImg}
        />
      </div>
      <div key={barKey} className={styles.track}>
        <div className={styles.fill} />
      </div>
      <p className={styles.tagline}>Discover Your World, Your Way</p>
    </div>
  );
}
