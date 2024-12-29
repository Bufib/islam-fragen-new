import { View, Text, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { Stack } from "expo-router";
import RenderQuestion from "@/components/RenderQuestion";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import {
  isQuestionInFavorite,
  addQuestionToFavorite,
  removeQuestionFromFavorite,
} from "@/components/initializeDatabase";
import Ionicons from "@expo/vector-icons/Ionicons";
import Toast from "react-native-toast-message";
import { removeFavoriteToast, addFavoriteToast } from "@/constants/messages";
import { useRefreshFavorites } from "@/hooks/useRefreshFavoritesStore";

export default function categories() {
  const { category, subcategory, questionId, questionTitle } =
    useLocalSearchParams<{
      category: string;
      subcategory: string;
      questionId: string;
      questionTitle: string;
    }>();
  const [isFavorite, setIsFavorite] = useState(false);
  const { triggerRefreshFavorites } = useRefreshFavorites();

  // Check if question is favorite
  useEffect(() => {
    const checkIfFavorite = async () => {
      try {
        // Ensure `questionId` is a valid number before processing
        const id = parseInt(questionId, 10);
        if (!isNaN(id)) {
          const result = await isQuestionInFavorite(id);
          console.log(result);
          setIsFavorite(result);
        } else {
          console.error("Invalid questionId:", questionId);
        }
      } catch (error) {
        console.error("Error checking favorite status:", error);
      }
    };

    checkIfFavorite();
  }, [questionId]);

  const handleAddFavorite = async () => {
    try {
      const id = parseInt(questionId, 10);
      if (!isNaN(id)) {
        await addQuestionToFavorite(id);
        setIsFavorite(true);
        addFavoriteToast();
        triggerRefreshFavorites();
      }
    } catch (error) {
      console.error("Error adding question to favorites:", error);
    }
  };

  const handleRemoveFavorite = async () => {
    try {
      const id = parseInt(questionId, 10);
      if (!isNaN(id)) {
        await removeQuestionFromFavorite(id);
        setIsFavorite(false);
        removeFavoriteToast();
        triggerRefreshFavorites();
      }
    } catch (error) {
      console.error("Error removing question from favorites:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: questionTitle,
          headerRight: () =>
            isFavorite ? (
              <Ionicons
                name="star"
                size={28}
                color={Colors.universal.favoriteIcon}
                onPress={() => handleRemoveFavorite()}
              />
            ) : (
              <Ionicons
                name="star-outline"
                size={28}
                color={Colors.universal.favoriteIcon}
                onPress={() => handleAddFavorite()}
              />
            ),
        }}
      />
      <RenderQuestion
        category={category}
        subcategory={subcategory}
        questionId={parseInt(questionId, 10)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
