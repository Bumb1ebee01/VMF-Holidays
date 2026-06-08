"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`${styles.nav} ${scrolled ? styles.scrolled : ""}`}>
      <div className={`container ${styles.inner}`}>
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          <span className={styles.logoText}>
            <span className={styles.logoVmf}>VMF</span>
            <span className={styles.logoHols}>Holidays</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className={styles.links}>
          <Link href="/packages">Packages</Link>
          <Link href="/destinations">Destinations</Link>
          <Link href="/trip-builder">Trip Builder</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
        </nav>

        {/* CTAs */}
        <div className={styles.actions}>
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

      {/* Mobile menu */}
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
