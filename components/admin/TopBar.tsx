"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { logout } from "@/app/admin/login/actions";
import type { SafeUser } from "@/lib/auth/user";
import { can } from "@/lib/permissions";
import { IconSearch, IconBell, IconMenu, IconChevronDown, IconExternal, IconTeam, IconLogout } from "./icons";
import styles from "./TopBar.module.css";

const CRUMB_LABELS: Record<string, string> = {
  leads: "Leads",
  packages: "Packages",
  destinations: "Destinations",
  testimonials: "Testimonials",
  activity: "Activity",
  team: "Team",
  new: "New",
};

function useBreadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean); // e.g. ["admin","leads","abc"]
  const crumbs: { label: string; href: string }[] = [{ label: "Dashboard", href: "/admin" }];
  let acc = "/admin";
  for (const seg of segments.slice(1)) {
    acc += `/${seg}`;
    const label = CRUMB_LABELS[seg] ?? (seg.length > 14 ? "Detail" : seg);
    crumbs.push({ label, href: acc });
  }
  return crumbs;
}

export default function TopBar({
  user,
  newLeads,
  onToggleNav,
}: {
  user: SafeUser;
  newLeads: number;
  onToggleNav: () => void;
}) {
  const canViewLeads = can(user, "leads:view");
  const crumbs = useBreadcrumbs();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    function onDocClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [menuOpen]);

  return (
    <header className={styles.bar}>
      <div className={styles.left}>
        <button type="button" className={styles.iconBtn} onClick={onToggleNav} aria-label="Toggle sidebar">
          <IconMenu size={18} />
        </button>
        <nav className={styles.crumbs} aria-label="Breadcrumb">
          {crumbs.map((c, i) => (
            <span key={c.href} className={styles.crumbItem}>
              {i > 0 && <span className={styles.crumbSep}>/</span>}
              {i === crumbs.length - 1 ? (
                <span className={styles.crumbCurrent}>{c.label}</span>
              ) : (
                <Link href={c.href} className={styles.crumbLink}>{c.label}</Link>
              )}
            </span>
          ))}
        </nav>
      </div>

      {canViewLeads && (
        <form className={styles.search} action="/admin/leads">
          <IconSearch size={16} className={styles.searchIcon} />
          <input
            type="search"
            name="q"
            placeholder="Search leads…"
            className={styles.searchInput}
            aria-label="Search leads"
          />
        </form>
      )}

      <div className={styles.actions}>
        {canViewLeads && (
          <Link
            href="/admin/leads?status=NEW"
            className={styles.bell}
            aria-label={`${newLeads} new leads`}
            title={`${newLeads} new lead${newLeads === 1 ? "" : "s"}`}
          >
            <IconBell size={17} />
            {newLeads > 0 && <span className={styles.badge}>{newLeads > 9 ? "9+" : newLeads}</span>}
          </Link>
        )}
        <ThemeToggle />

        <div className={styles.profile} ref={menuRef}>
          <button
            type="button"
            className={styles.profileBtn}
            onClick={() => setMenuOpen((o) => !o)}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
          >
            <span className={styles.avatar}>{user.name.charAt(0)}</span>
            <span className={styles.profileMeta}>
              <span className={styles.profileName}>{user.name}</span>
              <span className={styles.profileRole}>{user.role === "ADMIN" ? "Administrator" : "Member"}</span>
            </span>
            <IconChevronDown size={14} className={styles.profileChevron} />
          </button>

          {menuOpen && (
            <div className={styles.menu} role="menu">
              <div className={styles.menuHead}>
                <span className={styles.menuName}>{user.name}</span>
                <span className={styles.menuEmail}>{user.email}</span>
              </div>
              <Link href="/" target="_blank" className={styles.menuItem} role="menuitem" onClick={() => setMenuOpen(false)}>
                <IconExternal size={15} /> View site
              </Link>
              {user.role === "ADMIN" && (
                <Link href="/admin/team" className={styles.menuItem} role="menuitem" onClick={() => setMenuOpen(false)}>
                  <IconTeam size={15} /> Team & roles
                </Link>
              )}
              <form action={logout} className={styles.menuForm}>
                <button type="submit" className={`${styles.menuItem} ${styles.menuDanger}`} role="menuitem">
                  <IconLogout size={15} /> Sign out
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
