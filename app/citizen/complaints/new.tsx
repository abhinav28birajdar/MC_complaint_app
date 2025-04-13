import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, MapPin, ArrowLeft, X } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { colors } from '@/constants/Colors';
import { useComplaintsStore } from '@/store/complaints-store';
import { useAuthStore } from '@/store/auth-store';
import { ComplaintType } from '@/types';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';

export default function NewComplaintScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { addComplaint, isLoading } = useComplaintsStore();
  
  const [type, setType] = useState<ComplaintType>('garbage');
  const [description, setDescription] = useState('');
  const [media, setMedia] = useState<string[]>([]);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
    address: string;
  } | null>(null);
  
  const [descriptionError, setDescriptionError] = useState('');
  const [locationError, setLocationError] = useState('');

  const complaintTypes: { value: ComplaintType; label: string }[] = [
    { value: 'garbage', label: 'Garbage' },
    { value: 'waterLeakage', label: 'Water Leakage' },
    { value: 'streetlight', label: 'Streetlight' },
    { value: 'roadDamage', label: 'Road Damage' },
    { value: 'others', label: 'Others' },
  ];

  const pickImage = async () => {
    // Updated method: Use pickImage instead of launchImagePickerAsync
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setMedia([...media, result.assets[0].uri]);
    }
  };

  const removeImage = (index: number) => {
    const updatedMedia = [...media];
    updatedMedia.splice(index, 1);
    setMedia(updatedMedia);
  };

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        setLocationError('Permission to access location was denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      
      // Get address from coordinates
      const [address] = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });
      
      const formattedAddress = address 
        ? `${address.street || ''}, ${address.city || ''}, ${address.region || ''}, ${address.postalCode || ''}`
        : 'Unknown location';
      
      setLocation({
        latitude,
        longitude,
        address: formattedAddress,
      });
      
      setLocationError('');
    } catch (error) {
      setLocationError('Failed to get current location');
      console.error('Error getting location:', error);
    }
  };

  const validateForm = () => {
    let isValid = true;
    
    if (!description.trim()) {
      setDescriptionError('Please provide a description');
      isValid = false;
    } else {
      setDescriptionError('');
    }
    
    if (!location) {
      setLocationError('Please add your location');
      isValid = false;
    } else {
      setLocationError('');
    }
    
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm() || !user) return;
    
    try {
      const newComplaint = await addComplaint({
        type,
        description,
        location: location!,
        media,
        citizenId: user.id,
      });
      
      router.replace(`./citizen/complaints/${newComplaint.id}`);
    } catch (error) {
      console.error('Error submitting complaint:', error);
    }
  };

  const handleBack = () => {
    router.back();
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
        <Text style={styles.title}>File a Complaint</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Complaint Type</Text>
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
          
          <Text style={styles.sectionTitle}>Description</Text>
          <Input
            placeholder="Describe your complaint in detail..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={5}
            error={descriptionError}
          />
          
          <Text style={styles.sectionTitle}>Photos/Videos</Text>
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
          
          <Text style={styles.sectionTitle}>Location</Text>
          <TouchableOpacity
            style={styles.locationButton}
            onPress={getCurrentLocation}
            activeOpacity={0.7}
          >
            <MapPin size={20} color={colors.primary} />
            <Text style={styles.locationButtonText}>
              {location ? 'Update Current Location' : 'Use Current Location'}
            </Text>
          </TouchableOpacity>
          
          {location && (
            <View style={styles.locationPreview}>
              <Text style={styles.locationAddress}>{location.address}</Text>
            </View>
          )}
          
          {locationError ? (
            <Text style={styles.errorText}>{locationError}</Text>
          ) : null}
          
          <Button
            title="Submit Complaint"
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
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.gray[900],
  },
  placeholder: {
    width: 40,
  },
  scrollContent: {
    padding: 20,
  },
  formContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.gray[800],
    marginBottom: 12,
    marginTop: 20,
  },
  typeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.gray[200],
    marginBottom: 8,
  },
  typeButtonSelected: {
    backgroundColor: colors.primary,
  },
  typeButtonText: {
    fontSize: 14,
    color: colors.gray[700],
  },
  typeButtonTextSelected: {
    color: colors.white,
  },
  mediaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  mediaItem: {
    position: 'relative',
  },
  mediaPreview: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeMediaButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addMediaButton: {
    width: 100,
    height: 100,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  addMediaText: {
    fontSize: 12,
    color: colors.gray[500],
    marginTop: 8,
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
  },
  locationButtonText: {
    fontSize: 14,
    color: colors.primary,
    marginLeft: 8,
  },
  locationPreview: {
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
    backgroundColor: colors.gray[100],
  },
  locationAddress: {
    fontSize: 14,
    color: colors.gray[700],
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 4,
  },
  submitButton: {
    marginTop: 32,
    marginBottom: 20,
  },
});