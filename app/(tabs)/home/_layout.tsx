import { Stack } from "expo-router";
import { Colors } from "@/constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="category"
        options={{
          headerShown: true,
          headerTintColor: "#057958",
          headerLeft: () => {
            return (
              <Ionicons
                name="chevron-back-outline"
                size={30}
                          color="#057958"
                style={{ marginLeft: -16 }}
                onPress={() => router.back()}
              />
            );
          },
        }}
      />
      <Stack.Screen name="subcategory" options={{ headerShown: true , headerTintColor: "#057958",}} />
    </Stack>
  );
}
