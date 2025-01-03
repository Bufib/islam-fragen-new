import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "@/utils/supabase";
import { Session } from "@supabase/supabase-js"; // Import Supabase's Session type

type AuthStore = {
  session: Session | null; // Type the session explicitly
  setSession: (session: Session | null) => void;
  clearSession: () => Promise<void>;
  restoreSession: () => Promise<void>;
};

export const useAuthStore = create<AuthStore>((set) => ({
  session: null,

  setSession: (session: Session | null) => {
    set({ session });
    if (session) {
      AsyncStorage.setItem("supabase_session", JSON.stringify(session));
    } else {
      AsyncStorage.removeItem("supabase_session"); // Clean up storage if session is null
    }
  },

  clearSession: async () => {
    set({ session: null });
    await AsyncStorage.removeItem("supabase_session");
  },

  restoreSession: async () => {
    try {
      const storedSession = await AsyncStorage.getItem("supabase_session");
      if (storedSession) {
        const session: Session = JSON.parse(storedSession);
        set({ session });
        supabase.auth.setSession(session); // Set the session in Supabase
      }
    } catch (error) {
      console.error("Failed to restore session:", error);
      set({ session: null });
    }
  },
}));
