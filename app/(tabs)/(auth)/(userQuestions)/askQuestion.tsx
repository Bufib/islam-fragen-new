import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  View,
} from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { supabase } from "@/utils/supabase";
import { useAuthStore } from "@/components/authStore";
import { Controller, useForm } from "react-hook-form";
import { coustomTheme } from "@/utils/coustomTheme";
import { Colors } from "@/constants/Colors";
import { router } from "expo-router";

type QuestionFormData = {
  title: string;
  marja: string;
  question: string;
  user_age: number;
  user_gender: string;
  user_email: string;
};

const CustomInput = ({
  label,
  error,
  multiline,
  numberOfLines,
  style,
  ...props
}: any) => (
  <View style={styles.inputContainer}>
    <ThemedText style={styles.label}>{label}</ThemedText>
    <TextInput
      style={[
        styles.input,
        multiline && styles.textArea,
        error && styles.inputError,
        style,
      ]}
      placeholderTextColor="#666"
      numberOfLines={numberOfLines}
      multiline={multiline}
      {...props}
    />
    {error && <ThemedText style={styles.errorText}>{error}</ThemedText>}
  </View>
);

export default function askQuestion() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const session = useAuthStore((state) => state.session);
  const themeStyles = coustomTheme();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<QuestionFormData>({
    defaultValues: {
      title: "",
      marja: "",
      question: "",
      user_age: undefined,
      user_gender: "",
      user_email: "",
    },
  });

  const onSubmit = async (data: QuestionFormData) => {
    if (!session?.user.id) {
      setError("You must be logged in to submit a question");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log(session.user.id);
      const { error: submissionError } = await supabase
        .from("user_question")
        .insert([
          {
            user_id: session.user.id,
            title: data.title,
            marja: data.marja,
            question: data.question,
            user_age: parseInt(data.user_age.toString()),
            user_gender: data.user_gender,
            user_email: data.user_email,
            status: "Beantwortung steht noch aus",
          },
        ]);

      if (submissionError) throw submissionError;
      reset();
    } catch (err) {
      setError(err.message);
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, themeStyles.defaultBackgorundColor]}
    >
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <ThemedText style={styles.title} type="title">
          Neue Frage
        </ThemedText>

        {error && (
          <ThemedView style={styles.errorContainer}>
            <ThemedText style={styles.errorText}>{error}</ThemedText>
          </ThemedView>
        )}

        <View style={[styles.formContainer, themeStyles.contrast]}>
          <Controller
            control={control}
            rules={{ required: "Bitte gebe einen Titel ein!" }}
            name="title"
            render={({ field: { onChange, value } }) => (
              <CustomInput
                label="Titel *"
                value={value}
                onChangeText={onChange}
                error={errors.title?.message}
                placeholder="Titel deiner Frage"
                style={themeStyles.text}
              />
            )}
          />

          <Controller
            control={control}
            rules={{ required: "Bitte gebe deinen Marja an!" }}
            name="marja"
            render={({ field: { onChange, value } }) => (
              <CustomInput
                label="Marja *"
                value={value}
                onChangeText={onChange}
                error={errors.marja?.message}
                placeholder="Wer ist dein Marja?"
                style={themeStyles.text}
              />
            )}
          />

          <Controller
            control={control}
            rules={{ required: "Bitte gebe deine Frage ein!" }}
            name="question"
            render={({ field: { onChange, value } }) => (
              <CustomInput
                label="Frage *"
                value={value}
                onChangeText={onChange}
                error={errors.question?.message}
                multiline
                numberOfLines={4}
                placeholder="Wie lautet deine Frage?"
                style={themeStyles.text}
              />
            )}
          />

          <Controller
            control={control}
            rules={{
              required: "Bitte gebe dein Alter ein!",
            }}
            name="user_age"
            render={({ field: { onChange, value } }) => (
              <CustomInput
                label="Alter *"
                value={value?.toString() || ""}
                onChangeText={(text: string) => onChange(parseInt(text) || "")}
                keyboardType="numeric"
                error={errors.user_age?.message}
                placeholder="Dein Alter"
                style={themeStyles.text}
              />
            )}
          />

          <Controller
            control={control}
            rules={{ required: "Bitte gebe dein Geschlecht an!" }}
            name="user_gender"
            render={({ field: { onChange, value } }) => (
              <CustomInput
                label="Geschlecht *"
                value={value}
                onChangeText={onChange}
                error={errors.user_gender?.message}
                placeholder="Dein Geschlecht"
                style={themeStyles.text}
              />
            )}
          />

          <Controller
            control={control}
            rules={{
              required: "Bitte gebe deinen Email an!",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Ungültige Emailadresse",
              },
            }}
            name="user_email"
            render={({ field: { onChange, value } }) => (
              <CustomInput
                label="Email *"
                value={value || ""}
                onChangeText={onChange}
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.user_email?.message}
                placeholder="Deine Emailadresse"
                style={themeStyles.text}
              />
            )}
          />
        </View>
        <Pressable
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit(onSubmit)}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="black" />
          ) : (
            <ThemedText style={styles.submitButtonText}>
              Frage stellen
            </ThemedText>
          )}
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  scrollView: {
    flex: 1,
  },

  title: {
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
  },
  textArea: {
    height: 120,
    paddingTop: 12,
    paddingBottom: 12,
    textAlignVertical: "top",
  },
  inputError: {
    borderColor: Colors.universal.error,
  },
  errorContainer: {
    backgroundColor: "#FFE5E5",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: Colors.universal.error,
    fontSize: 14,
  },
  formContainer: {
    flex: 1,
    borderWidth: 1,
    padding: 10,
    borderRadius: 20,
  },
  submitButton: {
    backgroundColor: Colors.universal.link,
    height: 56,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    marginBottom: 20,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.universal.white,
  },
});
