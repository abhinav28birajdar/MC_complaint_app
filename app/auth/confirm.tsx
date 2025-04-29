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
  const { verifySession, user } = useAuthStore();

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        // Basic validation for params
        const tokenHash = params.token_hash;
        const email = params.email;

        if (!tokenHash || typeof tokenHash !== 'string' ||
            !email || typeof email !== 'string') {
          throw new Error('Invalid confirmation link parameters');
        }

        const { error: confirmError } = await supabase.auth.verifyOtp({
          type: 'email',
          token_hash: tokenHash,
          email: email,
        });

        if (confirmError) throw confirmError;

        // Verify the session immediately after OTP verification
        await verifySession();
        setStatus('success');

      } catch (err: any) { // Catch 'any' for broader error handling
        console.error("Confirmation Error:", err);
        setStatus('error');
        // Check common Supabase error messages
        let errorMessage = 'Confirmation failed. The link might be invalid or expired.';
        if (err?.message?.includes('Token has expired')) {
          errorMessage = 'Confirmation link has expired. Please request a new one or try logging in.';
        } else if (err?.message?.includes('Token not found')) {
          errorMessage = 'Invalid confirmation link. Please check the link or request a new one.';
        } else if (err instanceof Error) {
           errorMessage = err.message;
        }
        setError(errorMessage);
      }
    };

    confirmEmail();
  }, [params.token_hash, params.email, verifySession]);

  // Redirect after success and user is available
  useEffect(() => {
      if (status === 'success' && user) {
          // Default to 'citizen' if role is missing or invalid
          const role = user.role || 'citizen';
          // Ensure the role corresponds to a valid route segment
          const validRoles = ['citizen', 'employee', 'admin'];
          const redirectRole = validRoles.includes(role) ? role : 'citizen';
          const redirectPath = `/${redirectRole}`;

          console.log(`Email confirmed, redirecting to: ${redirectPath}`);
          const timer = setTimeout(() => {
            // Fix the type issue by using 'as any' 
            router.replace(redirectPath as any);
          }, 2000);
          return () => clearTimeout(timer); // Cleanup timer on unmount
      }
  }, [status, user, router]);


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
        <Text style={styles.text}>Redirecting you shortly...</Text>
      </View>
    );
  }

  // Status is 'error'
  return (
    <View style={styles.container}>
      <Text style={[styles.text, styles.errorText]}>Confirmation Failed</Text>
      <Text style={styles.text}>{error}</Text>

      <TouchableOpacity
        onPress={() => router.replace('/auth/login' as any)}
        style={styles.button}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>Go to Login</Text>
      </TouchableOpacity>

      {/* Optionally offer resend - might need a dedicated screen/flow */}
      {/* <TouchableOpacity
        onPress={() => router.push('/auth/resend-confirmation' as any)}
        style={[styles.button, styles.secondaryButton]}
        activeOpacity={0.8}
      >
        <Text style={styles.secondaryButtonText}>Resend Email</Text>
      </TouchableOpacity> */}
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
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
    width: '100%',
    maxWidth: 300, // Optional max width
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
    marginTop: 16, // Added margin
  },
  secondaryButtonText: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 16,
  },
});