# Contribution Guide

## Branching Strategy

```
main
 │
 ├── develop
 │
 ├── feature/auth
 ├── feature/menu
 ├── feature/feedback
 ├── feature/complaints
 └── feature/analytics
```

No experimental work goes directly to `main`. Branch from `develop`, open a PR back into `develop` when a feature is complete.

## Team Responsibilities (4-developer split)

| Developer | Owns |
|---|---|
| Dev 1 — Backend/Auth | Authentication, JWT, RBAC, User APIs, middleware |
| Dev 2 — Menu + Feedback | Menu, Food, Rating, Feedback |
| Dev 3 — Complaints + Suggestions | Complaints, Suggestions, Voting, Notifications |
| Dev 4 — Frontend/Admin | Student UI, Admin Dashboard, charts, responsive design |

Everyone should still understand the overall architecture end-to-end, not just their slice.

## Definition of Done

A feature is **not** done just because the frontend works. Every feature needs:

```
Frontend + API + Validation + Authentication + Authorization
+ Database + Error Handling + Testing + Documentation
```

**Example — Feedback feature.** Not done: *"I created the rating button."* Done:

```
Student submits rating
   → Frontend validation
   → POST API
   → JWT validation
   → Student role verification
   → Duplicate check
   → Database insert
   → Success response
   → UI update
```

## Testing Checklist

- Authentication & authorization
- Menu CRUD
- Feedback submission + duplicate prevention
- Complaints (create, list, status update)
- Suggestions (create, vote, approve/reject)
- Admin-only permission boundaries
- API error responses, invalid input handling

Critical test case: **a student hitting an admin-only API must get `403 Forbidden`.**

## Phase-Wise Delivery Order

```
1. Project setup            8.  UI/UX polish
2. Database design           9.  Testing
3. Authentication           10.  Deployment
4. RBAC                     11.  Documentation
5. Menu management          12.  Future features
6. Student menu UI
7. Feedback / rating
      → Complaint system
      → Food suggestions
      → Admin dashboard
      → Analytics
```

MVP scope stops after step 11 (basic analytics). Notifications, QR feedback, mess-manager role, multi-hostel support, and the recommendation engine are post-MVP.
