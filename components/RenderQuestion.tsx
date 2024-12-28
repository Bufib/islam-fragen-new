import { StyleSheet, Text, View, ScrollView } from "react-native";
import React from "react";
import { Collapsible } from "@/components/Collapsible";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { coustomTheme } from "@/components/coustomTheme";
import { SafeAreaView } from "react-native-safe-area-context";
import { useColorScheme } from "react-native";
import { QuestionType, getQuestion } from "@/components/initializeDatabase";
import { useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import { Stack } from "expo-router";

type RenderQuestionProps = {
  category: string;
  subcategory: string;
  questionId: number;
};

const RenderQuestion = ({
  category,
  subcategory,
  questionId,
}: RenderQuestionProps) => {
  const themeStyles = coustomTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [question, setQuestion] = useState<QuestionType | null>(null);

  useEffect(() => {
    const loadQuestion = async () => {
      try {
        setIsLoading(true);

        if (!category || !subcategory) {
          console.log("Missing category or subcategory");
          return;
        }
        const question = await getQuestion(category, subcategory, questionId);

        if (question) {
          setQuestion(question);
        } else {
          console.log("Invalid data format received");
          setQuestion(null);
        }
      } catch (error) {
        console.error("Error loading question:", error);
        setQuestion(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadQuestion();
  }, [category, subcategory]);

  return (
    <ScrollView
      style={[styles.scrollViewStyles, themeStyles.defaultBackgorundColor]}
      contentContainerStyle={styles.scrollViewContent}
    >
      <View
        style={[
          styles.questionContainer,
          themeStyles.questionContainerBackground,
        ]}
      >
        <ThemedText style={styles.questionText}>
          {question?.question}
        </ThemedText>
      </View>

      <View style={styles.answerContainer}>
        <Collapsible title="Sayid al-Khamenei" marja="khamenei">
          <ThemedText style={styles.answerText}>
            {question?.answer_khamenei}
          </ThemedText>
        </Collapsible>
        <Collapsible title="Sayid as-Sistani" marja="sistani">
          <ThemedText style={styles.answerText}>
            {question?.answer_sistani}
          </ThemedText>
        </Collapsible>
      </View>
    </ScrollView>
  );
};

export default RenderQuestion;

const styles = StyleSheet.create({
  scrollViewStyles: {
    flex: 1,
  },
  scrollViewContent: {
    gap: 30,
  },
  questionContainer: {
    padding: 15,
    margin: 10,
    borderRadius: 8,
  },
  answerContainer: {
    flexDirection: "column",
    flex: 3,
    gap: 30,
    marginHorizontal: 10,
    paddingBottom: 20,
    backgroundColor: "transparent",
  },
  questionText: {
    fontSize: 18,
    textAlign: "center",
  },
  answerText: {
    fontSize: 16,
  },
});
