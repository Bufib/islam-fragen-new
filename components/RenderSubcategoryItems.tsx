// Import required modules and hooks
import { useEffect, useState } from "react";
import { View, Pressable, Text, StyleSheet, FlatList } from "react-native";
import {
  useQADatabase,
  QuestionAnswerPerMarjaType,
  AllTableNamesType,
} from "@/hooks/useDatabase";
import { SafeAreaView } from "react-native-safe-area-context";
import { coustomTheme } from "@/components/coustomTheme";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Entypo from "@expo/vector-icons/Entypo";
import { useColorScheme } from "react-native";
import editTitle from "./editTitle";
import { useLocalSearchParams } from "expo-router";

type RenderSubcategoryItemsProps = {
  category: string;
  subcategory: string;
};

function RenderSubcategoryItems({}: RenderSubcategoryItemsProps) {
  const { getQuestionsForTable, loading } = useQADatabase();
  const [questions, setQuestions] = useState<QuestionAnswerPerMarjaType[]>([]);
  const themeStyle = coustomTheme();
  const colorScheme = useColorScheme();
  const { category, subcategory } = useLocalSearchParams<{
    category: string;
    subcategory: string;
  }>();

  useEffect(() => {
    const handleSubcategorySelected = async () => {
      try {
        const data = await getQuestionsForTable(subcategory, category);
        console.log(data);
        if (data) {
          setQuestions(data as QuestionAnswerPerMarjaType[]);
        } else {
          setQuestions([]);
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    handleSubcategorySelected();
  }, [category, subcategory, getQuestionsForTable]);

  // Display loading state
  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <Text>Loading data...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, themeStyle.defaultBackgorundColor]}>
      <FlatList
        data={questions}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        style={themeStyle.defaultBackgorundColor}
        contentContainerStyle={styles.flatListStyle}
        renderItem={({ item }) => (
          <Pressable>
            <ThemedView
              style={[styles.item, themeStyle.renderItemsBackgroundcolor]}
            >
              <ThemedText style={styles.tableText}>{item.title}</ThemedText>
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

// Styles
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
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    marginBottom: 15,
  },
  tableText: {
    fontSize: 18,
    textAlign: "left",
    fontWeight: 500,
  },
});

export default RenderSubcategoryItems;
