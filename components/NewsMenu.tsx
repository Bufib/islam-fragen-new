import React from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import Entypo from "@expo/vector-icons/Entypo";
import { useColorScheme } from "react-native";
import { Colors } from "@/constants/Colors";
import { coustomTheme } from "./coustomTheme";

export default function NewsMenu({ id }: { id: number }) {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const themeStyles = coustomTheme();

  return (
    <View style={styles.container}>
      <Menu>
        {/* Trigger the menu */}
        <MenuTrigger>
          <Entypo
            name="dots-three-horizontal"
            size={24}
            color={isDarkMode ? "white" : "black"}
            style={styles.triggerIcon}
          />
        </MenuTrigger>

        {/* Menu options */}
        <MenuOptions
          customStyles={{
            optionsContainer: [styles.optionsContainer, themeStyles.contrast],
            optionWrapper: styles.optionWrapper,
            optionText: styles.optionText,
          }}
        >
          <MenuOption onSelect={() => Alert.alert("Fixieren")}>
            <Text style={[themeStyles.newsMenuFixieren, styles.optionText]}>
              Fixieren
            </Text>
          </MenuOption>
          <MenuOption onSelect={() => Alert.alert("Bearbeiten")}>
            <Text style={[themeStyles.newsMenuBearbeiten, styles.optionText]}>
              Bearbeiten
            </Text>
          </MenuOption>
          <MenuOption onSelect={() => Alert.alert("Löschen")} disabled>
            <Text style={[themeStyles.newsMenuLoeschen, styles.optionText]}>
              Löschen
            </Text>
          </MenuOption>
        </MenuOptions>
      </Menu>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  triggerIcon: {
    padding: 10,
  },
  optionsContainer: {
    borderRadius: 10,
    paddingVertical: 5,
    elevation: 4, // For Android shadow
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4, // For iOS shadow
  },
  optionWrapper: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  optionText: {
    fontSize: 18,
  },
});
