"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import type { SafeUser } from "@/lib/auth/user";
import { can, type PermissionKey } from "@/lib/permissions";
import type { NavState } from "./AdminShell";
import {
  IconDashboard,
  IconLeads,
  IconPackage,
  IconMap,
  IconStar,
  IconBook,
  IconTag,
  IconImage,
  IconActivity,
  IconTeam,
  IconWallet,
  IconExternal,
  type AdminIcon,
} from "./icons";
import styles from "./AdminSidebar.module.css";

type NavItem = {
  href: string;
  label: string;
  icon: AdminIcon;
  exact?: boolean;
  perm?: PermissionKey;
  adminOnly?: boolean;
};

type NavGroup = { heading: string; items: NavItem[] };

const GROUPS: NavGroup[] = [
  {
    heading: "Overview",
    items: [{ href: "/admin", label: "Dashboard", icon: IconDashboard, exact: true }],
  },
  {
    heading: "Workspace",
    items: [
      { href: "/admin/leads", label: "Leads", icon: IconLeads, perm: "leads:view" },
      { href: "/admin/bookings", label: "Bookings", icon: IconWallet, perm: "bookings:view" },
      { href: "/admin/price-alerts", label: "Price Alerts", icon: IconTag, perm: "leads:view" },
      { href: "/admin/packages", label: "Packages", icon: IconPackage, perm: "packages:manage" },
      { href: "/admin/destinations", label: "Destinations", icon: IconMap, perm: "destinations:manage" },
      { href: "/admin/trip-builder", label: "Trip Builder", icon: IconMap, perm: "destinations:manage" },
      { href: "/admin/testimonials", label: "Testimonials", icon: IconStar, perm: "testimonials:manage" },
      { href: "/admin/blog", label: "Blog", icon: IconBook, perm: "posts:manage" },
      { href: "/admin/offers", label: "Offers", icon: IconTag, perm: "offers:manage" },
      { href: "/admin/gallery", label: "Gallery", icon: IconImage, perm: "gallery:manage" },
    ],
  },
  {
    heading: "Travellers Club",
    items: [
      { href: "/admin/members", label: "Members", icon: IconTeam, perm: "members:view" },
      { href: "/admin/redemptions", label: "Redemptions", icon: IconTag, perm: "members:manage" },
      { href: "/admin/engagement", label: "Engagement", icon: IconStar, perm: "members:manage" },
      { href: "/admin/reconciliation", label: "Reconciliation", icon: IconActivity, perm: "members:manage" },
    ],
  },
  {
    heading: "Oversight",
    items: [
      { href: "/admin/activity", label: "Activity", icon: IconActivity },
      { href: "/admin/team", label: "Team", icon: IconTeam, adminOnly: true },
    ],
  },
];

export default function AdminSidebar({ user, navState }: { user: SafeUser; navState: NavState }) {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const visible = (item: NavItem) => {
    if (item.adminOnly) return user.role === "ADMIN";
    if (item.perm) return can(user, item.perm);
    return true;
  };

  return (
    <aside className={`${styles.sidebar} ${styles[navState]}`}>
      <div className={styles.inner}>
        <Link href="/admin" className={styles.logo} title="VMF Holidays">
          <Image
            src="/logo-white.png"
            alt="VMF Holidays"
            width={150}
            height={62}
            className={`${styles.logoImg} ${styles.wordmark}`}
            priority
          />
          <Image
            src="/logo-emblem.png"
            alt="VMF"
            width={40}
            height={28}
            className={`${styles.logoImg} ${styles.emblem}`}
          />
        </Link>
        <p className={`${styles.consoleLabel} ${styles.hideText}`}>Team Console</p>

        <nav className={styles.nav}>
          {GROUPS.map((group) => {
            const items = group.items.filter(visible);
            if (items.length === 0) return null;
            return (
              <div key={group.heading} className={styles.group}>
                <p className={`${styles.groupHeading} ${styles.hideText}`}>{group.heading}</p>
                {items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href, item.exact);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      title={item.label}
                      className={`${styles.navLink} ${active ? styles.navActive : ""}`}
                    >
                      <Icon size={17} className={styles.navIcon} />
                      <span className={styles.hideText}>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            );
          })}
        </nav>

        <div className={styles.footer}>
          <Link href="/" className={styles.viewSite} target="_blank" title="View site">
            <IconExternal size={15} />
            <span className={styles.hideText}>View Site</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}
