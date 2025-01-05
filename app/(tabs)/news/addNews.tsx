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
  Button,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm, Controller } from "react-hook-form";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "@/utils/supabase";
import { decode } from "base64-arraybuffer";

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

  const pickImages = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "You need to grant permission to access photos to use this feature."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsMultipleSelection: true,
        quality: 0.8,
        base64: true,
        selectionLimit: 10,
      });

      if (!result.canceled && result.assets) {
        const images = result.assets.map((asset) => ({
          uri: asset.uri,
          base64: asset.base64 ?? null
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
        const fileName = `${Date.now()}_${Math.random()
          .toString(36)
          .slice(2)}.png`;
        const fileType = uri.split(".").pop(); // Get file extension
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
    setUploading(true);
    try {
      const uploadedImageUrls = await uploadImages(selectedImages);
      if (!uploadedImageUrls) {
        Alert.alert("Error", "Image upload failed. Please try again.");
        setUploading(false);
        return;
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
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Add News</Text>

      <Text style={styles.label}>Title</Text>
      <Controller
        control={control}
        name="title"
        rules={{ required: "Title is required." }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={[styles.input, errors.title && styles.errorInput]}
            onChangeText={onChange}
            value={value}
            placeholder="Enter the title"
          />
        )}
      />
      {errors.title && (
        <Text style={styles.errorText}>{errors.title.message}</Text>
      )}

      <Text style={styles.label}>Body Text</Text>
      <Controller
        control={control}
        name="body_text"
        rules={{ required: "Body text is required." }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={[
              styles.input,
              styles.textArea,
              errors.body_text && styles.errorInput,
            ]}
            onChangeText={onChange}
            value={value}
            placeholder="Enter the body text"
            multiline
          />
        )}
      />
      {errors.body_text && (
        <Text style={styles.errorText}>{errors.body_text.message}</Text>
      )}

      <Text style={styles.label}>External URL</Text>
      <Controller
        control={control}
        name="external_url"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            onChangeText={onChange}
            value={value}
            placeholder="Enter the external URL"
          />
        )}
      />

      <Text style={styles.label}>Internal URL</Text>
      <Controller
        control={control}
        name="internal_url"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            onChangeText={onChange}
            value={value}
            placeholder="Enter the internal URL"
          />
        )}
      />

      <Text style={styles.label}>Pin News</Text>
      <Controller
        control={control}
        name="is_pinned"
        render={({ field: { onChange, value } }) => (
          <Switch onValueChange={onChange} value={value} />
        )}
      />

      <TouchableOpacity style={styles.imagePicker} onPress={pickImages}>
        <Text style={styles.imagePickerText}>
          {selectedImages.length ? "Add More Images" : "Upload Images"}
        </Text>
      </TouchableOpacity>

      <FlatList
        data={selectedImages}
        keyExtractor={(item) => item.uri}
        renderItem={({ item }) => (
          <View style={styles.imageContainer}>
            <Image source={{ uri: item.uri }} style={styles.imagePreview} />
            <Button title="Remove" onPress={() => removeImage(item.uri)} />
          </View>
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginVertical: 10 }}
      />

      <TouchableOpacity
        style={[styles.submitButton, uploading && styles.disabledButton]}
        onPress={handleSubmit(onSubmit)}
        disabled={uploading}
      >
        <Text style={styles.submitButtonText}>
          {uploading ? "Submitting..." : "Submit"}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: "bold",
    color: "#555",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  errorInput: {
    borderColor: "#ff4d4f",
  },
  errorText: {
    color: "#ff4d4f",
    marginBottom: 10,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  imagePicker: {
    padding: 15,
    borderRadius: 8,
    backgroundColor: "#007bff",
    alignItems: "center",
    marginTop: 10,
  },
  imagePickerText: {
    color: "#fff",
    fontWeight: "bold",
  },
  imageContainer: {
    marginRight: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 5,
  },
  submitButton: {
    padding: 15,
    borderRadius: 8,
    backgroundColor: "#007bff",
    alignItems: "center",
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: "#aaa",
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
