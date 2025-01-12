// Import required modules and hooks
import { useEffect, useState } from "react";
import { View, Pressable, Text, StyleSheet, FlatList } from "react-native";
import { coustomTheme } from "@/utils/coustomTheme";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Entypo from "@expo/vector-icons/Entypo";
import { useColorScheme } from "react-native";
import { router } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import { getSubcategoriesForCategory } from "../utils/initializeDatabase";

function RenderCategoryItems() {
  const { category } = useLocalSearchParams<{ category: string }>();
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const themeStyle = coustomTheme();
  const colorScheme = useColorScheme();

  useEffect(() => {
    const loadSubcategories = async () => {
      setIsLoading(true);
      try {
        const subcategories = await getSubcategoriesForCategory(category);
        if (subcategories) {
          setSubcategories(subcategories);
        } else {
          setSubcategories([]);
          console.log("No subcategories found");
        }
      } catch (error) {
        console.error("Error loading subcategories:", error);
        setSubcategories([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadSubcategories();
  }, [category]);

  //  Display loading state
  if (isLoading) {
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
        data={subcategories}
        keyExtractor={(item) => item.toString()}
        showsVerticalScrollIndicator={false}
        style={themeStyle.defaultBackgorundColor}
        contentContainerStyle={styles.flatListStyle}
        renderItem={({ item }) => (
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/(tabs)/home/subcategory",
                params: { category: category, subcategory: item },
              })
            }
          >
            <ThemedView style={[styles.item, themeStyle.contrast]}>
              <ThemedText style={styles.tableText}>{item}</ThemedText>
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

export default RenderCategoryItems;
