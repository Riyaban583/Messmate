# MessMate - Supabase Setup & Attachment Instructions

This guide provides step-by-step instructions to create your Supabase database and attach it to your **MessMate** backend server.

---

## Step 1: Create a Supabase Project

1. Open [https://supabase.com](https://supabase.com) in your web browser.
2. Sign in or create a free Supabase account.
3. Click **"New Project"**.
4. Select your organization and enter:
   - **Name**: `MessMate-Database` (or any name you prefer)
   - **Database Password**: Set a strong password (remember it!)
   - **Region**: Choose the region closest to you (e.g. South Asia / Singapore / US East)
5. Click **"Create new project"** and wait ~1-2 minutes for Supabase to provision your PostgreSQL database.

---

## Step 2: Run the SQL Schema Migration Script

1. In your Supabase Dashboard left sidebar, click on **SQL Editor** (the `>_` icon).
2. Click **"New Query"**.
3. Open the schema file from your project workspace: [`supabase/schema.sql`](file:///c:/Users/Shahanaj/Downloads/mess-menu-systemm/supabase/schema.sql).
4. Copy the entire contents of `supabase/schema.sql` and paste it into the Supabase SQL Editor.
5. Click **"Run"** (or press `Ctrl + Enter` / `Cmd + Enter`).
6. You should see a green success message: **`Success. No rows returned`**.

> [!TIP]
> You can verify your tables were created by clicking on **Table Editor** in the left sidebar. You will see:
> - `users` (with pre-seeded demo accounts)
> - `menus` (with all 7 days of weekly menus pre-seeded)
> - `feedbacks`
> - `complaints` (with initial ticket complaints)
> - `suggestions` (with community suggestions)
> - `food_items`

---

## Step 3: Get Your Supabase API Credentials

1. In your Supabase Dashboard, click on **Project Settings** (the gear icon at the bottom of the left sidebar).
2. Click on **API** under Configuration.
3. Copy the following two values:
   - **Project URL**: (e.g. `https://xyzcompany.supabase.co`)
   - **`service_role` secret key** or **`anon` `public` key** (Under Project API keys).

---

## Step 4: Configure Your Backend Environment Variables

1. Open the file [`server/.env`](file:///c:/Users/Shahanaj/Downloads/mess-menu-systemm/server/.env) in your editor.
2. Paste your Supabase credentials:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/messmate
JWT_SECRET=messmate_super_secret_jwt_key_change_in_production
CLIENT_URL=http://localhost:5173
NODE_ENV=development

# Supabase Credentials
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your_actual_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_actual_service_role_key_here
```

3. Save the file.

---

## Step 5: Start & Verify the Backend Server

1. Open a terminal in the `server` directory:
   ```bash
   cd server
   npm install
   npm run dev
   ```

2. Watch the console output. When Supabase is attached, you will see:
   ```text
   [Supabase] Client initialized successfully for https://your-project-ref.supabase.co
   [MessMate Server] Listening on http://localhost:5000
   ```

3. Open your browser or API client to verify the health check:
   `http://localhost:5000/api/health`

---

## Features Enabled by Supabase Integration

- **Live Database Sync**: Users, registrations, daily food ratings, tickets, and community suggestions are stored in PostgreSQL on Supabase.
- **Role-Based Access Control (RBAC)**: Secure authorization for students and mess admins.
- **Dynamic Analytics**: Real-time aggregation of mess ratings, resolution rates, and top/bottom voted dishes.
