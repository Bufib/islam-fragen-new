import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "@/utils/supabase";
import { Session } from "@supabase/supabase-js";

const SUPABASE_SESSION_KEY = "supabase_session";

type AuthStore = {
  session: Session | null;
  isLoggedIn: boolean;
  setSession: (session: Session | null) => void;
  clearSession: () => Promise<void>;
  restoreSession: () => Promise<boolean>;
};

export const useAuthStore = create<AuthStore>((set, get) => ({
  session: null,
  isLoggedIn: false,

  setSession: (session: Session | null) => {
    console.log("Setting session:", session);
    set({ session, isLoggedIn: !!session });
    if (session) {
      try {
        AsyncStorage.setItem(SUPABASE_SESSION_KEY, JSON.stringify(session));
      } catch (error) {
        console.error("Failed to save session to AsyncStorage:", error);
      }
    }
  },

  clearSession: async () => {
    try {
      await supabase.auth.signOut();
      await AsyncStorage.removeItem(SUPABASE_SESSION_KEY);
      set({ session: null, isLoggedIn: false });
    } catch (error) {
      console.error("Failed to clear session:", error);
    }
  },

  restoreSession: async () => {
    try {
      const storedSession = await AsyncStorage.getItem(SUPABASE_SESSION_KEY);
      if (storedSession) {
        const session: Session = JSON.parse(storedSession);

        if (session.expires_at && session.expires_at <= Date.now() / 1000) {
          const { data, error } = await supabase.auth.refreshSession();
          if (data.session) {
            set({ session: data.session, isLoggedIn: true });
            await AsyncStorage.setItem(SUPABASE_SESSION_KEY, JSON.stringify(data.session));
            return true;
          } else {
            console.error("Failed to refresh expired session:", error);
            await get().clearSession();
            return false;
          }
        } else {
          set({ session, isLoggedIn: true });
          supabase.auth.setSession(session);
          return true;
        }
      }
    } catch (error) {
      console.error("Failed to restore session:", error);
      await get().clearSession();
    }
    return false;
  },
}));
