import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, ".env") });
dotenv.config();

import app from "./src/app.js";
import { connectDB } from "./src/config/db.js";
import { isSupabaseConfigured, verifySupabaseConnection } from "./src/config/supabase.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  if (isSupabaseConfigured()) {
    try {
      const status = await verifySupabaseConnection();
      if (status.tablesReady) {
        console.log(`[Supabase] Database connection verified. All tables active on ${process.env.SUPABASE_URL}`);
      } else {
        console.log(`[Supabase] Successfully connected to project (${process.env.SUPABASE_URL})!`);
        console.warn(`[Supabase] Note: Schema not found ('menus' table missing in schema cache).`);
        console.warn(`[Supabase] To create tables: Copy 'supabase/schema.sql' and run it in your Supabase SQL Editor:`);
        console.warn(`           https://supabase.com/dashboard/project/bsdbknlmsyswtzuzghel/sql/new`);
        console.warn(`[Supabase] Server running with local fallback until schema is applied.`);
      }
    } catch (err) {
      console.warn(`[Supabase] Connection warning: ${err.message}`);
      await connectDB();
    }
  } else {
    await connectDB();
  }

  app.listen(PORT, () => {
    console.log(`[MessMate Server] Listening on http://localhost:${PORT}`);
  });
};

startServer().catch((error) => {
  console.error("[MessMate Server] Startup failed:", error.message);
  process.exitCode = 1;
});
