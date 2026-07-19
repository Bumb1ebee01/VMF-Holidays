"use client";

import { Fragment, useActionState, useMemo, useState, useTransition } from "react";
import {
  createUser,
  setUserActive,
  resetUserPassword,
  setUserRole,
  setUserPermissions,
  type TeamActionResult,
} from "@/app/admin/(panel)/team/actions";
import { PERMISSIONS, ROLE_PRESETS, type PermissionKey } from "@/lib/permissions";
import { formatDateTime } from "@/lib/utils";
import shared from "./shared.module.css";
import styles from "./TeamManager.module.css";

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "MEMBER";
  active: boolean;
  permissions: string[];
  createdAt: Date;
}

interface TeamManagerProps {
  users: TeamMember[];
  currentUserId: string;
}

const PERMISSION_GROUPS = Array.from(new Set(PERMISSIONS.map((p) => p.group)));

export default function TeamManager({ users, currentUserId }: TeamManagerProps) {
  const [createState, createAction, creating] = useActionState<TeamActionResult | null, FormData>(
    createUser,
    null
  );
  const [pending, startTransition] = useTransition();
  const [rowError, setRowError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  // Optimistic local copy of each member's permissions so toggles feel instant.
  const initialPerms = useMemo(
    () => Object.fromEntries(users.map((u) => [u.id, u.permissions])),
    [users]
  );
  const [perms, setPerms] = useState<Record<string, string[]>>(initialPerms);

  function run(action: () => Promise<TeamActionResult>) {
    setRowError(null);
    startTransition(async () => {
      const result = await action();
      if ("error" in result) setRowError(result.error);
    });
  }

  function togglePermission(userId: string, key: PermissionKey, on: boolean) {
    const current = perms[userId] ?? [];
    const next = on ? [...new Set([...current, key])] : current.filter((k) => k !== key);
    setPerms((p) => ({ ...p, [userId]: next }));
    run(() => setUserPermissions(userId, next));
  }

  function applyPreset(userId: string, keys: PermissionKey[]) {
    const next = [...keys];
    setPerms((p) => ({ ...p, [userId]: next }));
    run(() => setUserPermissions(userId, next));
  }

  return (
    <div className={styles.wrap}>
      <div className={`${shared.panel} ${shared.panelPad}`}>
        <h2 className={styles.panelTitle}>Add Team Member</h2>
        <form action={createAction} className={styles.createForm}>
          <input name="name" className="form-input" placeholder="Full name" required />
          <input name="email" type="email" className="form-input" placeholder="Email" required />
          <input
            name="password"
            type="text"
            className="form-input"
            placeholder="Temporary password (8+ chars)"
            minLength={8}
            required
          />
          <select name="role" className="form-select" defaultValue="MEMBER">
            <option value="MEMBER">Member</option>
            <option value="ADMIN">Admin</option>
          </select>
          <button type="submit" className="btn btn-primary btn--sm" disabled={creating}>
            {creating ? "Adding…" : "Add Member"}
          </button>
        </form>
        {createState && "error" in createState && (
          <p className={shared.error}>{createState.error}</p>
        )}
        {createState && "ok" in createState && (
          <p className={shared.success}>Member added. Share the temporary password with them securely.</p>
        )}
      </div>

      {rowError && <p className={shared.error}>{rowError}</p>}

      <div className={shared.panel}>
        <table className={shared.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Access</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const isSelf = u.id === currentUserId;
              const isAdmin = u.role === "ADMIN";
              const granted = perms[u.id] ?? [];
              const open = expanded === u.id;
              return (
                <Fragment key={u.id}>
                  <tr className={u.active ? "" : styles.inactiveRow}>
                    <td>{u.name}{isSelf && <span className={styles.you}> (you)</span>}</td>
                    <td>{u.email}</td>
                    <td>
                      <select
                        className={`form-select ${styles.roleSelect}`}
                        value={u.role}
                        disabled={isSelf || pending}
                        onChange={(e) => run(() => setUserRole(u.id, e.target.value))}
                      >
                        <option value="MEMBER">Member</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                    </td>
                    <td>
                      {isAdmin ? (
                        <span className={styles.fullAccess}>Full access</span>
                      ) : (
                        <button
                          type="button"
                          className={styles.permToggle}
                          onClick={() => setExpanded(open ? null : u.id)}
                        >
                          {granted.length}/{PERMISSIONS.length} {open ? "▴" : "▾"}
                        </button>
                      )}
                    </td>
                    <td>{u.active ? "Active" : "Deactivated"}</td>
                    <td className={styles.dateCell}>{formatDateTime(u.createdAt)}</td>
                    <td>
                      <div className={styles.rowActions}>
                        <button
                          type="button"
                          className={styles.smallBtn}
                          disabled={pending}
                          onClick={() => {
                            const pw = prompt(`New password for ${u.name} (8+ characters):`);
                            if (pw) run(() => resetUserPassword(u.id, pw));
                          }}
                        >
                          Reset password
                        </button>
                        {!isSelf && (
                          <button
                            type="button"
                            className={`${styles.smallBtn} ${u.active ? styles.deactivate : ""}`}
                            disabled={pending}
                            onClick={() => run(() => setUserActive(u.id, !u.active))}
                          >
                            {u.active ? "Deactivate" : "Reactivate"}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                  {open && !isAdmin && (
                    <tr className={styles.permRow}>
                      <td colSpan={7}>
                        <div className={styles.presetBar}>
                          <span className={styles.presetLabel}>Apply role preset</span>
                          {ROLE_PRESETS.map((pr) => (
                            <button
                              key={pr.key}
                              type="button"
                              className={styles.presetBtn}
                              title={pr.hint}
                              disabled={pending}
                              onClick={() => applyPreset(u.id, pr.keys)}
                            >
                              {pr.label}
                            </button>
                          ))}
                        </div>
                        <div className={styles.permPanel}>
                          {PERMISSION_GROUPS.map((group) => (
                            <div key={group} className={styles.permGroup}>
                              <span className={styles.permGroupLabel}>{group}</span>
                              {PERMISSIONS.filter((p) => p.group === group).map((p) => (
                                <label key={p.key} className={styles.permItem} title={p.hint}>
                                  <input
                                    type="checkbox"
                                    checked={granted.includes(p.key)}
                                    disabled={pending}
                                    onChange={(e) => togglePermission(u.id, p.key, e.target.checked)}
                                  />
                                  <span>{p.label}</span>
                                </label>
                              ))}
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
