import { createClient } from "@supabase/supabase-js";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Robustly load .env from server directory first, then fallback to cwd
dotenv.config({ path: path.resolve(__dirname, "../../.env") });
dotenv.config({ path: path.resolve(process.cwd(), ".env") });
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SECRET_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_ANON_KEY;

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

export const verifySupabaseConnection = async () => {
  if (!supabase) {
    throw new Error("Supabase is not configured. Set SUPABASE_URL and a Supabase API key in server/.env.");
  }

  try {
    const { data, error } = await supabase.from("menus").select("id").limit(1);

    if (error) {
      const isMissingTable =
        error.code === "PGRST205" ||
        error.message?.includes("Could not find the table") ||
        error.message?.includes("relation") ||
        error.message?.includes("schema cache");

      if (isMissingTable) {
        return {
          connected: true,
          tablesReady: false,
          message: error.message,
        };
      }

      throw new Error(`Supabase query failed: ${error.message} (code: ${error.code})`);
    }

    return {
      connected: true,
      tablesReady: true,
    };
  } catch (err) {
    if (err.message && (err.message.includes("fetch failed") || err.name === "TypeError")) {
      throw new Error(`Network error reaching Supabase (${supabaseUrl}): ${err.message}`);
    }
    throw err;
  }
};
