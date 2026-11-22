# Architecture

This is the top-level architecture reference for MessMate. For the deeper narrative version (auth flow, analytics engine, error conventions) see `docs/architecture.md`; this file is the quick-reference: layers, tech stack, and folder/file structure.

---

## 1. System architecture

Layered MERN architecture, client → API → business logic → data:

```
Student / Admin (web & mobile browser)
         │
         ▼
React UI (Tailwind CSS, Axios, React Router)
         │
      REST API
         │
         ▼
Express server
  ├── Authentication (JWT)
  ├── Authorization (RBAC middleware)
  ├── Validation
  ├── Controllers
  └── Services (business logic)
         │
         ▼
Mongoose ODM (schemas, validation, indexes)
         │
         ▼
MongoDB
  ├── users
  ├── menus
  ├── foodItems
  ├── feedback
  ├── complaints
  └── suggestions
```

Backend request flow, every route:

```
Route → Middleware (auth, role, validation) → Controller → Service → Model → Database
```

See the interactive architecture and ER diagrams generated earlier in this session for a visual version of both flows.

---

## 2. Tech stack

| Layer | Choice | Why |
|---|---|---|
| Frontend | React.js | Component-based, strong ecosystem, good for dashboards |
| Styling | Tailwind CSS | Fast, consistent, minimal hand-written CSS |
| HTTP client | Axios | Interceptors for auth headers, consistent error shape |
| Routing (client) | React Router | Standard SPA routing |
| Charts | Recharts | Admin analytics visualizations |
| Backend runtime | Node.js | JS across the stack, strong for I/O-heavy REST APIs |
| Backend framework | Express.js | Routes, middleware, controllers |
| Database | MongoDB | Document model fits varied entities (users, menus, feedback, complaints, suggestions) |
| ODM | Mongoose | Schemas, validation, indexes, middleware |
| Auth | JWT + bcrypt | Stateless auth; passwords never stored in plaintext |
| Deployment (frontend) | Vercel | — |
| Deployment (backend) | Render / Railway | — |
| Deployment (database) | MongoDB Atlas | — |

Full rationale for each choice is in `docs/architecture.md` and the original product spec.

---

## 3. Folder & file structure

### Repository root

```
mess-menu-system/
├── client/                    # React + Tailwind frontend
├── server/                    # Express + Mongoose backend
├── docs/                      # Narrative documentation
│   ├── architecture.md
│   ├── api.md
│   ├── database.md
│   ├── setup.md
│   └── contribution.md
├── design.md                  # UI/UX, color theme, typography, UI memory
├── memory.md                  # Running project context log
├── phases.md                  # Phase-by-phase build plan
├── rules.md                   # Conventions, libraries, error handling, AI boundaries
├── architecture.md            # This file
├── product-requirements.md    # PRD — what to build, target users, features
├── README.md
├── .gitignore
└── LICENSE
```

### `server/`

```
server/
├── src/
│   ├── config/
│   │   └── db.js                    # MongoDB connection
│   ├── models/
│   │   ├── User.js
│   │   ├── Food.js
│   │   ├── Menu.js
│   │   ├── Feedback.js
│   │   ├── Complaint.js
│   │   └── Suggestion.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── menuController.js
│   │   ├── feedbackController.js
│   │   ├── complaintController.js
│   │   └── suggestionController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── menuRoutes.js
│   │   ├── feedbackRoutes.js
│   │   ├── complaintRoutes.js
│   │   └── suggestionRoutes.js
│   ├── middleware/
│   │   ├── authMiddleware.js         # JWT verification
│   │   ├── roleMiddleware.js         # RBAC
│   │   └── errorMiddleware.js        # Centralized error handling
│   ├── services/
│   │   ├── analyticsService.js       # Rating/complaint aggregation
│   │   └── notificationService.js    # Future feature
│   ├── utils/
│   └── app.js                        # Express app assembly
└── server.js                         # Entry point
```

### `client/`

```
client/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── MenuCard.jsx
│   │   ├── Rating.jsx
│   │   ├── ComplaintCard.jsx
│   │   └── FoodSuggestion.jsx
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Menu.jsx
│   │   ├── Feedback.jsx
│   │   ├── Complaints.jsx
│   │   └── Suggestions.jsx
│   ├── admin/
│   │   ├── AdminDashboard.jsx
│   │   ├── ManageMenu.jsx
│   │   ├── ManageComplaints.jsx
│   │   ├── ManageSuggestions.jsx
│   │   └── Analytics.jsx
│   ├── services/
│   │   └── api.js                    # Axios instance + interceptors
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── hooks/
│   ├── utils/
│   └── App.jsx
```

---

## 4. Layer responsibilities (quick reference)

| Layer | Owns | Does not own |
|---|---|---|
| Routes | HTTP verb + path → controller mapping | Business logic, DB queries |
| Middleware | Auth, role checks, validation, error formatting | Domain logic |
| Controllers | Parse request, call service, shape response | Direct DB queries, complex logic |
| Services | Business logic (e.g. analytics aggregation) | HTTP concerns (req/res objects) |
| Models | Schema, validation, indexes | Business logic |
| React pages | Route-level composition, data fetching | Deeply nested business logic |
| React components | Presentational + local interaction state | API calls (delegate to `services/api.js`) |

This table is the fast check for "where does this code belong" — if you're writing a Mongoose query inside a route file or a fetch call inside a presentational component, it's in the wrong layer.
