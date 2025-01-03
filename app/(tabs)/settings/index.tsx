import React, { useEffect, useLayoutEffect, useState } from "react";
import { StyleSheet, Text, View, Switch, Appearance } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useColorScheme } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { coustomTheme } from "@/components/coustomTheme";
import Storage from "expo-sqlite/kv-store";
import { Colors } from "@/constants/Colors";
import { router } from "expo-router";
import { Linking } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import { useAuthStore } from "@/components/authStore";
import handleLogout from "@/components/handleLogout";

const Settings = () => {
  const colorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(colorScheme === "dark");
  const themeStyles = coustomTheme();
  const { isLoggedIn, restoreSession, clearSession } = useAuthStore();

  useEffect(() => {
    const savedColorSetting = Storage.getItemSync("isDarkMode");
    Appearance.setColorScheme(savedColorSetting === "true" ? "dark" : "light");
  }, [isDarkMode]);

  // Function to handle colorswitch
  const toggleDarkMode = async () => {
    Appearance.setColorScheme(isDarkMode ? "light" : "dark");
    setIsDarkMode((prev) => !prev);
    // isDarkMode changes after re-rendering (state) so I have to set it !isDarkMode
    Storage.setItemSync("isDarkMode", `${!isDarkMode}`);
  };

  
  return (
    <SafeAreaView
      style={[styles.container, themeStyles.defaultBackgorundColor]}
      edges={["top"]}
    >
      <ThemedView style={styles.headerContainer}>
        <ThemedText style={styles.headerText} type="title">
          Einstellungen
        </ThemedText>

        {isLoggedIn ? (
          <Entypo
            name="log-out"
            size={24}
            color={colorScheme === "dark" ? "white" : "black"}
            onPress={handleLogout}

          />
        ) : (
          <Entypo
            name="login"
            size={24}
            color={colorScheme === "dark" ? "white" : "black"}
            onPress={() => router.push("/(tabs)/renderItems/login")}
          />
        )}
      </ThemedView>

      <ThemedView style={styles.contentContainer}>
        <View style={styles.row}>
          <ThemedText style={styles.label}>Dunkelmodus</ThemedText>
          <Switch
            value={isDarkMode}
            onValueChange={toggleDarkMode}
            trackColor={{
              false: Colors.light.trackColor,
              true: Colors.dark.trackColor,
            }}
            thumbColor={
              isDarkMode ? Colors.light.thumbColor : Colors.dark.thumbColor
            }
          />
        </View>

        {/* Push everything down */}
        <View style={{ flexGrow: 1 }} />

        {/* Legal Links */}
        <ThemedView style={styles.legalLinksContainer}>
          <ThemedText
            style={styles.linkText}
            onPress={() =>
              Linking.openURL(
                "https://bufib.github.io/Islam-Fragen-App-rechtliches/datenschutz"
              )
            }
          >
            Datenschutz
          </ThemedText>
          <ThemedText
            style={styles.linkText}
            onPress={() => router.push("/settings/about")}
          >
            Über die App
          </ThemedText>
          <ThemedText
            style={styles.linkText}
            onPress={() => router.push("/settings/impressum")}
          >
            Impressum
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </SafeAreaView>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  headerContainer: {
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerText: {},
  contentContainer: {
    flex: 1,
    marginTop: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.universal.borderBottomToggleSettings,
  },
  label: {
    fontSize: 18,
  },
  legalLinksContainer: {
    marginTop: 40,
    alignItems: "center",
  },
  linkText: {
    color: Colors.universal.link,
    fontSize: 18,
    marginBottom: 10,
  },
});
