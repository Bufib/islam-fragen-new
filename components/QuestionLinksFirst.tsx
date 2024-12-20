import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { ThemedView } from "./ThemedView";
import { Link } from "expo-router";
import { Pressable } from "react-native";
import { Image } from "expo-image";
import { useColorScheme } from "react-native";
import { coustomTheme } from "./coustomTheme";
import { Text } from "react-native";

export default function QuestionLinksFirst() {
  const colorScheme = useColorScheme();
  const themeStyles = coustomTheme();
  const [pressedIndex, setPressedIndex] = useState<number | null>(null);

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
        <Link
          key={index}
          href={
            {
              pathname: "",
              params: {
                category: category.name,
              },
            } as any
          }
          //asChild
        >
          <Pressable
            onPressIn={() => setPressedIndex(index)}
            onPressOut={() => setPressedIndex(null)}
            style={[
              styles.element,
              {
                backgroundColor: category.backgroundColor,
                shadowColor: colorScheme === "light" ? "black" : "white",
              },
              pressedIndex === index && { shadowOpacity: 0 },
            ]}
          >
            <Image
              style={styles.elementIcon}
              source={category.image}
              contentFit="contain"
            />
            <Text style={styles.elementText}>{category.name}</Text>
          </Pressable>
        </Link>
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
    width: "70%",
    height: "auto",
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
