"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/admin/login/actions";
import type { SafeUser } from "@/lib/auth/user";
import styles from "./AdminSidebar.module.css";

const NAV = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/packages", label: "Packages" },
  { href: "/admin/destinations", label: "Destinations" },
  { href: "/admin/testimonials", label: "Testimonials" },
];

export default function AdminSidebar({ user }: { user: SafeUser }) {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <aside className={styles.sidebar}>
      <Link href="/admin" className={styles.logo}>
        <span className={styles.logoVmf}>VMF</span>
        <span className={styles.logoHols}>Holidays</span>
      </Link>
      <p className={styles.consoleLabel}>Team Console</p>

      <nav className={styles.nav}>
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.navLink} ${isActive(item.href, item.exact) ? styles.navActive : ""}`}
          >
            {item.label}
          </Link>
        ))}
        {user.role === "ADMIN" && (
          <Link
            href="/admin/team"
            className={`${styles.navLink} ${isActive("/admin/team") ? styles.navActive : ""}`}
          >
            Team
          </Link>
        )}
      </nav>

      <div className={styles.footer}>
        <Link href="/" className={styles.viewSite} target="_blank">
          View Site ↗
        </Link>
        <div className={styles.userRow}>
          <div className={styles.avatar}>{user.name.charAt(0)}</div>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{user.name}</span>
            <span className={styles.userRole}>{user.role === "ADMIN" ? "Admin" : "Member"}</span>
          </div>
        </div>
        <form action={logout}>
          <button type="submit" className={styles.logoutBtn}>Sign out</button>
        </form>
      </div>
    </aside>
  );
}
