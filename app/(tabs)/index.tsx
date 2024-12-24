import * as React from "react";
import { View, useWindowDimensions, Text, StyleSheet } from "react-native";
import {
  TabView,
  TabBar,
} from "react-native-tab-view";
import { ThemedText } from "@/components/ThemedText";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import QuestionLinksFirst from "@/components/QuestionLinksFirst";
import QuestionLinksSeconde from "@/components/QuestionLinksSeconde";
import { useState } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function index() {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const colorScheme = useColorScheme() ?? "light";

  // Custom renderScene function
  const renderScene = ({ route }: any) => {
    switch (route.key) {
      case "first":
        return <QuestionLinksFirst />;
      case "second":
        return <QuestionLinksSeconde />;
      default:
        return null;
    }
  };

  const routes = [
    { key: "first", title: "" },
    { key: "second", title: "" },
  ];

  // Coustome settings for top bar
  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      indicatorStyle={{
        backgroundColor: Colors[colorScheme].indicatorStyleTopBar, // Tap bar swipe-line
      }}
      style={{ backgroundColor: Colors[colorScheme].backgroundColorTopBar }} // Tab bar background color
    />
  );

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <ThemedView style={styles.headerContainer}>
        <ThemedText>Header</ThemedText>
      </ThemedView>
      <ThemedView style={styles.swipeContainer}>
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
          renderTabBar={renderTabBar} // Coustome style
          style={styles.swipeList}
        />
      </ThemedView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flex: 1,
  },

  swipeContainer: {
    flex: 4,
  },
  swipeList: {
    flex: 1,
    
  },
  renderScene: {
    flex: 1,
  },
});
