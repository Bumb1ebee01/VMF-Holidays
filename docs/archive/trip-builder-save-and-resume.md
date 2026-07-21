# Archived: Trip Builder "save & resume"

**Status:** Built, then the feature was cancelled. Not merged, not deployed.
**Archived:** 22 July 2026 · **⚠️ Flagged for review → delete**

- **Branch:** `trip-builder/save-and-resume` (2 commits, tip `5522b2c`)
- **Permanent tag:** `archive/trip-builder-save-and-resume` — survives deletion of the branch
- **Recover with:** `git checkout archive/trip-builder-save-and-resume`

---

## What it contained

| Piece | Verdict |
|---|---|
| `TripDraft` table — one saved wizard state per member, stored as JSON | Archived |
| Server actions to save / load / clear a draft | Archived |
| "You have a saved trip" resume banner, with restore and dismiss | Archived |
| "Save and finish later" button in the wizard footer | Archived |
| **Progress bar through the six steps** | ✅ **Salvaged — now on `main` (`19e47c1`)** |

The progress bar was independent of the rest and has been cherry-picked. Everything
else stays here.

## Why save & resume was dropped

Decided 2026-07-06, and re-reviewed on 2026-07-21 against the actual code — the
reasoning held:

- **It only works for logged-in Travellers Club members.** Most Trip Builder
  visitors are not logged in, so it is invisible to the people most likely to
  abandon the wizard.
- **It costs a table and a migration** for a form that is mostly tap-to-select and
  finishable in one sitting.
- **The "bring people back" job is already covered** by contextual WhatsApp, the
  enquiry flow and price-drop alerts.
- The version with real payoff — cross-device resume via phone + OTP, the "trip
  scratchpad" from §6 of the execution plan — is a much larger build that was
  separately assessed as low leverage.

## Before reviving it

The schema additions were **never applied to the database** — confirmed during the
`db:push` on 2026-07-21, which showed no `TripDraft` table. Any revival needs a
fresh `db:push`, and the branch is far behind `main`, so rebuild rather than merge.

## Deleting this

Once you are content the work is not coming back, delete the branch:

```
git push origin --delete trip-builder/save-and-resume
git branch -D trip-builder/save-and-resume
```

The tag keeps the code recoverable forever, so nothing is lost.
