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
import { router } from "expo-router";
import  editTitle  from "./editTitle";
import { useLocalSearchParams } from "expo-router";




function RenderCategoryItems() {
  const { getTablesByCategory, getQuestionsForTable, loading } =
    useQADatabase();
  const { category } = useLocalSearchParams<{ category: string }>();
  const [items, setItems] = useState<AllTableNamesType[]>([]);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [questions, setQuestions] = useState<QuestionAnswerPerMarjaType[]>([]);
  const themeStyle = coustomTheme();
  const colorScheme = useColorScheme();

  // Fetch tables for "Rechtsfragen" category
  useEffect(() => {
    const loadTables = async () => {
      const tableData = await getTablesByCategory(category);
      if (tableData) {
        setItems(tableData);
        console.log(tableData)
      }
    };
    loadTables();
  }, [getTablesByCategory]);

 

  // Display loading state
  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <Text>Loading data...</Text>
      </View>
    );
  }

  // Main render
  return (
    <View style={[styles.container, themeStyle.defaultBackgorundColor]}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        style={themeStyle.defaultBackgorundColor}
        contentContainerStyle={styles.flatListStyle}
        renderItem={({ item }) => (
          <Pressable onPress={() => router.push({ pathname: "/(tabs)/renderItems/subcategories", params: { category: category, subcategory: item.tableName } })}>
            <ThemedView
              style={[styles.item, themeStyle.renderItemsBackgroundcolor]}
            >
              <ThemedText style={styles.tableText}>{editTitle(item.tableName)}</ThemedText>
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
    fontWeight: 500
  },
});

export default RenderCategoryItems;
