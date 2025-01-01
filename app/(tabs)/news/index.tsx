import React, { useRef } from "react";
import { StyleSheet, FlatList, ActivityIndicator, Button } from "react-native";
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
    isRefetching,
  } = useFetchNews();

  const themeStyles = coustomTheme();
  const flatListRef = useRef<FlatList>(null);

  const handleRefreshAndScroll = async () => {
    await refetch();
    // Scroll to top after refetch
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  const ListFooter = () => {
    if (!hasNextPage) return null;

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
          <Button
            title="Neuer Beitrag verfügbar"
            onPress={handleRefreshAndScroll}
          />
        </ThemedView>
      )}

      <ThemedView style={styles.headerContainer}>
        <ThemedText style={styles.headerText} type="title">
          Neuigkeiten
        </ThemedText>
      </ThemedView>

      <FlatList
        ref={flatListRef}
        data={news}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <NewsItem
            id={item.id}
            title={item.title ?? ""}
            body_text={item.body_text ?? ""}
            image_url={item.image_url ?? []}
            external_url={item.external_url ?? []}
            internal_url={item.internal_url ?? []}
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
    gap: 10,
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
  footerComponent: {},
});
