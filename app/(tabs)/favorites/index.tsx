import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { SafeAreaView } from "react-native-safe-area-context";
import { useColorScheme, Pressable } from "react-native";
import { coustomTheme } from "@/utils/coustomTheme";
import Feather from "@expo/vector-icons/Feather";
import { router } from "expo-router";
import RenderFavoriteQuestions from "@/components/RenderFavorites";

const favorites = () => {
  const colorScheme = useColorScheme();
  const themeStyles = coustomTheme();

  return (
    <SafeAreaView
      style={[styles.container, themeStyles.defaultBackgorundColor]}
      edges={["top"]}
    >
      <ThemedView style={styles.headerContainer}>
        <ThemedText style={styles.headerText} type="title">
          Favoriten
        </ThemedText>
      </ThemedView>
      <RenderFavoriteQuestions />
    </SafeAreaView>
  );
};

export default favorites;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 15,
  },
  headerContainer: {
    flexDirection: "column",
    marginBottom: 10,
  },
  headerText: {
    margin: 15,
  },
});
