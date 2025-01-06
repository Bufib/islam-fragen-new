// // app/questions/[id].tsx
// import { View, Text, ScrollView, StyleSheet, SafeAreaView } from "react-native";
// import { useLocalSearchParams } from "expo-router";
// import { useQuery } from "@tanstack/react-query";
// import { supabase } from "@/utils/supabase";
// import { QuestionFromUser } from "@/hooks/useGetUserQuestions";
// import { useQueryClient } from "@tanstack/react-query";
// export default function QuestionDetailScreen() {
//     const { id } = useLocalSearchParams<{ id: string }>();
//     const queryClient = useQueryClient();
  
//     // Get question from existing cache
//     const data = queryClient.getQueriesData<{
//       pages: { questions: QuestionFromUser[] }[];
//     }>({ queryKey: ['questionsFromUser'] });
  

//     // Find the question in the cached pages
//     const question = data[0]?.[1]?.pages
//       .flatMap(page => page.questions)
//       .find(q => q.id === id);
  
//     if (!question) {
//       return (
//         <View style={styles.centerContainer}>
//           <Text>Question not found</Text>
//         </View>
//       );
//     }
  

//   if (isLoading) {
//     return (
//       <View style={styles.centerContainer}>
//         <Text>Loading...</Text>
//       </View>
//     );
//   }

//   if (!question) {
//     return (
//       <View style={styles.centerContainer}>
//         <Text>Question not found</Text>
//       </View>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <Text style={styles.title}>{question.title}</Text>
//         <View
//           style={[
//             styles.statusBadge,
//             { backgroundColor: getStatusColor(question.answer_status) },
//           ]}
//         >
//           <Text style={styles.statusText}>{question.status}</Text>
//         </View>
//       </View>

//       {/* Chat Area */}
//       <ScrollView style={styles.chatContainer}>
//         {/* Question Bubble */}
//         <View style={styles.questionBubble}>
//           <Text style={styles.bubbleText}>{question.question_text}</Text>
//           <Text style={styles.timestamp}>
//             {new Date(question.created_at).toLocaleDateString()}
//           </Text>
//         </View>

//         {/* Answer Bubble (if exists) */}
//         {question.answer_text ? (
//           <View style={styles.answerBubble}>
//             <Text style={styles.bubbleText}>{question.answer_text}</Text>
//             <Text style={styles.statusLabel}>{question.answer_status}</Text>
//           </View>
//         ) : (
//           <View style={styles.waitingContainer}>
//             <Text style={styles.waitingText}>Beantwortung steht noch aus.</Text>
//           </View>
//         )}
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// // Helper function to determine status color
// const getStatusColor = (status: QuestionFromUser["answer_status"]) => {
//   switch (status) {
//     case "Beantworted.":
//       return "#4CAF50"; // Green
//     case "Beantwortung steht noch aus.":
//       return "#FFA500"; // Orange
//     case "Abgelehnt.":
//       return "#F44336"; // Red
//     default:
//       return "#999999"; // Gray
//   }
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#F5F5F5",
//   },
//   centerContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   header: {
//     backgroundColor: "white",
//     padding: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: "#E0E0E0",
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: "600",
//     marginBottom: 8,
//   },
//   statusBadge: {
//     alignSelf: "flex-start",
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 16,
//   },
//   statusText: {
//     color: "white",
//     fontSize: 12,
//     fontWeight: "500",
//   },
//   chatContainer: {
//     flex: 1,
//     padding: 16,
//   },
//   questionBubble: {
//     backgroundColor: "#E3F2FD",
//     padding: 16,
//     borderRadius: 16,
//     borderBottomLeftRadius: 4,
//     maxWidth: "80%",
//     alignSelf: "flex-start",
//     marginBottom: 16,
//   },
//   answerBubble: {
//     backgroundColor: "#E8F5E9",
//     padding: 16,
//     borderRadius: 16,
//     borderBottomRightRadius: 4,
//     maxWidth: "80%",
//     alignSelf: "flex-end",
//     marginBottom: 16,
//   },
//   bubbleText: {
//     fontSize: 16,
//     lineHeight: 24,
//   },
//   timestamp: {
//     fontSize: 12,
//     color: "#666666",
//     marginTop: 8,
//   },
//   statusLabel: {
//     fontSize: 12,
//     color: "#4CAF50",
//     marginTop: 8,
//     fontWeight: "500",
//   },
//   waitingContainer: {
//     padding: 16,
//     alignItems: "center",
//   },
//   waitingText: {
//     color: "#666666",
//     fontStyle: "italic",
//   },
// });


// app/questions/[id].tsx
import { View, Text, ScrollView, StyleSheet, SafeAreaView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/utils/supabase";
import { QuestionFromUser } from "@/hooks/useGetUserQuestions";

export default function QuestionDetailScreen() {
  const { questionId } = useLocalSearchParams<{ questionId: string }>();

  // Fetch individual question
  const { data: question, isLoading } = useQuery({
    queryKey: ["question", questionId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("user_question")
        .select("*")
        .eq("id", questionId)
        .eq("user_id", user.id)
        .single();

      if (error) throw error;
      return data as QuestionFromUser;
    },
  });

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!question) {
    return (
      <View style={styles.centerContainer}>
        <Text>Question not found</Text>
      </View>
    );
  }

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

// Helper function to map status strings to colors
const getStatusColor = (status: QuestionFromUser["status"]) => {
  switch (status) {
    case "Beantworted.":
      return "#4CAF50"; // Green
    case "Beantwortung steht noch aus.":
      return "#FFA500"; // Orange
    case "Abgelehnt.":
      return "#F44336"; // Red
    default:
      return "#999999"; // Gray
  }
};

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
