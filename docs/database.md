# Database Design (MongoDB + Mongoose)

## Collections

```
users
foodItems
menus
feedback
complaints
suggestions
notifications   (future)
```

An ER diagram of these relationships is also rendered as an interactive visual in the project chat.

---

## User

```
User
├── _id
├── name
├── email            (unique)
├── password         (bcrypt hash)
├── hostelId         (future: multi-hostel)
├── roomNumber
├── role             enum: "student" | "admin"
├── isActive
├── createdAt
└── updatedAt
```

```js
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: { type: String, enum: ["student", "admin"], default: "student" }
});
```

## Food

```
Food
├── _id
├── name
├── category
├── description
├── isActive
├── createdAt
└── updatedAt
```

## Menu

```
Menu
├── _id
├── date
├── mealType         enum: "breakfast" | "lunch" | "snacks" | "dinner"
├── foodItems[]       → ref Food
├── createdBy         → ref User (admin)
├── createdAt
└── updatedAt
```

```json
{
  "date": "2026-08-26",
  "mealType": "lunch",
  "foodItems": ["rice", "dal", "paneer", "salad"]
}
```

## Feedback

```
Feedback
├── _id
├── studentId        → ref User
├── menuId           → ref Menu
├── foodId           → ref Food
├── rating           1–5
├── comment
├── date
└── createdAt
```

**Critical index — enforced at the database level, not just in React:**

```
unique(studentId + foodId + date)
```

This guarantees one feedback record per student, per food, per day (prevents a student rating the same meal 20 times).

## Complaint

```
Complaint
├── _id
├── studentId        → ref User
├── category         enum: Food Quality | Taste | Quantity | Hygiene | Menu | Service | Cleanliness | Other
├── menuId           → ref Menu
├── foodId           → ref Food
├── description
├── priority         enum: Normal | Important | Urgent
├── status           enum: Pending | Under Review | In Progress | Resolved | Rejected
├── adminResponse
├── resolvedAt
├── createdAt
└── updatedAt
```

## Suggestion

```
Suggestion
├── _id
├── foodName
├── category
├── description
├── suggestedBy      → ref User
├── votes            number (count of likes)
├── dislikes         number (count of dislikes)
├── votedUsers[]     array of { userId/deviceId, voteType: "like" | "dislike" } (enforces 1 vote per user/device)
├── status           enum: pending | approved | rejected | implemented
├── createdAt
└── updatedAt
```

---

## Relationships

```
User (1) ──── (many) Feedback
User (1) ──── (many) Complaint
User (1) ──── (many) Suggestion
Menu (1) ──── (many) Feedback
Menu (1) ──── (many) Complaint
Food (1) ──── (many) Feedback
Food (1) ──── (many) Complaint
Menu (many) ──── (many) Food     [via Menu.foodItems]
```

## Indexing Summary

| Collection | Index | Purpose |
|---|---|---|
| `users` | `email` (unique) | Prevent duplicate accounts, fast login lookup |
| `feedback` | `studentId + foodId + date` (unique) | Prevent duplicate votes |
| `complaints` | `status`, `studentId` | Fast admin filtering, student's own complaints |
| `suggestions` | `status`, `votes` (desc) | Admin review queue, popularity sort |
