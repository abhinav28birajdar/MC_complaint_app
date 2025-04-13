import { useEffect, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth-store';
import { colors } from '@/constants/Colors';

export default function EmailConfirmation() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [status, setStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [error, setError] = useState<string | null>(null);
  const { verifySession } = useAuthStore();

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        if (!params.token_hash || !params.email) {
          throw new Error('Invalid confirmation link');
        }

        const { error: confirmError } = await supabase.auth.verifyOtp({
          type: 'email',
          token_hash: params.token_hash as string,
          email: params.email as string,
        });

        if (confirmError) throw confirmError;

        // Verify session after confirmation
        await verifySession();
        
        setStatus('success');
        setTimeout(() => {
          router.replace('/citizen');
        }, 2000);
      } catch (err) {
        setStatus('error');
        setError(err instanceof Error ? err.message : 'Confirmation failed');
      }
    };

    confirmEmail();
  }, []);

  const handleRetry = () => {
    setStatus('pending');
    setError(null);
    router.replace('/auth/login');
  };

  if (status === 'pending') {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.text}>Confirming your email...</Text>
      </View>
    );
  }

  if (status === 'success') {
    return (
      <View style={styles.container}>
        <Text style={[styles.text, styles.successText]}>Email Confirmed!</Text>
        <Text style={styles.text}>Your account has been successfully verified.</Text>
        <Text style={styles.text}>Redirecting to your dashboard...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.text, styles.errorText]}>Confirmation Failed</Text>
      <Text style={styles.text}>{error}</Text>
      
      <TouchableOpacity 
        onPress={handleRetry}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Try Again</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        onPress={() => router.replace('/auth/login')}
        style={[styles.button, styles.secondaryButton]}
      >
        <Text style={styles.secondaryButtonText}>Go to Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: colors.background,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
    color: colors.gray[700],
  },
  successText: {
    color: colors.success,
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 16,
  },
  errorText: {
    color: colors.error,
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 16,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
    width: '100%',
  },
  buttonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  secondaryButtonText: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 16,
  },
});