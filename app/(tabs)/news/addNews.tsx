import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Image,
  FlatList,
  Pressable,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm, Controller } from "react-hook-form";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "@/utils/supabase";
import { decode } from "base64-arraybuffer";
import { Linking } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { coustomTheme } from "@/components/coustomTheme";
import { ScrollView } from "react-native";
import { Colors } from "@/constants/Colors";
import { router } from "expo-router";
type NewsFormValues = {
  title: string;
  body_text: string;
  external_url?: string;
  internal_url?: string;
  is_pinned: boolean;
};

export default function AddNews() {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewsFormValues>({
    defaultValues: {
      title: "",
      body_text: "",
      external_url: "",
      internal_url: "",
      is_pinned: false,
    },
  });

  const [selectedImages, setSelectedImages] = useState<
    { uri: string; base64: string | null }[]
  >([]);
  const [uploading, setUploading] = useState(false);
  const themeStyles = coustomTheme();
  const pickImages = async () => {
    try {
      // Check media library permission
      const { status: mediaStatus, canAskAgain: canAskMediaAgain } =
        await ImagePicker.getMediaLibraryPermissionsAsync();

      if (mediaStatus !== "granted" && canAskMediaAgain) {
        const { status: newMediaStatus } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (newMediaStatus !== "granted") {
          Alert.alert(
            "Permission Denied",
            "We need access to your media library to select images."
          );
          return;
        }
      } else if (mediaStatus !== "granted" && !canAskMediaAgain) {
        Alert.alert(
          "Permission Denied",
          "You have permanently denied media library access. Please enable permissions in your device settings.",
          [
            {
              text: "Go to Settings",
              onPress: () => Linking.openSettings(),
            },
            { text: "Cancel", style: "cancel" },
          ]
        );
        return;
      }

      // Optional: Handle camera permission if needed
      const { status: cameraStatus, canAskAgain: canAskCameraAgain } =
        await ImagePicker.getCameraPermissionsAsync();

      if (cameraStatus !== "granted" && canAskCameraAgain) {
        const { status: newCameraStatus } =
          await ImagePicker.requestCameraPermissionsAsync();
        if (newCameraStatus !== "granted") {
          Alert.alert(
            "Permission Denied",
            "We need access to your camera to take photos."
          );
          return;
        }
      } else if (cameraStatus !== "granted" && !canAskCameraAgain) {
        Alert.alert(
          "Permission Denied",
          "You have permanently denied camera access. Please enable permissions in your device settings.",
          [
            {
              text: "Go to Settings",
              onPress: () => Linking.openSettings(),
            },
            { text: "Cancel", style: "cancel" },
          ]
        );
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsMultipleSelection: true,
        quality: 0.8,
        base64: true,
        selectionLimit: 10,
      });

      if (!result.canceled && result.assets) {
        const images = result.assets.map((asset) => ({
          uri: asset.uri,
          base64: asset.base64 ?? null, // Ensure `base64` is null if undefined
        }));
        setSelectedImages((prev) => [...prev, ...images]);
      }
    } catch (error) {
      console.error("Image picking error:", error);
      Alert.alert("Error", "Could not pick images. Please try again.");
    }
  };

  const uploadImages = async (
    images: { uri: string; base64: string | null }[]
  ) => {
    const uploadedUrls: string[] = [];

    for (const { uri, base64 } of images) {
      if (!base64) continue;

      try {
        const fileType = uri.split(".").pop()?.toLowerCase(); // Get file extension (e.g., "png", "jpg")

        // Validate the file type
        if (fileType && !["jpg", "jpeg", "png", "gif"].includes(fileType)) {
          console.error("Unsupported file type:", fileType);
          Alert.alert(
            "Error",
            `Invalid or unsupported file type (${fileType || "unknown"}).`
          );
          continue; // Skip this file and move to the next one
        }
        const fileName = `${Date.now()}_${Math.random()
          .toString(36)
          .slice(2)}.${fileType}`; // Use dynamic file extension
        const contentType = `image/${fileType}`; // Construct MIME type (e.g., image/png, image/jpeg)

        // Use decode from base64-arraybuffer directly on the base64 string
        const arrayBuffer = decode(base64);

        const { data, error } = await supabase.storage
          .from("news_bucket")
          .upload(`images/${fileName}`, arrayBuffer, {
            contentType: contentType,
            cacheControl: "3600",
            upsert: true,
          });

        if (error) {
          console.error("Image upload failed:", error.message);
          continue;
        }

        const { data: publicData } = supabase.storage
          .from("news_bucket")
          .getPublicUrl(`images/${fileName}`);

        if (!publicData?.publicUrl) {
          console.error("Failed to retrieve public URL for uploaded image");
          continue;
        }

        uploadedUrls.push(publicData.publicUrl);
      } catch (err) {
        console.error("Error uploading file:", err);
        continue;
      }
    }

    if (uploadedUrls.length === 0) {
      return null;
    }

    return uploadedUrls;
  };

  const onSubmit = async (formData: NewsFormValues) => {
    // Prevent multiple submissions while an upload is in progress
    if (uploading) {
      return;
    }
    // Prevent empty submission
    if (
      !formData.title.trim() &&
      !formData.body_text.trim() &&
      !formData.external_url?.trim() &&
      !formData.internal_url?.trim() &&
      selectedImages.length === 0
    ) {
      Alert.alert(
        "Error",
        "The news content cannot be empty. Please fill in at least one field or add an image."
      );
      return; // Exit without submitting
    }
    setUploading(true);
    try {
      // Attempt to upload images only if there are selected images
      let uploadedImageUrls: string[] | null = null;
      if (selectedImages.length > 0) {
        uploadedImageUrls = await uploadImages(selectedImages);

        if (!uploadedImageUrls) {
          Alert.alert("Error", "Image upload failed. Please try again.");
          setUploading(false);
          return;
        }
      }

      const { error } = await supabase.from("news").insert([
        {
          title: formData.title,
          body_text: formData.body_text,
          image_url: uploadedImageUrls,
          external_url: formData.external_url || null,
          internal_url: formData.internal_url || null,
          is_pinned: formData.is_pinned,
          pinned_at: formData.is_pinned ? new Date().toISOString() : null,
        },
      ]);

      if (error) throw error;

      reset();
      setSelectedImages([]);
      Alert.alert("Success", "News added successfully!");
      router.push("/(tabs)/news");
    } catch (error: any) {
      console.error("Error submitting news:", error.message);
      Alert.alert("Error", "An error occurred. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (uri: string) => {
    setSelectedImages((prev) => prev.filter((img) => img.uri !== uri));
  };

  return (
    <SafeAreaView
      style={[styles.container, themeStyles.defaultBackgorundColor]}
      edges={["top"]}
    >
      <ScrollView
        style={[styles.scrollViewStyle, themeStyles.defaultBackgorundColor]}
        contentContainerStyle={styles.scrollViewContentContainer}
      >
        <ThemedText style={styles.header} type="title">
          Nachricht hinzufügen
        </ThemedText>

        <View style={[styles.card, themeStyles.contrast]}>
          <ThemedText style={styles.label}>Title</ThemedText>
          <Controller
            control={control}
            name="title"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={[styles.input, themeStyles.text]}
                onChangeText={onChange}
                value={value}
                placeholder="Gib einen Titel ein"
                placeholderTextColor="#888"
              />
            )}
          />

          <ThemedText style={styles.label}>Nachricht</ThemedText>
          <Controller
            control={control}
            name="body_text"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={[styles.input, styles.textArea, themeStyles.text]}
                onChangeText={onChange}
                value={value}
                placeholder="Gib eine Nachricht ein"
                multiline
                placeholderTextColor="#888"
              />
            )}
          />

          <ThemedText style={styles.label}>Externe URL</ThemedText>
          <Controller
            control={control}
            name="external_url"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={[styles.input, themeStyles.text]}
                onChangeText={onChange}
                value={value}
                placeholder="Gib eine vollständinge URL (mit http...) ein"
                placeholderTextColor="#888"
              />
            )}
          />
          <ThemedText style={styles.label}>Verlinke eine Frage</ThemedText>
          <Controller
            control={control}
            name="internal_url"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={[styles.input, themeStyles.text]}
                onChangeText={onChange}
                value={value}
                placeholder="Gib den vollständingen Titel eine Frage an"
                placeholderTextColor="#888"
              />
            )}
          />

          <ThemedText style={styles.label}>Nachricht fixieren?</ThemedText>
          <Controller
            control={control}
            name="is_pinned"
            render={({ field: { onChange, value } }) => (
              <Switch onValueChange={onChange} value={value} />
            )}
          />
        </View>

        <Pressable style={styles.pickImageButton} onPress={pickImages}>
          <Text style={styles.imagePickerText}>
            {selectedImages.length
              ? "Mehr Bilder auswählen"
              : "Bilder hochladen"}
          </Text>
        </Pressable>

        {selectedImages.length > 0 && (
          <FlatList
            data={selectedImages}
            keyExtractor={(item) => item.uri}
            renderItem={({ item }) => (
              <View style={styles.imageContainer}>
                <Image source={{ uri: item.uri }} style={styles.imagePreview} />
                <Pressable
                  style={styles.removeButton}
                  onPress={() => removeImage(item.uri)}
                >
                  <Text style={styles.removeButtonText}>Entfernen</Text>
                </Pressable>
              </View>
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginVertical: 10 }}
          />
        )}

        <Pressable
          style={[styles.submitButton, uploading && styles.disabledButton]}
          onPress={handleSubmit(onSubmit)}
          disabled={uploading}
        >
          <Text style={styles.submitButtonText}>
            {uploading ? "Wird hochgeladen..." : "Hochgeladen"}
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewStyle: {
    flex: 1,
    padding: 20,
  },
  scrollViewContentContainer: {
    paddingBottom: 20,
  },
  header: {
    marginBottom: 20,
  },
  card: {
    borderRadius: 12,
    padding: 20,
    gap: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    fontSize: 16,
  },
  textArea: {
    height: 200,
  },

  pickImageButton: {
    padding: 15,
    borderRadius: 12,
    backgroundColor: Colors.universal.pickImageButton,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  imagePickerText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  imageContainer: {
    marginRight: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  imagePreview: {
    width: 120,
    height: 120,
    borderRadius: 12,
    marginBottom: 8,
  },
  removeButton: {
    backgroundColor: "#e74c3c",
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  removeButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  submitButton: {
    padding: 15,
    borderRadius: 12,
    backgroundColor: Colors.universal.submitButton,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#aaa",
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
