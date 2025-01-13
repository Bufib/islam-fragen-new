import { StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { noInternetBody, noInternetHeader } from "@/constants/messages";
import { Colors } from "@/constants/Colors";
import NetInfo from "@react-native-community/netinfo";

export default function NoInternet() {
  const [isConnected, setIsConnected] = useState<boolean | null>(true);

  // Check internet connectivity
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  // Conditional rendering based on connectivity
  if (isConnected) {
    return null; // If connected, render nothing
  }

  return (
    <ThemedView style={styles.noInternet}>
      <ThemedText style={styles.noInternetText}>
        {noInternetHeader}
        {"\n"}
        {noInternetBody}
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  noInternet: {
    padding: 15,
  },
  noInternetText: {
    textAlign: "center",
    color: Colors.universal.error,
    fontSize: 16,
    fontWeight: "700",
  },
});
