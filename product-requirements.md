# Product Requirements Document (PRD)

## 1. Product

**Name:** MessMate — Hostel Mess Menu & Feedback Management System
**Type:** Full-stack web application (student portal + admin dashboard)

## 2. Problem statement

In a hostel with 500+ students, the mess menu is largely fixed and there's no structured way to know which food students like or dislike, what they want added, how satisfied they are with a given meal, which items get repeated complaints, or whether complaints are actually resolved. A WhatsApp group or a physical complaint register produces anecdotes, not data.

## 3. What we're building

A centralized web app that closes the loop between what students experience and what admins decide:

```
Student eats → rates/complains/suggests → data → analytics → admin decision → better menu → repeat
```

**Students can:** view the daily/weekly menu, rate food after eating, suggest new food items, submit and track complaints, see popular food items.

**Admins can:** manage the menu, view voting/rating statistics, analyze food popularity, review and resolve complaints, review food suggestions, generate reports, identify problem items, manage students and settings.

The differentiator versus a plain CRUD app is this **feedback → data → analytics → decision** cycle — see `docs/architecture.md` §6 for how it's calculated.

## 4. Target users

| User | Who | Primary need |
|---|---|---|
| **Student** | Hostel resident, primarily accessing via phone | Answer "how was today's food?" in one tap; be heard when something's wrong; influence what gets served |
| **Mess admin** | Hostel mess management/warden staff, accessing via desktop | Turn hundreds of individual opinions into a short list of decisions: keep, improve, reduce, remove |
| *(Future)* Mess manager | Kitchen-facing staff | See today's menu, complaints, and food quantity requirements — no full admin rights |

MessMate is explicitly **not** building for: general campus-wide social features, payment/billing, or attendance tracking. Those are out of scope even long-term.

## 5. Goals

- **Student goal:** make rating today's food take under 10 seconds.
- **Admin goal:** convert votes into a clear "keep / improve / reduce / remove" call per food item.
- **Long-term goal:** replace assumption-driven mess decisions with a data-driven process.

## 6. Success metrics

| Metric | Target (post-launch) |
|---|---|
| Feedback participation rate | ≥ 60% of active students rate at least one meal per week (see `docs/architecture.md` §5 for the formula) |
| Complaint resolution rate | ≥ 90% of complaints reach `Resolved` within 7 days |
| Admin adoption | Admin dashboard checked at least 3x/week |
| Suggestion engagement | At least 1 suggestion implemented per month, sourced from student votes |

## 7. Features

### MVP (must ship first — see `phases.md`)

1. Authentication (student/admin, JWT-based, role-gated)
2. Menu management (admin CRUD, student view — daily/weekly)
3. Food rating (1–5 stars, one submission per student/food/day)
4. Complaints (submit, categorize, prioritize, track status, admin respond/resolve)
5. Food suggestions (submit + community vote, admin approve/reject)
6. Basic admin analytics (KPI cards, average rating, top/bottom foods, complaint counts)

### Post-MVP (see `docs/architecture.md` → Future Features)

- Push/in-app notifications (menu changes, complaint updates, suggestion approvals)
- QR-code feedback (scan in the mess hall → rate today's meal instantly)
- Mess Manager role
- Multi-hostel support (`hostelId` segmentation, per-hostel analytics)
- Recommendation engine (`high rating + high demand + low complaints → recommended food`)
- Advanced analytics: satisfaction trend over the month, most-requested-but-never-served items

### Explicitly out of scope

- Payments/billing for mess fees
- Attendance or meal-swipe tracking
- General social/chat features between students
- Native mobile apps (mobile-responsive web is the strategy — see `design.md` §1)

## 8. Non-functional requirements

- **RBAC enforced server-side**, always — see `rules.md` §4.
- **Duplicate-vote prevention at the database level**, not just UI — see `docs/database.md`.
- **Mobile-first UI** — most students will use this on a phone (see `design.md`).
- **Backend validation on every write** — never trust the frontend alone.
- **Consistent error handling and response shape** across the whole API — see `rules.md` §3.

## 9. Open questions

- Does the target hostel already have a fixed roll of students to seed, or does registration need to be fully self-serve with verification?
- Is there a moderation step needed for complaints/suggestions before they're visible to other students, or is voting fully open?
- Should ratings be anonymous to other students (visible only in aggregate) while remaining identifiable to admins? *(Current assumption: yes — ratings are aggregated publicly, but the admin view can see who submitted what, for complaint correlation.)*

These should be resolved before or during Phase 1 — track answers in `memory.md` once decided.
