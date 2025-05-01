import React, { useState, useEffect } from "react";
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
import { Card } from "@/components/ui/Card";
import { colors } from "@/constants/Colors";
import { complaintTypes } from "@/constants/complaint-types";
import { Complaint, ComplaintType, ComplaintPriority } from "@/types";
import { useAuthStore } from "@/store/auth-store";
import { Camera, MapPin, Upload, AlertTriangle } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";

interface ComplaintFormProps {
  onSubmit: (complaintData: Omit<Complaint, "id" | "createdAt" | "updatedAt" | "status">) => Promise<void>;
  isLoading: boolean;
}

export const ComplaintForm: React.FC<ComplaintFormProps> = ({
  onSubmit,
  isLoading,
}) => {
  const { user } = useAuthStore();

  const [formData, setFormData] = useState({
    type: "" as ComplaintType,
    description: "",
    photoUrls: [] as string[],
    locationLat: 0,
    locationLong: 0,
    address: "",
    priority: "normal" as ComplaintPriority,
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [locationPermission, setLocationPermission] = useState<boolean | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    if (Platform.OS === "web") {
      setLocationPermission(true);
      return;
    }

    const { status } = await Location.requestForegroundPermissionsAsync();
    setLocationPermission(status === "granted");
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user changes input
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleTypeSelect = (type: ComplaintType) => {
    handleChange("type", type);
  };

  const handlePrioritySelect = (priority: ComplaintPriority) => {
    handleChange("priority", priority);
  };

  const handleImagePick = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const newPhotoUrls = [...formData.photoUrls, result.assets[0].uri];
        handleChange("photoUrls", newPhotoUrls);
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  };

  const handleRemoveImage = (index: number) => {
    const newPhotoUrls = [...formData.photoUrls];
    newPhotoUrls.splice(index, 1);
    handleChange("photoUrls", newPhotoUrls);
  };

  const getCurrentLocation = async () => {
    if (!locationPermission) {
      setFormErrors(prev => ({
        ...prev,
        location: "Location permission is required",
      }));
      return;
    }

    setIsLoadingLocation(true);

    try {
      if (Platform.OS === "web") {
        navigator.geolocation.getCurrentPosition(
          position => {
            handleChange("locationLat", position.coords.latitude);
            handleChange("locationLong", position.coords.longitude);
            handleChange("address", "Location selected (Web)");
            setIsLoadingLocation(false);
          },
          error => {
            console.error("Error getting location:", error);
            setFormErrors(prev => ({
              ...prev,
              location: "Failed to get location",
            }));
            setIsLoadingLocation(false);
          }
        );
      } else {
        const location = await Location.getCurrentPositionAsync({});
        handleChange("locationLat", location.coords.latitude);
        handleChange("locationLong", location.coords.longitude);

        // Get address from coordinates
        const [address] = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        if (address) {
          const addressStr = [
            address.street,
            address.city,
            address.region,
            address.postalCode,
          ]
            .filter(Boolean)
            .join(", ");
          handleChange("address", addressStr);
        } else {
          handleChange("address", "Location selected");
        }

        setIsLoadingLocation(false);
      }
    } catch (error) {
      console.error("Error getting location:", error);
      setFormErrors(prev => ({
        ...prev,
        location: "Failed to get location",
      }));
      setIsLoadingLocation(false);
    }
  };

  const validate = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.type) {
      errors.type = "Please select a complaint type";
    }

    if (!formData.description.trim()) {
      errors.description = "Description is required";
    } else if (formData.description.trim().length < 10) {
      errors.description = "Description must be at least 10 characters";
    }

    if (formData.locationLat === 0 || formData.locationLong === 0) {
      errors.location = "Location is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (validate() && user) {
      await onSubmit({
        ...formData,
        citizenId: user.id,
      });
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Complaint Type</Text>
      <View style={styles.typeContainer}>
        {complaintTypes.map(type => (
          <TouchableOpacity
            key={type.value}
            style={[
              styles.typeButton,
              formData.type === type.value && styles.selectedTypeButton,
            ]}
            onPress={() => handleTypeSelect(type.value)}
          >
            <Text
              style={[
                styles.typeText,
                formData.type === type.value && styles.selectedTypeText,
              ]}
            >
              {type.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {formErrors.type && <Text style={styles.errorText}>{formErrors.type}</Text>}

      <Text style={styles.sectionTitle}>Description</Text>
      <Input
        placeholder="Describe the issue in detail..."
        value={formData.description}
        onChangeText={value => handleChange("description", value)}
        error={formErrors.description}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
        style={styles.descriptionInput}
      />

      <Text style={styles.sectionTitle}>Photos</Text>
      <View style={styles.photosContainer}>
        {formData.photoUrls.map((url, index) => (
          <View key={index} style={styles.photoContainer}>
            <Image source={{ uri: url }} style={styles.photo} />
            <TouchableOpacity
              style={styles.removePhotoButton}
              onPress={() => handleRemoveImage(index)}
            >
              <Text style={styles.removePhotoText}>×</Text>
            </TouchableOpacity>
          </View>
        ))}
        {formData.photoUrls.length < 3 && (
          <TouchableOpacity
            style={styles.addPhotoButton}
            onPress={handleImagePick}
          >
            <Camera size={24} color={colors.primary} />
            <Text style={styles.addPhotoText}>Add Photo</Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.sectionTitle}>Location</Text>
      <Card style={styles.locationCard}>
        {formData.address ? (
          <View style={styles.selectedLocation}>
            <MapPin size={20} color={colors.primary} />
            <Text style={styles.locationText}>{formData.address}</Text>
          </View>
        ) : (
          <Text style={styles.locationPlaceholder}>
            No location selected
          </Text>
        )}
        <Button
          title="Use Current Location"
          leftIcon={<MapPin size={16} color="white" />}
          onPress={getCurrentLocation}
          isLoading={isLoadingLocation}
          size="sm"
          style={styles.locationButton}
        />
      </Card>
      {formErrors.location && (
        <Text style={styles.errorText}>{formErrors.location}</Text>
      )}

      <Text style={styles.sectionTitle}>Priority</Text>
      <View style={styles.priorityContainer}>
        <TouchableOpacity
          style={[
            styles.priorityButton,
            formData.priority === "normal" && styles.selectedPriorityButton,
          ]}
          onPress={() => handlePrioritySelect("normal")}
        >
          <Text
            style={[
              styles.priorityText,
              formData.priority === "normal" && styles.selectedPriorityText,
            ]}
          >
            Normal
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.priorityButton,
            styles.urgentButton,
            formData.priority === "urgent" && styles.selectedUrgentButton,
          ]}
          onPress={() => handlePrioritySelect("urgent")}
        >
          <AlertTriangle
            size={16}
            color={
              formData.priority === "urgent" ? "white" : colors.danger
            }
          />
          <Text
            style={[
              styles.priorityText,
              styles.urgentText,
              formData.priority === "urgent" && styles.selectedUrgentText,
            ]}
          >
            Urgent
          </Text>
        </TouchableOpacity>
      </View>

      <Button
        title="Submit Complaint"
        onPress={handleSubmit}
        isLoading={isLoading}
        style={styles.submitButton}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  typeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  typeButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  selectedTypeButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  typeText: {
    fontSize: 14,
    color: colors.text,
  },
  selectedTypeText: {
    color: "white",
  },
  descriptionInput: {
    height: 100,
  },
  photosContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  photoContainer: {
    position: "relative",
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removePhotoButton: {
    position: "absolute",
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.danger,
    alignItems: "center",
    justifyContent: "center",
  },
  removePhotoText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  addPhotoButton: {
    width: 100,
    height: 100,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },
  addPhotoText: {
    color: colors.primary,
    marginTop: 4,
    fontSize: 12,
  },
  locationCard: {
    padding: 12,
  },
  selectedLocation: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  locationText: {
    marginLeft: 8,
    fontSize: 14,
    color: colors.text,
  },
  locationPlaceholder: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  locationButton: {
    alignSelf: "flex-start",
  },
  priorityContainer: {
    flexDirection: "row",
    gap: 12,
  },
  priorityButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  selectedPriorityButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  urgentButton: {
    borderColor: colors.danger,
  },
  selectedUrgentButton: {
    backgroundColor: colors.danger,
    borderColor: colors.danger,
  },
  priorityText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 4,
  },
  urgentText: {
    color: colors.danger,
  },
  selectedPriorityText: {
    color: "white",
  },
  selectedUrgentText: {
    color: "white",
  },
  errorText: {
    color: colors.danger,
    fontSize: 12,
    marginTop: 4,
  },
  submitButton: {
    marginTop: 24,
    marginBottom: 32,
  },
});