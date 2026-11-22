# Rules

Working conventions for anyone — human or AI — contributing to MessMate. When in doubt, follow this file over personal habit or a framework's default.

---

## 1. What to use / what to avoid

### Use

- **Functional React components + hooks.** No class components.
- **Tailwind utility classes** for styling. Component-level Tailwind, not global CSS files, except for true resets/variables.
- **Async/await** for all asynchronous code — backend and frontend. No unchained `.then()` pyramids.
- **Named exports** for utilities/services; default export only for React components and Express routers.
- **Environment variables** (`process.env`) for all config/secrets — see `docs/setup.md`.
- **Mongoose schemas with explicit validation** (`required`, `enum`, `min`/`max`) — don't rely on frontend validation alone.
- **REST conventions** already defined in `docs/api.md` — don't invent parallel endpoint shapes for the same resource.

### Avoid

- **No `any`-shaped, untyped API responses.** Every controller returns the standard `{ success, message, data }` shape (see §4).
- **No business logic in route files.** Routes call controllers; controllers call services; services touch models. Don't collapse the layers for "speed."
- **No direct DOM manipulation in React** (`document.querySelector` etc.) — use refs/state.
- **No inline styles in React** except for truly dynamic, computed values (e.g. a progress-bar width) — everything else is Tailwind.
- **No `localStorage`/`sessionStorage` for anything beyond the JWT and pure UI preferences** (see `design.md` §3). Never store PII or business data there.
- **No silent catch blocks.** Every `catch` either handles the error meaningfully or re-throws/logs it — never `catch (e) {}`.
- **No committing `.env`, `node_modules/`, or build output** — see `.gitignore`.

---

## 2. Libraries & dependencies

### Approved (already decided in `architecture.md`)

| Layer | Library | Notes |
|---|---|---|
| Frontend framework | React | Functional components + hooks only |
| Styling | Tailwind CSS | No CSS-in-JS libraries |
| HTTP client | Axios | Centralized instance in `services/api.js` with interceptors for auth headers |
| Routing | React Router | — |
| Charts | Recharts | Admin analytics only |
| Backend framework | Express | — |
| ODM | Mongoose | — |
| Auth | jsonwebtoken + bcrypt | — |
| Validation | Mongoose schema validation (+ a lightweight request validator like `zod` or `express-validator` at the controller boundary) | Pick one validator and use it everywhere — don't mix |
| Env config | dotenv | — |
| CORS | cors | Restrict to `CLIENT_URL` in production |

### Adding a new dependency

Before adding any new package:
1. Check it isn't already solved by something in the approved list above.
2. Prefer a library already used elsewhere in the stack over introducing a second tool for the same job (e.g. don't add `moment.js` if `date-fns` or native `Date` already covers the need).
3. Note the addition and the reason in `memory.md` → "Updates" so the decision has a paper trail.
4. Avoid dependencies with no recent maintenance activity or with heavy, rarely-used feature surfaces for a small task.

---

## 3. Error handling

- **Consistent shape, always:**
  ```json
  { "success": false, "message": "Human-readable message" }
  ```
  ```json
  { "success": true, "data": { } }
  ```
- **HTTP status codes are meaningful and consistent:**

  | Code | Meaning |
  |---|---|
  | 400 | Bad request / validation failure |
  | 401 | Not authenticated (missing/invalid JWT) |
  | 403 | Authenticated but not authorized (wrong role) |
  | 404 | Resource not found |
  | 409 | Conflict (e.g. duplicate feedback submission) |
  | 500 | Unexpected server error |

- **Centralized error middleware** in Express catches everything — controllers throw/pass errors, they don't format responses themselves.
- **Never leak internals to the client.** Stack traces, raw Mongoose error messages, and DB connection strings never reach the response body — log them server-side, return a clean message to the client.
- **Frontend:** every API call site handles the error case explicitly (toast + inline message) — no unhandled promise rejections, no silent failures that leave the UI looking "stuck."

---

## 4. Boundaries of AI

Ground rules for any AI assistant (Claude Code or otherwise) working in this repo:

- **Follow this doc suite over defaults.** `design.md`, `phases.md`, `rules.md`, `architecture.md`, `product-requirements.md`, and `memory.md` are the source of truth — don't fall back to generic framework conventions when they conflict with what's written here.
- **Don't change locked decisions silently.** Stack, auth strategy, DB choice, and duplicate-vote enforcement (see `memory.md` §1) are fixed. If a change is genuinely warranted, flag it explicitly and update `memory.md` — don't just swap it mid-task.
- **Don't invent scope.** Stick to the phase currently in progress (`memory.md` §3, `phases.md`). Building ahead into a later phase without being asked creates untested, unreviewed surface area.
- **Never commit secrets.** No API keys, JWT secrets, or DB URIs in code, comments, or example files — env vars only.
- **Ask before destructive operations.** Dropping/altering collections, force-pushing, deleting files outside the working scope, or resetting the database require explicit confirmation first.
- **Update `memory.md`** after any session that changes scope, architecture, or adds a dependency — this is how continuity is maintained across sessions that have no shared memory.
- **Security-sensitive code gets extra scrutiny.** Auth middleware, password handling, and role checks should be reviewed carefully rather than generated and left unchecked — these are the highest-cost places to get wrong.
- **When uncertain, state the assumption rather than guessing silently.** If a requirement is ambiguous, pick the most reasonable interpretation, say so, and proceed — don't block, but don't hide the assumption either.

---

## 5. General rules

- **Git:** feature branches off `develop`, never commit straight to `main` (see `docs/contribution.md`). Small, focused commits with descriptive messages.
- **Definition of Done** (full detail in `docs/contribution.md`): a feature isn't done until it has frontend + API + validation + auth + authorization + DB + error handling + tests + docs.
- **Docs stay current.** If a PR changes an API shape, schema, or architecture decision, the relevant doc (`docs/api.md`, `docs/database.md`, `architecture.md`) is updated in the same PR — not "later."
- **Accessibility:** interactive elements are keyboard-navigable, forms have visible labels (not placeholder-only), color is never the sole carrier of meaning (pair with text/icon — see `design.md`).
- **Performance:** paginate any list endpoint that can grow unbounded (feedback, complaints); don't fetch full collections into a dashboard.
- **No dead code left in `main`.** Delete unused components/routes rather than commenting them out "just in case" — git history is the safety net.
