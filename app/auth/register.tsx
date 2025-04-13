import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, Lock, User, ArrowLeft, Phone, MapPin } from 'lucide-react-native';
import { colors } from '@/constants/Colors';
import { useAuthStore } from '@/store/auth-store';
import { UserRole } from '@/types';
import Input from '@/components/Input';
import Button from '@/components/Button';

export default function RegisterScreen() {
  const router = useRouter();
  const { role } = useLocalSearchParams<{ role: UserRole }>();
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
    
    if (!name) {
      setNameError('Name is required');
      isValid = false;
    } else {
      setNameError('');
    }
    
    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email');
      isValid = false;
    } else {
      setEmailError('');
    }
    
    if (phone && !/^\d{10}$/.test(phone)) {
      setPhoneError('Please enter a valid 10-digit phone number');
      isValid = false;
    } else {
      setPhoneError('');
    }
    
    if (role === 'citizen' && !address) {
      setAddressError('Address is required');
      isValid = false;
    } else {
      setAddressError('');
    }
    
    if (role === 'citizen' && !pinCode) {
      setPinCodeError('PIN code is required');
      isValid = false;
    } else if (pinCode && !/^\d{6}$/.test(pinCode)) {
      setPinCodeError('Please enter a valid 6-digit PIN code');
      isValid = false;
    } else {
      setPinCodeError('');
    }
    
    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    } else {
      setPasswordError('');
    }
    
    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your password');
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      isValid = false;
    } else {
      setConfirmPasswordError('');
    }
    
    return isValid;
  };

  const handleRegister = async () => {
    if (validateForm()) {
      try {
        const { requiresConfirmation } = await register(
          name, 
          email, 
          password, 
          role || 'citizen'
        );
        
        if (requiresConfirmation) {
          router.push({
            pathname: '/auth/confirm-pending',
            params: { email }
          });
        } else {
          router.replace(`/${role || 'citizen'}`);
        }
      } catch (error) {
        console.error('Registration error:', error);
      }
    }
  };

  const handleLogin = () => {
    router.push({
      pathname: '/auth/login',
      params: { role }
    });
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      
      <TouchableOpacity 
        style={styles.backButton}
        onPress={handleBack}
        activeOpacity={0.7}
      >
        <ArrowLeft size={24} color={colors.gray[700]} />
      </TouchableOpacity>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Create Your Account</Text>
          <Text style={styles.subtitle}>
            Join us to start using CivicConnect services
          </Text>
        </View>
        
        <View style={styles.formContainer}>
          <Input
            label="Full Name"
            placeholder="Enter your full name"
            value={name}
            onChangeText={setName}
            error={nameError}
            leftIcon={<User size={20} color={colors.gray[500]} />}
          />
          
          <Input
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            error={emailError}
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon={<Mail size={20} color={colors.gray[500]} />}
          />
          
          <Input
            label="Phone Number"
            placeholder="Enter your phone number"
            value={phone}
            onChangeText={setPhone}
            error={phoneError}
            keyboardType="phone-pad"
            leftIcon={<Phone size={20} color={colors.gray[500]} />}
          />
          
          {role === 'citizen' && (
            <>
              <Input
                label="Address"
                placeholder="Enter your address"
                value={address}
                onChangeText={setAddress}
                error={addressError}
                multiline
                numberOfLines={3}
                leftIcon={<MapPin size={20} color={colors.gray[500]} />}
              />
              
              <Input
                label="PIN Code"
                placeholder="Enter your PIN code"
                value={pinCode}
                onChangeText={setPinCode}
                error={pinCodeError}
                keyboardType="numeric"
              />
            </>
          )}
          
          <Input
            label="Password"
            placeholder="Create a password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            error={passwordError}
            leftIcon={<Lock size={20} color={colors.gray[500]} />}
          />
          
          <Input
            label="Confirm Password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            error={confirmPasswordError}
            leftIcon={<Lock size={20} color={colors.gray[500]} />}
          />
          
          {error && (
            <Text style={styles.errorText}>
              {error.includes('row violates row-level security') 
                ? "Registration failed due to security restrictions. Please try again."
                : error}
            </Text>
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
    padding: 24,
  },
  backButton: {
    marginBottom: 24,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.gray[900],
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.gray[600],
    lineHeight: 24,
  },
  formContainer: {
    marginBottom: 40,
  },
  registerButton: {
    marginTop: 16,
  },
  errorText: {
    color: colors.error,
    marginBottom: 16,
    textAlign: 'center',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  loginText: {
    color: colors.gray[600],
    marginRight: 4,
  },
  loginLink: {
    color: colors.primary,
    fontWeight: '600',
  },
});