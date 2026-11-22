# Architecture

## 1. System Overview

MessMate follows a standard layered MERN architecture. Diagrams for each layer are also rendered as interactive visuals in the project chat; this document is the text/version-controlled source of truth.

```
Student / Admin
      │
      ▼
React UI (Tailwind CSS)
      │
   REST API (Axios)
      │
      ▼
Express Server
  ├── Authentication (JWT)
  ├── Authorization (RBAC middleware)
  ├── Validation
  ├── Controllers
  └── Business Logic (Services)
      │
      ▼
Mongoose ODM
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

Admins hit the same Express/Mongoose/MongoDB stack through an `admin` route namespace and an `Analytics` service that aggregates feedback and complaint data.

## 2. Backend Layering

```
Route → Middleware → Controller → Service → Model → Database
```

- **Routes** map HTTP verbs + paths to controllers.
- **Middleware** handles JWT verification, role checks, and centralized error handling.
- **Controllers** parse requests, call services, shape responses.
- **Services** hold business logic (e.g. `analyticsService`, `suggestionService` enforcing 1 vote per user/device) so controllers stay thin.
- **Models** are Mongoose schemas with validation and unique indexes.

### Recommended backend structure

```
server/
├── src/
│   ├── config/
│   │   └── db.js
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
│   │   ├── authMiddleware.js
│   │   ├── roleMiddleware.js
│   │   └── errorMiddleware.js
│   ├── services/
│   │   ├── analyticsService.js
│   │   └── notificationService.js
│   ├── utils/
│   └── app.js
└── server.js
```

### Recommended frontend structure

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
│   │   └── api.js
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── hooks/
│   ├── utils/
│   └── App.jsx
```

## 3. Authentication Flow

```
Student → Login → Backend validates credentials → JWT generated
→ Frontend stores auth state → Protected API requests
→ Backend verifies JWT → Request accepted
```

Passwords are hashed with **bcrypt** before storage — plaintext passwords are never persisted.

## 4. Authorization

Every protected route re-verifies role server-side:

```js
if (user.role !== "admin") {
  return res.status(403).json({ success: false, message: "Access denied" });
}
```

Hiding UI elements in React is a UX nicety, not a security control.

## 5. Student & Admin Flows

**Student:** Login → Dashboard → View Menu / Feedback (Rating) / Suggestions (Vote) → Complaints → Submit Complaint → Track Status

**Admin:** Login → Role Verification → Dashboard → Menu Management / Analytics (Food Performance) / Complaints (Update Status) / Suggestions (Approve/Reject)

Interactive versions of both flows are rendered as diagrams alongside this documentation.

## 6. Analytics Engine

No separate analytics database in the MVP — analytics are computed from `feedback` and `complaint` records directly (later optimized via MongoDB aggregation pipelines).

```
Average Rating = Sum of ratings / Number of ratings
Participation Rate = (Students who gave feedback / Total students) × 100
```

Planned KPIs: total/active students, today's responses, average rating, total/pending complaints, top/bottom 5 foods, most-complained food, most-suggested food, daily/weekly/monthly rating trends, feedback/complaint/suggestion participation rates.

## 7. Error Handling Convention

Centralized error middleware, consistent response shape:

```json
{ "success": false, "message": "You have already submitted feedback." }
```

| Code | Meaning |
|---|---|
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 500 | Internal Server Error |

## Future Features

- Notifications (new menu, complaint updates, suggestion approvals)
- QR-code feedback (scan → today's meal → rate)
- `Mess Manager` role (sees menu, complaints, food requirements — no full admin rights)
- Multi-hostel support (`hostelId` on users/menus, analytics segmented per hostel)
- Recommendation engine: `High Rating + High Demand + Low Complaint Rate → Recommended Food`
