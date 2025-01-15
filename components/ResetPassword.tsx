import React, { useState } from 'react';
import { View, TextInput, Alert, StyleSheet, Button, Text, Pressable, useColorScheme } from 'react-native';
import { supabase } from '@/utils/supabase';
import { useLocalSearchParams, router } from 'expo-router';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Feather from "@expo/vector-icons/Feather";
import { Colors } from '@/constants/Colors';

const schema = z.object({
  code: z.string({
    required_error: "Code wird benötigt",
  }).min(1, "Code wird benötigt"),
  newPassword: z.string({
    required_error: "Password wird benötigt",
  })
  .min(8, "Password muss mindestens 8 Zeichen lang sein")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^+=\-]).{8,}$/,
    "Password muss mindestens einen Großbuchstaben, einen Kleinbuchstaben, eine Zahl und ein Sonderzeichen enthalten"
  ),
  confirmPassword: z.string({
    required_error: "Password wird benötigt",
  }).min(8, "Password muss mindestens 8 Zeichen lang sein"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwörter stimmen nicht überein",
  path: ["confirmPassword"],
});

type ResetPasswordFormValues = {
  code: string;
  newPassword: string;
  confirmPassword: string;
};

export function ResetPassword() {
  const params = useLocalSearchParams();
  const email = Array.isArray(params.email) ? params.email[0] : params.email;
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const colorScheme = useColorScheme();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(schema),
  });

  const handleUpdatePassword = async (data: ResetPasswordFormValues) => {
    if (!email) {
      Alert.alert('Error', 'Email is required');
      return;
    }

    try {
      setLoading(true);
      const { data: verifyData, error: verifyError } = await supabase.auth.verifyOtp({
        email: email,
        token: data.code,
        type: 'recovery'
      });

      if (verifyError) throw verifyError;

      const { error: updateError } = await supabase.auth.updateUser({
        password: data.newPassword
      });

      if (updateError) throw updateError;

      Alert.alert('Erfolg', 'Dein Passwort wurde aktualisiert.');
      router.replace("/login");
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert('Error', 'Ein unerwarteter Fehler ist aufgetreten');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name="code"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Reset-Code eingeben"
            onChangeText={onChange}
            value={value}
            keyboardType="number-pad"
          />
        )}
      />
      {errors.code && (
        <Text style={styles.error}>{errors.code.message}</Text>
      )}

      <Controller
        control={control}
        name="newPassword"
        render={({ field: { onChange, value } }) => (
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Neues Passwort eingeben"
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
      {errors.newPassword && (
        <Text style={styles.error}>{errors.newPassword.message}</Text>
      )}

      <Controller
        control={control}
        name="confirmPassword"
        render={({ field: { onChange, value } }) => (
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
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

      <Button
        title="Passwort aktualisieren"
        onPress={handleSubmit(handleUpdatePassword)}
        disabled={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  input: {
    marginBottom: 16,
    padding: 12,
    borderWidth: 1,
    borderRadius: 6,
  },
  error: {
    color: Colors.universal.error,
    marginBottom: 12,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 6,
    marginBottom: 16,
  },
  passwordInput: {
    flex: 1,
    padding: 12,
  },
  eyeIcon: {
    padding: 10,
  },
});