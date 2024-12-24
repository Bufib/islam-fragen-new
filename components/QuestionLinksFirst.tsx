import React, { useState } from "react";
import { StyleSheet, useWindowDimensions } from "react-native";
import { ThemedView } from "./ThemedView";
import { Link, router } from "expo-router";
import { Pressable } from "react-native";
import { Image } from "expo-image";
import { useColorScheme } from "react-native";
import { coustomTheme } from "./coustomTheme";
import { Text } from "react-native";

export default function QuestionLinksFirst() {
  const colorScheme = useColorScheme();
  const themeStyles = coustomTheme();
  const [pressedIndex, setPressedIndex] = useState<number | null>(null);
  const { width } = useWindowDimensions();

  // Dynamically calculate the size of each element based on screen width
  const elementSize = width > 400 ? 200 : 160;
  const fontSize = width > 400 ? 20 : 16;

  const categories = [
    {
      name: "Rechtsfragen",
      image: require("@/assets/images/rechtsfragen.png"),
      backgroundColor: "#00a8ff",
    },
    {
      name: "Quran",
      image: require("@/assets/images/quran.png"),
      backgroundColor: "#4cd137",
    },
    {
      name: "Historie",
      image: require("@/assets/images/historie.png"),
      backgroundColor: "#e84118",
    },
    {
      name: "Glaubensfragen",
      image: require("@/assets/images/glaubensfragen.png"),
      backgroundColor: "#fbc531",
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
            router.push({
              pathname: "/(tabs)/renderItems/categories",
              params: { category: category.name },
            })
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

  elementIcon: {
    width: "80%",
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
