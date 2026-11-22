import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

export const isSupabaseConfigured = () => {
  return Boolean(
    supabaseUrl && 
    supabaseKey && 
    supabaseUrl !== "https://your-supabase-project-id.supabase.co" && 
    !supabaseUrl.includes("your-supabase-project")
  );
};

let supabaseInstance = null;

if (isSupabaseConfigured()) {
  try {
    supabaseInstance = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
    });
    console.log(`[Supabase] Client initialized successfully for ${supabaseUrl}`);
  } catch (error) {
    console.warn(`[Supabase] Initialization error: ${error.message}`);
  }
} else {
  console.log(`[Supabase] Credentials not detected in .env. Running backend in local hybrid fallback mode.`);
}

export const supabase = supabaseInstance;
