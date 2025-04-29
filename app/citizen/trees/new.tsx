import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, MapPin, ArrowLeft, X, TreePine, Info } from 'lucide-react-native'; // Added Info
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { colors } from '@/constants/Colors';
// Assuming you create a tree store similar to complaints store
// import { useTreeStore } from '@/store/tree-store';
import { useAuthStore } from '@/store/auth-store';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { Location as LocationType } from '@/types'; // Import Location type

// Placeholder store hook (replace with your actual store)
const useTreeStore = () => ({
    addTree: async (data: any) => {
        console.log("Adding Tree:", data);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
        return { id: `tree_${Date.now()}` }; // Simulate success response
    },
    isLoading: false
});

export default function NewTreeScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  // Replace with your actual tree store hook and methods
  const { addTree, isLoading } = useTreeStore();

  const [species, setSpecies] = useState('');
  const [notes, setNotes] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [location, setLocation] = useState<LocationType | null>(null);
  const [isLocationLoading, setIsLocationLoading] = useState(false);

  // Errors states are good practice but not used in validation logic below yet
  const [speciesError, setSpeciesError] = useState('');
  const [locationError, setLocationError] = useState('');
  const [imageError, setImageError] = useState(''); // Added image error

 const requestMediaPermissions = async () => {
     if (Platform.OS !== 'web') {
         const libraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
         // Optionally request camera permission too
         // const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
         if (libraryPermission.status !== 'granted') { // && cameraPermission.status !== 'granted'
             Alert.alert('Permission required', 'Media library permissions are needed to add a photo.');
             return false;
         }
     }
     return true;
   };

  const pickImage = async () => {
     const hasPermission = await requestMediaPermissions();
     if (!hasPermission) return;
     setImageError(''); // Clear previous error

     try {
       const result = await ImagePicker.launchImageLibraryAsync({
         mediaTypes: ImagePicker.MediaTypeOptions.Images,
         allowsEditing: true,
         aspect: [4, 3], // Landscape or portrait? Adjust as needed. [1,1] for square
         quality: 0.8,
       });

       if (!result.canceled && result.assets && result.assets.length > 0) {
         setImageUri(result.assets[0].uri);
       }
     } catch (error) {
       console.error("Image Picker Error:", error);
       setImageError("Could not select image.");
       Alert.alert("Error", "Could not select image.");
     }
   };

  const removeImage = () => {
    setImageUri(null);
    setImageError('');
  };

  const requestLocationPermission = async () => {
     const { status } = await Location.requestForegroundPermissionsAsync();
     if (status !== 'granted') {
         setLocationError('Location permission denied. Please enable it in settings.');
         Alert.alert('Permission Denied', 'Location permission is required to record the tree location.');
         return false;
     }
     return true;
   };


  const getCurrentLocation = async () => {
     const hasPermission = await requestLocationPermission();
     if (!hasPermission) return;

     setIsLocationLoading(true);
     setLocationError('');

     try {
       const currentLocation = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
       const { latitude, longitude } = currentLocation.coords;
       const addressResults = await Location.reverseGeocodeAsync({ latitude, longitude });

       let formattedAddress = 'Address not found';
        if (addressResults && addressResults.length > 0) {
           const adr = addressResults[0];
           const addressParts = [
               adr.name, adr.street, adr.city, adr.region, adr.postalCode, adr.country
           ].filter(part => part != null && part !== adr.name);
           formattedAddress = [adr.name, ...new Set(addressParts)].filter(Boolean).join(', ');
        }

       setLocation({ latitude, longitude, address: formattedAddress });
     } catch (error: any) {
       setLocationError('Failed to get current location. Ensure location services are enabled.');
       console.error('Error getting location:', error);
       Alert.alert("Location Error", "Could not fetch location.");
     } finally {
       setIsLocationLoading(false);
     }
   };

  const validateForm = () => {
    let isValid = true;
    setSpeciesError('');
    setLocationError('');
    setImageError(''); // Reset image error

    // Example: Make species optional, but location required
    // if (!species.trim()) {
    //   setSpeciesError('Tree species is required');
    //   isValid = false;
    // }

    if (!location) {
      setLocationError('Please add the tree\'s location');
      isValid = false;
    }

    // Example: Make image optional
    // if (!imageUri) {
    //   setImageError('Please add a photo of the tree');
    //   isValid = false;
    // }

    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm() || !user) return;
    if (isLoading || isLocationLoading) return;

    if (typeof addTree !== 'function') {
        console.error("addTree function is not available");
        Alert.alert("Error", "Tree recording service is unavailable.");
        return;
    }

    try {
      // Adapt this call to your actual addTree store function signature
      const newTreeData = {
        // *** FIX: Use 'userId' instead of 'citizenId' ***
        userId: user.id,
        treeName: species.trim() || 'Unknown', // Provide default if empty
        location: location!, // Already validated
        notes: notes.trim() || null,
        images: imageUri ? [imageUri] : [], // Pass image URI in an array as expected by TreeEntry
        plantedDate: new Date().getTime(), // Record planting time as timestamp
        // Default values for other TreeEntry fields if needed by store/backend
        wateringHistory: [],
        createdAt: new Date().getTime(),
        updatedAt: new Date().getTime(),
      };

      const newTree = await addTree(newTreeData);

      Alert.alert("Success", "Tree added successfully!");
      // Navigate back to the trees list, replacing current screen
      router.replace(`/citizen/trees`);
      // Or navigate to the new tree's detail page:
      // router.replace(`/citizen/trees/${newTree.id}`);

    } catch (error) {
      console.error('Error adding tree:', error);
      Alert.alert("Error", `Failed to add tree. ${error instanceof Error ? error.message : 'Please try again.'}`);
    }
  };

  const handleBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/citizen/trees'); // Fallback
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack} activeOpacity={0.7}>
          <ArrowLeft size={24} color={colors.gray[700]} />
        </TouchableOpacity>
        <Text style={styles.title}>Record New Tree</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.formContainer}>

          <View style={styles.imagePickerContainer}>
             <TouchableOpacity style={styles.imageButtonWrapper} onPress={pickImage} activeOpacity={0.7}>
                {imageUri ? (
                    <Image source={{ uri: imageUri }} style={styles.imagePreview} />
                ) : (
                    <View style={styles.addImageButton}>
                        <Camera size={32} color={colors.gray[500]} />
                        <Text style={styles.addImageText}>Add Tree Photo</Text>
                    </View>
                )}
             </TouchableOpacity>
             {imageUri && (
                 <TouchableOpacity style={styles.removeImageButton} onPress={removeImage} activeOpacity={0.7}>
                     <X size={16} color={colors.white} />
                 </TouchableOpacity>
             )}
             {imageError ? <Text style={[styles.inlineErrorText, { textAlign: 'center' }]}>{imageError}</Text> : null}
          </View>


          <Input
            label="Tree Species"
            placeholder="E.g., Mango, Neem (Optional)"
            value={species}
            onChangeText={setSpecies}
            error={speciesError} // Use error state if needed
            leftIcon={<TreePine size={20} color={colors.gray[500]} />}
          />
           {speciesError ? <Text style={styles.inlineErrorText}>{speciesError}</Text> : null}


          <Text style={styles.sectionTitle}>Location *</Text>
          <TouchableOpacity style={styles.locationButton} onPress={getCurrentLocation} activeOpacity={0.7} disabled={isLocationLoading}>
            {isLocationLoading ? <ActivityIndicator size="small" color={colors.primary} style={styles.locationIcon}/> : <MapPin size={20} color={colors.primary} style={styles.locationIcon}/>}
            <Text style={styles.locationButtonText}>
              {isLocationLoading ? 'Fetching Location...' : (location ? 'Update Tree Location' : 'Use Current Location')}
            </Text>
          </TouchableOpacity>
          {location && !isLocationLoading && (
            <View style={styles.locationPreview}>
              <Text style={styles.locationAddress} numberOfLines={2} ellipsizeMode="tail">{location.address}</Text>
            </View>
          )}
          {locationError ? <Text style={styles.inlineErrorText}>{locationError}</Text> : null}


          <Input
            label="Notes (Optional)"
            placeholder="Add any notes about the tree (e.g., age, condition)..."
            value={notes}
            onChangeText={setNotes}
            leftIcon={<Info size={20} color={colors.gray[500]} />} // Added Info icon
            multiline
            numberOfLines={4}
            containerStyle={{ minHeight: 90 }}
            inputStyle={styles.textAreaInput}
            textAlignVertical="top"
          />

          <Button
            title="Record Tree" // Changed button text
            onPress={handleSubmit}
            loading={isLoading}
            disabled={isLoading || isLocationLoading}
            fullWidth
            size="lg"
            style={styles.submitButton}
            // *** FIX: Removed invalid 'success' variant ***
            // variant='success' // Use a valid variant or remove for default
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.gray[200] },
  backButton: { padding: 8 },
  title: { fontSize: 18, fontWeight: '600', color: colors.gray[900], textAlign: 'center', flex: 1 },
  placeholder: { width: 40 },
  scrollContent: { padding: 20, paddingBottom: 40 },
  formContainer: { flex: 1 },
  sectionTitle: { fontSize: 15, fontWeight: '600', color: colors.gray[700], marginBottom: 12, marginTop: 24 },
  imagePickerContainer: { alignItems: 'center', marginBottom: 24, position: 'relative' }, // Added relative position
  imageButtonWrapper: { // Wrapper for the touchable area
      width: 120,
      height: 120,
      borderRadius: 60,
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden', // Clip the image/placeholder
      backgroundColor: colors.gray[100], // Background for placeholder state
      borderWidth: 1, // Add border to wrapper
      borderColor: colors.gray[300],
      borderStyle: 'dashed',
  },
  addImageButton: { // View inside wrapper for placeholder state
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: '100%',
  },
  addImageText: { fontSize: 14, color: colors.gray[500], marginTop: 8, textAlign: 'center' },
  imagePreview: { width: '100%', height: '100%', resizeMode: 'cover' },
  removeImageButton: {
      position: 'absolute',
      top: 0, // Position relative to imagePickerContainer
      right: '50%', // Adjust horizontal position
      marginRight: -70, // Fine-tune horizontal position (half of width + offset)
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: 'rgba(0,0,0,0.6)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1,
  },
  locationButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.gray[300], marginBottom: 8 },
  locationIcon: { marginRight: 10 },
  locationButtonText: { fontSize: 14, color: colors.primary, fontWeight: '500' },
  locationPreview: { marginTop: 8, padding: 12, borderRadius: 8, backgroundColor: colors.gray[100], borderWidth: 1, borderColor: colors.gray[200], marginBottom: 16 },
  locationAddress: { fontSize: 13, color: colors.gray[700], lineHeight: 18 },
  inlineErrorText: {
      color: colors.error,
      fontSize: 12,
      marginTop: 4, // Below the element
      marginBottom: 12, // Space before next element
      marginLeft: 2,
   },
  textAreaInput: { minHeight: 80, textAlignVertical: 'top', paddingTop: 10, paddingBottom: 10, lineHeight: 20 },
  submitButton: { marginTop: 32, marginBottom: 20 },
});