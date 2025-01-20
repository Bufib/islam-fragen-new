import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import { supabase } from "@/utils/supabase";
import { router } from "expo-router";
import { ActivityIndicator } from "react-native";

export default function VerifyTokenScreen() {
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: "email",
      });

      if (error) {
        Alert.alert("Verification Failed", error.message);
        return;
      }

      Alert.alert("Success", "Your email has been verified!");
      router.push("/(tabs)/home"); // Navigate to the main page
    } catch (error) {
      Alert.alert("Error", error.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify Your Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your token"
        value={token}
        onChangeText={setToken}
      />
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <Button title="Verify" onPress={handleVerify} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    padding: 12,
    marginBottom: 16,
    borderRadius: 8,
  },
});
