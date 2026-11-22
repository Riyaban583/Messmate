# Design

## 1. UI/UX & Colour Theme

### Design principles

- **Mobile-first.** Most of the 500+ students will use this from a phone in the mess line or hostel room — every screen is designed for a ~375px viewport first, then scaled up.
- **One-tap feedback.** The single most common action (rating today's meal) should never require more than a tap and a submit — no multi-step wizards for the core loop.
- **Calm, not noisy.** Admins are scanning a dashboard, not playing a game. Flat surfaces, no gradients/glow, generous whitespace, restrained color.
- **Status is always visible.** Complaint status, vote confirmation, and submission state are never ambiguous — every action gets a clear success/error/pending state.
- **Empty and loading states are designed, not default.** "No complaints yet" and a skeleton loader are part of the UI, not an afterthought.

### Colour palette

A warm accent (food, appetite, hostel-mess energy) on a neutral, low-fatigue base — with a clear semantic set for ratings and complaint status.

| Role | Token | Hex | Usage |
|---|---|---|---|
| Primary | `--color-primary` | `#D85A30` (coral/burnt-orange) | Primary buttons, active nav, key CTAs |
| Primary hover | `--color-primary-hover` | `#993C1D` | Hover/pressed states |
| Secondary | `--color-secondary` | `#0F6E56` (teal) | Secondary actions, admin analytics accents |
| Neutral 900 | `--color-text-primary` | `#2C2C2A` | Body text |
| Neutral 600 | `--color-text-secondary` | `#5F5E5A` | Muted text, captions |
| Neutral 100 | `--color-surface` | `#F1EFE8` | Page background |
| Neutral 0 | `--color-card` | `#FFFFFF` | Cards, modals |
| Border | `--color-border` | `#D3D1C7` | Hairlines, dividers |
| Success | `--color-success` | `#3B6D11` (on `#EAF3DE`) | Resolved complaints, positive ratings (4–5⭐) |
| Warning | `--color-warning` | `#854F0B` (on `#FAEEDA`) | Pending / under review, mid ratings (2.5–4⭐) |
| Danger | `--color-danger` | `#A32D2D` (on `#FCEBEB`) | Rejected, urgent complaints, low ratings (<2.5⭐) |
| Info | `--color-info` | `#185FA5` (on `#E6F1FB`) | Neutral notices, "under review" badges |

**Rules:**
- Text on a colored fill always uses the 700–900 shade from that same family — never plain black/gray on a tint.
- Rating colors are semantic, not decorative: ≥4★ green, 2.5–4★ amber, <2.5★ red, everywhere in the app (menu cards, admin food-performance table, complaint priority).
- Dark mode: invert neutral scale (`#1C1B18` background, `#F1EFE8` text), keep primary/secondary/semantic hues as-is but shift fills to their 800-stop equivalents for contrast.
- No gradients, drop shadows, or neon effects. Flat fills + a single hairline border for elevation.

### Component conventions

- **Buttons:** primary (filled coral), secondary (outlined teal), destructive (filled danger) — three variants only. No more than one primary button visible per screen.
- **Cards:** `12px` radius, `1px` border in `--color-border`, `16px` internal padding minimum.
- **Rating control:** filled star row, tap-to-set, always paired with a numeric label ("4/5") for accessibility.
- **Status badges:** pill-shaped, semantic color pair (light fill + dark text from the same ramp) — Pending / Under Review / In Progress / Resolved / Rejected.
- **Toasts:** used for every write action (feedback submitted, complaint filed, status updated) — 3s auto-dismiss, manually dismissible.

---

## 2. Fonts & Typography

### Typeface

- **Primary (UI + body):** `Inter` — clean, highly legible at small sizes, wide language support, free and self-hostable.
- **Fallback stack:** `Inter, "Segoe UI", system-ui, -apple-system, Roboto, sans-serif`
- No serif or display font is used anywhere in the product — this is a utility app, not an editorial one.

### Type scale

| Token | Size | Weight | Line height | Usage |
|---|---|---|---|---|
| `text-h1` | 28px | 600 | 1.3 | Page titles ("Today's menu") |
| `text-h2` | 22px | 600 | 1.35 | Section headers ("Lunch", "Complaints") |
| `text-h3` | 18px | 500 | 1.4 | Card titles, KPI labels |
| `text-body` | 16px | 400 | 1.6 | Default body text |
| `text-body-sm` | 14px | 400 | 1.5 | Secondary text, form helper text |
| `text-caption` | 12px | 400 | 1.4 | Timestamps, meta info, badge labels |
| `text-numeric` | 32px | 600 | 1.2 | KPI card numbers (e.g. "523 students") |

### Rules

- Only two weights across the whole app: 400 (regular) and 600 (semibold). Avoid 500/700 to keep visual weight consistent — exception: card titles at 500 where 600 feels too heavy next to a KPI number.
- Sentence case everywhere. No ALL CAPS headers, no Title Case buttons.
- Minimum body text size is 14px; never go below that for anything a student reads on a phone.
- Numeric KPIs (dashboard) get their own larger, bolder scale so they scan instantly — this is the one place typography is allowed to be loud.

---

## 3. Memory & UI Preference

"Memory" here means **per-user UI state that should persist across sessions** so the app doesn't reset to defaults every time a student or admin logs back in.

### What gets remembered

| Preference | Scope | Storage |
|---|---|---|
| Theme (light/dark) | Per device | `localStorage` (client-only, not synced) |
| Last-viewed meal tab (Breakfast/Lunch/Dinner) | Per device | `localStorage` |
| Admin dashboard date-range filter | Per user | Backend (`users.preferences`) so it follows them across devices |
| Admin table sort/column preferences | Per user | Backend (`users.preferences`) |
| Dismissed "how to vote" onboarding tip | Per user | Backend, one-time flag |

### Rules

- **Never store anything sensitive in `localStorage`** — no tokens beyond the short-lived JWT needed for API calls, no PII.
- Preferences that should follow a student between their phone and a shared hostel PC belong in the database (`users.preferences: { theme, dashboardFilters, ... }`), not just the browser.
- Preferences are *non-blocking* — if a preference fails to load, the app falls back to sane defaults (light theme, today's date, unsorted table) rather than erroring out.
- This section applies to product UI state. It is unrelated to `memory.md`, which tracks project/build context for whoever (human or AI) is working on the codebase.
