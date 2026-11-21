 🍽️ MessMate — Hostel Mess Menu & Feedback Management System

A full-stack web application that turns subjective student opinions about hostel mess food into structured, actionable data for mess administrators.

---

## The Problem

In a hostel with 500+ students, the mess menu is largely fixed and there's no reliable way to know:

- Which food students actually like or dislike
- What students want added to the menu
- How satisfied students are with a given meal
- Which items receive repeated complaints
- Which days/meals score highest or lowest
- Whether complaints are actually being resolved

A WhatsApp group or a physical complaint register can't answer any of this with real data.

## The Solution

MessMate gives students a fast, low-friction way to rate meals, suggest food, and file complaints — and gives admins a dashboard that converts that raw feedback into decisions: *keep, improve, reduce, or remove*.

```
Student eats → Gives feedback → Database → Analytics → Admin decisions → Better menu → More feedback
```

This feedback → data → analytics → decision loop is what separates MessMate from a plain CRUD app.

---

## Core Features

### Student
- Auth (register/login/logout, JWT-protected)
- Daily/weekly menu view
- Food rating (1–5 stars, MVP scope)
- Duplicate-vote prevention (one rating per student/meal/day, enforced at the DB level)
- Food suggestions + community voting on suggestions
- Complaint submission with category/priority
- Complaint status tracking (Pending → Under Review → In Progress → Resolved)

### Admin
- Menu CRUD
- Feedback & rating analytics per food, per meal, per day/week
- Complaint dashboard with status management and admin responses
- Suggestion review (approve/reject)
- KPI dashboard (students, today's responses, average rating, complaints, pending, popular/least-popular food)
- Participation rate tracking

Full feature breakdown: see the original spec content mirrored in [`docs/architecture.md`](docs/architecture.md) and [`docs/database.md`](docs/database.md).

---

## Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Frontend | React.js | Component-based, great for dashboards, huge ecosystem |
| Styling | Tailwind CSS | Fast, consistent, minimal custom CSS |
| Backend | Node.js + Express | JS everywhere, great for REST APIs and I/O-heavy workloads |
| Database | MongoDB | Flexible document model fits varied entities (users, menus, feedback, complaints, suggestions) |
| ODM | Mongoose | Schemas, validation, indexes, middleware |
| Auth | JWT + bcrypt | Stateless auth, passwords never stored in plaintext |
| Charts | Recharts | Admin analytics visualizations |
| Deployment | Vercel (frontend) · Render/Railway (backend) · MongoDB Atlas (DB) | Simple, low-cost, standard MERN deployment path |

---

## Repository Structure

```
mess-menu-system/
├── client/                # React + Tailwind frontend
├── server/                # Express + Mongoose backend
├── docs/
│   ├── architecture.md    # System & backend architecture, diagrams
│   ├── api.md             # Full REST API reference
│   ├── database.md        # Schemas, indexes, ER relationships
│   ├── setup.md           # Local dev setup & onboarding
│   └── contribution.md    # Branching strategy, team roles, definition of done
├── README.md
├── .gitignore
└── LICENSE
```

---

## User Roles (RBAC)

| Capability | Student | Admin |
|---|:---:|:---:|
| View menu | ✅ | ✅ |
| Vote / submit feedback | ✅ | ❌ |
| Suggest food | ✅ | ❌ |
| Submit complaint | ✅ | ❌ |
| View own complaints | ✅ | — |
| Create/update/delete menu | ❌ | ✅ |
| View analytics | ❌ | ✅ |
| Manage complaints | ❌ | ✅ |
| Manage suggestions | ❌ | ✅ |
| Manage students | ❌ | ✅ |

Role checks are enforced **server-side** on every protected route — hiding an "Admin" button in React is not access control.

---

## MVP Scope

To keep the project achievable while still demonstrating strong full-stack skills, the first version is limited to:

1. Authentication (Student/Admin roles)
2. Menu management
3. Food rating (1–5 stars)
4. Complaints
5. Food suggestions
6. Basic admin analytics

Everything else (notifications, QR-code feedback, mess-manager role, multi-hostel support, recommendation engine) is deferred — see [`docs/architecture.md#future-features`](docs/architecture.md#future-features).

---

## Getting Started

See [`docs/setup.md`](docs/setup.md) for prerequisites, environment variables, and run instructions.

## API Reference

See [`docs/api.md`](docs/api.md).

## Database Design

See [`docs/database.md`](docs/database.md).

## Contributing

See [`docs/contribution.md`](docs/contribution.md) for branching strategy, team responsibilities, and the Definition of Done.

---

## License

MIT (placeholder — update as needed).
