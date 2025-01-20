import * as React from "react";
import { View, useWindowDimensions, Text, StyleSheet } from "react-native";
import { TabView, TabBar } from "react-native-tab-view";
import { ThemedText } from "@/components/ThemedText";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { registerRootComponent } from "expo";
import { ScrollView } from "react-native";
import QuestionLinks from "@/components/QuestionLinks";
import { Image } from "expo-image";
import { coustomTheme } from "@/utils/coustomTheme";
import { useFetchUserQuestions } from "@/hooks/useFetchUserQuestions";
export default function index() {
  const themeStyles = coustomTheme();


  return (
    <SafeAreaView
      edges={["top"]}
      style={[styles.container, themeStyles.defaultBackgorundColor]}
    >
      <ScrollView
        style={[styles.scrollViewStyles, themeStyles.defaultBackgorundColor]}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <QuestionLinks />
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewStyles: {
    flex: 1,
  },
  scrollViewContent: {
    paddingTop: 20,
    paddingBottom: 10,
  },
});
