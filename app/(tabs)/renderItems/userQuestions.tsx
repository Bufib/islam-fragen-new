import React, { useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Link } from "expo-router";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  useGetUserQuestions,
  QuestionFromUser,
} from "@/hooks/useGetUserQuestions";
import { useAuthStore } from "@/components/authStore";

// Helper to map statuses to colors
const getStatusColor = (status: QuestionFromUser["status"]) => {
  switch (status) {
    case "Beantwortung steht noch aus":
      return "#FFA500";
    case "Beantwortet":
      return "#4CAF50";
    case "Abgelehnt":
      return "#F44336";
    default:
      return "#999";
  }
};

export default function QuestionsList() {
  // 1. Check auth state from the store
  const { isLoggedIn, session } = useAuthStore();

  // 2. If not logged in, redirect to login
  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/(tabs)/renderItems/login");
    }
  }, [isLoggedIn]);

  if (!isLoggedIn || !session) {
    return null; // or a loading screen
  }

  // 3. Use our hook to fetch data
  const {
    data: questions, // Here, data is now an array of questions
    isLoading,
    isRefetching,
    refetch,
    isError,
  } = useGetUserQuestions();

  // 4. Handle loading
  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#007BFF" />
          <Text style={styles.loadingText}>Loading questions...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // 5. Handle error
  if (isError) {
    return (
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <View style={styles.centered}>
          <Text style={styles.errorText}>Failed to load questions</Text>
          <Pressable style={styles.retryButton} onPress={refetch}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  // 6. Render item
  const renderQuestion = ({ item }: { item: QuestionFromUser }) => (
    <Link
      href={{
        pathname: "/(tabs)/renderItems/[questionId]",
        params: { questionId: item.id },
      }}
      asChild
    >
      <Pressable style={styles.questionCard}>
        <Text style={styles.questionTitle}>{item.title}</Text>
        <Text style={styles.questionText} numberOfLines={2}>
          {item.question}
        </Text>
        <View style={styles.questionFooter}>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(item.status) },
            ]}
          >
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>
        <Text style={styles.createdAtText}>{item.created_at}</Text>
      </Pressable>
    </Link>
  );

  // 7. Render the full list
  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
      <FlatList
        data={questions ?? []}
        renderItem={renderQuestion}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContainer,
          questions?.length === 0 && styles.emptyListContainer,
        ]}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No questions yet</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  errorText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 16,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#007BFF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  listContainer: {
    padding: 16,
  },
  emptyListContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  questionCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    // Shadow/elevation for Android
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  questionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  questionText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  questionFooter: {
    alignSelf: "flex-end",
  },
  category: {
    fontSize: 12,
    color: "#666",
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
  },
  createdAtText: {
    
  },
  emptyContainer: {
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    color: "#666",
    fontSize: 16,
    textAlign: "center",
  },
});
