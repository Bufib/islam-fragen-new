import React, { useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Button,
} from "react-native";
import { Link } from "expo-router";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  useFetchUserQuestions,
  QuestionFromUser,
} from "@/hooks/useFetchUserQuestions";
import { useAuthStore } from "@/utils/authStore";
import { formateDate } from "@/utils/formateDate";
import { Colors } from "@/constants/Colors";
import getStatusColor from "@/utils/getStatusColor";
import { useColorScheme } from "react-native";
import { coustomTheme } from "@/utils/coustomTheme";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { userQuestionErrorLoadingQuestions } from "@/constants/messages";

export default function QuestionsList() {
  // 1. Check auth state from the store
  const { isLoggedIn, session } = useAuthStore();
  const colorScheme = useColorScheme();
  const themeStyles = coustomTheme();

  // 2. If not logged in, redirect to login
  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/(tabs)/renderItems/login");
    }
  }, [isLoggedIn]);

  // 3. Use our hook to fetch data
  const {
    data: questions, // Here, data is now an array of questions
    isLoading,
    isRefetching,
    refetch,
    isError,
    hasUpdate,
    handleRefresh,
  } = useFetchUserQuestions();

  // Loading state should be checked first
  if (isLoading) {
    return (
      <ThemedView style={[styles.container, styles.centered]}>
        <ActivityIndicator
          size="large"
          color={colorScheme === "dark" ? "white" : "black"}
        />
        <ThemedText style={styles.loadingText}>
          Fragen werden geladen...
        </ThemedText>
      </ThemedView>
    );
  }

  // 5. Handle error
  if (isError) {
    return (
      <ThemedView style={styles.container}>
        <ThemedView style={styles.centered}>
          <ThemedText style={styles.errorText}>
            {userQuestionErrorLoadingQuestions}
          </ThemedText>

          <Pressable style={styles.retryButton} onPress={refetch}>
            <ThemedText style={styles.retryButtonText}>
              Versuch es nochmal
            </ThemedText>
          </Pressable>
        </ThemedView>
      </ThemedView>
    );
  }

  // 6. Render item
  const renderQuestion = ({ item }: { item: QuestionFromUser }) => (
    <Pressable
      style={[styles.questionCard, themeStyles.contrast]}
      onPress={() =>
        router.push({
          pathname: "/(tabs)/(auth)/(userQuestions)/[questionId]",
          params: { questionId: item.id },
        })
      }
    >
      <ThemedText style={styles.questionTitle}>{item.title}</ThemedText>
      <ThemedText style={styles.questionText} numberOfLines={2}>
        {item.question}
      </ThemedText>
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
      <Text style={styles.createdAtText}>{formateDate(item.created_at)}</Text>
    </Pressable>
  );

  // 7. Render the full list
  return (
    <ThemedView style={[styles.container, themeStyles.defaultBackgorundColor]}>
      {hasUpdate && (
        <Pressable style={styles.updateButton} onPress={handleRefresh}>
          <Text style={styles.updateButtonText}>Aktualisieren</Text>
        </Pressable>
      )}

      <FlatList
        data={questions}
        renderItem={renderQuestion}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.listContainer,
          questions?.length === 0 && !isLoading && styles.emptyListContainer,
        ]}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
        ListEmptyComponent={
          <ThemedView style={styles.emptyContainer}>
            <ThemedText style={styles.emptyText}>
              Du hast noch keine Fragen!
              {"\n"}
              Klicke unten auf den Button um eine zu stellen.
            </ThemedText>
          </ThemedView>
        }
      />

      <Pressable
        style={styles.askQuestionButton}
        onPress={() =>
          router.push("/(tabs)/(auth)/(userQuestions)/askQuestion")
        }
      >
        <ThemedText style={styles.askQuestionButtonText}>
          Neue Frage stellen
        </ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: Colors.universal.link,
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
  updateButton: {
    backgroundColor: Colors.universal.link,
    padding: 10,
    margin: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  updateButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },

  questionCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
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
    color: Colors.universal.questionBoxQuestionText,
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
    color: Colors.universal.created_atTextColor,
  },
  emptyContainer: {
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
  },
  askQuestionButton: {
    position: "absolute",
    bottom: 30,
    right: 15,
    padding: 15,
    backgroundColor: Colors.universal.link,
    borderRadius: 25,
  },
  askQuestionButtonText: {
    color: Colors.universal.white,
  },
});
