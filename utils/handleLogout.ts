import { router } from "expo-router";
import { useAuthStore } from "../components/authStore";
import { Alert } from "react-native";

const handleLogout = async () => {
  const { clearSession } = useAuthStore.getState(); // Access Zustand state directly
  try {
    await clearSession();
    Alert.alert("Logged Out", "You have been logged out successfully.");
    router.replace("/"); // Navigate to the root or login screen
  } catch (error) {
    console.error("Logout failed:", error);
    Alert.alert("Error", "Failed to log out. Please try again.");
  }
};

export default handleLogout;