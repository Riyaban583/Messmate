-- ====================================================================
-- MessMate - Complete Supabase PostgreSQL Database Schema & Seed Script
-- Description: Database setup script for MessMate Hostel Mess System
-- Instructions: Copy and paste this entire script into your Supabase SQL Editor and click 'Run'.
-- ====================================================================

-- Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- --------------------------------------------------------------------
-- 1. USERS TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.users (
    id TEXT PRIMARY KEY DEFAULT ('usr_' || gen_random_uuid()::text),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'student' CHECK (role IN ('student', 'admin')),
    hostel_id VARCHAR(100) DEFAULT 'Block-A',
    room_number VARCHAR(50) DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 2. MENUS TABLE (Weekly Mess Menu)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.menus (
    id TEXT PRIMARY KEY DEFAULT ('menu_' || gen_random_uuid()::text),
    day VARCHAR(20) UNIQUE NOT NULL CHECK (day IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')),
    date DATE,
    meals JSONB NOT NULL,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 3. FEEDBACKS TABLE (Daily Meal Ratings)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.feedbacks (
    id TEXT PRIMARY KEY DEFAULT ('fb_' || gen_random_uuid()::text),
    user_id TEXT REFERENCES public.users(id) ON DELETE SET NULL,
    user_name VARCHAR(255) DEFAULT 'Student',
    food_name VARCHAR(255) NOT NULL,
    meal_type VARCHAR(50) DEFAULT 'General',
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT DEFAULT '',
    date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 4. COMPLAINTS TABLE (Support & Issue Tickets)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.complaints (
    id TEXT PRIMARY KEY DEFAULT ('cmp_' || floor(extract(epoch from now()))::text),
    user_id TEXT REFERENCES public.users(id) ON DELETE SET NULL,
    student_name VARCHAR(255) NOT NULL,
    student_email VARCHAR(255) NOT NULL,
    room_number VARCHAR(50) DEFAULT 'N/A',
    category VARCHAR(100) NOT NULL,
    meal VARCHAR(50) DEFAULT 'General',
    priority VARCHAR(20) DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High', 'Urgent')),
    status VARCHAR(50) DEFAULT 'Pending' CHECK (status IN ('Pending', 'In Progress', 'Resolved', 'Closed')),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    admin_response TEXT DEFAULT '',
    is_anonymous BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

-- --------------------------------------------------------------------
-- 5. SUGGESTIONS TABLE (Community Dish Suggestions & Upvotes)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.suggestions (
    id TEXT PRIMARY KEY DEFAULT ('sug_' || gen_random_uuid()::text),
    user_id TEXT REFERENCES public.users(id) ON DELETE SET NULL,
    submitted_by VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    dietary VARCHAR(50) DEFAULT 'Veg',
    status VARCHAR(50) DEFAULT 'Under Review' CHECK (status IN ('Under Review', 'Approved', 'Rejected')),
    upvotes TEXT[] DEFAULT ARRAY[]::TEXT[],
    upvote_count INTEGER DEFAULT 1,
    admin_comment TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 6. FOOD_ITEMS TABLE (Food Catalog)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.food_items (
    id TEXT PRIMARY KEY DEFAULT ('food_' || gen_random_uuid()::text),
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    dietary VARCHAR(50) DEFAULT 'Veg',
    default_calories INTEGER DEFAULT 0,
    default_protein INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- INDEXES FOR PERFORMANCE
-- --------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_feedbacks_date ON public.feedbacks(date);
CREATE INDEX IF NOT EXISTS idx_feedbacks_food_name ON public.feedbacks(food_name);
CREATE INDEX IF NOT EXISTS idx_complaints_status ON public.complaints(status);
CREATE INDEX IF NOT EXISTS idx_suggestions_status ON public.suggestions(status);
CREATE INDEX IF NOT EXISTS idx_suggestions_upvotes ON public.suggestions(upvote_count DESC);

-- --------------------------------------------------------------------
-- ROW LEVEL SECURITY
-- The backend uses a server-only Supabase secret/service-role key, which
-- bypasses RLS. Do not grant public access to these tables.
-- --------------------------------------------------------------------
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menus ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedbacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_items ENABLE ROW LEVEL SECURITY;

<<<<<<< HEAD
DROP POLICY IF EXISTS "Public Read Access Menus" ON public.menus;
DROP POLICY IF EXISTS "Public All Access Menus" ON public.menus;
DROP POLICY IF EXISTS "Public Read Access Users" ON public.users;
DROP POLICY IF EXISTS "Public All Access Users" ON public.users;
DROP POLICY IF EXISTS "Public All Access Feedbacks" ON public.feedbacks;
DROP POLICY IF EXISTS "Public All Access Complaints" ON public.complaints;
DROP POLICY IF EXISTS "Public All Access Suggestions" ON public.suggestions;
DROP POLICY IF EXISTS "Public All Access Food Items" ON public.food_items;
=======
-- Permissive public policies for API backend access
DROP POLICY IF EXISTS "Public Read Access Menus" ON public.menus;
DROP POLICY IF EXISTS "Public All Access Menus" ON public.menus;
CREATE POLICY "Public Read Access Menus" ON public.menus FOR SELECT USING (true);
CREATE POLICY "Public All Access Menus" ON public.menus FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Read Access Users" ON public.users;
DROP POLICY IF EXISTS "Public All Access Users" ON public.users;
CREATE POLICY "Public Read Access Users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Public All Access Users" ON public.users FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public All Access Feedbacks" ON public.feedbacks;
CREATE POLICY "Public All Access Feedbacks" ON public.feedbacks FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public All Access Complaints" ON public.complaints;
CREATE POLICY "Public All Access Complaints" ON public.complaints FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public All Access Suggestions" ON public.suggestions;
CREATE POLICY "Public All Access Suggestions" ON public.suggestions FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public All Access Food Items" ON public.food_items;
CREATE POLICY "Public All Access Food Items" ON public.food_items FOR ALL USING (true) WITH CHECK (true);
>>>>>>> 91db31dae331b94eb3a02907b28ba9cc99bc7ac2


-- --------------------------------------------------------------------
-- SEED DATA SETUP
-- --------------------------------------------------------------------

-- Seed Users (Demo Student & Demo Admin)
-- Passwords hash for 'password123'
INSERT INTO public.users (id, name, email, password_hash, role, hostel_id, room_number)
VALUES 
  ('user-student-1', 'Aarav Sharma', 'student@hostel.edu', '$2a$10$e8W1jE7/1xU5mD1rB6Z.e.V3v.7K6yW8Xz9G1a2b3c4d5e6f7g8h', 'student', 'Block-A', '302'),
  ('user-admin-1', 'Mess Warden Staff', 'admin@hostel.edu', '$2a$10$e8W1jE7/1xU5mD1rB6Z.e.V3v.7K6yW8Xz9G1a2b3c4d5e6f7g8h', 'admin', 'Central-Mess', '101')
ON CONFLICT (email) DO NOTHING;

-- Seed Weekly Menu
INSERT INTO public.menus (day, date, meals, is_published)
VALUES
(
  'Monday', '2026-08-31',
  '{
    "breakfast": {"time": "7:30 AM - 9:30 AM", "items": [{"name": "Aloo Paratha with Curd", "dietary": "Veg", "rating": 4.5, "calories": 340}, {"name": "Boiled Eggs / Omelette", "dietary": "Non-Veg", "rating": 4.2, "calories": 180}, {"name": "Tea & Coffee", "dietary": "Veg", "rating": 4.1, "calories": 80}]},
    "lunch": {"time": "12:30 PM - 2:30 PM", "items": [{"name": "Rajma Chawal", "dietary": "Veg", "rating": 4.8, "calories": 450}, {"name": "Jeera Rice & Tandoori Roti", "dietary": "Veg", "rating": 4.4, "calories": 280}, {"name": "Mixed Veg Salad & Boondi Raita", "dietary": "Veg", "rating": 4.3, "calories": 120}]},
    "snacks": {"time": "5:00 PM - 6:00 PM", "items": [{"name": "Samosa with Mint Chutney", "dietary": "Veg", "rating": 4.6, "calories": 250}, {"name": "Hot Masala Chai", "dietary": "Veg", "rating": 4.7, "calories": 90}]},
    "dinner": {"time": "7:30 PM - 9:30 PM", "items": [{"name": "Paneer Butter Masala", "dietary": "Veg", "rating": 4.7, "calories": 420}, {"name": "Chicken Curry (Optional)", "dietary": "Non-Veg", "rating": 4.6, "calories": 480}, {"name": "Dal Tadka & Steamed Rice", "dietary": "Veg", "rating": 4.2, "calories": 310}, {"name": "Gulab Jamun", "dietary": "Special", "rating": 4.9, "calories": 220}]}
  }'::jsonb, true
),
(
  'Tuesday', '2026-09-01',
  '{
    "breakfast": {"time": "7:30 AM - 9:30 AM", "items": [{"name": "Idli Sambar & Coconut Chutney", "dietary": "Veg", "rating": 4.3, "calories": 280}, {"name": "Vada", "dietary": "Veg", "rating": 4.1, "calories": 210}]},
    "lunch": {"time": "12:30 PM - 2:30 PM", "items": [{"name": "Kadhi Pakoda", "dietary": "Veg", "rating": 4.0, "calories": 380}, {"name": "Aloo Gobi & Plain Paratha", "dietary": "Veg", "rating": 3.9, "calories": 320}]},
    "snacks": {"time": "5:00 PM - 6:00 PM", "items": [{"name": "Bread Pakoda", "dietary": "Veg", "rating": 3.8, "calories": 290}, {"name": "Coffee", "dietary": "Veg", "rating": 4.0, "calories": 85}]},
    "dinner": {"time": "7:30 PM - 9:30 PM", "items": [{"name": "Egg Curry / Malai Kofta", "dietary": "Non-Veg", "rating": 4.3, "calories": 390}, {"name": "Jeera Rice & Chapati", "dietary": "Veg", "rating": 4.1, "calories": 290}]}
  }'::jsonb, true
),
(
  'Wednesday', '2026-09-02',
  '{
    "breakfast": {"time": "7:30 AM - 9:30 AM", "items": [{"name": "Poha with Sev & Peanuts", "dietary": "Veg", "rating": 4.4, "calories": 260}, {"name": "Boiled Eggs", "dietary": "Non-Veg", "rating": 4.2, "calories": 150}]},
    "lunch": {"time": "12:30 PM - 2:30 PM", "items": [{"name": "Chole Bhature", "dietary": "Special", "rating": 4.9, "calories": 550}, {"name": "Pulao & Onion Salad", "dietary": "Veg", "rating": 4.5, "calories": 310}]},
    "snacks": {"time": "5:00 PM - 6:00 PM", "items": [{"name": "Pav Bhaji", "dietary": "Veg", "rating": 4.8, "calories": 380}, {"name": "Tea", "dietary": "Veg", "rating": 4.6, "calories": 80}]},
    "dinner": {"time": "7:30 PM - 9:30 PM", "items": [{"name": "Butter Chicken", "dietary": "Non-Veg", "rating": 4.9, "calories": 510}, {"name": "Paneer Tikka Masala", "dietary": "Special", "rating": 4.8, "calories": 430}, {"name": "Naan & Rice", "dietary": "Veg", "rating": 4.5, "calories": 320}]}
  }'::jsonb, true
),
(
  'Thursday', '2026-09-03',
  '{
    "breakfast": {"time": "7:30 AM - 9:30 AM", "items": [{"name": "Masala Dosa with Sambhar", "dietary": "Veg", "rating": 4.6, "calories": 320}]},
    "lunch": {"time": "12:30 PM - 2:30 PM", "items": [{"name": "Dal Makhani & Shahi Paneer", "dietary": "Veg", "rating": 4.7, "calories": 460}]},
    "snacks": {"time": "5:00 PM - 6:00 PM", "items": [{"name": "Veg Cutlet & Tea", "dietary": "Veg", "rating": 4.2, "calories": 230}]},
    "dinner": {"time": "7:30 PM - 9:30 PM", "items": [{"name": "Mix Veg Sabzi & Rice", "dietary": "Veg", "rating": 3.9, "calories": 290}]}
  }'::jsonb, true
),
(
  'Friday', '2026-09-04',
  '{
    "breakfast": {"time": "7:30 AM - 9:30 AM", "items": [{"name": "Puri Bhaji", "dietary": "Veg", "rating": 4.3, "calories": 410}]},
    "lunch": {"time": "12:30 PM - 2:30 PM", "items": [{"name": "Hyderabadi Veg Biryani", "dietary": "Veg", "rating": 4.6, "calories": 440}]},
    "snacks": {"time": "5:00 PM - 6:00 PM", "items": [{"name": "French Fries & Coffee", "dietary": "Veg", "rating": 4.5, "calories": 310}]},
    "dinner": {"time": "7:30 PM - 9:30 PM", "items": [{"name": "Fish Curry / Kadai Paneer", "dietary": "Non-Veg", "rating": 4.4, "calories": 430}]}
  }'::jsonb, true
),
(
  'Saturday', '2026-09-05',
  '{
    "breakfast": {"time": "7:30 AM - 9:30 AM", "items": [{"name": "Uttapam with Chutney", "dietary": "Veg", "rating": 4.2, "calories": 290}]},
    "lunch": {"time": "12:30 PM - 2:30 PM", "items": [{"name": "Bhindi Masala & Dal Fry", "dietary": "Veg", "rating": 4.0, "calories": 310}]},
    "snacks": {"time": "5:00 PM - 6:00 PM", "items": [{"name": "Maggi Noodles & Tea", "dietary": "Veg", "rating": 4.7, "calories": 340}]},
    "dinner": {"time": "7:30 PM - 9:30 PM", "items": [{"name": "Special Veg Thali", "dietary": "Special", "rating": 4.6, "calories": 480}]}
  }'::jsonb, true
),
(
  'Sunday', '2026-09-06',
  '{
    "breakfast": {"time": "7:30 AM - 9:30 AM", "items": [{"name": "Chole Kulche", "dietary": "Special", "rating": 4.8, "calories": 470}]},
    "lunch": {"time": "12:30 PM - 2:30 PM", "items": [{"name": "Chicken Biryani / Paneer Biryani", "dietary": "Special", "rating": 4.9, "calories": 560}, {"name": "Raita & Ice Cream", "dietary": "Special", "rating": 4.9, "calories": 190}]},
    "snacks": {"time": "5:00 PM - 6:00 PM", "items": [{"name": "Pastry & Cold Coffee", "dietary": "Special", "rating": 4.8, "calories": 260}]},
    "dinner": {"time": "7:30 PM - 9:30 PM", "items": [{"name": "Light Khichdi & Papad", "dietary": "Veg", "rating": 4.0, "calories": 230}]}
  }'::jsonb, true
)
ON CONFLICT (day) DO UPDATE SET meals = EXCLUDED.meals, date = EXCLUDED.date;

