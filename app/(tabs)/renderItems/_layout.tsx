import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/useColorScheme";
import { SQLiteProvider } from "expo-sqlite";
import Entypo from "@expo/vector-icons/Entypo";
import { Colors } from "@/constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";

import { migrateDbIfNeeded } from "@/hooks/useDatabase";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <SQLiteProvider databaseName="qaDatabase.db" onInit={migrateDbIfNeeded}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen
            name="categories"
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
          <Stack.Screen name="subcategories" options={{ headerShown: true }} />
        </Stack>
      </ThemeProvider>
    </SQLiteProvider>
  );
}
