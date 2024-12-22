import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://hjyfekrajykvtyodsuks.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhqeWZla3JhanlrdnR5b2RzdWtzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTYyMzQwOTcsImV4cCI6MjAzMTgxMDA5N30.uLgXLZc9ZvU__76A2sGfS0s_C3DvxoivfiawpTTgka0";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