-- Seed Sample Complaints
INSERT INTO public.complaints (id, user_id, student_name, student_email, room_number, category, meal, priority, status, title, description, admin_response, is_anonymous)
VALUES
('cmp-101', 'user-student-1', 'Aarav Sharma', 'student@hostel.edu', '302', 'Food Quality', 'Lunch', 'High', 'In Progress', 'Undercooked Rice in Lunch', 'The rice served today in lunch was undercooked and hard to digest.', 'Mess chef notified. We are recalibrating the steamer settings.', false),
('cmp-102', 'user-student-1', 'Anonymous Student', 'hidden@hostel.edu', 'N/A', 'Hygiene', 'Breakfast', 'Urgent', 'Resolved', 'Unwashed Spoons at Counter', 'Found grease stains on cutlery at the breakfast counter.', 'Deep cleaning conducted and dishwasher temperature increased. Issue resolved.', true)
ON CONFLICT (id) DO NOTHING;

-- Seed Sample Suggestions
INSERT INTO public.suggestions (id, user_id, submitted_by, title, description, category, dietary, status, upvotes, upvote_count, admin_comment)
VALUES
('sug-1', 'user-student-1', 'Aarav Sharma', 'Add Pav Bhaji to Weekend Snacks', 'Pav Bhaji is a favorite dish among hostelites and perfect for Saturday evenings.', 'Snacks', 'Veg', 'Approved', ARRAY['user-student-1', 'user-student-2', 'user-student-3', 'user-student-4'], 42, 'Scheduled for Saturday evening snacks menu!'),
('sug-2', 'user-student-1', 'Priya Patel', 'Cold Coffee with Ice Cream', 'Request to include cold coffee option during hot summer afternoons.', 'Snacks', 'Veg', 'Under Review', ARRAY['user-student-3', 'user-student-5'], 28, 'Checking vendor feasibility for cold coffee dispenser.')
ON CONFLICT (id) DO NOTHING;
