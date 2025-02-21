import {
  StyleSheet,
  TextInput,
  FlatList,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { SafeAreaView } from "react-native-safe-area-context";
import { useColorScheme, Pressable } from "react-native";
import { coustomTheme } from "../utils/coustomTheme";
import Feather from "@expo/vector-icons/Feather";
import { searchQuestions } from "../utils/initializeDatabase";
import { router } from "expo-router";
import { Keyboard } from "react-native";
import { Link } from "expo-router";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Colors } from "@/constants/Colors";

type SearchResults = {
  id: number;
  category_name: string;
  subcategory_name: string;
  question: string;
  title: string;
};

const DEBOUNCE_DELAY = 300; // milliseconds

const RenderSearch = () => {
  const colorScheme = useColorScheme();
  const themeStyles = coustomTheme();
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResults[]>([]);
  const [loading, setLoading] = useState(false);

  // Debounced search function
  const debouncedSearch = useCallback(
    async (text: string) => {
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
    },
    [] // Empty dependency array since we don't use any external values
  );

  // Effect to handle debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      debouncedSearch(searchText);
    }, DEBOUNCE_DELAY);

    // Cleanup timeout on each searchText change
    return () => clearTimeout(timeoutId);
  }, [searchText, debouncedSearch]);

  // Update search text without immediate search
  const handleSearchTextChange = (text: string) => {
    setSearchText(text);
    if (text.trim() === "") {
      setSearchResults([]);
    }
  };

  const renderItem = ({ item }: { item: SearchResults }) => (
    <Pressable
      style={[styles.resultItem, themeStyles.contrast]}
      onPress={() =>
        router.push({
          pathname: "/(question)",
          params: {
            questionId: item.id.toString(),
            category: item.category_name,
            subcategory: item.subcategory_name,
            questionTitle: item.title,
          },
        })
      }
    >
      <ThemedText style={styles.resultCategorySubcategoryLink}>
        {item.category_name}
        {" > "}
        {item.subcategory_name}
      </ThemedText>
      <ThemedText style={styles.resultQuestionTitle}>{item.title}</ThemedText>
      <ThemedText style={styles.resultQuestionQuestion} numberOfLines={1}>
        {item.question}
      </ThemedText>
    </Pressable>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
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
              style={[styles.searchBarInput, themeStyles.text]}
              onChangeText={handleSearchTextChange}
              value={searchText}
              placeholder="Suche nach einer Frage die dich interessiert"
              keyboardType="default"
            />
            {searchText && (
              <Feather
                name="x-circle"
                size={18}
                color={colorScheme === "dark" ? "#fff" : "#000"}
                onPress={() => handleSearchTextChange("")}
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
              keyboardDismissMode="on-drag"
              keyboardShouldPersistTaps="handled"
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
    </KeyboardAvoidingView>
  );
};

export default RenderSearch;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 10,
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
  resultCategorySubcategoryLink: {
    fontSize: 14,
    color: Colors.universal.link,
  },
  resultQuestionTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  resultQuestionQuestion: {
    fontSize: 14,
    fontWeight: "400",
  },
  noResultsText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "gray",
  },
});
