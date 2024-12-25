import { useEffect, useState } from "react";
import { View, Pressable, StyleSheet, FlatList } from "react-native";
import {
  useQADatabase,
  QuestionAnswerPerMarjaType,
  QuestionOneAnswerType,
} from "@/hooks/useQandA";
import { coustomTheme } from "@/components/coustomTheme";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Entypo from "@expo/vector-icons/Entypo";
import { useColorScheme } from "react-native";
import { router } from "expo-router";
import { useLocalSearchParams } from "expo-router";

function RenderSubcategoryItems() {
  const { getQuestionsForTable, loading } = useQADatabase();
  const { category, subcategory } = useLocalSearchParams<{
    category: string;
    subcategory: string;
  }>();
  const [questions, setQuestions] = useState<
    (QuestionOneAnswerType | QuestionAnswerPerMarjaType)[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const themeStyle = coustomTheme();
  const colorScheme = useColorScheme();

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setIsLoading(true);
        console.log("Loading questions with params:", {
          category,
          subcategory,
        });

        if (!category || !subcategory) {
          console.log("Missing category or subcategory");
          return;
        }

        console.log("Fetching questions...");
        const data = await getQuestionsForTable(subcategory, category);
        console.log("Received data:", data);

        if (data && Array.isArray(data)) {
          setQuestions(data);
        } else {
          console.log("Invalid data format received");
          setQuestions([]);
        }
      } catch (error) {
        console.error("Error loading questions:", error);
        setQuestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadQuestions();
  }, [category, subcategory]);

  // Show loading state
  if (loading || isLoading) {
    return (
      <View style={styles.centeredContainer}>
        <ThemedText>Loading questions...</ThemedText>
      </View>
    );
  }

  // Show error state if missing parameters
  if (!category || !subcategory) {
    return (
      <View style={styles.centeredContainer}>
        <ThemedText>Missing parameters</ThemedText>
      </View>
    );
  }

  // Show empty state
  if (questions.length === 0) {
    return (
      <View
        style={[styles.centeredContainer, themeStyle.defaultBackgorundColor]}
      >
        <ThemedText>No questions found for {subcategory}</ThemedText>
      </View>
    );
  }

  const isMarjaQuestion = category === "Rechtsfragen";

  // Main render with questions
  return (
    <View style={[styles.container, themeStyle.defaultBackgorundColor]}>
      <FlatList
        data={questions}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        style={themeStyle.defaultBackgorundColor}
        contentContainerStyle={styles.flatListStyle}
        renderItem={({ item }) => (
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/(tabs)/renderItems/question",
                params: {
                  questionId: item.id.toString(),
                  category,
                  subcategory,
                  type: isMarjaQuestion ? "marja" : "single",
                },
              })
            }
          >
            <ThemedView
              style={[styles.item, themeStyle.renderItemsBackgroundcolor]}
            >
              <View style={styles.questionContainer}>
                <ThemedText style={styles.questionText}>
                  {item.title}
                </ThemedText>
                <ThemedText>{item.question}</ThemedText>
              </View>
              <Entypo
                name="chevron-thin-right"
                size={24}
                color={colorScheme === "light" ? "black" : "white"}
              />
            </ThemedView>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  flatListStyle: {
    paddingTop: 10,
    paddingHorizontal: 16,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
  },
  questionContainer: {
    flex: 1,
    marginRight: 10,
  },
  questionText: {
    fontSize: 16,
    textAlign: "left",
    fontWeight: "500",
  },
  marjaLabel: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
});

export default RenderSubcategoryItems;
