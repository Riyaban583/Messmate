# Memory

This file is the project's running context log. Its job is continuity — for a human picking the project back up after a break, or an AI assistant that has no memory of previous sessions. Update it at the end of every work session, however small.

---

## 1. Memory (durable context — decisions that shouldn't need re-explaining)

Things that are already decided and shouldn't be re-litigated without a good reason:

- Product name: **MessMate**. MVP scope is fixed at: auth, menu, 1–5 star feedback, complaints, food suggestions, basic admin analytics (see `phases.md` and `product-requirements.md`).
- Stack is locked: React + Tailwind (client), Node/Express + Mongoose + MongoDB (server), JWT + bcrypt for auth. Do not swap the database or framework mid-project without updating `architecture.md` first.
- Duplicate-vote prevention is a **database-level unique index** (`studentId + foodId + date`), not just a frontend check — this was a deliberate decision, don't "simplify" it away.
- Role checks (`student` vs `admin`) are always enforced server-side, even if the UI already hides the control.
- Color/typography decisions live in `design.md` — don't introduce new colors or fonts ad hoc; extend that file first.

## 2. What happened (append-only history)

Newest entry on top. One or two lines per session — what was decided or built, not a full diff.

```
2026-08-26 — Initial documentation suite created: README, docs/ (architecture, database,
api, setup, contribution), design.md, phases.md, rules.md, root architecture.md, and
product-requirements.md, based on the original MessMate concept spec. No code written yet.
```

## 3. Currently working (what's in flight right now)

Update this section whenever the active task changes — it should always reflect the *current* state, not history.

```
Status: Planning complete, no implementation started.
Next up: Phase 1 — Login & Authentication (see phases.md).
Blocking: none.
```

## 4. Updates (running changelog, most recent first)

For meaningful changes to scope, architecture, or decisions — not routine commits.

```
2026-08-26 — Docs suite created (README, docs/*, design.md, phases.md, rules.md,
architecture.md, product-requirements.md, memory.md).
```

## 5. Purpose

This file exists so that:

1. **A new developer** can read `memory.md` top to bottom and know what's true right now, what's already decided, and what's in progress — without spelunking through commit history.
2. **An AI coding assistant** picking up the project in a fresh session (no memory of prior conversations) has a compact source of truth instead of re-deriving context from scratch or, worse, guessing.
3. **Decisions stay decided.** Section 1 exists specifically to stop re-litigating settled architecture/design choices every few weeks.

**Maintenance rule:** keep entries short (1–3 lines). If an update needs more explanation, put the detail in the relevant doc (`architecture.md`, `design.md`, `rules.md`, etc.) and just link/reference it here.
