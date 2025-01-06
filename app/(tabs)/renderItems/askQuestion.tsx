// // import React, { useEffect, useState } from "react";
// // import {
// //   View,
// //   Text,
// //   StyleSheet,
// //   TouchableOpacity,
// //   FlatList,
// //   TextInput,
// //   Modal,
// //   ActivityIndicator,
// //   SafeAreaView,
// //   RefreshControl,
// //   Alert,
// // } from "react-native";
// // import { supabase } from "@/utils/supabase";

// // const AskQuestion = () => {
// //   const [questions, setQuestions] = useState([]);
// //   const [selectedQuestion, setSelectedQuestion] = useState(null);
// //   const [showChat, setShowChat] = useState(false);
// //   const [newQuestion, setNewQuestion] = useState("");
// //   const [title, setTitle] = useState("");
// //   const [category, setCategory] = useState("");

// //   const [isModalVisible, setIsModalVisible] = useState(false);
// //   const [userId, setUserId] = useState(null);
// //   const [isLoading, setIsLoading] = useState(true);
// //   const [refreshing, setRefreshing] = useState(false);

// //   // Fetch the current user
// //   const fetchUser = async () => {
// //     try {
// //       const {
// //         data: { user },
// //         error,
// //       } = await supabase.auth.getUser();
// //       if (error) throw error;

// //       if (user) {
// //         setUserId(user.id);
// //       } else {
// //         // If no user is found, handle gracefully
// //         setIsLoading(false);
// //       }
// //     } catch (err) {
// //       console.error("Error fetching user:", err.message);
// //       setIsLoading(false);
// //     }
// //   };

// //   // Fetch questions for the logged-in user
// //   const fetchQuestions = async () => {
// //     // Only fetch if we have a user ID
// //     if (!userId) {
// //       setIsLoading(false);
// //       return;
// //     }

// //     try {
// //       setIsLoading(true);
// //       const { data, error } = await supabase
// //         .from("user_question")
// //         .select("*")
// //         .eq("user_id", userId)
// //         .order("created_at", { ascending: false });

// //       if (error) throw error;
// //       setQuestions(data || []);
// //     } catch (err) {
// //       console.error("Error fetching questions:", err.message);
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   // Add a new question
// //   const addQuestion = async () => {
// //     if (!title.trim() || !newQuestion.trim()) {
// //       Alert.alert("Validation Error", "Please fill in both title and question.");
// //       return;
// //     }

// //     try {
// //       const { error } = await supabase
// //         .from("user_question")
// //         .insert([
// //           {
// //             user_id: userId,
// //             question: newQuestion.trim(),
// //             title: title.trim(),
// //             status: "Pending",
// //             marja: category.trim() || "General",
// //           },
// //         ]);

// //       if (error) throw error;

// //       // Refresh questions
// //       await fetchQuestions();

// //       // Clear inputs and close modal
// //       setTitle("");
// //       setNewQuestion("");
// //       setCategory("");
// //       setIsModalVisible(false);
// //     } catch (err) {
// //       Alert.alert("Error", `Error adding question: ${err.message}`);
// //     }
// //   };

// //   // Pull to refresh
// //   const onRefresh = async () => {
// //     setRefreshing(true);
// //     await fetchQuestions();
// //     setRefreshing(false);
// //   };

// //   // Get color for status badge
// //   const getStatusColor = (status) => {
// //     switch (status?.toLowerCase()) {
// //       case "pending":
// //         return "#FFA500";
// //       case "answered":
// //         return "#4CAF50";
// //       case "in progress":
// //         return "#2196F3";
// //       default:
// //         return "#999";
// //     }
// //   };

// //   // Render each question in the list
// //   const renderQuestionItem = ({ item }) => (
// //     <TouchableOpacity
// //       style={styles.questionBox}
// //       onPress={() => {
// //         setSelectedQuestion(item);
// //         setShowChat(true);
// //       }}
// //     >
// //       <View style={styles.questionHeader}>
// //         <Text style={styles.questionTitle}>{item.title}</Text>
// //         <View
// //           style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}
// //         >
// //           <Text style={styles.statusText}>{item.status}</Text>
// //         </View>
// //       </View>

// //       <Text style={styles.questionText} numberOfLines={2}>
// //         {item.question}
// //       </Text>

// //       <View style={styles.questionFooter}>
// //         <Text style={styles.categoryText}>{item.marja || "General"}</Text>
// //         <Text style={styles.dateText}>
// //           {new Date(item.created_at).toLocaleDateString()}
// //         </Text>
// //       </View>
// //     </TouchableOpacity>
// //   );

