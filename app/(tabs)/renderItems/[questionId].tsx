// app/questions/[questionId].tsx
import React, { useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, SafeAreaView } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";
import { QuestionFromUser } from "@/hooks/useGetUserQuestions";
import { useAuthStore } from "@/components/authStore";

// Helper function to map statuses to colors
const getStatusColor = (status: QuestionFromUser["status"]) => {
  switch (status) {
    case "Beantwortet":
      return "#4CAF50"; // Green
    case "Beantwortung steht noch aus":
      return "#FFA500"; // Orange
    case "Abgelehnt":
      return "#F44336"; // Red
    default:
      return "#999999"; // Gray
  }
};

export default function QuestionDetailScreen() {
  // 1. Grab the questionId from the URL
  const { questionId } = useLocalSearchParams();
  // 2. Grab QueryClient to read from the cache
  const queryClient = useQueryClient();
  // 3. Auth
  const { isLoggedIn, session } = useAuthStore();
  const userId = session?.user?.id ?? null;

  // 4. If user is not logged in, redirect to login
  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/(tabs)/renderItems/login");
    }
  }, [isLoggedIn]);

  // 5. Grab **non-paginated** data from the cache
  //    NOTE: If your query key is ["questionsFromUser", userId],
  //    be sure to include userId in the key below.
  const cachedQuestions = queryClient.getQueryData<QuestionFromUser[]>([
    "questionsFromUser",
    userId,
  ]);

  // 6. Find the specific question in the cached array
  const question = cachedQuestions?.find(
    (q) => String(q.id) === String(questionId)
  );

  // 7. Fallback if the question is not in the cache
  if (!question) {
    return (
      <View style={styles.centerContainer}>
        <Text>Question not found</Text>
      </View>
    );
  }

  // 8. Render
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{question.title}</Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(question.status) },
          ]}
        >
          <Text style={styles.statusText}>{question.status}</Text>
        </View>
      </View>

      <ScrollView style={styles.chatContainer}>
        <View style={styles.questionBubble}>
          <Text style={styles.bubbleText}>{question.question_text}</Text>
          <Text style={styles.timestamp}>
            {new Date(question.created_at).toLocaleDateString()}
          </Text>
        </View>

        {question.answer_text ? (
          <View style={styles.answerBubble}>
            <Text style={styles.bubbleText}>{question.answer_text}</Text>
            <Text style={styles.statusLabel}>{question.status}</Text>
          </View>
        ) : (
          <View style={styles.waitingContainer}>
            <Text style={styles.waitingText}>Beantwortung steht noch aus.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    backgroundColor: "white",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
  },
  chatContainer: {
    flex: 1,
    padding: 16,
  },
  questionBubble: {
    backgroundColor: "#E3F2FD",
    padding: 16,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    maxWidth: "80%",
    alignSelf: "flex-start",
    marginBottom: 16,
  },
  answerBubble: {
    backgroundColor: "#E8F5E9",
    padding: 16,
    borderRadius: 16,
    borderBottomRightRadius: 4,
    maxWidth: "80%",
    alignSelf: "flex-end",
    marginBottom: 16,
  },
  bubbleText: {
    fontSize: 16,
    lineHeight: 24,
  },
  timestamp: {
    fontSize: 12,
    color: "#666666",
    marginTop: 8,
  },
  statusLabel: {
    fontSize: 12,
    color: "#4CAF50",
    marginTop: 8,
    fontWeight: "500",
  },
  waitingContainer: {
    padding: 16,
    alignItems: "center",
  },
  waitingText: {
    color: "#666666",
    fontStyle: "italic",
  },
});
