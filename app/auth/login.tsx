import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, Lock, ArrowLeft } from 'lucide-react-native';
import { colors } from '@/constants/Colors';
import { useAuthStore } from '@/store/auth-store';
import { UserRole } from '@/types';
import Input from '@/components/Input';
import Button from '@/components/Button';

export default function LoginScreen() {
  const router = useRouter();
  const { role, message } = useLocalSearchParams<{ role?: UserRole; message?: string }>();
  const { login, isLoading, error, clearError } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateForm = () => {
    let isValid = true;
    clearError();

    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email');
      isValid = false;
    } else {
      setEmailError('');
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

    return isValid;
  };

  const handleLogin = async () => {
    if (validateForm()) {
      try {
        await login(email, password);
        // Successful login is handled by the auth store's effect in app/index.tsx
      } catch (error) {
        console.error('Login screen error:', error);
        // Error message is displayed via the 'error' state from the store
      }
    }
  };

  const handleRegister = () => {
    router.push({
      pathname: '/auth/register',
      params: { role: role || 'citizen' }
    });
  };

  const handleBack = () => {
     if (router.canGoBack()) {
         router.back();
     } else {
         router.replace('/auth/role-selection'); // Fallback
     }
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

      <View style={styles.header}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>
          Sign in to access your account
        </Text>
      </View>

      {message && (
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>{message}</Text>
        </View>
      )}

      <View style={styles.formContainer}>
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
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          error={passwordError}
          leftIcon={<Lock size={20} color={colors.gray[500]} />}
        />

        {error && (
          <Text style={styles.errorText}>{error}</Text>
        )}

        <Button
          title="Login"
          onPress={handleLogin}
          loading={isLoading}
          disabled={isLoading}
          fullWidth
          size="lg"
          style={styles.loginButton}
        />

        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Don't have an account?</Text>
          <TouchableOpacity onPress={handleRegister}>
            <Text style={styles.registerLink}>Register</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    // Ensure adequate touch area
    padding: 8,
    alignSelf: 'flex-start',
  },
  header: {
    marginBottom: 40,
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
  messageContainer: {
    backgroundColor: colors.successLight,
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  messageText: {
    color: colors.success,
    textAlign: 'center',
  },
  formContainer: {
    flex: 1,
  },
  loginButton: {
    marginTop: 16,
  },
  errorText: {
    color: colors.error,
    marginBottom: 16,
    textAlign: 'center',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  registerText: {
    color: colors.gray[600],
    marginRight: 4,
  },
  registerLink: {
    color: colors.primary,
    fontWeight: '600',
  },
});