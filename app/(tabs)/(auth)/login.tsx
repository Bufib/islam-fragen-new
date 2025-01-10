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
import { loginError, loginSuccess } from "@/constants/messages";
import { Colors } from "@/constants/Colors";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { router } from "expo-router";

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

      if (error) {
        Alert.alert(loginError, error.message);
        return false;
      }

      // session for the user
      if (data.session) {
        await setSession(data.session, stayLoggedIn);

        // Clear form after successful login
        reset();

        // Show login success toast
        loginSuccess();
        router.push("/(tabs)/home");
      }
    } catch (error: any) {
      Alert.alert(
        loginError,
        error.message || "Es gab einen Fehler beim login."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: LoginFormValues) => {
    await loginWithSupabase(data.email, data.password);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, themeStyles.defaultBackgorundColor]}
    >
      <ScrollView
        style={[styles.scrollViewContainer]}
        contentContainerStyle={styles.scrollViewContent}
      >
          <View style={[styles.contentContainer, themeStyles.contrast]}>
            <ThemedText style={styles.title} type="title">
              Login
            </ThemedText>

            <Controller
              control={control}
              name="email"
              rules={{ required: "Bitte gebe deine E-mail-Adresse ein!" }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={[styles.input, themeStyles.text]}
                  placeholder="E-mail"
                  onChangeText={onChange}
                  value={value}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              )}
            />
            {errors.email && (
              <Text style={styles.error}>{errors.email.message}</Text>
            )}

            <Controller
              control={control}
              name="password"
              rules={{ required: "Bitte gebe dein Passwort ein!" }}
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
              <ThemedText style={styles.stayLoggedInText}>
                Eingeloggt bleiben
              </ThemedText>
            </View>

            <Button title="Einloggen" onPress={handleSubmit(onSubmit)} />
            <Button
              title="Ich möchte mich gerne Registrieren"
              onPress={() => router.push("/(tabs)/(auth)/signup")}
            />
          </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContainer: {
    flex: 1,
    padding: 20,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
  },

  contentContainer: {
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 50,
    borderRadius: 20,
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
    color: Colors.universal.error,
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
