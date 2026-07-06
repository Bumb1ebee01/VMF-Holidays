"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef, Fragment } from "react";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/ui/ThemeToggle";
import AccountMenu from "./AccountMenu";
import { LIVE_TOOLS } from "@/lib/data/tools";
import styles from "./Navbar.module.css";

const NAV_LINKS = [
  { href: "/destinations", label: "Destinations" },
  { href: "/trip-builder", label: "Build My Trip" },
  { href: "/offers", label: "Offers" },
  { href: "/tools", label: "Travel Tools" },
  { href: "/blog", label: "Blog" },
  { href: "/travellers-club", label: "Travellers Club" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

// "About" and "Blog" are kept out of the desktop top bar to make room for the
// Travel Tools dropdown — both live in the "Plan My Trip" dropdown, and the
// mobile menu renders the full NAV_LINKS, so both stay reachable there.
const TOP_NAV_LINKS = NAV_LINKS.filter(
  (link) => link.href !== "/blog" && link.href !== "/about"
);

// The "Destinations" top-bar item is a dropdown → Domestic / International.
const DESTINATION_LINKS = [
  { href: "/destinations/domestic", label: "Domestic (India)" },
  { href: "/destinations/international", label: "International" },
];

// The "Travel Tools" top-bar item is a dropdown → every live tool, sourced from
// the tools registry so new tools appear here automatically.
const TOOL_LINKS = LIVE_TOOLS.map((t) => ({ href: `/tools/${t.slug}`, label: t.title }));

// Pages shown in the "Plan My Trip" dropdown so visitors can jump straight to
// any section instead of having to start in the Trip Builder.
const PLAN_LINKS = [
  { href: "/trip-builder", label: "Build My Trip", primary: true },
  { href: "/destinations", label: "Browse Destinations" },
  { href: "/compare", label: "Compare Packages" },
  { href: "/offers", label: "Offers & Deals" },
  { href: "/tools", label: "Travel Tools" },
  { href: "/gallery", label: "Gallery" },
  { href: "/blog", label: "Travel Blog" },
  { href: "/travellers-club", label: "Travellers Club" },
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
  const [destOpen, setDestOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [canHover, setCanHover] = useState(false);
  const planRef = useRef<HTMLDivElement>(null);
  const destRef = useRef<HTMLDivElement>(null);
  const toolsRef = useRef<HTMLDivElement>(null);

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

  // Close the Destinations dropdown on outside click, Escape, or route change.
  useEffect(() => {
    if (!destOpen) return;
    const onDown = (e: MouseEvent) => {
      if (destRef.current && !destRef.current.contains(e.target as Node)) setDestOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDestOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [destOpen]);

  // Close the Travel Tools dropdown on outside click, Escape, or route change.
  useEffect(() => {
    if (!toolsOpen) return;
    const onDown = (e: MouseEvent) => {
      if (toolsRef.current && !toolsRef.current.contains(e.target as Node)) setToolsOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setToolsOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [toolsOpen]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPlanOpen(false);
    setDestOpen(false);
    setToolsOpen(false);
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
          {TOP_NAV_LINKS.map((link) => {
            if (link.href === "/destinations") {
              return (
                <div
                  key={link.href}
                  ref={destRef}
                  className={styles.navDropdown}
                  onMouseEnter={canHover ? () => setDestOpen(true) : undefined}
                  onMouseLeave={canHover ? () => setDestOpen(false) : undefined}
                >
                  <button
                    type="button"
                    className={`${styles.linkTrigger} ${isActive("/destinations") ? styles.active : ""}`}
                    aria-haspopup="menu"
                    aria-expanded={destOpen}
                    onClick={() => setDestOpen((o) => !o)}
                  >
                    Destinations
                    <svg
                      className={`${styles.linkCaret} ${destOpen ? styles.planCaretOpen : ""}`}
                      width="12" height="12" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>
                  {destOpen && (
                    <div className={styles.navMenu} role="menu">
                      <Link href="/destinations" role="menuitem" onClick={() => setDestOpen(false)}>
                        All destinations
                      </Link>
                      {DESTINATION_LINKS.map((l) => (
                        <Link key={l.href} href={l.href} role="menuitem" onClick={() => setDestOpen(false)}>
                          {l.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }
            if (link.href === "/tools") {
              return (
                <div
                  key={link.href}
                  ref={toolsRef}
                  className={styles.navDropdown}
                  onMouseEnter={canHover ? () => setToolsOpen(true) : undefined}
                  onMouseLeave={canHover ? () => setToolsOpen(false) : undefined}
                >
                  <button
                    type="button"
                    className={`${styles.linkTrigger} ${isActive("/tools") ? styles.active : ""}`}
                    aria-haspopup="menu"
                    aria-expanded={toolsOpen}
                    onClick={() => setToolsOpen((o) => !o)}
                  >
                    Travel Tools
                    <svg
                      className={`${styles.linkCaret} ${toolsOpen ? styles.planCaretOpen : ""}`}
                      width="12" height="12" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>
                  {toolsOpen && (
                    <div className={styles.navMenu} role="menu">
                      <Link href="/tools" role="menuitem" onClick={() => setToolsOpen(false)}>
                        All tools
                      </Link>
                      {TOOL_LINKS.map((l) => (
                        <Link key={l.href} href={l.href} role="menuitem" onClick={() => setToolsOpen(false)}>
                          {l.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }
            return (
              <Link
                key={link.href}
                href={link.href}
                className={isActive(link.href) ? styles.active : ""}
                aria-current={isActive(link.href) ? "page" : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className={styles.actions}>
          <ThemeToggle onLight={isLight} />
          <AccountMenu onLight={isLight} />
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
          {NAV_LINKS.map((link) => {
            const subLinks =
              link.href === "/destinations"
                ? DESTINATION_LINKS
                : link.href === "/tools"
                  ? TOOL_LINKS
                  : null;
            if (subLinks) {
              return (
                <Fragment key={link.href}>
                  <Link
                    href={link.href}
                    className={isActive(link.href) ? styles.active : ""}
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                  {subLinks.map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      className={`${styles.mobileSub} ${isActive(l.href) ? styles.active : ""}`}
                      onClick={() => setMobileOpen(false)}
                    >
                      {l.label}
                    </Link>
                  ))}
                </Fragment>
              );
            }
            return (
              <Link
                key={link.href}
                href={link.href}
                className={isActive(link.href) ? styles.active : ""}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/compare"
            className={isActive("/compare") ? styles.active : ""}
            onClick={() => setMobileOpen(false)}
          >
            Compare Packages
          </Link>
          <Link
            href="/travellers-club/dashboard"
            className={isActive("/travellers-club/dashboard") ? styles.active : ""}
            onClick={() => setMobileOpen(false)}
          >
            My account
          </Link>
          <Link href="/trip-builder" className="btn btn-primary" onClick={() => setMobileOpen(false)}>
            Plan My Trip
          </Link>
        </div>
      )}
    </header>
  );
}
