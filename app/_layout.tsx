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
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/utils/queryClient";
import { useAuthStore } from "@/stores/authStore";
import NetInfo from "@react-native-community/netinfo";
import { noInternet } from "@/constants/messages";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { SupabaseRealtimeProvider } from "@/components/SupabaseRealtimeProvider";
import useNotificationStore from "@/stores/notificationStore";
import { useFontSizeStore } from "@/stores/fontSizeStore";
import ReMountManager from "@/components/ReMountManager";
import LoadingVideo from "@/components/LoadingVideo";
import { View } from "react-native";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  // Initialize database
  const dbInitialized = useInitializeDatabase();
  console.log(dbInitialized);
  const restoreSession = useAuthStore((state) => state.restoreSession);
  const [isSessionRestored, setIsSessionRestored] = useState(false);
  const [isConnected, setIsConnected] = useState<boolean | null>(true);
  const { expoPushToken, notification } = usePushNotifications();
  const [storesHydrated, setStoresHydrated] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  // Musst be before 'if (!dbInitialized)' or 'Rendered more hooks' appearce because if (!loaded || !dbInitialized) -> we return and the useEffect benath it doesn't get used
  useEffect(() => {
    const setColorTheme = () => {
      const savedColorScheme = Storage.getItemSync("isDarkMode");
      Appearance.setColorScheme(savedColorScheme === "true" ? "dark" : "light");
    };
    setColorTheme();
  }, []);

  // Check internet connectivity
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  // Show toast on connectivity change
  useEffect(() => {
    if (isConnected === false) {
      noInternet();
    }
  }, [isConnected]);

  useEffect(() => {
    const hydrateStores = async () => {
      await Promise.all([
        useAuthStore.persist.rehydrate(),
        useFontSizeStore.persist.rehydrate(),
        useNotificationStore.persist.rehydrate(),
        useNotificationStore.getState().checkPermissions(),
      ]);

      setStoresHydrated(true);
    };

    hydrateStores();
  }, []);

  // Session restoration effect
  useEffect(() => {
    const initSession = async () => {
      await restoreSession();
      setIsSessionRestored(true);
    };
    initSession();
  }, []);

  //! Store push token
  useEffect(() => {
    if (expoPushToken?.data) {
      console.log("Push Token:", expoPushToken.data);
    }
  }, [expoPushToken]);

  //! Handle notifications
  useEffect(() => {
    if (notification) {
      console.log("Received notification:", notification);
    }
  }, [notification]);

  // Debounce showing the loading video by 2 seconds
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (!dbInitialized && isConnected) {
      timer = setTimeout(() => {
        setShowVideo(true);
      }, 2000);
    } else {
      // If DB becomes initialized or connectivity changes, reset the flag
      setShowVideo(false);
    }

    return () => clearTimeout(timer); // Properly clear the timeout on cleanup
  }, [dbInitialized, isConnected]);

  // Hide splash screen when everything is ready
  useEffect(() => {
    if (dbInitialized && isSessionRestored && storesHydrated) {
      SplashScreen.hideAsync();
      return;
    }

    if (!isConnected) {
      SplashScreen.hideAsync();
      Toast.show({
        type: "error",
        text1: "Keine Internetverbindung",
        text2: "Daten können nicht geladen werden!",
      });
      // Quits the useEffect tree
      return;
    }

    SplashScreen.hideAsync();
  }, [dbInitialized, isSessionRestored, storesHydrated, isConnected]);

  // Show loading video
  if (!dbInitialized && isConnected && showVideo) {
    return (
      // Add this return
      <View style={{ flex: 1 }}>
        <LoadingVideo />
        <Toast />
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <ReMountManager>
        <QueryClientProvider client={queryClient}>
          <SupabaseRealtimeProvider>
            <SQLiteProvider databaseName="islam-fragen.db">
              <Stack
                screenOptions={{
                  headerTintColor: colorScheme === "dark" ? "#d0d0c0" : "#000",
                }}
              >
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                <Stack.Screen
                  name="(search)"
                  options={{
                    headerShown: true,
                    headerBackTitle: "Zurück",
                    headerTitle: "Suche",
                  }}
                />
                <Stack.Screen
                  name="(question)"
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="(askQuestion)"
                  options={{ headerShown: false }}
                />
                <Stack.Screen name="+not-found" />
              </Stack>
              <StatusBar style="auto" />
            </SQLiteProvider>
          </SupabaseRealtimeProvider>
        </QueryClientProvider>
        <Toast />
      </ReMountManager>
    </ThemeProvider>
  );
}