// //   // On component mount, fetch user info
// //   useEffect(() => {
// //     fetchUser();
// //   }, []);

// //   // Once we have a userId, fetch questions
// //   useEffect(() => {
// //     if (userId) {
// //       fetchQuestions();
// //     }
// //   }, [userId]);

// //   // Loading state while fetching user or questions
// //   if (isLoading) {
// //     return (
// //       <View style={styles.loadingContainer}>
// //         <ActivityIndicator size="large" color="#007BFF" />
// //       </View>
// //     );
// //   }

// //   // If there's no user (e.g., not logged in), show a fallback
// //   if (!userId) {
// //     return (
// //       <SafeAreaView style={styles.container}>
// //         <View style={styles.emptyContainer}>
// //           <Text style={styles.emptyText}>
// //             No user found. Please log in to view or ask questions.
// //           </Text>
// //         </View>
// //       </SafeAreaView>
// //     );
// //   }

// //   return (
// //     <SafeAreaView style={styles.container}>
// //       <FlatList
// //         data={questions}
// //         keyExtractor={(item) => item.id.toString()}
// //         renderItem={renderQuestionItem}
// //         refreshControl={
// //           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
// //         }
// //         ListEmptyComponent={
// //           <View style={styles.emptyContainer}>
// //             <Text style={styles.emptyText}>
// //               No questions yet. Tap the button below to ask your first question!
// //             </Text>
// //           </View>
// //         }
// //       />

// //       {/** CHAT MODAL */}
// //       <Modal
// //         visible={showChat}
// //         animationType="slide"
// //         onRequestClose={() => setShowChat(false)}
// //       >
// //         <SafeAreaView style={styles.chatContainer}>
// //           <View style={styles.chatHeader}>
// //             <Text style={styles.chatTitle}>{selectedQuestion?.title}</Text>
// //             <TouchableOpacity
// //               style={styles.closeButton}
// //               onPress={() => setShowChat(false)}
// //             >
// //               <Text style={styles.closeButtonText}>×</Text>
// //             </TouchableOpacity>
// //           </View>

// //           <View style={styles.chatContent}>
// //             {/* Question Bubble */}
// //             <View style={styles.questionBubble}>
// //               <Text style={styles.chatQuestionText}>
// //                 {selectedQuestion?.question}
// //               </Text>
// //             </View>
// //             {/* Answer Bubble (if available) */}
// //             {selectedQuestion?.answer ? (
// //               <View style={styles.answerBubble}>
// //                 <Text style={styles.chatAnswerText}>
// //                   {selectedQuestion.answer}
// //                 </Text>
// //               </View>
// //             ) : (
// //               <Text style={styles.noAnswerText}>
// //                 No answer yet. Please wait...
// //               </Text>
// //             )}
// //           </View>
// //         </SafeAreaView>
// //       </Modal>

// //       {/** NEW QUESTION MODAL */}
// //       <Modal
// //         visible={isModalVisible}
// //         animationType="slide"
// //         onRequestClose={() => setIsModalVisible(false)}
// //       >
// //         <SafeAreaView style={styles.modalContainer}>
// //           <View style={styles.modalHeader}>
// //             <Text style={styles.modalTitle}>Ask a New Question</Text>
// //             <TouchableOpacity
// //               style={styles.closeButton}
// //               onPress={() => setIsModalVisible(false)}
// //             >
// //               <Text style={styles.closeButtonText}>×</Text>
// //             </TouchableOpacity>
// //           </View>

// //           <View style={styles.inputContainer}>
// //             <Text style={styles.inputLabel}>Title</Text>
// //             <TextInput
// //               style={styles.titleInput}
// //               placeholder="Enter a brief title..."
// //               value={title}
// //               onChangeText={setTitle}
// //             />

// //             <Text style={styles.inputLabel}>Category (Optional)</Text>
// //             <TextInput
// //               style={styles.categoryInput}
// //               placeholder="Enter category..."
// //               value={category}
// //               onChangeText={setCategory}
// //             />

// //             <Text style={styles.inputLabel}>Question</Text>
// //             <TextInput
// //               style={styles.questionInput}
// //               placeholder="Type your question here..."
// //               value={newQuestion}
// //               onChangeText={setNewQuestion}
// //               multiline
// //               textAlignVertical="top"
// //             />

// //             <TouchableOpacity style={styles.submitButton} onPress={addQuestion}>
// //               <Text style={styles.submitButtonText}>Submit Question</Text>
// //             </TouchableOpacity>
// //           </View>
// //         </SafeAreaView>
// //       </Modal>

