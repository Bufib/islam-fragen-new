import React, { useEffect } from "react";
import {
  View,
  TextInput,
  Button,
  Switch,
  Alert,
  StyleSheet,
  Text,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { supabase } from "@/utils/supabase";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useAuthStore } from "@/components/authStore";
import { coustomTheme } from "@/utils/coustomTheme";

type LoginFormValues = {
  email: string;
  password: string;
};

export default function LoginScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormValues>();

  const { setSession, restoreSession } = useAuthStore();
  const [stayLoggedIn, setStayLoggedIn] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const themeStyles = coustomTheme();

  const loginWithSupabase = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.session) {
        await setSession(data.session, stayLoggedIn);

        // Clear form after successful login
        reset();

        const isAdmin = data.session.user.app_metadata.role === "admin";
        Alert.alert("Success", `Welcome back${isAdmin ? " admin" : ""}!`);
      }
    } catch (error: any) {
      Alert.alert(
        "Login Error",
        error.message || "An error occurred during login"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: LoginFormValues) => {
    await loginWithSupabase(data.email, data.password);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title} type="title">
        Login
      </ThemedText>

      <Controller
        control={control}
        name="email"
        rules={{ required: "Email is required" }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={[styles.input, themeStyles.text]}
            placeholder="Email"
            onChangeText={onChange}
            value={value}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        )}
      />
      {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

      <Controller
        control={control}
        name="password"
        rules={{ required: "Password is required" }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={[styles.input, themeStyles.text]}
            placeholder="Password"
            onChangeText={onChange}
            value={value}
            secureTextEntry
          />
        )}
      />
      {errors.password && (
        <Text style={styles.error}>{errors.password.message}</Text>
      )}

      <View style={styles.stayLoggedInContainer}>
        <Switch value={stayLoggedIn} onValueChange={setStayLoggedIn} />
        <ThemedText style={styles.stayLoggedInText}>Stay Logged In</ThemedText>
      </View>

      <Button title="Log In" onPress={handleSubmit(onSubmit)} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    padding: 12,
    marginBottom: 16,
    borderRadius: 8,
  },
  error: {
    color: "red",
    marginBottom: 12,
  },
  stayLoggedInContainer: {
    marginTop: 10,
    flexDirection: "row",
    alignSelf: "center",
    marginBottom: 16,
  },
  stayLoggedInText: {
    marginLeft: 8,
    fontSize: 16,
  },
});
