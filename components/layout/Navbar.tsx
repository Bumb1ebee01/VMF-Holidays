"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/ui/ThemeToggle";
import styles from "./Navbar.module.css";

const NAV_LINKS = [
  { href: "/destinations", label: "Destinations" },
  { href: "/offers", label: "Offers" },
  { href: "/gallery", label: "Gallery" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

// Pages shown in the "Plan My Trip" dropdown so visitors can jump straight to
// any section instead of having to start in the Trip Builder.
const PLAN_LINKS = [
  { href: "/trip-builder", label: "Build My Trip", primary: true },
  { href: "/destinations", label: "Browse Destinations" },
  { href: "/offers", label: "Offers & Deals" },
  { href: "/gallery", label: "Gallery" },
  { href: "/blog", label: "Travel Blog" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact / Enquire" },
];

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const [scrolled, setScrolled] = useState(!isHome);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [planOpen, setPlanOpen] = useState(false);
  const [canHover, setCanHover] = useState(false);
  const planRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCanHover(window.matchMedia("(hover: hover)").matches);
  }, []);

  // Close the Plan dropdown on outside click, Escape, or route change.
  useEffect(() => {
    if (!planOpen) return;
    const onDown = (e: MouseEvent) => {
      if (planRef.current && !planRef.current.contains(e.target as Node)) setPlanOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPlanOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [planOpen]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPlanOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isHome) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
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
          <div className={styles.logoWrap}>
            <Image
              src="/logo-white.png"
              alt="VMF Holidays"
              width={160}
              height={66}
              className={`${styles.logoImg} ${scrolled ? styles.logoOut : ""}`}
              priority
            />
            <Image
              src="/logo-blue.png"
              alt=""
              width={160}
              height={67}
              className={`${styles.logoImg} ${styles.logoBlue} ${scrolled ? "" : styles.logoOut}`}
              priority
            />
          </div>
        </Link>

        <nav className={styles.links}>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={isActive(link.href) ? styles.active : ""}
              aria-current={isActive(link.href) ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className={styles.actions}>
          <ThemeToggle onLight={isLight} />
          <div
            ref={planRef}
            className={styles.planWrap}
            onMouseEnter={canHover ? () => setPlanOpen(true) : undefined}
            onMouseLeave={canHover ? () => setPlanOpen(false) : undefined}
          >
            <button
              type="button"
              className={`btn btn-primary btn--sm ${styles.planBtn}`}
              aria-haspopup="menu"
              aria-expanded={planOpen}
              onClick={() => setPlanOpen((o) => !o)}
            >
              Plan My Trip
              <svg
                className={`${styles.planCaret} ${planOpen ? styles.planCaretOpen : ""}`}
                width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
            {planOpen && (
              <div className={styles.planMenu} role="menu">
                {PLAN_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    role="menuitem"
                    className={link.primary ? styles.planPrimary : ""}
                    onClick={() => setPlanOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <button
            className={styles.hamburger}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className={styles.mobileMenu} id="mobile-menu">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={isActive(link.href) ? styles.active : ""}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/trip-builder" className="btn btn-primary" onClick={() => setMobileOpen(false)}>
            Plan My Trip
          </Link>
        </div>
      )}
    </header>
  );
}
