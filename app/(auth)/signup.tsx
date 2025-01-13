import React from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  useColorScheme,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/utils/supabase";
import { router } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { coustomTheme } from "@/utils/coustomTheme";
import { Colors } from "@/constants/Colors";
import {
  signUpErrorGeneral,
  signUpSuccess,
  signUpUserNameAlreadyInUsage,
  signUpUserEmailAlreadyInUsage,
  signUpUserNameMin,
  signUpUserPasswordFormat,
  signUpUserPasswordMin,
  signUpUserEmail,
  signUpUserPasswordConformation,
  noInternetHeader,
  noInternetBody,
  signUpEmailNotEmpty,
  signUpPasswordNotEmpty,
  signUpUsernameNotEmpty,
} from "@/constants/messages";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useState } from "react";
import NetInfo from "@react-native-community/netinfo";
import Feather from "@expo/vector-icons/Feather";
import ConfirmHcaptcha from "@hcaptcha/react-native-hcaptcha";
import { useRef, useEffect } from "react";
// Define validation schema with Zod
const schema = z
  .object({
    username: z
      .string({
        required_error: signUpUsernameNotEmpty,
      })
      .min(3, signUpUserNameMin),
    email: z
      .string({
        required_error: signUpEmailNotEmpty,
      })
      .email(signUpEmailNotEmpty),
    password: z
      .string({
        required_error: signUpPasswordNotEmpty,
      })
      .min(8, signUpUserPasswordMin)
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^+=\-]).{8,}$/,
        signUpUserPasswordFormat
      ),
    confirmPassword: z
      .string({
        required_error: signUpPasswordNotEmpty,
      })
      .min(8, signUpUserPasswordMin),
  })
  .refine((data) => data.password === data.confirmPassword, {
    // coustom logic
    message: signUpUserPasswordConformation,
    path: ["confirmPassword"], // Show error here
  });

type SignUpFormValues = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function SignUpScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(schema),
  });

  const themeStyles = coustomTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const colorScheme = useColorScheme();
  const [showCaptcha, setShowCaptcha] = useState(false);
  const captchaRef = useRef(null);

  useEffect(() => {
    if (showCaptcha && captchaRef.current) {
      captchaRef.current?.show();
    }
  }, [showCaptcha]);

  const checkUserExists = async (username: string, email: string) => {
    try {
      const { data, error } = await supabase
        .from("user")
        .select("user_username, user_email") // Fetch both fields
        .or(`user_username.eq.${username},user_email.eq.${email}`); // Check if either matches

      if (error) {
        Alert.alert(signUpErrorGeneral, error.message);
        return { usernameExists: false, emailExists: false };
      }

      // Determine which fields already exist
      const usernameExists = data.some(
        (user) => user.user_username === username
      );
      const emailExists = data.some((user) => user.user_email === email);

      return { usernameExists, emailExists };
    } catch (error) {
      Alert.alert(signUpErrorGeneral, error.message);
      return { usernameExists: false, emailExists: false };
    }
  };

  const signUpWithSupabase = async (
    username: string,
    email: string,
    password: string,
    captchaToken: string
  ) => {
    try {
      setIsLoading(true);

      // First check if username exists
      const { usernameExists, emailExists } = await checkUserExists(
        username,
        email
      );

      if (usernameExists) {
        Alert.alert(signUpErrorGeneral, signUpUserNameAlreadyInUsage);
        return;
      }
      if (emailExists) {
        Alert.alert(signUpErrorGeneral, signUpUserEmailAlreadyInUsage);
        return;
      }

      // If username is available, proceed with signUp
      const { data: signUpData, error: signUpError } =
        await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { username },
            captchaToken,
          },
        });

      if (signUpError) {
        console.log(signUpError);

        Alert.alert(signUpErrorGeneral, signUpError.message);
        return;
      }

      // If signup successful, create user record
      if (signUpData.user) {
        const { error: userError } = await supabase.from("user").insert([
          {
            user_id: signUpData.user.id,
            user_username: username,
            user_email: email,
          },
        ]);

        if (userError) {
          Alert.alert(signUpErrorGeneral, userError.message);
          return;
        }

        signUpSuccess();
        router.push("/(tabs)/home");
      }
    } catch (error) {
      console.log(error);
      Alert.alert(signUpErrorGeneral, error.message);

      console.error(error);
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
        handleSubmit(async (formData) => {
          await signUpWithSupabase(
            formData.username,
            formData.email,
            formData.password,
            token
          );
        })();
      }
    }
  };

  const onSubmit = async (data: SignUpFormValues) => {
    // Check for internet
    const netInfo = await NetInfo.fetch();
    if (!netInfo.isConnected) {
      Alert.alert(noInternetHeader, noInternetBody);
      return;
    }
    setShowCaptcha(true);
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
            Registrieren
          </ThemedText>

          {/* Username Field */}
          <Controller
            control={control}
            name="username"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={[styles.input, themeStyles.text]}
                placeholder="Benutzername"
                onChangeText={onChange}
                value={value}
                autoCapitalize="none"
              />
            )}
          />
          {errors.username && (
            <Text style={styles.error}>{errors.username.message}</Text>
          )}

          {/* Email Field */}
          <Controller
            control={control}
            name="email"
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
          {errors.email && (
            <Text style={styles.error}>{errors.email.message}</Text>
          )}

          {/* Password Field */}
          <Controller
            control={control}
            name="password"
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

          {/* Confirm Password Field */}
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, value } }) => (
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[styles.passwordInput, themeStyles.text]}
                  placeholder="Passwort bestätigen"
                  onChangeText={onChange}
                  value={value}
                  secureTextEntry={!showConfirmPassword}
                />
                <Pressable
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeIcon}
                >
                  <Text>
                    {showConfirmPassword ? (
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
          {errors.confirmPassword && (
            <Text style={styles.error}>{errors.confirmPassword.message}</Text>
          )}

          {/* Sign-Up Button */}
          {isLoading ? (
            <ActivityIndicator />
          ) : (
            <Button
              title="Registrieren"
              onPress={handleSubmit(onSubmit)}
              disabled={isLoading}
            />
          )}

          {/* Link to Login */}
          <View style={styles.logInContainer}>
            <ThemedText style={styles.logInText}>
              Hast du bereits einen Account?
            </ThemedText>
            <Button title="Login" onPress={() => router.replace("/login")} />
          </View>
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
  loginLink: {
    marginTop: 20,
    alignItems: "center",
  },

  logInContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  logInText: {
    fontSize: 16,
    fontWeight: "700",
  },
});
