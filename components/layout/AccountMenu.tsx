"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { logoutMember } from "@/app/(site)/travellers-club/actions";
import styles from "./AccountMenu.module.css";

// Header account area (WI-9). Optimistically shows Log in / Sign up, then swaps to
// an avatar + "Hi, {firstName}" dropdown once the client confirms a member session.
export default function AccountMenu({ onLight }: { onLight: boolean }) {
  const [member, setMember] = useState<{ firstName: string } | null>(null);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let alive = true;
    fetch("/api/club/me", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (alive && d.loggedIn) setMember({ firstName: d.firstName });
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  if (!member) {
    return (
      <div className={`${styles.auth} ${onLight ? styles.light : ""}`}>
        <Link href="/travellers-club/login" className={styles.login}>Log in</Link>
        <Link href="/travellers-club" className={styles.signup}>Sign up</Link>
      </div>
    );
  }

  const initial = member.firstName.charAt(0).toUpperCase() || "M";
  return (
    <div className={`${styles.wrap} ${onLight ? styles.light : ""}`} ref={ref}>
      <button
        type="button"
        className={styles.chip}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className={styles.avatar}>{initial}</span>
        <span className={styles.name}>Hi, {member.firstName}</span>
      </button>
      {open && (
        <div className={styles.menu} role="menu">
          <Link href="/travellers-club/dashboard" role="menuitem" onClick={() => setOpen(false)}>
            Dashboard
          </Link>
          <form action={logoutMember}>
            <button type="submit" role="menuitem" className={styles.logout}>Log out</button>
          </form>
        </div>
      )}
    </div>
  );
}
