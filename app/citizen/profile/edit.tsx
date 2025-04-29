import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User as UserIcon, Mail, Phone, MapPin, Home, Camera, X } from 'lucide-react-native'; // Renamed User import
import * as ImagePicker from 'expo-image-picker';
import { colors } from '@/constants/Colors';
import { useAuthStore } from '@/store/auth-store';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { User } from '@/types'; // Import User type if needed for clarity

export default function EditProfileScreen() {
  const router = useRouter();

  const { user, updateProfile, isLoading } = useAuthStore();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imageChanged, setImageChanged] = useState(false);

  const [nameError, setNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [pinCodeError, setPinCodeError] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
      setAddress(user.address || '');
      setPinCode(user.pinCode || '');
      setImageUri(user.profileImage || null);
      setImageChanged(false); // Reset changed status when user data loads/changes
    }
  }, [user]);

  const requestMediaPermissions = async () => {
     if (Platform.OS !== 'web') {
         const libraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
         const cameraPermission = await ImagePicker.requestCameraPermissionsAsync(); // Request camera too if you plan to allow taking photos
         if (libraryPermission.status !== 'granted' && cameraPermission.status !== 'granted') {
             Alert.alert('Permission required', 'Camera roll and/or camera permission is needed to update your profile picture.');
             return false;
         }
     }
     return true;
   };

  const pickImage = async () => {
     const hasPermission = await requestMediaPermissions();
     if (!hasPermission) return;

     // Optional: Show action sheet to choose Camera or Library
     // ... action sheet logic ...

     try {
       const result = await ImagePicker.launchImageLibraryAsync({
         mediaTypes: ImagePicker.MediaTypeOptions.Images,
         allowsEditing: true, // Allow cropping/editing
         aspect: [1, 1], // Force square aspect ratio
         quality: 0.7, // Reduce quality slightly for smaller file size
       });

       if (!result.canceled && result.assets && result.assets.length > 0) {
         setImageUri(result.assets[0].uri);
         setImageChanged(true); // Mark that image has been changed
       }
     } catch (error) {
       console.error("Image Picker Error:", error);
       Alert.alert("Error", "Could not select image.");
     }
   };

   const removeImage = () => {
     setImageUri(null);
     setImageChanged(true); // Mark that image has been changed (to null)
   }

  const validateForm = () => {
    let isValid = true;
    setNameError('');
    setPhoneError('');
    setPinCodeError('');

    if (!name.trim()) {
      setNameError('Name is required');
      isValid = false;
    } else if (name.trim().length < 2) {
      setNameError('Name should be at least 2 characters');
      isValid = false;
    }

    // Validate phone only if it's not empty
    if (phone.trim() && !/^\d{10}$/.test(phone.trim())) {
      setPhoneError('If provided, phone must be a valid 10-digit number');
      isValid = false;
    }
    // Validate PIN code only if it's not empty
    if (pinCode.trim() && !/^\d{6}$/.test(pinCode.trim())) {
      setPinCodeError('If provided, PIN code must be a valid 6-digit number');
      isValid = false;
    }
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm() || !user) return;
    if (isLoading) return;

    // Ensure updateProfile exists
    if (typeof updateProfile !== 'function') {
        console.error("updateProfile function is not available in useAuthStore");
        Alert.alert("Error", "Profile update service is unavailable.");
        return;
    }

    try {
      await updateProfile({
        id: user.id,
        name: name.trim(),
        phone: phone.trim() || null, // Send null if empty string
        address: address.trim() || null,
        pinCode: pinCode.trim() || null,
        // Only include profileImageUri if it actually changed
        profileImageUri: imageChanged ? imageUri : undefined,
      });

      Alert.alert("Success", "Profile updated successfully!");
      setImageChanged(false); // Reset image changed flag after successful update
      if (router.canGoBack()) {
         router.back(); // Go back to the previous screen (likely profile screen)
      } else {
         // Fallback if cannot go back (e.g., deep link directly to edit)
         router.replace(`./${user.role}/profile`);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert("Error", `Failed to update profile. ${error instanceof Error ? error.message : 'Please try again.'}`);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar style="dark" />
      {/* Header is handled by the stack navigator in _layout.tsx */}

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.formContainer}>
          <View style={styles.profilePicContainer}>
            <View style={styles.imageWrapper}>
                {imageUri ? (
                   <Image source={{ uri: imageUri }} style={styles.profileImage} />
                ) : (
                  <View style={styles.profileImagePlaceholder}>
                      <UserIcon size={40} color={colors.gray[400]} />
                  </View>
                )}
                {imageUri && (
                   <TouchableOpacity style={styles.removeImageButton} onPress={removeImage} activeOpacity={0.7}>
                      <X size={16} color={colors.white} />
                    </TouchableOpacity>
                )}
             </View>
              <TouchableOpacity style={styles.changePicButton} onPress={pickImage} activeOpacity={0.7}>
                  <Camera size={16} color={colors.primary} />
                  <Text style={styles.changePicButtonText}>{imageUri ? 'Change Photo' : 'Add Photo'}</Text>
              </TouchableOpacity>
          </View>


          <Input
            label="Email" // Simplified label
            value={user?.email || ''}
            editable={false} // Make email non-editable
            leftIcon={<Mail size={20} color={colors.gray[400]} />} // Dim icon
            // *** FIX: Provide dummy onChangeText for disabled input ***
            onChangeText={() => {}} // Required prop, even if disabled
            inputStyle={styles.disabledInput}
            containerStyle={styles.disabledInputContainer}
            labelStyle={styles.disabledLabel} // Style for label too
          />

          <Input
            label="Full Name *"
            placeholder="Enter your full name"
            value={name}
            onChangeText={setName}
            error={nameError}
            leftIcon={<UserIcon size={20} color={colors.gray[500]} />}
            autoCapitalize="words"
            textContentType="name" // Help password managers
          />
           {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}


          <Input
            label="Phone Number"
            placeholder="Enter 10-digit number (Optional)"
            value={phone}
            onChangeText={setPhone}
            error={phoneError}
            keyboardType="phone-pad"
            leftIcon={<Phone size={20} color={colors.gray[500]} />}
            maxLength={10}
            textContentType="telephoneNumber"
          />
          {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}


          {/* Address and PIN only for citizens - Conditionally render */}
           {user?.role === 'citizen' && (
              <>
                  <Input
                     label="Address"
                     placeholder="Enter your full address (Optional)"
                     value={address}
                     onChangeText={setAddress}
                     multiline
                     numberOfLines={3}
                     leftIcon={<MapPin size={20} color={colors.gray[500]} />}
                     containerStyle={{ minHeight: 80, marginBottom: 16 }} // Ensure margin
                     inputStyle={styles.textAreaInput} // Use specific style
                     textAlignVertical="top"
                   />
                    {/* No error prop needed if not validated */}

                   <Input
                     label="PIN Code"
                     placeholder="Enter 6-digit PIN (Optional)"
                     value={pinCode}
                     onChangeText={setPinCode}
                     error={pinCodeError}
                     keyboardType="numeric"
                     leftIcon={<Home size={20} color={colors.gray[500]} />}
                     maxLength={6}
                     textContentType="postalCode"
                   />
                  {pinCodeError ? <Text style={styles.errorText}>{pinCodeError}</Text> : null}

             </>
           )}

          <Button
            title="Save Changes"
            onPress={handleSubmit}
            loading={isLoading}
            disabled={isLoading}
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
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: 24, paddingBottom: 40 },
  formContainer: { flex: 1 },
   profilePicContainer: { alignItems: 'center', marginBottom: 32 },
   imageWrapper: {
       width: 100,
       height: 100,
       borderRadius: 50,
       marginBottom: 12, // Space before button
       position: 'relative', // Needed for absolute positioning of remove button
       backgroundColor: colors.gray[200], // Background for placeholder
       justifyContent: 'center',
       alignItems: 'center',
       overflow: 'hidden', // Clip image to circle
   },
   profileImage: { width: '100%', height: '100%' },
   profileImagePlaceholder: { /* Placeholder content is inside wrapper */ },
   removeImageButton: {
       position: 'absolute',
       top: 0,
       right: 0,
       width: 28,
       height: 28,
       borderRadius: 14,
       backgroundColor: 'rgba(0,0,0,0.6)',
       justifyContent: 'center',
       alignItems: 'center',
       zIndex: 1,
   },
   changePicButton: {
       flexDirection: 'row',
       alignItems: 'center',
       paddingVertical: 6,
       paddingHorizontal: 12,
       borderRadius: 16,
       backgroundColor: colors.primaryLight,
   },
   changePicButtonText: { color: colors.primary, marginLeft: 6, fontSize: 13, fontWeight: '500' },
   disabledInput: { color: colors.gray[500] }, // Style for disabled text
   disabledInputContainer: { backgroundColor: colors.gray[100], borderColor: colors.gray[300] }, // Style for disabled background
   disabledLabel: { color: colors.gray[500] }, // Style for disabled label
   textAreaInput: { minHeight: 80, textAlignVertical: 'top', paddingTop: 10, paddingBottom: 10 },
   errorText: {
      color: colors.error,
      fontSize: 12,
      marginTop: -10, // Pull error text up closer to the input
      marginBottom: 10, // Add space before next input
      marginLeft: 2
    },
  submitButton: { marginTop: 24 },
});