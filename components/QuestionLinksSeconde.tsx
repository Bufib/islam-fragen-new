import React from "react";
import { StyleSheet, useWindowDimensions } from "react-native";
import { ThemedView } from "./ThemedView";
import { Link } from "expo-router";
import { Pressable } from "react-native";
import { Image } from "expo-image";
import { useColorScheme } from "react-native";
import { coustomTheme } from "./coustomTheme";
import { Text } from "react-native";
import { router } from "expo-router";
import { useState } from "react";

export default function QuestionLinksFirst() {
  const colorScheme = useColorScheme();
  const themeStyles = coustomTheme();
  const { width } = useWindowDimensions();

  // Dynamically calculate the size of each element based on screen width
  const elementSize = width > 400 ? 200 : 160;
  const fontSize = width > 400 ? 20 : 16;

  const [pressedIndex, setPressedIndex] = useState<number | null>(null);

  const categories = [
    {
      name: "Ethik",
      image: require("@/assets/images/ethik.png"),
      backgroundColor: "#8c7ae6",
    },

    {
      name: "Ratschläge",
      image: require("@/assets/images/ratschlaege.png"),
      backgroundColor: "#487eb0",
    },
    {
      name: "Frage stellen",
      image: require("@/assets/images/ratschlaege.png"),
      backgroundColor: "#487eb0",
    },
  ];

  return (
    <ThemedView style={styles.container}>
      {categories.map((category, index) => (
        <Pressable
          key={index}
          onPressIn={() => setPressedIndex(index)}
          onPressOut={() => setPressedIndex(null)}
          onPress={() =>
            router.replace(
              category.name === "Frage stellen"
                ? {
                    pathname: "/(tabs)/renderItems/userQuestions",
                    params: { category: category.name },
                  }
                : {
                    pathname: "/(tabs)/renderItems/category",
                    params: { category: category.name },
                  }
            )
          }
          style={[
            styles.element,
            {
              backgroundColor: category.backgroundColor,
              shadowColor: colorScheme === "light" ? "black" : "white",
              width: elementSize,
              height: elementSize,
            },
            pressedIndex === index && { shadowOpacity: 0 },

            index === 2 && styles.askQuestionElement,
            index === 2 && { width: elementSize * 2.1 },
          ]}
        >
          <Image
            style={styles.elementIcon}
            source={category.image}
            contentFit="contain"
          />
          <Text style={[styles.elementText, { fontSize: fontSize }]}>
            {category.name}
          </Text>
        </Pressable>
      ))}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignContent: "center",
    gap: 20,
  },

  element: {
    flexDirection: "column",
    gap: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    borderWidth: 2,
    shadowOffset: { width: -2.5, height: 4 },
    shadowOpacity: 0.65,
    shadowRadius: 3,
  },

  askQuestionElement: {
    backgroundColor: "#f5f6fa",
  },

  elementIcon: {
    width: 150,
    height: "auto",
    aspectRatio: 1.5,
    alignSelf: "center",
  },

  elementText: {
    fontSize: 20,
    fontWeight: "bold",
    padding: 5,
    textAlign: "center",
    paddingHorizontal: 5,
  },
});
