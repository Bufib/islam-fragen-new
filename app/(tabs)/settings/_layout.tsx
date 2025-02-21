import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/useColorScheme";
import Entypo from "@expo/vector-icons/Entypo";
import { Colors } from "@/constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
          name="impressum"
          options={{ headerShown: true, headerBackTitle: "Einstellungen" }}
        />
        <Stack.Screen
          name="about"
          options={{ presentation: "modal", headerTitle: "Über die App" }}
        />
        <Stack.Screen
          name="changePassword"
          options={{ headerShown: true, headerBackTitle: "Einstellungen", headerTitle: "" }}
        />
      </Stack>
    </ThemeProvider>
  );
}
