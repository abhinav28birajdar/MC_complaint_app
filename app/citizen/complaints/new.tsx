import React, { useState } from 'react';
// *** FIX: Add ActivityIndicator import ***
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, MapPin, ArrowLeft, X } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { colors } from '@/constants/Colors';
import { useComplaintsStore } from '@/store/complaints-store';
import { useAuthStore } from '@/store/auth-store';
// *** FIX: Import ComplaintPriority as well ***
import { ComplaintType, Location as LocationType, ComplaintPriority } from '@/types';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';

export default function NewComplaintScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { addComplaint, isLoading } = useComplaintsStore();

  const [type, setType] = useState<ComplaintType>('garbage');
  const [description, setDescription] = useState('');
  const [media, setMedia] = useState<string[]>([]);
  const [location, setLocation] = useState<LocationType | null>(null);
  const [isLocationLoading, setIsLocationLoading] = useState(false);

  const [descriptionError, setDescriptionError] = useState('');
  const [locationError, setLocationError] = useState('');

  // *** FIX: Correct ComplaintType values ('streetLight', 'other') ***
  const complaintTypes: { value: ComplaintType; label: string }[] = [
    { value: 'pothole', label: 'Pothole' },
    { value: 'garbage', label: 'Garbage' },
    { value: 'streetLight', label: 'Street Light' }, // Corrected value
    { value: 'waterLeakage', label: 'Water Leakage' },
    { value: 'roadDamage', label: 'Road Damage' },
    { value: 'other', label: 'Other' }, // Corrected value
  ];

  const requestMediaPermissions = async () => {
     if (Platform.OS !== 'web') {
         const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
         if (status !== 'granted') {
             Alert.alert('Permission required', 'Sorry, we need camera roll permissions to make this work!');
             return false;
         }
     }
     return true; // No explicit permissions needed for web library access usually
   };

  const pickImage = async () => {
     const hasPermission = await requestMediaPermissions();
     if (!hasPermission) return;

     try {
          const result = await ImagePicker.launchImageLibraryAsync({
               mediaTypes: ImagePicker.MediaTypeOptions.Images,
               // allowsEditing: true, // Consider removing if full image is needed
               // aspect: [4, 3], // Consider removing if full image is needed
               quality: 0.8, // Balance quality and size
               base64: false, // Don't include base64 unless needed for direct upload
           });

           if (!result.canceled && result.assets && result.assets.length > 0) {
               if (media.length < 3) {
                   // Use the URI from the assets array
                   setMedia([...media, result.assets[0].uri]);
               } else {
                   Alert.alert("Limit Reached", "You can upload a maximum of 3 images.");
               }
           }
     } catch (error) {
         console.error("Image Picker Error:", error);
         Alert.alert("Error", "Could not pick image.");
     }
   };

  const removeImage = (index: number) => {
    const updatedMedia = [...media];
    updatedMedia.splice(index, 1);
    setMedia(updatedMedia);
  };

  const requestLocationPermission = async () => {
     const { status } = await Location.requestForegroundPermissionsAsync();
     if (status !== 'granted') {
         setLocationError('Permission to access location was denied. Please enable it in settings.');
         Alert.alert('Permission Denied', 'Location permission is required to submit a complaint. Please enable it in your device settings.');
         return false;
     }
     return true;
  };


  const getCurrentLocation = async () => {
     const hasPermission = await requestLocationPermission();
     if (!hasPermission) return;

     setIsLocationLoading(true); // Start loading indicator
     setLocationError(''); // Clear previous error

     try {
       // Consider adding a timeout
       const currentLocation = await Location.getCurrentPositionAsync({
         accuracy: Location.Accuracy.High, // Request high accuracy
         // timeout: 10000, // Add timeout (e.g., 10 seconds)
       });
       const { latitude, longitude } = currentLocation.coords;

       // Reverse geocode to get address
       const addressResults = await Location.reverseGeocodeAsync({
         latitude,
         longitude,
       });

       let formattedAddress = 'Address not found';
       if (addressResults && addressResults.length > 0) {
           const adr = addressResults[0];
            // Construct address more reliably
            const addressParts = [
                adr.name, // Often includes street number and name
                adr.street,
                adr.city,
                adr.region,
                adr.postalCode,
                adr.country
            ].filter(part => part != null && part !== adr.name); // Filter nulls and duplicates of name

           formattedAddress = [adr.name, ...new Set(addressParts)].filter(Boolean).join(', '); // Join unique parts
       }

       setLocation({
         latitude,
         longitude,
         address: formattedAddress,
       });

     } catch (error: any) {
       // Handle specific errors like timeout
       if (error.code === 'TIMEOUT') {
          setLocationError('Failed to get location: Timed out. Try again in an open area.');
          Alert.alert("Location Timeout", "Could not fetch location in time. Please try again.");
       } else {
          setLocationError('Failed to get current location. Please ensure location services are enabled.');
          Alert.alert("Location Error", "Could not fetch location. Please try again or check settings.");
       }
       console.error('Error getting location:', error);
     } finally {
          setIsLocationLoading(false); // Stop loading indicator
     }
   };


  const validateForm = () => {
    let isValid = true;
    setDescriptionError('');
    setLocationError('');

    if (!description.trim()) {
      setDescriptionError('Please provide a description');
      isValid = false;
    } else if (description.trim().length < 10) {
         setDescriptionError('Description should be at least 10 characters');
         isValid = false;
     }


    if (!location) {
      setLocationError('Please add the complaint location');
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm() || !user) return;

    if (isLoading || isLocationLoading) return; // Prevent submission while loading anything

    // Ensure addComplaint function exists
    if (typeof addComplaint !== 'function') {
        console.error("addComplaint function is not available in useComplaintsStore");
        Alert.alert("Error", "Complaint submission service is unavailable. Please try again later.");
        return;
    }

    try {
        // *** FIX: Add missing 'priority' field ***
        // Defaulting priority to 'medium', adjust if needed
      const newComplaintData = {
        type,
        description: description.trim(),
        location: location!, // Location is validated, so ! assertion is okay here
        media,
        citizenId: user.id,
        priority: 'medium' as ComplaintPriority, // Added default priority
        // 'status' will be set to 'pending' by the backend or store logic
        // 'createdAt', 'updatedAt' will be set by the backend or store logic
      };

      const newComplaint = await addComplaint(newComplaintData);

      Alert.alert("Success", "Complaint submitted successfully!");
      // Replace current screen with the detail screen of the new complaint
      router.replace(`/citizen/complaints/${newComplaint.id}`);

    } catch (error) {
      console.error('Error submitting complaint:', error);
      Alert.alert("Error", `Failed to submit complaint. ${error instanceof Error ? error.message : 'Please try again.'}`);
    }
  };

  const handleBack = () => {
    if (router.canGoBack()) {
        router.back();
    } else {
        router.replace('/citizen/complaints'); // Fallback to complaints list
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          activeOpacity={0.7}
        >
          <ArrowLeft size={24} color={colors.gray[700]} />
        </TouchableOpacity>
        <Text style={styles.title}>File a New Complaint</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled" // Dismiss keyboard on tap outside inputs
      >
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Complaint Type *</Text>
          <View style={styles.typeContainer}>
            {complaintTypes.map(item => (
              <TouchableOpacity
                key={item.value}
                style={[
                  styles.typeButton,
                  type === item.value && styles.typeButtonSelected
                ]}
                onPress={() => setType(item.value)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.typeButtonText,
                    type === item.value && styles.typeButtonTextSelected
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Description *</Text>
          <Input
            label="Complaint Details" // Added label for clarity
            placeholder="Describe the issue in detail (min. 10 characters)..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={5}
            error={descriptionError}
            containerStyle={{ marginBottom: 16 }} // Adjusted margin
            inputStyle={styles.textAreaInput} // Specific style for textarea
            textAlignVertical="top" // Align text to top for multiline
          />
          {descriptionError ? <Text style={styles.inlineErrorText}>{descriptionError}</Text> : null}


          <Text style={styles.sectionTitle}>Photos (Optional, Max 3)</Text>
          <View style={styles.mediaContainer}>
            {media.map((uri, index) => (
              <View key={index} style={styles.mediaItem}>
                <Image source={{ uri }} style={styles.mediaPreview} />
                <TouchableOpacity
                  style={styles.removeMediaButton}
                  onPress={() => removeImage(index)}
                  activeOpacity={0.7}
                >
                  <X size={16} color={colors.white} />
                </TouchableOpacity>
              </View>
            ))}

            {media.length < 3 && (
              <TouchableOpacity
                style={styles.addMediaButton}
                onPress={pickImage}
                activeOpacity={0.7}
              >
                <Camera size={24} color={colors.gray[500]} />
                <Text style={styles.addMediaText}>Add Photo</Text>
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.sectionTitle}>Location *</Text>
          <TouchableOpacity
            style={styles.locationButton}
            onPress={getCurrentLocation}
            activeOpacity={0.7}
            disabled={isLocationLoading} // Disable button while loading
          >
            {/* *** FIX: Use imported ActivityIndicator *** */}
            {isLocationLoading ? (
                <ActivityIndicator size="small" color={colors.primary} style={styles.locationIcon}/>
            ) : (
                <MapPin size={20} color={colors.primary} style={styles.locationIcon}/>
            )}
            <Text style={styles.locationButtonText}>
              {isLocationLoading ? 'Fetching Location...' : (location ? 'Update Current Location' : 'Use Current Location')}
            </Text>
          </TouchableOpacity>

          {location && !isLocationLoading && ( // Only show preview if location is set and not loading
            <View style={styles.locationPreview}>
              <Text style={styles.locationAddress} numberOfLines={2} ellipsizeMode='tail'>{location.address}</Text>
            </View>
          )}

          {locationError ? (
             <Text style={styles.inlineErrorText}>{locationError}</Text>
          ) : null}

          <Button
            title="Submit Complaint"
            onPress={handleSubmit}
            loading={isLoading}
            disabled={isLoading || isLocationLoading} // Disable if submitting or fetching location
            fullWidth
            size="lg"
            style={styles.submitButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16, // Reduced horizontal padding
    paddingVertical: 12, // Reduced vertical padding
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  backButton: {
     padding: 8, // Add padding for touch area
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.gray[900],
    textAlign: 'center', // Center title
    flex: 1, // Allow title to take space
  },
  placeholder: {
    width: 40, // Match back button width for balance
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40, // Ensure space below button
  },
  formContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 15, // Slightly smaller
    fontWeight: '600',
    color: colors.gray[700], // Darker gray
    marginBottom: 12,
    marginTop: 24, // Increased top margin
  },
  typeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10, // Increased gap
    marginBottom: 16, // Added margin below types
  },
  typeButton: {
    paddingHorizontal: 14, // Adjusted padding
    paddingVertical: 8, // Adjusted padding
    borderRadius: 20,
    backgroundColor: colors.gray[100], // Lighter background
    borderWidth: 1,
    borderColor: colors.gray[300],
  },
  typeButtonSelected: {
    backgroundColor: colors.primaryLight, // Use light primary for selected
    borderColor: colors.primary,
  },
  typeButtonText: {
    fontSize: 13, // Slightly smaller
    color: colors.gray[700],
  },
  typeButtonTextSelected: {
    color: colors.primary, // Primary color text when selected
     fontWeight: '600',
  },
  textAreaInput: {
    minHeight: 100, // Ensure min height
    textAlignVertical: 'top', // Explicitly set
    paddingTop: 12, // Add padding top inside textarea
    paddingBottom: 12,
    lineHeight: 20,
  },
  mediaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10, // Consistent gap
    marginBottom: 16, // Added margin below media
  },
  mediaItem: {
    position: 'relative',
  },
  mediaPreview: {
    width: 90, // Slightly smaller preview
    height: 90,
    borderRadius: 8,
    backgroundColor: colors.gray[100], // Placeholder bg
  },
  removeMediaButton: {
    position: 'absolute',
    top: -5, // Adjust position
    right: -5, // Adjust position
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Darker overlay
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1, // Ensure it's above image
  },
  addMediaButton: {
    width: 90, // Match preview size
    height: 90,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.gray[50], // Lighter background
  },
  addMediaText: {
    fontSize: 12,
    color: colors.gray[500],
    marginTop: 6, // Reduced margin
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray[300],
    marginBottom: 8, // Add margin below button
  },
  locationIcon: {
      marginRight: 10, // Increased margin
  },
  locationButtonText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500', // Make text slightly bolder
  },
  locationPreview: {
    marginTop: 8, // Reduced margin
    padding: 12,
    borderRadius: 8,
    backgroundColor: colors.gray[100],
    borderWidth: 1,
    borderColor: colors.gray[200],
    marginBottom: 16, // Add margin below preview
  },
  locationAddress: {
    fontSize: 13, // Slightly smaller
    color: colors.gray[700],
    lineHeight: 18, // Improve readability
  },
  inlineErrorText: {
     color: colors.error,
     fontSize: 12,
     marginTop: -12, // Adjust position to be below the input
     marginBottom: 12, // Space before next element
     marginLeft: 2,
  },
  submitButton: {
    marginTop: 32,
    marginBottom: 20,
  },
});