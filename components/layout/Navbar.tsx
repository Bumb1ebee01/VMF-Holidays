"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/ui/ThemeToggle";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const [scrolled, setScrolled] = useState(!isHome);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!isHome) {
      setScrolled(true);
      return;
    }
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  const isLight = scrolled;

  return (
    <header className={`${styles.nav} ${scrolled ? styles.scrolled : ""}`}>
      <div className={`container ${styles.inner}`}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoText}>
            <span className={styles.logoVmf}>VMF</span>
            <span className={styles.logoHols}>Holidays</span>
          </span>
        </Link>

        <nav className={styles.links}>
          <Link href="/packages">Packages</Link>
          <Link href="/destinations">Destinations</Link>
          <Link href="/trip-builder">Trip Builder</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
        </nav>

        <div className={styles.actions}>
          <ThemeToggle onLight={isLight} />
          <Link href="/trip-builder" className="btn btn-primary btn--sm">
            Plan My Trip
          </Link>
          <button
            className={styles.hamburger}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className={styles.mobileMenu}>
          <Link href="/packages" onClick={() => setMobileOpen(false)}>Packages</Link>
          <Link href="/destinations" onClick={() => setMobileOpen(false)}>Destinations</Link>
          <Link href="/trip-builder" onClick={() => setMobileOpen(false)}>Trip Builder</Link>
          <Link href="/about" onClick={() => setMobileOpen(false)}>About</Link>
          <Link href="/contact" onClick={() => setMobileOpen(false)}>Contact</Link>
          <Link href="/trip-builder" className="btn btn-primary" onClick={() => setMobileOpen(false)}>
            Plan My Trip
          </Link>
        </div>
      )}
    </header>
  );
}
