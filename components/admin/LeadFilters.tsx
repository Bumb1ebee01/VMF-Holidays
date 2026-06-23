"use client";

import { useRef } from "react";
import { IconSearch } from "./icons";
import styles from "./LeadFilters.module.css";

const SOURCES = [
  { value: "", label: "All sources" },
  { value: "CONTACT_FORM", label: "Contact Form" },
  { value: "TRIP_WIZARD", label: "Trip Builder" },
  { value: "PACKAGE_PAGE", label: "Package Page" },
  { value: "OTHER", label: "Other" },
];

export default function LeadFilters({
  q,
  source,
  assignee,
  view,
  status,
  users,
}: {
  q: string;
  source: string;
  assignee: string;
  view: string;
  status: string;
  users: { id: string; name: string }[];
}) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form ref={formRef} className={styles.filters} action="/admin/leads">
      {view && <input type="hidden" name="view" value={view} />}
      {status && <input type="hidden" name="status" value={status} />}

      <div className={styles.searchWrap}>
        <IconSearch size={15} className={styles.searchIcon} />
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Search name, email, phone…"
          className={styles.search}
        />
      </div>

      <select
        name="source"
        defaultValue={source}
        className={styles.select}
        onChange={() => formRef.current?.requestSubmit()}
      >
        {SOURCES.map((s) => (
          <option key={s.value} value={s.value}>{s.label}</option>
        ))}
      </select>

      <select
        name="assignee"
        defaultValue={assignee}
        className={styles.select}
        onChange={() => formRef.current?.requestSubmit()}
      >
        <option value="">Anyone</option>
        {users.map((u) => (
          <option key={u.id} value={u.id}>{u.name}</option>
        ))}
      </select>
    </form>
  );
}
