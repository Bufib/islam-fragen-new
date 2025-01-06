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
        <Stack.Screen
          name="category"
          options={{
            headerShown: true,
            headerLeft: () => {
              return (
                <Ionicons
                  name="chevron-back-outline"
                  size={30}
                  color={Colors.universal.link}
                  style={{ marginLeft: -16 }}
                  onPress={() => router.back()}
                />
              );
            },
          }}
        />
        <Stack.Screen name="subcategory" options={{ headerShown: true }} />
        <Stack.Screen name="question" options={{ headerShown: true }} />
        <Stack.Screen name="login" options={{ headerShown: true }} />
        <Stack.Screen name="signup" options={{ headerShown: true }} />
        <Stack.Screen name="userQuestions" options={{ headerShown: false }} />

      </Stack>
    </ThemeProvider>
  );
}
