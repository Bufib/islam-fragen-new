import React from "react";
import {
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Button,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { coustomTheme } from "@/components/coustomTheme";
import { useFetchNews } from "@/hooks/useFetchNews";
import { NewsItem } from "@/components/NewsItem";
export default function NewsFeed() {
  const {
    allNews: news,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    showUpdateButton: updated,
    handleRefresh: refetch,
  } = useFetchNews();

  const themeStyles = coustomTheme();

  const ListFooter = () => {
    // Only show footer if there's more content to load
    if (!hasNextPage) {
      return null;
    }

    return (
      <ThemedView style={styles.loadMoreContainer}>
        {isFetchingNextPage ? (
          <ActivityIndicator
            size="small"
            color={themeStyles.activityIndicator.color}
          />
        ) : (
          <Button title="Mehr laden" onPress={() => fetchNextPage()} />
        )}
      </ThemedView>
    );
  };

  if (!news || news.length === 0) {
    return (
      <SafeAreaView
        style={[styles.container, themeStyles.defaultBackgorundColor]}
        edges={["top"]}
      >
        <ActivityIndicator
          size="large"
          color={themeStyles.activityIndicator.color}
          style={styles.loader}
        />
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
          <Button title="Neuer Beitrag verfügbar" onPress={refetch} />
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
        ListFooterComponent={ListFooter}
        ListFooterComponentStyle={styles.footerComponent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 10, // distance between header and news list
  },
  headerContainer: {
    flexDirection: "column",
  },
  headerText: {
    marginTop: 15,
    marginHorizontal: 15,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  newsList: {
    padding: 15,
  },
  updateContainer: {
    padding: 10,
    alignItems: "center",
  },
  loadMoreContainer: {
    alignItems: "center",
  },
  footerComponent: {
  },
});
