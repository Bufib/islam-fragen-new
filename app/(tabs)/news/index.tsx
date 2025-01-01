import React from "react";
import { StyleSheet, FlatList, ActivityIndicator, Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { coustomTheme } from "@/components/coustomTheme";
import { useFetchNews } from "@/hooks/useFetchNews";
import { NewsItem } from "@/components/NewsItem";

export default function () {
  const {
    allNews: news,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    showUpdateButton: updated,
    handleRefresh: refetch,
  } = useFetchNews();

  const themeStyles = coustomTheme();

  if (!news || news.length === 0) {
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
        data={news}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <NewsItem
            title={item.title ?? ""}
            body_text={item.body_text ?? ""}
            created_at={item.created_at}
          />
        )}
        contentContainerStyle={styles.newsList}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
      />

      {hasNextPage && (
        <ThemedView style={styles.loadMoreContainer}>
          <Button
            title="Mehr laden"
            onPress={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          />
        </ThemedView>
      )}
    </SafeAreaView>
  );
}

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