// //       {/** BUTTON TO SHOW NEW QUESTION MODAL */}
// //       <TouchableOpacity
// //         style={styles.addButton}
// //         onPress={() => setIsModalVisible(true)}
// //       >
// //         <Text style={styles.addButtonText}>+ New Question</Text>
// //       </TouchableOpacity>
// //     </SafeAreaView>
// //   );
// // };

// // export default AskQuestion;

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: "#f5f5f5",
// //   },
// //   loadingContainer: {
// //     flex: 1,
// //     justifyContent: "center",
// //     alignItems: "center",
// //   },
// //   questionBox: {
// //     backgroundColor: "#fff",
// //     margin: 10,
// //     padding: 15,
// //     borderRadius: 12,
// //     shadowColor: "#000",
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 4,
// //     elevation: 3,
// //   },
// //   questionHeader: {
// //     flexDirection: "row",
// //     justifyContent: "space-between",
// //     alignItems: "center",
// //     marginBottom: 8,
// //   },
// //   questionTitle: {
// //     fontSize: 16,
// //     fontWeight: "600",
// //     flex: 1,
// //     marginRight: 8,
// //   },
// //   statusBadge: {
// //     paddingHorizontal: 8,
// //     paddingVertical: 4,
// //     borderRadius: 12,
// //     marginLeft: 8,
// //   },
// //   statusText: {
// //     color: "#fff",
// //     fontSize: 12,
// //     fontWeight: "500",
// //   },
// //   questionText: {
// //     fontSize: 14,
// //     color: "#666",
// //     marginBottom: 8,
// //   },
// //   questionFooter: {
// //     flexDirection: "row",
// //     justifyContent: "space-between",
// //     alignItems: "center",
// //     marginTop: 8,
// //   },
// //   categoryText: {
// //     fontSize: 12,
// //     color: "#666",
// //     backgroundColor: "#f0f0f0",
// //     paddingHorizontal: 8,
// //     paddingVertical: 4,
// //     borderRadius: 8,
// //   },
// //   dateText: {
// //     fontSize: 12,
// //     color: "#999",
// //   },
// //   emptyContainer: {
// //     padding: 20,
// //     alignItems: "center",
// //   },
// //   emptyText: {
// //     fontSize: 16,
// //     color: "#666",
// //     textAlign: "center",
// //     marginTop: 20,
// //   },
// //   chatContainer: {
// //     flex: 1,
// //     backgroundColor: "#f5f5f5",
// //   },
// //   chatHeader: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     padding: 15,
// //     backgroundColor: "#fff",
// //     borderBottomWidth: 1,
// //     borderBottomColor: "#eee",
// //   },
// //   chatTitle: {
// //     fontSize: 18,
// //     fontWeight: "600",
// //     flex: 1,
// //   },
// //   closeButton: {
// //     padding: 8,
// //   },
// //   closeButtonText: {
// //     fontSize: 24,
// //     color: "#666",
// //     fontWeight: "600",
// //   },
// //   chatContent: {
// //     flex: 1,
// //     padding: 15,
// //   },
// //   questionBubble: {
// //     backgroundColor: "#e3f2fd",
// //     padding: 15,
// //     borderRadius: 12,
// //     marginBottom: 15,
// //     maxWidth: "80%",
// //   },
// //   answerBubble: {
// //     backgroundColor: "#fff",
// //     padding: 15,
// //     borderRadius: 12,
// //     marginBottom: 15,
// //     maxWidth: "80%",
// //     alignSelf: "flex-end",
// //   },
// //   chatQuestionText: {
// //     fontSize: 16,
// //     color: "#1976d2",
// //   },
// //   chatAnswerText: {
// //     fontSize: 16,
// //     color: "#333",
// //   },
// //   noAnswerText: {
// //     fontSize: 14,
// //     color: "#999",
// //     marginTop: 5,
// //   },
// //   modalContainer: {
// //     flex: 1,
// //     backgroundColor: "#f5f5f5",
// //   },
// //   modalHeader: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     padding: 15,
// //     backgroundColor: "#fff",
// //     borderBottomWidth: 1,
// //     borderBottomColor: "#eee",
// //   },
// //   modalTitle: {
// //     fontSize: 18,
// //     fontWeight: "600",
// //     flex: 1,
// //   },
// //   inputContainer: {
// //     padding: 15,
// //   },
// //   inputLabel: {
// //     fontSize: 14,
// //     fontWeight: "500",
// //     color: "#666",
// //     marginBottom: 8,
// //   },
// //   titleInput: {
// //     backgroundColor: "#fff",
// //     borderRadius: 8,
// //     padding: 12,
// //     marginBottom: 15,
// //     borderWidth: 1,
// //     borderColor: "#ddd",
// //   },
// //   categoryInput: {
// //     backgroundColor: "#fff",
// //     borderRadius: 8,
// //     padding: 12,
// //     marginBottom: 15,
// //     borderWidth: 1,
// //     borderColor: "#ddd",
// //   },
// //   questionInput: {
// //     backgroundColor: "#fff",
// //     borderRadius: 8,
// //     padding: 12,
// //     marginBottom: 20,
// //     height: 120,
// //     borderWidth: 1,
// //     borderColor: "#ddd",
// //   },
// //   submitButton: {
// //     backgroundColor: "#007BFF",
// //     borderRadius: 8,
// //     padding: 15,
// //     alignItems: "center",
// //   },
// //   submitButtonText: {
// //     color: "#fff",
// //     fontSize: 16,
// //     fontWeight: "600",
// //   },
// //   addButton: {
// //     backgroundColor: "#007BFF",
// //     borderRadius: 30,
// //     padding: 15,
// //     position: "absolute",
// //     bottom: 20,
// //     right: 20,
// //     shadowColor: "#000",
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.25,
// //     shadowRadius: 4,
// //     elevation: 5,
// //   },
// //   addButtonText: {
// //     color: "#fff",
// //     fontSize: 16,
// //     fontWeight: "600",
// //   },
// // });
// // components/QuestionsList.tsx
// import {
//   View,
//   Text,
//   FlatList,
//   RefreshControl,
//   TouchableOpacity,
//   StyleSheet,
// } from "react-native";
// import {
//   useGetUserQuestions,
//   AskQuestionFormData,
//   QuestionFromUser,
// } from "@/hooks/useGetUserQuestions";
// import { Link } from "expo-router";

