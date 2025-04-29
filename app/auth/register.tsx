import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, Lock, User, ArrowLeft, Phone, MapPin, Home } from 'lucide-react-native';
import { colors } from '@/constants/Colors';
import { useAuthStore } from '@/store/auth-store';
import { UserRole } from '@/types';
import Input from '@/components/Input';
import Button from '@/components/Button';

export default function RegisterScreen() {
  const router = useRouter();
  const { role = 'citizen' } = useLocalSearchParams<{ role?: UserRole }>();
  const { register, isLoading, error, clearError } = useAuthStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [addressError, setAddressError] = useState('');
  const [pinCodeError, setPinCodeError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const validateForm = () => {
    let isValid = true;
    clearError();

    setNameError('');
    setEmailError('');
    setPhoneError('');
    setAddressError('');
    setPinCodeError('');
    setPasswordError('');
    setConfirmPasswordError('');

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

    if (phone.trim() && !/^\d{10}$/.test(phone.trim())) {
      setPhoneError('If provided, phone must be a valid 10-digit number');
    }

    if (role === 'citizen') {
        if (address.trim() && address.trim().length < 5) {
            setAddressError('If provided, address should be more detailed');
        }
      if (pinCode.trim() && !/^\d{6}$/.test(pinCode.trim())) {
        setPinCodeError('If provided, PIN code must be a valid 6-digit number');
      }
    }

    return isValid;
  };

  const handleRegister = async () => {
    if (validateForm()) {
      try {
        const { requiresConfirmation } = await register(
          name.trim(),
          email.trim().toLowerCase(),
          password,
          role
        );

        if (requiresConfirmation) {
          console.log('Navigating to confirm-pending for:', email.trim().toLowerCase());
          router.replace({
            pathname: '/auth/confirm-pending',
            params: { email: email.trim().toLowerCase() }
          });
        } else {
           console.log('Registration successful (no confirmation needed), navigating to dashboard:', `/${role}`);
           router.replace(`/${role}`);
        }
      } catch (err) {
        console.error('Registration Screen Error Handler:', err);
      }
    } else {
        Alert.alert("Validation Failed", "Please check the form for errors.");
    }
  };

  const handleLogin = () => {
    router.push({
      pathname: '/auth/login',
      params: { role }
    });
  };

  const handleBack = () => {
    if (router.canGoBack()) {
         router.back();
     } else {
         router.replace('/auth/role-selection');
     }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar style="dark" />

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
          <View style={styles.backButtonPlaceholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.formContainer}>
          <Input
            label="Full Name *"
            placeholder="Enter your full name"
            value={name}
            onChangeText={setName}
            error={nameError}
            leftIcon={<User size={20} color={colors.gray[500]} />}
            autoCapitalize="words"
            autoComplete="name"
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
            autoComplete="email"
          />

          <Input
            label="Password *"
            placeholder="Minimum 6 characters"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            error={passwordError}
            leftIcon={<Lock size={20} color={colors.gray[500]} />}
            autoComplete="password-new"
          />

          <Input
            label="Confirm Password *"
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            error={confirmPasswordError}
            leftIcon={<Lock size={20} color={colors.gray[500]} />}
          />

          <Text style={styles.optionalFieldsHeader}>Optional Details (Complete in Profile Later)</Text>
          <Input
            label="Phone Number"
            placeholder="Enter 10-digit number"
            value={phone}
            onChangeText={setPhone}
            error={phoneError}
            keyboardType="phone-pad"
            leftIcon={<Phone size={20} color={colors.gray[500]} />}
            maxLength={10}
            autoComplete="tel"
          />

          {role === 'citizen' && (
            <>
              <Input
                label="Address"
                placeholder="Enter your full address"
                value={address}
                onChangeText={setAddress}
                error={addressError}
                multiline
                numberOfLines={3}
                leftIcon={<MapPin size={20} color={colors.gray[500]} />}
                containerStyle={{ minHeight: 80 }}
                textAlignVertical="top"
                autoComplete="street-address"
              />

              <Input
                label="PIN Code"
                placeholder="Enter 6-digit PIN"
                value={pinCode}
                onChangeText={setPinCode}
                error={pinCodeError}
                keyboardType="numeric"
                leftIcon={<Home size={20} color={colors.gray[500]} />}
                maxLength={6}
                autoComplete="postal-code"
              />
            </>
          )}

          {error && (
            <Text style={styles.errorText}>{error}</Text>
          )}

          <Button
            title="Register"
            onPress={handleRegister}
            loading={isLoading}
            disabled={isLoading}
            fullWidth
            size="lg"
            style={styles.registerButton}
          />

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

const styles = StyleSheet.create({
   container: {
     flex: 1,
     backgroundColor: colors.background,
   },
   headerContainer: {
       flexDirection: 'row',
       alignItems: 'center',
       paddingHorizontal: 24,
       paddingTop: Platform.OS === 'ios' ? 10 : 16,
       paddingBottom: 16,
       borderBottomWidth: 1,
       borderBottomColor: colors.gray[200],
   },
   backButton: {
       padding: 8,
       minWidth: 40,
       minHeight: 40,
       justifyContent: 'center',
       alignItems: 'flex-start',
   },
   backButtonPlaceholder: { // Added to balance the header
       minWidth: 40,
   },
   header: {
      flex: 1,
      alignItems: 'center',
      paddingHorizontal: 8,
   },
   title: {
     fontSize: 22,
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
       paddingBottom: 40,
   },
   formContainer: {
       paddingTop: 24,
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
     marginTop: 32,
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
     paddingVertical: 4,
   },
 });