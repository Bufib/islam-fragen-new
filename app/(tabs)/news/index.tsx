import { StyleSheet, FlatList, ActivityIndicator, Button } from "react-native";
import React, { useState } from "react";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { SafeAreaView } from "react-native-safe-area-context";
import { useColorScheme } from "react-native";
import { coustomTheme } from "@/components/coustomTheme";
import useFetchNews from "@/hooks/useFetchNews";

const NewsItem = ({ title, body_text, created_at }) => {
  const themeStyles = coustomTheme();
  const formattedDate = new Date(created_at).toISOString().split("T")[0]; // Format to "YYYY-MM-DD"
  return (
    <ThemedView style={[styles.newsItem, themeStyles.contrast]}>
      <ThemedText style={styles.newsTitle} type="defaultSemiBold">
        {title}
      </ThemedText>
      <ThemedText style={styles.newsContent}>{body_text}</ThemedText>
      <ThemedText style={styles.newsDate}>{formattedDate}</ThemedText>
    </ThemedView>
  );
};

const News = () => {
  const { news, loading, error, updated, refetch } = useFetchNews();
  const themeStyles = coustomTheme();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 1;

  const paginatedNews = news.slice(0, currentPage * itemsPerPage); // Limit displayed news

  const loadMore = () => {
    if (paginatedNews.length < news.length) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

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

  if (error) {
    return (
      <SafeAreaView
        style={[styles.container, themeStyles.defaultBackgorundColor]}
        edges={["top"]}
      >
        <ThemedText style={styles.errorText}>{error}</ThemedText>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, themeStyles.defaultBackgorundColor]}
      edges={["top"]}
    >
      {updated && (
        <ThemedView style={styles.updateContainer}>
          <Button title="Neue Updates verfügbar" onPress={refetch} />
        </ThemedView>
      )}
      <ThemedView style={styles.headerContainer}>
        <ThemedText style={styles.headerText} type="title">
          Neuigkeiten
        </ThemedText>
      </ThemedView>
      <FlatList
        data={paginatedNews}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <NewsItem
            title={item.title}
            body_text={item.body_text}
            created_at={item.created_at}
          />
        )}
        contentContainerStyle={styles.newsList}
      />
      {paginatedNews.length < news.length && (
        <ThemedView style={styles.loadMoreContainer}>
          <Button title="Mehr laden" onPress={loadMore} />
        </ThemedView>
      )}
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
  errorText: {
    color: "red",
    textAlign: "center",
    margin: 20,
  },
  updateContainer: {
    padding: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  loadMoreContainer: {
    alignItems: "center",
  },
});
