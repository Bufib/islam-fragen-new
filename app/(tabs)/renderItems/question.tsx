import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import { Stack } from "expo-router";
import RenderQuestion from "@/components/RenderQuestion";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";

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
          headerRight: () => {
            return (
              <IconSymbol name="star" size={30} style={{ marginLeft: -16 }} color={Colors.universal.favoriteIcon}/>
            );
          },
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
