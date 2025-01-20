import React, { useEffect, useRef } from "react";
import {
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Button,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { coustomTheme } from "@/utils/coustomTheme";
import { useFetchNews } from "@/hooks/useFetchNews";
import { NewsItem } from "@/components/NewsItem";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAuthStore } from "@/stores/authStore";
import { router } from "expo-router";
import NoInternet from "@/components/NoInternet";
import { FlashList } from "@shopify/flash-list";
import { NewsItemType } from "@/hooks/useFetchNews";

export default function NewsFeed() {
  const {
    allNews: news,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    showUpdateButton,
    handleRefresh: refetch,
    isRefetching,
  } = useFetchNews();

  const themeStyles = coustomTheme();
  const flatListRef = useRef<FlashList<NewsItemType>>(null);
  const colorScheme = useColorScheme();
  const handleRefreshAndScroll = async () => {
    await refetch();
    // Scroll to top after refetch
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  };
  const isAdmin = useAuthStore((state) => state.isAdmin);

  const ListFooter = () => {
    if (!hasNextPage) return null;

    // useEffect(() => {
    //   const fetchNewsWithoutLoadButton = async () => {
    //     if (isAdmin && showUpdateButton) {
    //       await handleRefreshAndScroll();
    //     }
    //   };
    //   fetchNewsWithoutLoadButton();
    // }, [isAdmin, showUpdateButton]);

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
      <NoInternet />
      {showUpdateButton && !isAdmin && (
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
        {isAdmin && (
          <Ionicons
            name="add-circle-outline"
            size={35}
            color={colorScheme === "dark" ? "white" : "black"}
            style={styles.addIcon}
            onPress={() => router.push("/news/addNews")}
          />
        )}
      </ThemedView>

      <FlashList
        ref={flatListRef}
        data={news}
        keyExtractor={(item) => item.id.toString()}
        estimatedItemSize={104}
        renderItem={({ item }) => (
          <NewsItem
            id={item.id}
            title={item.title ?? ""}
            body_text={item.body_text ?? ""}
            image_url={item.image_url ?? []}
            external_url={item.external_url ?? []}
            internal_url={item.internal_url ?? []}
            is_pinned={item.is_pinned}
            created_at={item.created_at}
          />
        )}
        contentContainerStyle={styles.newsList}
        onRefresh={refetch} // Trigger `refetch` when pulling down
        refreshing={isRefetching} // Show a loader when refreshing
        nestedScrollEnabled={true}
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerText: {
    marginTop: 15,
    marginHorizontal: 15,
  },
  addIcon: {
    marginRight: 15,
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
