import { createClient } from "@supabase/supabase-js";

// IMPORTANT: Add your Supabase URL and Anon Key here
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "YOUR_SUPABASE_URL";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "YOUR_SUPABASE_ANON_KEY";

if (!supabaseUrl || !supabaseAnonKey) {
	throw new Error("Supabase URL and Anon Key are required.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
