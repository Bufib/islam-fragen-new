import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Switch,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Pressable,
  useColorScheme,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import NetInfo from "@react-native-community/netinfo";
import Feather from "@expo/vector-icons/Feather";
import ConfirmHcaptcha from "@hcaptcha/react-native-hcaptcha";
import { supabase } from "@/utils/supabase";
import { useAuthStore } from "@/stores/authStore";
import { ThemedText } from "@/components/ThemedText";
import { coustomTheme } from "@/utils/coustomTheme";
import { router } from "expo-router";
import Toast from "react-native-toast-message";
import {
 
  loginEmailNotEmpty,
  loginPasswordNotEmpty,
} from "@/constants/messages";
import { Colors } from "@/constants/Colors";

// ---- START: TYPES & SCHEMA ----

/** 1. The shape of our form data. */
const loginSchema = z.object({
  email: z
    .string()
    .nonempty("Bitte eine E-Mail angeben.")
    .email("Bitte eine gültige E-Mail angeben."),
  password: z
    .string()
    .nonempty("Bitte ein Passwort angeben."),
});

/** 1.1 Derive the TypeScript type from the schema. */
type LoginFormValues = z.infer<typeof loginSchema>;

/** 1.2 Typed event for hCaptcha messages. */
type CaptchaEvent = {
  nativeEvent: {
    data: string;
  };
};

// ---- END: TYPES & SCHEMA ----

export default function LoginScreen() {
  const themeStyles = coustomTheme();
  const colorScheme = useColorScheme();

  // React Hook Form
  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  // Local States
  const [isLoading, setIsLoading] = useState(false);
  const [stayLoggedIn, setStayLoggedIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showCaptcha, setShowCaptcha] = useState(false);

  // hCaptcha Ref
  const captchaRef = useRef<ConfirmHcaptcha | null>(null);

  // Access auth store
  const { setSession } = useAuthStore();

  useEffect(() => {
    // If user requested captcha, show it as soon as it's available
    if (showCaptcha && captchaRef.current) {
      captchaRef.current.show();
    }
  }, [showCaptcha]);

  /**
   * 2. Called when the user has typed email + password,
   *    and we want to do a captcha challenge before logging in.
   */
  const onSubmit = async (formData: LoginFormValues) => {
    // 2.1 Check for network connection
    const netInfo = await NetInfo.fetch();
    if (!netInfo.isConnected) {
      Alert.alert("Keine Internetverbindung", "Bitte überprüfe dein Internet.");
      return;
    }

    // 2.2 If connected, show captcha
    setShowCaptcha(true);
  };

  /**
   * 3. If captcha is successful, we call `loginWithSupabase`
   */
  const onCaptchaMessage = async (event: CaptchaEvent) => {
    // If Captcha is not actually open, ignore any stray message
    if (!showCaptcha) return;

    const token = event.nativeEvent.data;
    switch (token) {
      case "error":
      case "expired":
        setShowCaptcha(false);
        Alert.alert(
          "Fehler",
          "Captcha-Überprüfung fehlgeschlagen. Bitte versuche es erneut."
        );
        return;

      case "cancel":
        setShowCaptcha(false);
        Alert.alert(
          "Fehler",
          "Bitte nicht wegklicken, die Überprüfung wird sonst abgebrochen!"
        );
        return;

      case "open":
        // Just the captcha opening. Do nothing
        return;

      default:
        // We got a real token
        const { email, password } = getValues();
        await loginWithSupabase(email, password, token);
    }
  };

  /**
   * 4. The actual login function that calls Supabase,
   *    using the captcha token from step #3.
   */
  
  async function loginWithSupabase(
    email: string,
    password: string,
    captchaToken: string
  ) {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: { captchaToken },
      });

      if (error) {
        // specific errors
        if (error.message.includes("Invalid login credentials")) {
          Alert.alert("Login fehlgeschlagen", "E-Mail oder Passwort ist falsch.");
        } else if (error.message.includes("User not found")) {
          Alert.alert("Login fehlgeschlagen", "Benutzer existiert nicht.");
        } else if (error.message.includes("Email not confirmed")) {
          Alert.alert("Login fehlgeschlagen", "E-Mail ist noch nicht bestätigt.");
        } else {
          Alert.alert("Login fehlgeschlagen", error.message);
        }
        return;
      }

      if (data?.session) {
        // Store session in your auth store
        await setSession(data.session, stayLoggedIn);

        // Clear form
        reset();

        // Show success
        Toast.show({
            type: "success",
            text1: "Salam alaikum!",
            text1Style: { fontSize: 16, fontWeight: "600" },
            topOffset: 60,
          });

        // Navigate to home
        router.replace("/(tabs)/home");
      }
    } catch (error: any) {
      Alert.alert(error, error.message || "Es gab einen Fehler beim Login.");
    } finally {
      setShowCaptcha(false);
      setIsLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, themeStyles.defaultBackgorundColor]}
    >
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={[styles.contentContainer, themeStyles.contrast]}>
          <ThemedText style={styles.title} type="title">
            Login
          </ThemedText>

          {/* EMAIL FIELD */}
          <Controller
            control={control}
            rules={{ required: loginEmailNotEmpty }}
            name="email"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={[styles.input, themeStyles.text]}
                placeholder="E-mail"
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.email && (
            <Text style={styles.error}>{errors.email.message}</Text>
          )}

          {/* PASSWORD FIELD */}
          <Controller
            control={control}
            rules={{ required: loginPasswordNotEmpty }}
            name="password"
            render={({ field: { onChange, value } }) => (
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[styles.passwordInput, themeStyles.text]}
                  placeholder="Passwort"
                  secureTextEntry={!showPassword}
                  onChangeText={onChange}
                  value={value}
                />
                <Pressable
                  onPress={() => setShowPassword((prev) => !prev)}
                  style={styles.eyeIcon}
                >
                  <Feather
                    name={showPassword ? "eye" : "eye-off"}
                    size={24}
                    color={colorScheme === "dark" ? "#fff" : "#000"}
                  />
                </Pressable>
              </View>
            )}
          />
          {errors.password && (
            <Text style={styles.error}>{errors.password.message}</Text>
          )}

          {/* STAY LOGGED IN SWITCH */}
          <View style={styles.stayLoggedInContainer}>
            <Switch value={stayLoggedIn} onValueChange={setStayLoggedIn} />
            <ThemedText style={styles.stayLoggedInText}>
              Eingeloggt bleiben
            </ThemedText>
          </View>

          {/* LOGIN BUTTON */}
          <Button
            title={isLoading ? "Wird geladen..." : "Einloggen"}
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}
          />

          {/* FORGOT PASSWORD */}
          <Button
            title="Passwort vergessen"
            onPress={() => router.replace("/forgotPassword")}
          />

          {/* SIGNUP */}
          <Button
            title="Registrieren"
            onPress={() => router.replace("/signup")}
          />
        </View>
      </ScrollView>

      {/* HCAPTCHA INVISIBLE WIDGET */}
      {showCaptcha && (
        <ConfirmHcaptcha
          ref={captchaRef}
          siteKey="c2a47a96-0c8e-48b8-a6c6-e60a2e9e4228"
          onMessage={onCaptchaMessage}
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
    paddingHorizontal: 20,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  contentContainer: {
    borderWidth: 1,
    padding: 20,
    borderRadius: 12,
  },
  title: {
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
    fontSize: 20,
  },
  input: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
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
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  stayLoggedInText: {
    marginLeft: 8,
    fontSize: 16,
  },
});

