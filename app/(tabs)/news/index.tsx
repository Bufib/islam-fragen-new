import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  Pressable,
} from "react-native";
import React, { useState, useEffect } from "react";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { SafeAreaView } from "react-native-safe-area-context";
import { useColorScheme } from "react-native";
import { coustomTheme } from "@/components/coustomTheme";
import Feather from "@expo/vector-icons/Feather";
const newsData = [
  {
    id: "1",
    title: "Neues Update veröffentlicht",
    content:
      "Wir haben einige aufregende neue Funktionen hinzugefügt. Schau sie dir an!",
    date: "2024-12-30",
  },
  {
    id: "2",
    title: "Wartungsarbeiten geplant",
    content:
      "Am 02.01.2025 wird die App zwischen 00:00 und 03:00 Uhr nicht verfügbar sein.",
    date: "2024-12-29",
  },
  {
    id: "3",
    title: "Community-Meilenstein erreicht",
    content:
      "Wir haben 10.000 aktive Nutzer erreicht! Vielen Dank für eure Unterstützung.",
    date: "2024-12-28",
  },
];

const NewsItem = ({ title, content, date }) => {
  const themeStyles = coustomTheme();
  return (
    <ThemedView style={[styles.newsItem, themeStyles.contrast]}>
      <ThemedText style={styles.newsTitle} type="defaultSemiBold">
        {title}
      </ThemedText>
      <ThemedText style={styles.newsContent}>{content}</ThemedText>
      <ThemedText style={styles.newsDate}>{date}</ThemedText>
    </ThemedView>
  );
};

const News = () => {
  const colorScheme = useColorScheme();
  const themeStyles = coustomTheme();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 10); // Simulating data loading
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <SafeAreaView
        style={[styles.container, themeStyles.defaultBackgorundColor]}
        edges={["top"]}
      >
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      </SafeAreaView>
    );
  }

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
      <FlatList
        data={newsData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NewsItem
            title={item.title}
            content={item.content}
            date={item.date}
          />
        )}
        contentContainerStyle={styles.newsList}
      />
    </SafeAreaView>
  );
};

export default News;

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
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  newsList: {
    padding: 15,
  },
  newsItem: {
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    elevation: 2,
  },
  newsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  newsContent: {
    fontSize: 14,
    marginBottom: 5,
  },
  newsDate: {
    fontSize: 12,
    color: "#888",
  },
});
