import React from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/utils/supabase";
import { router } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { coustomTheme } from "@/components/coustomTheme";
import { Colors } from "@/constants/Colors";

// Define validation schema with Zod
const schema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters long"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

type SignUpFormValues = {
  username: string;
  email: string;
  password: string;
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
  const signUpWithSupabase = async (
    username: string,
    email: string,
    password: string
  ) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username }, // Save username in user metadata
      },
    });

    if (error) {
      Alert.alert("Sign-Up Error", error.message);
    } else {
      Alert.alert("Success", "Please check your email to verify your account.");
      router.push("/(tabs)/renderItems/login"); // Navigate back to login after successful sign-up
    }
  };

  const onSubmit = (data: SignUpFormValues) => {
    signUpWithSupabase(data.username, data.email, data.password);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title} type="title">
        Sign Up
      </ThemedText>

      {/* Username Field */}
      <Controller
        control={control}
        name="username"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={[styles.input, themeStyles.text]}
            placeholder="Username"
            onChangeText={onChange}
            value={value}
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
      {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

      {/* Password Field */}
      <Controller
        control={control}
        name="password"
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

      {/* Sign-Up Button */}
      <Button title="Sign Up" onPress={handleSubmit(onSubmit)} />

      {/* Link to Login */}
      <View style={styles.logInContainer}>
        <ThemedText style={styles.logInText}>
          Already have an account
        </ThemedText>
        <Pressable
          style={styles.logInLink}
          onPress={() => router.push("/(tabs)/renderItems/login")}
        >
          <Text style={[styles.logInTextHighlight, styles.logInText]}>
            Log in
          </Text>
        </Pressable>
      </View>
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
  loginLink: {
    marginTop: 20,
    alignItems: "center",
  },

  logInContainer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },

  logInLink: {},
  logInText: {
    fontSize: 16,
  },
  logInTextHighlight: {
    color: Colors.universal.link,
    fontWeight: "bold",
  },
});
