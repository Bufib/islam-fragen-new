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
import { useAuthStore } from "@/stores/authStore";
import { Controller, useForm } from "react-hook-form";
import { coustomTheme } from "@/utils/coustomTheme";
import { Colors } from "@/constants/Colors";
import { router } from "expo-router";
import ConfirmHcaptcha from "@hcaptcha/react-native-hcaptcha";
import { useEffect, useRef } from "react";
import { Alert } from "react-native";

type QuestionFormData = {
  title: string;
  marja: {
    sistani: boolean;
    khamenei: boolean;
    keineRechtsfrage: boolean;
  };
  question: string;
  user_age: number;
  user_gender: string;
  user_email: string;
  user_username: string;
};
const CustomCheckbox = ({ label, value, onValueChange, error }: any) => (
  <Pressable
    style={[styles.checkboxContainer]}
    onPress={() => onValueChange(!value)}
  >
    <View style={[styles.checkbox, value && styles.checkboxChecked]}>
      {value && <ThemedText style={styles.checkmark}>✓</ThemedText>}
    </View>
    <ThemedText style={styles.checkboxLabel}>{label}</ThemedText>
  </Pressable>
);

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
  const user_username = useAuthStore((state) => state.user_username);
  const themeStyles = coustomTheme();
  const [showCaptcha, setShowCaptcha] = useState(false);
  const captchaRef = useRef(null);
  const {
    control,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm<QuestionFormData>({
    defaultValues: {
      title: "",
      marja: {
        sistani: false,
        khamenei: false,
        keineRechtsfrage: false,
      },

      question: "",
      user_age: undefined,
      user_gender: "",
      user_email: "",
      user_username: "",
    },
  });

  useEffect(() => {
    if (showCaptcha && captchaRef.current) {
      captchaRef.current?.show();
    }
  }, [showCaptcha]);

  const submitQuestion = async (
    data: QuestionFormData,
    captchaToken: string
  ) => {
    if (!session?.user.id) {
      setError("You must be logged in to submit a question");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Extract the selected Marja
      let selectedMarja = null;
      if (data.marja.sistani) {
        selectedMarja = "Sistani";
      } else if (data.marja.khamenei) {
        selectedMarja = "Khamenei";
      } else if (data.marja.keineRechtsfrage) {
        selectedMarja = "Keine Rechtsfrage";
      }

      console.log(session.user.id);
      const { error: submissionError } = await supabase
        .from("user_question")
        .insert([
          {
            user_id: session.user.id,
            user_username: user_username,
            title: data.title,
            marja: selectedMarja,
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
      setShowCaptcha(false);
    }
  };

  const onSubmit = async (data: QuestionFormData) => {
    setShowCaptcha(true);
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
        // Validate form and submit with token
        handleSubmit(async (formData) => {
          await submitQuestion(formData, token);
        })();
      }
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
                autoCapitalize="none"
              />
            )}
          />

          {/* <Controller
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
                autoCapitalize="none"
              />
            )}
          /> */}

          <View style={styles.marjaContainer}>
            <ThemedText style={styles.label}>Marja *</ThemedText>
            <Controller
              control={control}
              rules={{
                validate: (value) => {
                  // Ensure that at least one Marja is selected
                  if (
                    !value.sistani &&
                    !value.khamenei &&
                    !value.keineRechtsfrage
                  ) {
                    return "Bitte wähle einen Marja aus!";
                  }
                  return true;
                },
              }}
              name="marja"
              render={({ field: { onChange, value } }) => (
                <View>
                  <CustomCheckbox
                    label="Sayid as-Sistani"
                    value={value.sistani}
                    onValueChange={
                      () =>
                        onChange({
                          sistani: true,
                          khamenei: false,
                          keineRechtsfrage: false,
                        }) // Select Sistani, deselect Khamenei
                    }
                  />
                  <CustomCheckbox
                    label="Sayid al-Khamenei"
                    value={value.khamenei}
                    onValueChange={
                      () =>
                        onChange({
                          sistani: false,
                          khamenei: true,
                          keineRechtsfrage: false,
                        }) // Select Khamenei, deselect Sistani
                    }
                  />
                  <CustomCheckbox
                    label="Keine Rechtsfrage"
                    value={value.keineRechtsfrage}
                    onValueChange={
                      () =>
                        onChange({
                          sistani: false,
                          khamenei: false,
                          keineRechtsfrage: true,
                        }) // neither
                    }
                  />
                  {errors.marja && (
                    <ThemedText style={styles.errorText}>
                      {errors.marja.message}
                    </ThemedText>
                  )}
                </View>
              )}
            />
          </View>

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
                autoCapitalize="none"
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
                autoCapitalize="none"
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
    padding: 10,
  },
  scrollView: {
    flex: 1,
  },

  title: {
    marginTop: 10,
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
    height: 250,
    paddingTop: 12,
    paddingBottom: 12,
    textAlignVertical: "top",
  },
  inputError: {
    borderColor: Colors.universal.error,
  },
  marjaContainer: {
    marginBottom: 16,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: Colors.universal.link,
    borderRadius: 4,
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: Colors.universal.link,
  },
  checkmark: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  checkboxLabel: {
    fontSize: 16,
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
    marginBottom: 40,
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
