# Setup & Onboarding Guide

## For New Developers

Don't just clone the repo and start coding — follow this sequence:

1. **Understand the problem** — read the root [`README.md`](../README.md): why the system exists, who uses it, what it solves.
2. **Understand the roles** — Student vs Admin, and exactly what each can/cannot do (see README's RBAC table).
3. **Understand the architecture** — read [`architecture.md`](architecture.md): React → Express → Mongoose → MongoDB.
4. **Set up your local environment** (below).
5. **Trace one complete feature** before touching anything else. Recommended: **Feedback**.
   ```
   React Form → Axios → Express Route → Middleware → Controller
   → Service → Mongoose Model → MongoDB → Response → React UI
   ```
   Once you understand one full vertical slice, the rest of the codebase follows the same pattern.

---

## Prerequisites

- Node.js (LTS)
- Git
- MongoDB (local) or MongoDB Atlas access
- A code editor (VS Code recommended)

## Clone & Install

```bash
git clone <repository-url>
cd mess-menu-system

cd server
npm install

cd ../client
npm install
```

## Environment Variables

Create `server/.env` (never commit this file):

```env
PORT=5000
MONGO_URI=
JWT_SECRET=
CLIENT_URL=
```

## Run Locally

**Backend**

```bash
cd server
npm run dev
```

**Frontend**

```bash
cd client
npm run dev
```

## Deployment Targets

| Layer | Service |
|---|---|
| Frontend | Vercel |
| Backend | Render / Railway (or similar) |
| Database | MongoDB Atlas |

```
Student → Frontend Hosting → Backend API → MongoDB Atlas
```
