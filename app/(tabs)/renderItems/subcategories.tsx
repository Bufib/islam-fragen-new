import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import { Stack } from "expo-router";
import RenderSubcategoryItems from "@/components/RenderSubcategoryItems";

export default function categories() {
  const { subcategory } = useLocalSearchParams<{ subcategory: string }>();

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: subcategory,
        }}
      />
      <RenderSubcategoryItems subcategory={subcategory} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
