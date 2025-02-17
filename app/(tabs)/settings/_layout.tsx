import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/useColorScheme";


export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
  <Stack screenOptions={{headerTintColor: colorScheme === "dark" ? "#d0d0c0" : "#000"}}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
          name="impressum"
          options={{ headerShown: true, headerBackTitle: "Einstellungen", }}
        />
        <Stack.Screen
          name="about"
          options={{ presentation: "modal", headerTitle: "Über die App", }}
        />
        <Stack.Screen
          name="changePassword"
          options={{ headerShown: true, headerBackTitle: "Einstellungen", headerTitle: "" ,}}
        />
      </Stack>
    </ThemeProvider>
  );
}
