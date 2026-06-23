"use client";

import { useEffect, useState } from "react";
import AdminSidebar from "./AdminSidebar";
import TopBar from "./TopBar";
import type { SafeUser } from "@/lib/auth/user";
import styles from "./AdminShell.module.css";

export type NavState = "full" | "collapsed" | "hidden";

export default function AdminShell({
  user,
  newLeads,
  children,
}: {
  user: SafeUser;
  newLeads: number;
  children: React.ReactNode;
}) {
  const [nav, setNav] = useState<NavState>("full");

  useEffect(() => {
    // Restore the persisted sidebar state once on mount (external store sync).
    const saved = localStorage.getItem("vmf-admin-nav") as NavState | null;
    if (saved === "full" || saved === "collapsed" || saved === "hidden") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setNav(saved);
    }
  }, []);

  function cycleNav() {
    setNav((prev) => {
      const next: NavState = prev === "full" ? "collapsed" : prev === "collapsed" ? "hidden" : "full";
      localStorage.setItem("vmf-admin-nav", next);
      return next;
    });
  }

  return (
    <div className={styles.shell}>
      <AdminSidebar user={user} navState={nav} />
      <div className={styles.content}>
        <TopBar user={user} newLeads={newLeads} onToggleNav={cycleNav} />
        <main className={styles.main}>{children}</main>
      </div>
    </div>
  );
}
