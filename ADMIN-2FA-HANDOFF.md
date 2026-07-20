# Admin 2FA (TOTP) — handoff notes

**Branch:** `feature/admin-2fa-totp`
**Status:** Feature-complete, typechecks, lints. **Not verified end-to-end — see "What's left".**
**Written:** 21 July 2026

---

## What this adds

Opt-in two-factor authentication for the `/admin` panel, using TOTP (the 6-digit
rotating code from Google/Microsoft Authenticator). It is **opt-in per user** —
deploying it changes nothing for anyone until they switch it on themselves, so
there is no lockout risk on release.

| Area | File |
|---|---|
| Crypto core (RFC 6238, no external dependency) | `lib/auth/totp.ts` |
| Correctness test | `scripts/_totp-test.ts` → `npm run test:totp` |
| Short-lived "password OK, awaiting code" ticket | `lib/auth/session.ts` |
| Enrol / disable server actions | `app/admin/(panel)/security/actions.ts` |
| Settings UI | `app/admin/(panel)/security/` |
| Second login step | `app/admin/login/verify/` |
| Lockout recovery | `scripts/disable-2fa.ts` → `npm run 2fa:disable -- <email>` |

**How the login flow now works:** password is checked as before, but if the user
has 2FA on, `app/admin/login/actions.ts` mints a 5-minute pending JWT ticket
instead of a session and redirects to `/admin/login/verify`. Only that page's
action creates the real session. The pending ticket grants no access on its own.

---

## What's already been verified

- `npm run test:totp` — 9/9 pass, including both RFC 6238 reference vectors,
  ±1-step clock tolerance, and encrypt/tamper-reject.
- `npx tsc --noEmit` and `npx eslint` — both clean.
- **The DB columns are already live in Neon.** `db:push` was run on 20 July 2026;
  `totpEnabled` / `totpSecret` / `totpBackupCodes` were confirmed present by
  querying the real database. **You do not need to run `db:push` for this branch.**
- Route guards: `/admin/login/verify` correctly 307s away with no pending ticket;
  `/admin/security` redirects when signed out.
- Bypass audit: only two places in the codebase call `createSession()`, and both
  respect the 2FA check. Password reset does **not** auto-login, so it can't be
  used to skip the second factor.

---

## What's left — please do this before merging

### 1. Drive the flow end-to-end (the main gap)

Nobody has actually clicked through this yet. It typechecks and the logic reads
correctly, but the UI wiring and the full password → code → session path have not
been observed. Please walk it:

1. Sign in to `/admin`, go to **Security** in the sidebar (under Oversight).
2. Click **Set up two-factor**. Add the displayed key to an authenticator app.
3. Enter the 6-digit code → you should get 8 backup codes, shown once.
4. Sign out, sign back in → you should land on the code prompt, not the dashboard.
5. Test a **backup code** works, and that the *same* code is rejected the second
   time (they're single-use).
6. Test **Turn off** from the Security page.
7. Check the page in **dark mode** — it was built for both themes but hasn't been
   eyeballed.

### 2. Decide: QR code?

There's no QR library in the project, and I didn't want to add a production
dependency without a decision. Right now enrollment shows the manual setup key
plus a tappable `otpauth://` link — functional, but scanning is nicer. Adding
`qrcode` (small, server-side only) and rendering a data-URI would close it.

### 3. Rate limiting is weaker in production than it looks

`lib/ratelimit.ts` falls back to an **in-memory** limiter when Upstash isn't
configured, and there are currently no `UPSTASH_REDIS_REST_*` env vars. On Vercel
that memory is per-serverless-instance, so the caps leak across instances. This
affects the **existing login lockout** too, not just 2FA — it's a pre-existing
issue this branch inherits rather than causes. Worth wiring up Upstash (free tier
is enough) as a separate task.

---

## Gotchas

- **`AUTH_SECRET` is now load-bearing.** It derives the AES-256-GCM key that
  encrypts stored TOTP secrets. If it's rotated or differs in Vercel, every
  enrolled user's authenticator stops working. Backup codes still work (bcrypt,
  hashed independently), so it's recoverable — but don't rotate it casually.
  Confirm it's set in Vercel prod before merging.
- **Locked out?** `npm run 2fa:disable -- someone@vmfholidays.com` clears 2FA for
  one user. Needs `DATABASE_URL`, so it's CLI-only and unreachable from the web.
  Ask them to re-enrol straight after.
- Backup codes are shown **once** at enrollment and never again. Running out means
  turning 2FA off and on again to reissue.
- `startTotpSetup()` is guarded against being re-run while already enrolled —
  without that guard it would have overwritten the secret and silently cleared
  the user's 2FA.

---

## Merging

This branch is based on `main` @ `61a5301` and contains one commit. `main` itself
is untouched, so nothing here is queued for production. Note that the DB schema
is **already ahead** of `main` (see above) — the columns are additive and
nullable/defaulted, so `main` runs fine without this branch.
