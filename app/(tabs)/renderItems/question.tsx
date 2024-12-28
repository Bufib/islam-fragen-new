import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import { Stack } from "expo-router";
import RenderQuestion from "@/components/RenderQuestion";

export default function categories() {
  const { category, subcategory, questionId, questionTitle } =
    useLocalSearchParams<{
      category: string;
      subcategory: string;
      questionId: string;
      questionTitle: string;
    }>();

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: questionTitle,
        }}
      />
      <RenderQuestion
        category={category}
        subcategory={subcategory}
        questionId={parseInt(questionId)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
