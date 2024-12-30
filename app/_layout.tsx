import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useInitializeDatabase } from "@/hooks/useInitializeDatabase.ts";
import { SQLiteProvider } from "expo-sqlite";
import Toast from "react-native-toast-message";
import { Appearance } from "react-native";
import { Storage } from "expo-sqlite/kv-store";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
const queryClient = new QueryClient();
export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  // Initialize database
  const dbInitialized = useInitializeDatabase();

  // Musst be before 'if (!loaded || !dbInitialized)' or 'Rendered more hooks' appearce because if (!loaded || !dbInitialized) -> we return and the useEffect benath it doesn't get used
  useEffect(() => {
    const savedColorScheme = Storage.getItemSync("isDarkMode");
    Appearance.setColorScheme(savedColorScheme === "true" ? "dark" : "light");
  }, []);

  useEffect(() => {
    if (loaded && dbInitialized) {
      SplashScreen.hideAsync();
    }
  }, [loaded, dbInitialized]);

  if (!loaded || !dbInitialized) {
    return null; // Wait until fonts and database initialization are complete
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
