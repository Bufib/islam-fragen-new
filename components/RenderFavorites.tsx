import { useEffect, useState, useLayoutEffect } from "react";
import { View, Pressable, StyleSheet, FlatList } from "react-native";
import { coustomTheme } from "@/components/coustomTheme";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Entypo from "@expo/vector-icons/Entypo";
import { useColorScheme } from "react-native";
import { router } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import {
  getQuestionsForSubcategory,
  QuestionType,
  getFavoriteQuestions,
} from "./initializeDatabase";
import { useRefreshFavorites } from "@/hooks/useRefreshFavoritesStore";

function RenderFavoriteQuestions() {
  const { category, subcategory } = useLocalSearchParams<{
    category: string;
    subcategory: string;
  }>();
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const themeStyle = coustomTheme();
  const colorScheme = useColorScheme();
  const { refreshTriggerFavorites } = useRefreshFavorites();

  useLayoutEffect(() => {
    const loadQuestions = async () => {
      try {
        setIsLoading(true);

        const questions = await getFavoriteQuestions();
        console.log(questions);

        if (questions) {
          setQuestions(questions);
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
  }, [refreshTriggerFavorites]);

  // Show loading state
  if (isLoading) {
    return (
      <View style={styles.centeredContainer}>
        <ThemedText>Loading questions...</ThemedText>
      </View>
    );
  }

  // Main render with questions
  return (
    <View style={[styles.container, themeStyle.defaultBackgorundColor]}>
      <FlatList
        data={questions}
        extraData={refreshTriggerFavorites}
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
                  category: item.category_name,
                  subcategory: item.subcategory_name,
                  questionId: item.id.toString(),
                  questionTitle: item.title,
                },
              })
            }
          >
            <ThemedView style={[styles.item, themeStyle.contrast]}>
              <View style={styles.questionContainer}>
                <ThemedText style={styles.titleText}>{item.title}</ThemedText>
                <ThemedText style={styles.questionText} numberOfLines={1}>
                  {item.question}
                </ThemedText>
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
    paddingHorizontal: 10,
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
    gap: 2,
  },
  titleText: {
    fontSize: 18,
    textAlign: "left",
    fontWeight: "500",
  },
  questionText: {
    fontSize: 16,
    textAlign: "left",
  },
});

export default RenderFavoriteQuestions;