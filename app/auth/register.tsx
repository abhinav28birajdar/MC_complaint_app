// src/app/auth/register.tsx (or relevant path)

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native'; // Added Alert
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, Lock, User, ArrowLeft, Phone, MapPin, Home } from 'lucide-react-native';
import { colors } from '@/constants/Colors'; // Adjust path
import { useAuthStore } from '@/store/auth-store'; // Adjust path
import { UserRole } from '@/types'; // Adjust path
import Input from '@/components/Input'; // Adjust path
import Button from '@/components/Button'; // Adjust path

export default function RegisterScreen() {
  const router = useRouter();
  const { role = 'citizen' } = useLocalSearchParams<{ role?: UserRole }>();
  const { register, isLoading, error, clearError } = useAuthStore();

  // State for form inputs
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState(''); // Keep state for the form input field
  const [address, setAddress] = useState(''); // Keep state for the form input field
  const [pinCode, setPinCode] = useState(''); // Keep state for the form input field
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // State for validation errors
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [addressError, setAddressError] = useState('');
  const [pinCodeError, setPinCodeError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  // Form validation function
  const validateForm = () => {
    let isValid = true;
    clearError(); // Clear previous backend errors first

    // Reset all validation error messages
    setNameError('');
    setEmailError('');
    setPhoneError('');
    setAddressError('');
    setPinCodeError('');
    setPasswordError('');
    setConfirmPasswordError('');

    // --- Required fields for registration ---
    if (!name.trim()) {
      setNameError('Name is required');
      isValid = false;
    }

    if (!email.trim()) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      isValid = false;
    }

    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your password');
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      isValid = false;
    }

    // --- Optional fields validation (only validate if filled, don't block submission) ---
    // These fields are NOT sent during initial registration anymore but are kept in the form.
    // Validate them to guide the user, but don't set `isValid = false` here
    // unless you *want* to force the user to fill them correctly on this screen.
    if (phone.trim() && !/^\d{10}$/.test(phone.trim())) {
      setPhoneError('If provided, phone must be a valid 10-digit number');
      // isValid = false; // Optional: Uncomment to make phone format mandatory if filled
    }

    if (role === 'citizen') {
        if (address.trim() && address.trim().length < 10) { // Example: Min length check
            setAddressError('If provided, address should be more detailed');
             // isValid = false; // Optional: Uncomment to make address format mandatory if filled
        }
      if (pinCode.trim() && !/^\d{6}$/.test(pinCode.trim())) {
        setPinCodeError('If provided, PIN code must be a valid 6-digit number');
        // isValid = false; // Optional: Uncomment to make PIN code format mandatory if filled
      }
    }

    return isValid; // Returns true only if required fields (name, email, password) are valid
  };

  // --- MODIFIED handleRegister function ---
  const handleRegister = async () => {
    if (validateForm()) { // Only proceed if basic validation passes
      try {
        // Call the register function from the store
        // Pass only the essential information: name, email, password, role
        const { requiresConfirmation } = await register(
          name.trim(),
          email.trim().toLowerCase(), // Normalize email
          password,
          role // Pass the selected role
          // *** NO address, phone, or pinCode passed here ***
        );

        // Show a message indicating profile needs completion later (optional)
        // Alert.alert(
        //   "Registration Initiated",
        //   "Please remember to complete your profile details (like address and phone) in your settings later."
        // );

        // Navigate based on whether email confirmation is required
        if (requiresConfirmation) {
          console.log('Navigating to confirm-pending for:', email.trim().toLowerCase());
          // Navigate to the screen prompting the user to check their email
          router.replace({
            pathname: '/auth/confirm-pending',
            params: { email: email.trim().toLowerCase() } // Pass email for resend functionality
          });
        } else {
           console.log('Registration successful (no confirmation needed), navigating to dashboard:', `/${role}`);
           // Navigate directly to the user's dashboard based on their role
           // The user object in the store will have basic details for now.
           router.replace(`/${role}`); // e.g., /citizen, /employee
        }
      } catch (err) {
        // Errors caught here are likely those re-thrown from the authStore
        console.error('Registration Screen Error Handler:', err);
        // The error message should be displayed automatically via the {error} state variable from the store
        // You could potentially show an Alert here too, but the {error} text display is usually sufficient.
        // Alert.alert("Registration Failed", error?.message || "An unexpected error occurred.");
      }
    } else {
        // If validation fails, maybe scroll to the first error or show a general message
        Alert.alert("Validation Failed", "Please check the form for errors.");
    }
  };

  // handleLogin function remains the same
  const handleLogin = () => {
    router.push({
      pathname: '/auth/login',
      params: { role }
    });
  };

  // handleBack function remains the same
  const handleBack = () => {
    if (router.canGoBack()) {
         router.back();
     } else {
         // Fallback if cannot go back (e.g., deep link entry)
         router.replace('/auth/role-selection'); // Or '/'
     }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar style="dark" />

       {/* Header Section */}
       <View style={styles.headerContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
            activeOpacity={0.7}
          >
            <ArrowLeft size={24} color={colors.gray[700]} />
          </TouchableOpacity>
          <View style={styles.header}>
            <Text style={styles.title}>Create Account ({role.charAt(0).toUpperCase() + role.slice(1)})</Text>
            <Text style={styles.subtitle}>
              Fill in the required details below.
            </Text>
          </View>
          {/* Spacer View to balance the back button */}
          <View style={styles.backButton} />
      </View>

      {/* Form Section */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.formContainer}>
          {/* Required Fields */}
          <Input
            label="Full Name *"
            placeholder="Enter your full name"
            value={name}
            onChangeText={setName}
            error={nameError}
            leftIcon={<User size={20} color={colors.gray[500]} />}
            autoCapitalize="words"
            autoComplete="name" // Add autocomplete hint
          />

          <Input
            label="Email *"
            placeholder="Enter your email"
            value={email}
            onChangeText={(text) => setEmail(text.toLowerCase())}
            error={emailError}
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon={<Mail size={20} color={colors.gray[500]} />}
            autoComplete="email" // Add autocomplete hint
          />

          <Input
            label="Password *"
            placeholder="Minimum 6 characters"
            value={password}
            onChangeText={setPassword}
            secureTextEntry // Handled internally by Input component
            error={passwordError}
            leftIcon={<Lock size={20} color={colors.gray[500]} />}
            autoComplete="password-new" // Hint for password managers
          />

          <Input
            label="Confirm Password *"
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry // Handled internally by Input component
            error={confirmPasswordError}
            leftIcon={<Lock size={20} color={colors.gray[500]} />}
          />

          {/* Optional Fields (kept in form, but not sent on initial register) */}
          <Text style={styles.optionalFieldsHeader}>Optional Details (Complete in Profile Later)</Text>
          <Input
            label="Phone Number" // Removed asterisk
            placeholder="Enter 10-digit number"
            value={phone}
            onChangeText={setPhone}
            error={phoneError}
            keyboardType="phone-pad"
            leftIcon={<Phone size={20} color={colors.gray[500]} />}
            maxLength={10}
            autoComplete="tel" // Add autocomplete hint
          />

          {role === 'citizen' && (
            <>
              <Input
                label="Address" // Removed asterisk
                placeholder="Enter your full address"
                value={address}
                onChangeText={setAddress}
                error={addressError}
                multiline
                numberOfLines={3}
                leftIcon={<MapPin size={20} color={colors.gray[500]} />}
                containerStyle={{ minHeight: 80 }}
                textAlignVertical="top"
                autoComplete="street-address" // Add autocomplete hint
              />

              <Input
                label="PIN Code" // Removed asterisk
                placeholder="Enter 6-digit PIN"
                value={pinCode}
                onChangeText={setPinCode}
                error={pinCodeError}
                keyboardType="numeric"
                leftIcon={<Home size={20} color={colors.gray[500]} />}
                maxLength={6}
                autoComplete="postal-code" // Add autocomplete hint
              />
            </>
          )}

          {/* Display backend/process errors */}
          {error && (
            <Text style={styles.errorText}>{error}</Text>
          )}

          {/* Submit Button */}
          <Button
            title="Register"
            onPress={handleRegister}
            loading={isLoading}
            disabled={isLoading}
            fullWidth
            size="lg"
            style={styles.registerButton}
          />

          {/* Link to Login */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account?</Text>
            <TouchableOpacity onPress={handleLogin}>
              <Text style={styles.loginLink}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Styles need to be defined (using the previous StyleSheet)
const styles = StyleSheet.create({
   container: {
     flex: 1,
     backgroundColor: colors.background,
   },
   headerContainer: {
       flexDirection: 'row',
       alignItems: 'center',
       paddingHorizontal: 24,
       paddingTop: Platform.OS === 'ios' ? 10 : 16, // Adjust top padding
       paddingBottom: 16,
       borderBottomWidth: 1, // Optional: add a subtle separator
       borderBottomColor: colors.gray[200], // Optional: separator color
   },
   backButton: {
       padding: 8,
       // Ensure touch target is good size
       minWidth: 40,
       minHeight: 40,
       justifyContent: 'center',
       alignItems: 'flex-start',
   },
   header: {
      flex: 1,
      alignItems: 'center',
      paddingHorizontal: 8, // Give text some space from icons/edges
   },
   title: {
     fontSize: 22, // Slightly adjust size if needed
     fontWeight: 'bold',
     color: colors.gray[900],
     marginBottom: 4,
     textAlign: 'center',
   },
   subtitle: {
     fontSize: 14,
     color: colors.gray[600],
     lineHeight: 20,
     textAlign: 'center',
   },
   scrollContent: {
       paddingHorizontal: 24,
       paddingBottom: 40, // Space at the bottom
   },
   formContainer: {
       paddingTop: 24, // Space below header
   },
   optionalFieldsHeader: {
       fontSize: 14,
       color: colors.gray[600],
       fontWeight: '500',
       marginTop: 24,
       marginBottom: 8,
       borderTopWidth: 1,
       borderTopColor: colors.gray[200],
       paddingTop: 16,
   },
   registerButton: {
     marginTop: 32, // More space before final button
   },
   errorText: {
     color: colors.error,
     marginBottom: 16,
     textAlign: 'center',
     fontSize: 14,
   },
   loginContainer: {
     flexDirection: 'row',
     justifyContent: 'center',
     alignItems: 'center',
     marginTop: 24,
     marginBottom: 20,
   },
   loginText: {
     color: colors.gray[600],
     marginRight: 4,
     fontSize: 14,
   },
   loginLink: {
     color: colors.primary,
     fontWeight: '600',
     fontSize: 14,
     paddingVertical: 4, // Increase touch area slightly
   },
 });