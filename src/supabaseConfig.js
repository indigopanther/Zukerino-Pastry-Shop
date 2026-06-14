// Supabase connection for the live menu.
// The URL and the anon (publishable) key are PUBLIC by design — safe to ship in
// the browser bundle. Writes are still protected: the public site can only READ
// (row-level security), and all edits go through a PIN-protected edge function.
//
// Values can be overridden at build time with Vite env vars
// (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY); otherwise these defaults are used.

export const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || "https://oightjxuugjsqcvuidnn.supabase.co";

export const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9pZ2h0anh1dWdqc3FjdnVpZG5uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAzMzg5NDQsImV4cCI6MjA5NTkxNDk0NH0.3Tza5DzQowkTMaXG5_5egHh-sfVAhJTO1oL4WokfArc";

export const MENU_TABLE = "zukerino_menu_items";
export const SAVE_FUNCTION = "zukerino-save-menu";

export const REST_URL = `${SUPABASE_URL}/rest/v1`;
export const FUNCTIONS_URL = `${SUPABASE_URL}/functions/v1`;

export const supabaseHeaders = {
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
};
