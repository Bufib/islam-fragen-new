import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useInitializeDatabase } from "@/hooks/useInitializeDatabase.ts";
import { SQLiteProvider } from "expo-sqlite";
import Toast from "react-native-toast-message";
import { Appearance } from "react-native";
import { Storage } from "expo-sqlite/kv-store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuthStore } from "@/utils/authStore";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
const queryClient = new QueryClient();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  // Initialize database
  const dbInitialized = useInitializeDatabase();
  const { restoreSession } = useAuthStore();
  const [isSessionRestored, setIsSessionRestored] = useState(false);

  // Musst be before 'if (!dbInitialized)' or 'Rendered more hooks' appearce because if (!loaded || !dbInitialized) -> we return and the useEffect benath it doesn't get used
  useEffect(() => {
    const setColorTheme = () => {
      const savedColorScheme = Storage.getItemSync("isDarkMode");
      Appearance.setColorScheme(savedColorScheme === "true" ? "dark" : "light");
    };
    setColorTheme();
  }, []);

  // Session restoration effect
  useEffect(() => {
    const initSession = async () => {
      await restoreSession();
      setIsSessionRestored(true);
    };
    initSession();
  }, []);

  // Hide splash screen when everything is ready
  useEffect(() => {
    if (dbInitialized && isSessionRestored) {
      SplashScreen.hideAsync();
    }
  }, [dbInitialized, isSessionRestored]);

  if (!dbInitialized || !isSessionRestored) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <QueryClientProvider client={queryClient}>
        <SQLiteProvider databaseName="islam-fragen.db">
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" />
        </SQLiteProvider>
      </QueryClientProvider>
      <Toast />
    </ThemeProvider>
  );
}
