import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
} from "react-native";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { colors } from "@/constants/colors";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/store/auth-store";
import { useEventStore } from "@/store/event-store";
import { Calendar, Clock, Upload } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";

export default function CreateEventScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { createEvent, isLoading } = useEventStore();
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: new Date().toISOString(),
    photoUrl: "",
  });
  
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user changes input
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleImagePick = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        handleChange("photoUrl", result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  };

  const validate = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.title.trim()) {
      errors.title = "Title is required";
    }

    if (!formData.description.trim()) {
      errors.description = "Description is required";
    }

    if (!formData.photoUrl) {
      errors.photoUrl = "Event image is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (validate() && user) {
      try {
        await createEvent({
          ...formData,
          createdBy: user.id,
        });
        router.push("./events");
      } catch (error) {
        console.error("Failed to create event:", error);
      }
    }
  };

  // For demo purposes, use a placeholder image if on web
  const getImagePlaceholder = () => {
    if (Platform.OS === "web" && !formData.photoUrl) {
      return "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80";
    }
    return formData.photoUrl;
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Create New Event</Text>

      <View style={styles.formContainer}>
        <Input
          label="Event Title"
          placeholder="Enter event title"
          value={formData.title}
          onChangeText={value => handleChange("title", value)}
          error={formErrors.title}
        />

        <Input
          label="Description"
          placeholder="Enter event description"
          value={formData.description}
          onChangeText={value => handleChange("description", value)}
          error={formErrors.description}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          style={styles.descriptionInput}
        />

        <Text style={styles.label}>Event Image</Text>
        <TouchableOpacity
          style={styles.imagePickerContainer}
          onPress={handleImagePick}
        >
          {formData.photoUrl || Platform.OS === "web" ? (
            <Image
              source={{ uri: getImagePlaceholder() }}
              style={styles.previewImage}
            />
          ) : (
            <View style={styles.uploadPlaceholder}>
              <Upload size={32} color={colors.primary} />
              <Text style={styles.uploadText}>Upload Image</Text>
            </View>
          )}
        </TouchableOpacity>
        {formErrors.photoUrl && (
          <Text style={styles.errorText}>{formErrors.photoUrl}</Text>
        )}

        <View style={styles.dateTimeContainer}>
          <View style={styles.dateTimeItem}>
            <Text style={styles.label}>Date</Text>
            <TouchableOpacity style={styles.dateTimePicker}>
              <Calendar size={20} color={colors.primary} />
              <Text style={styles.dateTimeText}>Select Date</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.dateTimeItem}>
            <Text style={styles.label}>Time</Text>
            <TouchableOpacity style={styles.dateTimePicker}>
              <Clock size={20} color={colors.primary} />
              <Text style={styles.dateTimeText}>Select Time</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Button
          title="Create Event"
          onPress={handleSubmit}
          isLoading={isLoading}
          style={styles.submitButton}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 24,
  },
  formContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.text,
    marginBottom: 8,
  },
  descriptionInput: {
    height: 120,
  },
  imagePickerContainer: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: "dashed",
  },
  previewImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  uploadPlaceholder: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: `${colors.primary}10`,
  },
  uploadText: {
    color: colors.primary,
    marginTop: 8,
    fontWeight: "500",
  },
  errorText: {
    color: colors.danger,
    fontSize: 12,
    marginTop: -8,
    marginBottom: 16,
  },
  dateTimeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  dateTimeItem: {
    width: "48%",
  },
  dateTimePicker: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
  },
  dateTimeText: {
    marginLeft: 8,
    color: colors.text,
  },
  submitButton: {
    marginTop: 8,
  },
});