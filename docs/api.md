# API Reference

Base path: `/api`

All protected routes require:

```
Authorization: Bearer <JWT>
```

Standard error response shape:

```json
{ "success": false, "message": "Human-readable message" }
```

---

## Auth — `/api/auth`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/auth/register` | Public | Create a student account |
| POST | `/auth/login` | Public | Authenticate, returns JWT |
| POST | `/auth/logout` | Authenticated | Invalidate client session |
| GET | `/auth/me` | Authenticated | Current user profile |

## Menu — `/api/menu`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/menu` | Authenticated | List menus (filterable by date range) |
| GET | `/menu/today` | Authenticated | Today's menu, all meals |
| GET | `/menu/:id` | Authenticated | Single menu entry |
| POST | `/menu` | Admin | Create a menu entry |
| PUT | `/menu/:id` | Admin | Update a menu entry |
| DELETE | `/menu/:id` | Admin | Delete a menu entry |

## Feedback — `/api/feedback`, `/api/admin/feedback`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/feedback` | Student | Submit a rating for a food/meal/day (rejected with `409` if already submitted) |
| GET | `/feedback/my` | Student | This student's feedback history |
| GET | `/admin/feedback` | Admin | All feedback, filterable by date/meal/food |
| GET | `/admin/feedback/analytics` | Admin | Aggregated ratings (per food, per meal, per day/week) |

## Complaints — `/api/complaints`, `/api/admin/complaints`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/complaints` | Student | Submit a complaint |
| GET | `/complaints/my` | Student | This student's complaints + status |
| GET | `/admin/complaints` | Admin | All complaints, filterable by status/category/priority |
| PUT | `/admin/complaints/:id/status` | Admin | Update status + optional admin response |

## Suggestions — `/api/suggestions`, `/api/admin/suggestions`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/suggestions` | Student | Suggest a new food item |
| GET | `/suggestions` | Authenticated | List suggestions with vote counts |
| POST | `/suggestions/:id/vote` | Student | Upvote an existing suggestion (one vote per student) |
| PUT | `/admin/suggestions/:id` | Admin | Approve / reject / mark implemented |
| DELETE | `/admin/suggestions/:id` | Admin | Remove a suggestion |

## Admin Analytics — `/api/admin/analytics`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/admin/analytics` | Admin | KPI cards: total/active students, today's responses, average rating, complaints, pending complaints, top/bottom foods |

---

## Example: Submit Feedback

**Request**

```
POST /api/feedback
Authorization: Bearer <JWT>

{
  "menuId": "665f...",
  "foodId": "665a...",
  "rating": 4,
  "comment": "Good but a bit salty"
}
```

**Success (201)**

```json
{ "success": true, "data": { "_id": "...", "rating": 4 } }
```

**Duplicate vote (409)**

```json
{ "success": false, "message": "You have already submitted feedback." }
```

## Example: Update Complaint Status

**Request**

```
PUT /api/admin/complaints/665b.../status
Authorization: Bearer <JWT>

{ "status": "In Progress", "adminResponse": "Mess staff has been informed." }
```

**Success (200)**

```json
{ "success": true, "data": { "status": "In Progress" } }
```
