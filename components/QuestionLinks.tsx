import React, { useState } from "react";
import { View, StyleSheet, useWindowDimensions } from "react-native";
import { ThemedView } from "./ThemedView";
import { Link, router } from "expo-router";
import { Pressable } from "react-native";
import { Image } from "expo-image";
import { useColorScheme } from "react-native";
import { coustomTheme } from "../utils/coustomTheme";
import { Text } from "react-native";
import { Colors } from "@/constants/Colors";

export default function QuestionLinks() {
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
    },
    {
      name: "Quran",
      image: require("@/assets/images/quran.png"),
    },
    {
      name: "Historie",
      image: require("@/assets/images/historie.png"),
    },
    { 
      name: "Glaubensfragen",
      image: require("@/assets/images/glaubensfragen.png"),
    },
    {
      name: "Ethik",
      image: require("@/assets/images/ethik.png"),
    },

    {
      name: "Ratschläge",
      image: require("@/assets/images/ratschlaege.png"),
    },
    {
      name: "Frage stellen",
      image: require("@/assets/images/frageStellen.png"),
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
                    pathname: "/(tabs)/(auth)/(userQuestions)",
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
              shadowColor: colorScheme === "light" ? "black" : "white",
              width: elementSize,
              height: elementSize,
            },
            pressedIndex === index && { shadowOpacity: 0 },

            index === 6 && styles.askQuestionElement,
            index === 6 && { width: elementSize * 2.1 },
          ]}
        >
          <Image
            style={styles.elementIcon}
            source={category.image}
            contentFit="contain"
          />
          <View style={styles.elementTextContainer}>
          <Text style={[styles.elementText, { fontSize: fontSize }]}>
            {category.name}
          </Text>
          </View>
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
    backgroundColor: Colors.universal.indexItemBackgroundColor
  },

  askQuestionElement: {},

  elementIcon: {
    width: 150,
    height: "auto",
    aspectRatio: 1.5,
    alignSelf: "center",
    
  },
  elementTextContainer: {
    padding: 1,
    backgroundColor: Colors.universal.white,
    borderRadius: 20,
    borderWidth: 1,

  },

  elementText: {
    fontSize: 20,
    fontWeight: "bold",
    padding: 5,
    textAlign: "center",
    paddingHorizontal: 5,
  },
});
