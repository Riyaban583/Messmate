# MessMate — client

React + Vite + Tailwind frontend for MessMate. Implements the design system defined in `../design.md` (colors, typography, components) and consumes the API described in `../docs/api.md`.

## Run locally

```bash
npm install
cp .env.example .env    # set VITE_API_BASE_URL to your running backend
npm run dev
```

## Current state

The backend (`../server`) hasn't been built yet (see `../phases.md` — Phase 1 is next). Every page currently reads from `src/services/mockData.js` so the UI is fully clickable and reviewable on its own. Each place that will call the real API is marked with a `// TODO: replace with ...Api.method(...)` comment pointing at the matching function already defined in `src/services/api.js`.

Swapping mock data for live data is a page-level change only — no component or design-system code needs to change.

## Folder structure

```
src/
├── components/   # Reusable, presentational (Navbar, Rating, MenuCard, ComplaintCard, FoodSuggestion, KpiCard, StatusBadge, Button)
├── pages/        # Student-facing routes (Login, Register, Dashboard, Menu, Feedback, Complaints, Suggestions)
├── admin/        # Admin-facing routes (AdminDashboard, ManageMenu, ManageComplaints, ManageSuggestions, Analytics)
├── services/     # api.js (real Axios client) + mockData.js (temporary)
├── context/      # AuthContext
├── hooks/        # useAuth
├── utils/        # ratingColor.js — semantic color helpers shared by student + admin views
├── App.jsx       # Routes + role-based route protection
├── main.jsx      # Entry point
└── index.css     # Tailwind + design-token component classes (.btn-primary, .card, .badge, ...)
```
