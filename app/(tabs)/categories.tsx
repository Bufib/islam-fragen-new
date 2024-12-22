import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";


export default function categories() {
  const { category } = useLocalSearchParams<{ category: string }>();

  return (
    <View style={styles.container}>
      <Text>Categories: {category}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