// export default function QuestionsList() {
//   const {
//     data,
//     fetchNextPage,
//     hasNextPage,
//     isFetchingNextPage,
//     isLoading,
//     refetch,
//     isRefetching,
//   } = useGetUserQuestions();

//   // Flatten all pages data into a single array
//   const questions = data?.pages.flatMap((page) => page.questions) ?? [];

//   if (isLoading) {
//     return (
//       <View style={styles.centered}>
//         <Text>Loading questions...</Text>
//       </View>
//     );
//   }

//   const renderQuestion = ({ item }: { item: QuestionFromUser }) => (
//     <Link
//       href={{
//         pathname: "/(tabs)/renderItems/[questionId]",
//         params: { id: item.id },
//       }}
//       asChild
//     >
//       <TouchableOpacity style={styles.questionCard}>
//         <Text style={styles.questionTitle}>{item.title}</Text>
//         <Text style={styles.questionText} numberOfLines={2}>
//           {item.question_text}
//         </Text>
//         <View style={styles.questionFooter}>
//           <Text style={styles.category}>{item.marja}</Text>
//           <View
//             style={[
//               styles.statusBadge,
//               { backgroundColor: getStatusColor(item.answer_status) },
//             ]}
//           >
//             <Text style={styles.statusText}>{item.answer_status}</Text>
//           </View>
//         </View>
//       </TouchableOpacity>
//     </Link>
//   );

//   return (
//     <FlatList
//       data={questions}
//       renderItem={renderQuestion}
//       keyExtractor={(item) => item.id}
//       contentContainerStyle={styles.listContainer}
//       refreshControl={
//         <RefreshControl
//           refreshing={isRefetching && !isFetchingNextPage}
//           onRefresh={refetch}
//         />
//       }
//       onEndReached={() => {
//         if (hasNextPage && !isFetchingNextPage) {
//           fetchNextPage();
//         }
//       }}
//       onEndReachedThreshold={0.5}
//       ListEmptyComponent={
//         <View style={styles.emptyContainer}>
//           <Text style={styles.emptyText}>No questions yet</Text>
//         </View>
//       }
//       ListFooterComponent={
//         isFetchingNextPage ? (
//           <View style={styles.loadingMore}>
//             <Text>Loading more questions...</Text>
//           </View>
//         ) : null
//       }
//     />
//   );
// }

// // Helper function to determine status color
// const getStatusColor = (status: QuestionFromUser["answer_status"]) => {
//   console.log(status);
//   switch (status) {
//     case "Beantwortung steht noch aus.":
//       return "#FFA500";
//     case "Beantworted.":
//       return "#4CAF50";
//     case "Abgelehnt.":
//       return "#2196F3";
//     default:
//       return "#999";
//   }
// };

