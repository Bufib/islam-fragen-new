import React, { useEffect, useRef } from "react";
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
import { useAuthStore } from "@/stores/authStore";
import { coustomTheme } from "@/utils/coustomTheme";
import Feather from "@expo/vector-icons/Feather";
import { Pressable } from "react-native";
import {
  loginError,
  loginSuccess,
  loginEmailNotEmpty,
  loginPasswordNotEmpty,
} from "@/constants/messages";
import { Colors } from "@/constants/Colors";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { router } from "expo-router";
import ConfirmHcaptcha from "@hcaptcha/react-native-hcaptcha";
import { useState } from "react";
import { useColorScheme } from "react-native";
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
    getValues,
  } = useForm<LoginFormValues>();

  const { setSession } = useAuthStore();
  const [stayLoggedIn, setStayLoggedIn] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [showCaptcha, setShowCaptcha] = React.useState(false);
  const captchaRef = useRef(null);
  const themeStyles = coustomTheme();
  const [showPassword, setShowPassword] = useState(false);
  const colorScheme = useColorScheme();

  const loginWithSupabase = async (
    email: string,
    password: string,
    captchaToken: string
  ) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: { captchaToken },
      });

      if (error) {
        // Überprüfe die genaue Fehlermeldung
        if (error.message.includes("Invalid login credentials")) {
          Alert.alert(
            "Login fehlgeschlagen",
            "E-Mail oder Passwort ist falsch."
          );
        } else if (error.message.includes("User not found")) {
          Alert.alert("Login fehlgeschlagen", "Benutzer existiert nicht.");
        } else {
          Alert.alert("Login fehlgeschlagen", error.message);
        }
        return false;
      }

      if (data.session) {
        await setSession(data.session, stayLoggedIn);
        reset();
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
      setShowCaptcha(false);
    }
  };

  const onMessage = async (event: any) => {
    if (event && event.nativeEvent.data) {
      const token = event.nativeEvent.data;

      if (["error", "expired"].includes(token)) {
        if (!showCaptcha) {
          //Skip so message doesn't appear spontanousley while app is opened and captcha expires
          console.log("Captcha not active.");
          return;
        }
        setShowCaptcha(false);
        Alert.alert(
          "Fehler",
          "Captcha-Überprüfung fehlgeschlagen. Bitte versuche es erneut."
        );
      } else if (token === "cancel") {
        setShowCaptcha(false);
        Alert.alert(
          "Fehler",
          "Bitte nicht wegklicken, da die Überprüfung sonst abgebrochen wird!"
        );
      } else if (token === "open") {
        // Captcha opened
      } else {
        const { email, password } = getValues();
        await loginWithSupabase(email, password, token);
      }
    }
  };

  const onSubmit = async () => {
    const { email, password } = getValues();

    if (!email || !password) {
      Alert.alert("Fehler", "Bitte fülle alle Felder aus.");
      return;
    }

    setShowCaptcha(true);
  };

  useEffect(() => {
    if (showCaptcha && captchaRef.current) {
      try {
        captchaRef.current?.show();
      } catch (error) {
        console.error("Captcha konnte nicht geöffnet werden:", error);
        setShowCaptcha(false);
      }
    }
  }, [showCaptcha]);

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
            rules={{ required: loginEmailNotEmpty }}
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
            rules={{ required: loginPasswordNotEmpty }}
            render={({ field: { onChange, value } }) => (
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[styles.passwordInput, themeStyles.text]}
                  placeholder="Password"
                  onChangeText={onChange}
                  value={value}
                  secureTextEntry={!showPassword}
                />
                <Pressable
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  <Text>
                    {showPassword ? (
                      <Feather
                        name="eye"
                        size={24}
                        color={colorScheme === "dark" ? "white" : "black"}
                      />
                    ) : (
                      <Feather
                        name="eye-off"
                        size={24}
                        color={colorScheme === "dark" ? "white" : "black"}
                      />
                    )}
                  </Text>
                </Pressable>
              </View>
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

          <Button
            title="Einloggen"
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}
          />
           <Button
            title="Passwort vergessen"
            onPress={() => router.replace("/forgotPassword")}
          />
          <Button
            title="Ich möchte mich gerne Registrieren"
            onPress={() => router.replace("/signup")}
          />
           
        </View>
      </ScrollView>

      {showCaptcha && (
        <ConfirmHcaptcha
          ref={captchaRef}
          siteKey="c2a47a96-0c8e-48b8-a6c6-e60a2e9e4228"
          baseUrl="https://hcaptcha.com"
          onMessage={onMessage}
          languageCode="de"
          size="invisible"
        />
      )}
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
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
  },
  passwordInput: {
    flex: 1,
    padding: 12,
  },
  eyeIcon: {
    padding: 10,
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
