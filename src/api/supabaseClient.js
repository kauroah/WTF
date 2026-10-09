import { createClient } from "@supabase/supabase-js";

/**
 * Supabase environment variables.
 *
 * Required in .env.local:
 *
 * VITE_SUPABASE_URL=https://your-project.supabase.co
 * VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
 */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const safeStorage =
  typeof window !== "undefined" && window.localStorage
    ? window.localStorage
    : undefined;

/**
 * Validate configuration early so configuration problems
 * are immediately obvious during development.
 */
if (!supabaseUrl) {
  throw new Error(
    "Missing VITE_SUPABASE_URL. Add it to your .env.local file."
  );
}

if (!supabasePublishableKey) {
  throw new Error(
    "Missing VITE_SUPABASE_PUBLISHABLE_KEY. Add it to your .env.local file."
  );
}

/**
 * Main Supabase client used throughout WHAT THE FASHION.
 *
 * This replaces the old Base44 client.
 */
export const supabase = createClient(
  supabaseUrl,
  supabasePublishableKey,
  {
    auth: {
      /**
       * Keep the user's login session between browser refreshes.
       */
      persistSession: true,

      /**
       * Automatically refresh access tokens before they expire.
       */
      autoRefreshToken: true,

      /**
       * Allows Supabase to recognize authentication information
       * when returning from:
       *
       * - Google OAuth
       * - password recovery
       * - email confirmation
       */
      detectSessionInUrl: true,

      /**
       * Store the auth session in localStorage when available.
       *
       * Guard this so the client remains safe in non-browser or
       * test-like environments.
       */
      storage: safeStorage,
    },

    global: {
      /**
       * Optional identifier for requests coming from this app.
       */
      headers: {
        "X-Client-Info": "what-the-fashion-web",
      },
    },
  }
);

export default supabase;