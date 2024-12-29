import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { SafeAreaView } from "react-native-safe-area-context";
import { useColorScheme, Pressable } from "react-native";
import { coustomTheme } from "./coustomTheme";
import Feather from "@expo/vector-icons/Feather";
import { searchQuestions } from "./initializeDatabase";
import { router } from "expo-router";

type SearchResults = {
  id: number;
  category_name: string;
  subcategory_name: string;
  question: string;
  title: string;
};

const RenderSearch = () => {
  const colorScheme = useColorScheme();
  const themeStyles = coustomTheme();
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResults[]>([]);
  const [loading, setLoading] = useState(false);

  // Function to handle search
  const handleSearch = async (text: string) => {
    setSearchText(text);
    if (text.trim() === "") {
      setSearchResults([]);
      return;
    }
    setLoading(true);
    try {
      const results = await searchQuestions(text);
      setSearchResults(results);
    } catch (error) {
      console.error("Error during search:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: SearchResults }) => (
    <Pressable
      style={[styles.resultItem, themeStyles.contrast]}
      onPress={() =>
        router.push({
          pathname: "/(tabs)/renderItems/question",
          params: {
            questionId: item.id.toString(),
            category: item.category_name,
            subcategory: item.subcategory_name,
            questionTitle: item.title,
          },
        })
      }
    >
      <ThemedText
        style={[styles.resultCategory, themeStyles.searchResultCategory]}
      >
        {item.category_name} {">"} {item.subcategory_name}
      </ThemedText>
      <ThemedText style={styles.resultQuestion}>{item.title}</ThemedText>
    </Pressable>
  );

  return (
    <SafeAreaView
      style={[styles.container, themeStyles.defaultBackgorundColor]}
      edges={["top"]}
    >
      <ThemedView style={styles.headerContainer}>
        <ThemedText style={styles.headerText} type="title">
          Suche
        </ThemedText>
        <ThemedView style={[styles.searchBarContainer, themeStyles.contrast]}>
          <TextInput
            style={[styles.searchBarInput, themeStyles.searchBarText]}
            onChangeText={handleSearch}
            value={searchText}
            placeholder="Suche nach einer Frage die dich interessiert"
            keyboardType="default"
          />
          {searchText && (
            <Feather
              name="x-circle"
              size={18}
              color={colorScheme === "light" ? "black" : "white"}
              onPress={() => handleSearch("")}
              style={styles.xButton}
            />
          )}
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.contentContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="gray" />
        ) : (
          <FlatList
            data={searchResults}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              searchText.trim() && !loading ? (
                <ThemedText style={styles.noResultsText}>
                  Keine Ergebnisse gefunden.
                </ThemedText>
              ) : null
            }
          />
        )}
      </ThemedView>
    </SafeAreaView>
  );
};

export default RenderSearch;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 15,
  },
  headerContainer: {
    flexDirection: "column",
    marginBottom: 10,
  },
  headerText: {
    margin: 15,
  },
  searchBarContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 10,
    borderWidth: 1,
    borderRadius: 10,
    height: 40,
    paddingHorizontal: 10,
  },
  searchBarInput: {
    flex: 1,
  },
  xButton: {
    paddingLeft: 10,
  },
  contentContainer: {
    flex: 1,
    marginHorizontal: 10,
  },
  resultItem: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    gap: 5,
  },
  resultCategory: {
    fontSize: 14,
    color: "#555",
  },
  resultQuestion: {
    fontSize: 16,
    fontWeight: "600",
  },
  noResultsText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "gray",
  },
});
