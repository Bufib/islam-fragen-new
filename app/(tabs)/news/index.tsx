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
import { coustomTheme } from "@/components/coustomTheme";
import Feather from "@expo/vector-icons/Feather";
import { router } from "expo-router";

const news = () => {
  const colorScheme = useColorScheme();
  const themeStyles = coustomTheme();

  return (
    <SafeAreaView
      style={[styles.container, themeStyles.defaultBackgorundColor]}
      edges={["top"]}
    >
      <ThemedView style={styles.headerContainer}>
        <ThemedText style={styles.headerText} type="title">
          Neuigkeiten
        </ThemedText>
      </ThemedView>
    </SafeAreaView>
  );
};

export default news;

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
