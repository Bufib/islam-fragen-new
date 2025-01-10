import { router } from "expo-router";
import { useAuthStore } from "../components/authStore";
import { Alert } from "react-native";
import { logoutSuccess, logoutErrorGeneral } from "@/constants/messages";

const handleLogout = async () => {
  const { clearSession } = useAuthStore.getState(); // Access Zustand state directly
  try {
    await clearSession();
    logoutSuccess();
    router.replace("/"); // Navigate to home
  } catch (error) {
    console.error("Logout failed:", error);
    Alert.alert(logoutErrorGeneral, error.message);
  }
};

export default handleLogout;