// const styles = StyleSheet.create({
//   centered: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   listContainer: {
//     padding: 16,
//   },
//   questionCard: {
//     backgroundColor: "white",
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 12,
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   questionTitle: {
//     fontSize: 18,
//     fontWeight: "600",
//     marginBottom: 8,
//   },
//   questionText: {
//     fontSize: 14,
//     color: "#666",
//     marginBottom: 12,
//   },
//   questionFooter: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   category: {
//     fontSize: 12,
//     color: "#666",
//     backgroundColor: "#f0f0f0",
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 8,
//   },
//   statusBadge: {
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 12,
//   },
//   statusText: {
//     color: "white",
//     fontSize: 12,
//     fontWeight: "500",
//   },
//   emptyContainer: {
//     alignItems: "center",
//     padding: 20,
//   },
//   emptyText: {
//     color: "#666",
//     fontSize: 16,
//   },
//   loadingMore: {
//     padding: 16,
//     alignItems: "center",
//   },
// });

import React from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Link } from "expo-router";
import {
  useGetUserQuestions,
  QuestionFromUser,
} from "@/hooks/useGetUserQuestions";
import { useAuthStore } from "@/components/authStore";
import { router } from "expo-router";
import { useEffect } from "react";

// Helper to map statuses to colors
const getStatusColor = (status: QuestionFromUser["status"]) => {
  console.log(status);
  switch (status) {
    case "Beantwortung steht noch aus.":
      return "#FFA500";
    case "Beantwortet.":
      return "#4CAF50";
    case "Abgelehnt.":
      return "#F44336";
    default:
      return "#999";
  }
};

export default function QuestionsList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
    isRefetching,
  } = useGetUserQuestions();

  // Flatten all pages data into a single array
  const questions = data?.pages.flatMap((page) => page.questions) ?? [];
  const { isLoggedIn, session } = useAuthStore();

  useEffect(() => {
    if (!isLoggedIn) {
      // Redirect to login if not authenticated
      router.replace("/(tabs)/renderItems/login");
    }
  }, [isLoggedIn]);

  // Loading state when fetching for the first time
  if (isLoading) {
    return (
      <View style={styles.centered}>
        <Text>Loading questions...</Text>
      </View>
    );
  }

    // If somehow we get here without being logged in
    if (!isLoggedIn || !session) {
      return null; // The useEffect will handle the redirect
    }
  

  // Render each question card
  const renderQuestion = ({ item }: { item: QuestionFromUser }) => (
    <Link
      href={{
        pathname: "/(tabs)/renderItems/[questionId]",
        // Make sure you match your file or parameter name
        params: { questionId: item.id },
      }}
      asChild
    >
      <TouchableOpacity style={styles.questionCard}>
        <Text style={styles.questionTitle}>{item.title}</Text>
        <Text style={styles.questionText} numberOfLines={2}>
          {item.question_text}
        </Text>
        <View style={styles.questionFooter}>
          <Text style={styles.category}>{item.marja}</Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(item.status) },
            ]}
          >
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );

  // Render footer with a "Load More" button or relevant message
  const renderFooter = () => {
    if (isFetchingNextPage) {
      return (
        <View style={styles.footer}>
          <ActivityIndicator size="small" color="#333" />
          <Text style={{ marginLeft: 8 }}>Loading more questions...</Text>
        </View>
      );
    }

    if (hasNextPage) {
      return (
        <TouchableOpacity style={styles.loadMoreButton} onPress={fetchNextPage}>
          <Text style={styles.loadMoreButtonText}>Load More</Text>
        </TouchableOpacity>
      );
    }

    // No more pages to load
    return (
      <View style={styles.footer}>
        <Text>No more questions to load</Text>
      </View>
    );
  };

  return (
    <FlatList
      data={questions}
      renderItem={renderQuestion}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContainer}
      // Pull-to-refresh
      refreshControl={
        <RefreshControl
          refreshing={isRefetching && !isFetchingNextPage}
          onRefresh={refetch}
        />
      }
      // Remove onEndReached if you only want to load more via the button:
      // onEndReached={() => {
      //   if (hasNextPage && !isFetchingNextPage) {
      //     fetchNextPage();
      //   }
      // }}
      // onEndReachedThreshold={0.5}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No questions yet</Text>
        </View>
      }
      ListFooterComponent={renderFooter()}
    />
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    padding: 16,
  },
  questionCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  emptyContainer: {
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    color: "#666",
    fontSize: 16,
  },
  footer: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  loadMoreButton: {
    padding: 12,
    marginVertical: 16,
    alignSelf: "center",
    backgroundColor: "#007BFF",
    borderRadius: 8,
  },
  loadMoreButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
});
