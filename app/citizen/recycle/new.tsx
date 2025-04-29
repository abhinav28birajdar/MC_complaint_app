import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin, ArrowLeft, Calendar, Clock, Info } from 'lucide-react-native'; // Added Info icon
import { colors } from '@/constants/Colors';
// Create and import a recycle store if you have one
// Example: import { useRecycleStore } from '@/store/recycle-store';
import { useAuthStore } from '@/store/auth-store';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
// Import DateTimePicker if using
// import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

// Placeholder store hook (replace with your actual store)
const useRecycleStore = () => ({
    addRequest: async (data: any) => {
        console.log("Add Request:", data);
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Simulate success response
        return { id: `recycle_${Date.now()}` };
    },
    isLoading: false
});

export default function NewRecycleRequestScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  // Use your actual recycle store hook
  const { addRequest, isLoading } = useRecycleStore();

  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  // State for preferred date/time (optional)
  // const [preferredDate, setPreferredDate] = useState(new Date());
  // const [showDatePicker, setShowDatePicker] = useState(false);

  const [addressError, setAddressError] = useState('');

  // Pre-fill address from user profile when available
  useEffect(() => {
      if (user?.address) {
          setAddress(user.address);
      }
  }, [user]); // Rerun effect if user object changes


  const validateForm = () => {
    let isValid = true;
    setAddressError('');

    if (!address.trim()) {
      setAddressError('Pickup address is required');
      isValid = false;
    } else if (address.trim().length < 10) {
      setAddressError('Please provide a more detailed address');
      isValid = false;
    }
    // Add validation for date/time if using
    // if (preferredDate <= new Date()) { // Basic check if date is in the past
    //   Alert.alert("Invalid Date", "Please select a future date for pickup.");
    //   isValid = false;
    // }
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm() || !user) return;
    if (isLoading) return; // Prevent double submission

    // Ensure addRequest is available
    if (typeof addRequest !== 'function') {
        console.error("addRequest function is not available");
        Alert.alert("Error", "Recycling request service is unavailable.");
        return;
    }

    try {
      const newRequestData = {
        citizenId: user.id,
        address: address.trim(),
        notes: notes.trim() || null, // Send null if notes are empty
        // preferredDate: preferredDate, // Add if using date picker
        requestedAt: new Date().toISOString(), // Add timestamp for request
        status: 'requested', // Initial status
      };

      const newRequest = await addRequest(newRequestData);

      Alert.alert("Success", "Recycling pickup requested successfully!");
      // Navigate back to the recycle list screen, replacing the current screen
      router.replace(`./citizen/recycle`);

    } catch (error) {
      console.error('Error requesting pickup:', error);
      Alert.alert("Error", `Failed to request pickup. ${error instanceof Error ? error.message : 'Please try again.'}`);
    }
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      // Fallback if cannot go back (e.g., direct link)
      router.replace('./citizen/recycle');
    }
  };

   // Placeholder for date change handler
   // const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
   //   const currentDate = selectedDate || preferredDate;
   //   // On Android, the picker closes automatically. On iOS, we need to close it.
   //   setShowDatePicker(Platform.OS === 'ios');
   //   if (event.type === 'set' && selectedDate) { // Check if a date was selected ('set')
   //       setPreferredDate(currentDate);
   //   } else {
   //       // Handle 'dismissed' event if needed
   //   }
   // };

   // const showMode = (currentMode: 'date' | 'time') => {
   //   setShowDatePicker(true);
   //   // setMode(currentMode); // If you need to switch between date/time
   // };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack} activeOpacity={0.7}>
          <ArrowLeft size={24} color={colors.gray[700]} />
        </TouchableOpacity>
        <Text style={styles.title}>Request Recycling Pickup</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.formContainer}>

          <Input
            label="Pickup Address *"
            placeholder="Enter the full address for pickup"
            value={address}
            onChangeText={setAddress}
            error={addressError}
            leftIcon={<MapPin size={20} color={colors.gray[500]} />}
            multiline
            numberOfLines={3}
            containerStyle={{ minHeight: 80, marginBottom: 16 }} // Added margin
            inputStyle={styles.textAreaInput}
            textAlignVertical="top"
            textContentType="fullStreetAddress" // Autocomplete hint
          />
           {addressError ? <Text style={styles.inlineErrorText}>{addressError}</Text> : null}


          {/* Add Date/Time Picker Here if needed */}
          {/* <Text style={styles.label}>Preferred Pickup Date (Optional)</Text>
          <TouchableOpacity onPress={() => showMode('date')} style={styles.dateButton}>
            <Calendar size={20} color={colors.primary} style={{ marginRight: 8 }}/>
            <Text style={styles.dateText}>{preferredDate.toLocaleDateString()}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              testID="dateTimePicker"
              value={preferredDate}
              mode="date" // or "time" or "datetime"
              is24Hour={true} // Optional
              display="default" // "default", "spinner", "calendar", "clock"
              onChange={onDateChange}
              minimumDate={new Date()} // Prevent selecting past dates
            />
          )} */}


          <Input
            label="Notes (Optional)"
            placeholder="E.g., 'Leave bags near the gate', 'Approx 5 bags of plastic'"
            value={notes}
            onChangeText={setNotes}
            leftIcon={<Info size={20} color={colors.gray[500]} />} // Added Info icon
            multiline
            numberOfLines={4}
            containerStyle={{ minHeight: 90 }} // Slightly taller
            inputStyle={styles.textAreaInput}
            textAlignVertical="top"
          />

          <Button
            title="Submit Request"
            onPress={handleSubmit}
            loading={isLoading}
            disabled={isLoading}
            fullWidth
            size="lg"
            style={styles.submitButton}
            // *** FIX: Removed invalid 'accent' variant ***
            // variant='accent' // Use a valid variant like 'primary' or remove for default
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
  placeholder: { width: 40 }, // Match back button touch area roughly
  scrollContent: { padding: 20, paddingBottom: 40 },
  formContainer: { flex: 1 },
  label: { // Style for labels if Input component doesn't have one built-in
     fontSize: 14,
     fontWeight: '500',
     color: colors.gray[700],
     marginBottom: 8,
  },
  textAreaInput: { // Specific style for multiline inputs
      minHeight: 80,
      textAlignVertical: 'top',
      paddingTop: 10,
      paddingBottom: 10,
      lineHeight: 20,
  },
   dateButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      backgroundColor: colors.white,
      borderWidth: 1,
      borderColor: colors.gray[300],
      marginBottom: 24, // Space after date picker
   },
   dateText: {
      fontSize: 16, // Larger date text
      color: colors.gray[800], // Darker text
      marginLeft: 8,
   },
  inlineErrorText: {
      color: colors.error,
      fontSize: 12,
      marginTop: -12, // Adjust to be below input
      marginBottom: 12, // Space before next element
      marginLeft: 2,
   },
  submitButton: { marginTop: 32, marginBottom: 20 },
});