import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "@/utils/supabase";
import { Session } from "@supabase/supabase-js";

type AuthStore = {
  session: Session | null;
  isLoggedIn: boolean; // Derived state to check login status
  setSession: (session: Session | null) => void;
  clearSession: () => Promise<void>;
  restoreSession: () => Promise<void>;
};

export const useAuthStore = create<AuthStore>((set, get) => ({
  session: null,

  isLoggedIn: false, // Default state

  setSession: (session: Session | null) => {
    set({ session, isLoggedIn: !!session });
    if (session) {
      AsyncStorage.setItem("supabase_session", JSON.stringify(session));
    } else {
      AsyncStorage.removeItem("supabase_session");
    }
  },

  clearSession: async () => {
    set({ session: null, isLoggedIn: false });
    await AsyncStorage.removeItem("supabase_session");
  },

  restoreSession: async () => {
    try {
      const storedSession = await AsyncStorage.getItem("supabase_session");
      if (storedSession) {
        const session: Session = JSON.parse(storedSession);
        set({ session, isLoggedIn: true });
        supabase.auth.setSession(session);
      } else {
        set({ isLoggedIn: false });
      }
    } catch (error) {
      console.error("Failed to restore session:", error);
      set({ session: null, isLoggedIn: false });
    }
  },
}));
