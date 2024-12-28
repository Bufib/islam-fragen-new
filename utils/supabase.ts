import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://tdjuwrsspauybgfywlfr.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRkanV3cnNzcGF1eWJnZnl3bGZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUzMTM5NTEsImV4cCI6MjA1MDg4OTk1MX0.Px8w_Vg-rF-wFKO8HvIuHWzh-3zfVTY31tH2vIBnlPw";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
