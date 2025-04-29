import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin, ArrowLeft, Calendar, Clock } from 'lucide-react-native';
import { colors } from '@/constants/Colors';
// Create and import a recycle store
// import { useRecycleStore } from '@/store/recycle-store';
import { useAuthStore } from '@/store/auth-store';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
// You might want a DateTimePicker component
// import DateTimePicker from '@react-native-community/datetimepicker';

// Placeholder store hook
const useRecycleStore = () => ({ addRequest: async (data: any) => { console.log("Add Request:", data); return { id: 'new123' }; }, isLoading: false });

export default function NewRecycleRequestScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  // Use your actual recycle store hook
  const { addRequest, isLoading } = useRecycleStore();

  const [address, setAddress] = useState(user?.address || ''); // Pre-fill from user profile if available
  const [notes, setNotes] = useState('');
  // Add state for preferred date/time if needed
  // const [preferredDate, setPreferredDate] = useState(new Date());
  // const [showDatePicker, setShowDatePicker] = useState(false);

  const [addressError, setAddressError] = useState('');

  useEffect(() => {
      // Pre-fill address when user data becomes available
      if (user?.address && !address) {
          setAddress(user.address);
      }
  }, [user]);


  const validateForm = () => {
    let isValid = true;
    setAddressError('');

    if (!address.trim()) {
      setAddressError('Pickup address is required');
      isValid = false;
    }
    // Add validation for date/time if using
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm() || !user) return;
    if (isLoading) return;

    try {
      const newRequest = await addRequest({
        citizenId: user.id,
        address: address.trim(),
        notes: notes.trim(),
        // preferredDate: preferredDate, // Add if using date picker
        status: 'requested', // Initial status
      });

      Alert.alert("Success", "Recycling pickup requested successfully!");
      router.replace(`./citizen/recycle`); // Navigate back to the list
    } catch (error) {
      console.error('Error requesting pickup:', error);
      Alert.alert("Error", "Failed to request pickup. Please try again.");
    }
  };

  const handleBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('./citizen/recycle');
  };

   // Placeholder for date change handler
   // const onDateChange = (event: any, selectedDate?: Date) => {
   //   const currentDate = selectedDate || preferredDate;
   //   setShowDatePicker(Platform.OS === 'ios'); // Keep open on iOS
   //   setPreferredDate(currentDate);
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
            containerStyle={{ minHeight: 80 }}
            textAlignVertical="top"
          />

          {/* Add Date/Time Picker Here if needed */}
          {/* <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
            <Calendar size={20} color={colors.primary} />
            <Text style={styles.dateText}>Preferred Date: {preferredDate.toLocaleDateString()}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={preferredDate}
              mode="date" // or "time" or "datetime"
              display="default" // or "spinner"
              onChange={onDateChange}
              minimumDate={new Date()} // Prevent selecting past dates
            />
          )} */}


          <Input
            label="Notes (Optional)"
            placeholder="E.g., 'Leave bags near the gate', 'Approx 5 bags'"
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
            containerStyle={{ minHeight: 80 }}
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
            variant='accent' // Use accent color for recycle
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.gray[200] },
  backButton: { width: 40, height: 40, justifyContent: 'center' },
  title: { fontSize: 18, fontWeight: '600', color: colors.gray[900], textAlign: 'center', flex: 1 },
  placeholder: { width: 40 },
  scrollContent: { padding: 20, paddingBottom: 40 },
  formContainer: { flex: 1 },
   dateButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.gray[300], marginBottom: 20 },
   dateText: { fontSize: 14, color: colors.primary, marginLeft: 8 },
  errorText: { color: colors.error, fontSize: 12, marginTop: 4, marginLeft: 2 },
  submitButton: { marginTop: 32, marginBottom: 20 },
});