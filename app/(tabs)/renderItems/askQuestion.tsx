import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList, 
  TextInput, 
  Modal, 
  ActivityIndicator,
  SafeAreaView,
  RefreshControl
} from "react-native";
import { supabase } from "@/utils/supabase";

const AskQuestion = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");

  // Fetch current user
  const fetchUser = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      setUserId(user.id);
    } catch (error) {
      console.error("Error fetching user:", error.message);
    }
  };

  // Fetch questions with proper error handling
  const fetchQuestions = async () => {
    if (!userId) return;
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("user_question")
        .select("*")
        .eq("user_id", userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuestions(data);
    } catch (error) {
      console.error("Error fetching questions:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Add a new question with validation
  const addQuestion = async () => {
    if (!newQuestion.trim() || !title.trim()) {
      alert("Please fill in both title and question fields");
      return;
    }

    try {
      const { error } = await supabase
        .from("user_question")
        .insert([{ 
          user_id: userId, 
          question: newQuestion,
          title: title,
          status: "Pending",
          marja: category || "General"
        }]);

      if (error) throw error;
      
      await fetchQuestions();
      setNewQuestion("");
      setTitle("");
      setCategory("");
      setIsModalVisible(false);
    } catch (error) {
      alert("Error adding question: " + error.message);
    }
  };

  // Pull to refresh functionality
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchQuestions();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchQuestions();
    }
  }, [userId]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return '#FFA500';
      case 'answered': return '#4CAF50';
      case 'in progress': return '#2196F3';
      default: return '#999';
    }
  };

  const renderQuestionItem = ({ item }) => (
    <TouchableOpacity
      style={styles.questionBox}
      onPress={() => {
        setSelectedQuestion(item);
        setShowChat(true);
      }}
    >
      <View style={styles.questionHeader}>
        <Text style={styles.questionTitle}>{item.title}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      <Text style={styles.questionText} numberOfLines={2}>{item.question}</Text>
      <View style={styles.questionFooter}>
        <Text style={styles.categoryText}>{item.marja || 'General'}</Text>
        <Text style={styles.dateText}>
          {new Date(item.created_at).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={questions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderQuestionItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No questions yet. Tap the button below to ask your first question!</Text>
          </View>
        }
      />

      {/* Chat Modal */}
      <Modal visible={showChat} animationType="slide" onRequestClose={() => setShowChat(false)}>
        <SafeAreaView style={styles.chatContainer}>
          <View style={styles.chatHeader}>
            <Text style={styles.chatTitle}>{selectedQuestion?.title}</Text>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowChat(false)}
            >
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.chatContent}>
            <View style={styles.questionBubble}>
              <Text style={styles.chatQuestionText}>{selectedQuestion?.question}</Text>
            </View>
            {selectedQuestion?.answer && (
              <View style={styles.answerBubble}>
                <Text style={styles.chatAnswerText}>{selectedQuestion.answer}</Text>
              </View>
            )}
          </View>
        </SafeAreaView>
      </Modal>

      {/* New Question Modal */}
      <Modal visible={isModalVisible} animationType="slide" onRequestClose={() => setIsModalVisible(false)}>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Ask a New Question</Text>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Title</Text>
            <TextInput
              style={styles.titleInput}
              placeholder="Enter a brief title..."
              value={title}
              onChangeText={setTitle}
            />

            <Text style={styles.inputLabel}>Category (Optional)</Text>
            <TextInput
              style={styles.categoryInput}
              placeholder="Enter category..."
              value={category}
              onChangeText={setCategory}
            />

            <Text style={styles.inputLabel}>Question</Text>
            <TextInput
              style={styles.questionInput}
              placeholder="Type your question here..."
              value={newQuestion}
              onChangeText={setNewQuestion}
              multiline
              textAlignVertical="top"
            />

            <TouchableOpacity 
              style={styles.submitButton}
              onPress={addQuestion}
            >
              <Text style={styles.submitButtonText}>Submit Question</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Add Question Button */}
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => setIsModalVisible(true)}
      >
        <Text style={styles.addButtonText}>+ New Question</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionBox: {
    backgroundColor: "#fff",
    margin: 10,
    padding: 15,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  questionTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  questionText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  questionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  categoryText: {
    fontSize: 12,
    color: "#666",
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  dateText: {
    fontSize: 12,
    color: "#999",
  },
  chatContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  chatTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  chatContent: {
    flex: 1,
    padding: 15,
  },
  questionBubble: {
    backgroundColor: '#e3f2fd',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    maxWidth: '80%',
  },
  answerBubble: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    maxWidth: '80%',
    alignSelf: 'flex-end',
  },
  chatQuestionText: {
    fontSize: 16,
    color: '#1976d2',
  },
  chatAnswerText: {
    fontSize: 16,
    color: '#333',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#666',
    fontWeight: '600',
  },
  inputContainer: {
    padding: 15,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 8,
  },
  titleInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  categoryInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  questionInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    height: 120,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  submitButton: {
    backgroundColor: '#007BFF',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: '#007BFF',
    borderRadius: 30,
    padding: 15,
    position: 'absolute',
    bottom: 20,
    right: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default AskQuestion;