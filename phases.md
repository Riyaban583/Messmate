# Phases

Build order for MessMate. Each phase has a clear exit condition — don't start the next phase until the current one's deliverable is actually done (see `rules.md` → Definition of Done).

---

## Phase 1 — Login & Authentication

**Goal:** A user can register, log in, and hit a protected route as the correct role.

Tasks:
- [ ] `User` model (name, email, password hash, role, hostelId, roomNumber, isActive)
- [ ] `POST /api/auth/register` (student self-registration)
- [ ] `POST /api/auth/login` → issues JWT
- [ ] `POST /api/auth/logout`
- [ ] `GET /api/auth/me`
- [ ] Password hashing with bcrypt (never store plaintext)
- [ ] `authMiddleware` — verifies JWT on protected routes
- [ ] `roleMiddleware` — enforces `student` vs `admin` on protected routes
- [ ] Frontend: Login page, Register page, `AuthContext`, protected route wrapper
- [ ] Seed script for at least one admin account (admins aren't self-registered)

**Deliverable:** Auth + RBAC working end-to-end; a student hitting an admin-only route gets `403`.

---

## Phase 2 — Dashboard

**Goal:** Both roles land on a dashboard that shows real, live data — not placeholders.

Tasks:
- [ ] Student dashboard: today's menu (breakfast/lunch/dinner), quick-rate control, recent complaint status
- [ ] Admin dashboard: KPI cards (students, today's feedback, average rating, complaints, pending complaints, popular/least-popular food)
- [ ] `GET /api/menu/today`
- [ ] `GET /api/admin/analytics` (initial version — can be simple aggregation, refined in Phase 4)
- [ ] Responsive layout for both dashboards (mobile-first for student, desktop-first but responsive for admin)
- [ ] Loading and empty states for both dashboards

**Deliverable:** Logging in as either role shows a dashboard backed by real API data.

---

## Phase 3 — CRUD Operations

**Goal:** All core entities can be created, read, updated, and deleted through the API and reflected in the UI.

Tasks:
- [ ] **Menu:** admin create/update/delete menu entries; student views today's/weekly menu
- [ ] **Feedback:** student submits rating (1–5), duplicate prevention via unique index (`studentId + foodId + date`); admin views raw feedback
- [ ] **Complaints:** student creates/views own complaints; admin lists all, updates status + adds admin response
- [ ] **Suggestions:** student creates a suggestion, votes on existing ones; admin approves/rejects/marks implemented
- [ ] Backend validation on every write endpoint (never trust the frontend — see `rules.md`)
- [ ] Consistent `{ success, message, data }` response shape and centralized error middleware

**Deliverable:** Every entity in `docs/database.md` has full CRUD coverage, validated and role-gated.

---

## Phase 4 — Additional Features

**Goal:** The features that make this more than a CRUD app — analytics, and the polish that makes it usable at scale.

Tasks:
- [ ] Full analytics: food popularity (avg rating per food), meal analytics, daily/weekly trends, complaint category breakdown, participation rate
- [ ] Charts (Recharts) on the admin dashboard
- [ ] Suggestion voting/deduplication (recognize an existing "Dosa" suggestion instead of creating a duplicate)
- [ ] Toast notifications, confirmation dialogs for destructive actions
- [ ] UI preference persistence (see `design.md` §3)
- [ ] Mobile polish pass — this is the interface most students will actually use

**Deliverable:** Admin Analytics Dashboard is genuinely useful for decisions, not just a KPI wall.

---

## Phase 5 — Testing & Quality Assurance

**Goal:** Confidence that the system behaves correctly and safely before it touches real students.

Tasks:
- [ ] Auth & RBAC tests, including the critical case: student → admin API → `403`
- [ ] Menu CRUD tests
- [ ] Feedback duplicate-prevention test (same student, same food, same day → rejected)
- [ ] Complaint lifecycle tests (status transitions, admin response)
- [ ] Suggestion voting tests (no double-voting)
- [ ] Input validation / bad-request tests (missing fields, invalid rating range, invalid enum values)
- [ ] Manual pass on mobile viewport sizes
- [ ] Basic load sanity check — dashboard queries shouldn't choke with 500+ students' worth of feedback rows

**Deliverable:** Test suite covers every item in the checklist above; no known `P0`/`P1` bugs open.

---

## Phase 6 — Deployment & Maintenance

**Goal:** The app is live, monitored, and has a clear path for ongoing changes.

Tasks:
- [ ] MongoDB Atlas cluster provisioned, connection string in backend `.env`
- [ ] Backend deployed (Render/Railway or similar)
- [ ] Frontend deployed (Vercel), `CLIENT_URL`/API base URL wired correctly
- [ ] Environment variables set in each platform's dashboard — never committed to git
- [ ] Basic uptime/error monitoring on the backend
- [ ] Rollback plan documented (how to redeploy the previous version fast)
- [ ] `memory.md` and `docs/` kept current as the source of truth for handoff
- [ ] Post-launch: monitor participation rate (see `docs/architecture.md` §6) as the health metric for whether the analytics are representative

**Deliverable:** MessMate is live, students can log in and use it, and there's a documented process for shipping the next change safely.

---

## After Phase 6

Once the MVP is stable in production, pull from the future-features backlog in `docs/architecture.md` and `product-requirements.md`: notifications, QR-code feedback, a Mess Manager role, multi-hostel support, and the food recommendation engine.
