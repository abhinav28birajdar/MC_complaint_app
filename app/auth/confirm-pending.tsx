import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuthStore } from '@/store/auth-store';
import { colors } from '@/constants/Colors';

export default function ConfirmPending() {
  const router = useRouter();
  const { email } = useLocalSearchParams();
  const { resendConfirmation, isLoading } = useAuthStore();

  const handleResend = async () => {
    if (!email || typeof email !== 'string') {
        alert('Email parameter is missing or invalid.');
        return;
    }
    try {
      await resendConfirmation(email);
      alert('Confirmation email resent! Please check your inbox.');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to resend email');
    }
  };

  const handleLogin = () => {
    router.replace('/auth/login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Confirm Your Email</Text>

      <Text style={styles.text}>
        We've sent a confirmation email to:
      </Text>

      <Text style={styles.emailText}>{email}</Text>

      <Text style={styles.text}>
        Please check your inbox and click the verification link to activate your account.
      </Text>

      <Text style={styles.noteText}>
        Didn't receive the email? Check your spam folder or resend it.
      </Text>

      <TouchableOpacity
        onPress={handleResend}
        style={styles.button}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Sending...' : 'Resend Confirmation Email'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleLogin}
        style={[styles.button, styles.secondaryButton]}
      >
        <Text style={styles.secondaryButtonText}>
          Back to Login
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.gray[900],
    marginBottom: 24,
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    color: colors.gray[600],
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 24,
  },
  emailText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 24,
  },
  noteText: {
    fontSize: 14,
    color: colors.gray[500],
    textAlign: 'center',
    marginBottom: 32,
    fontStyle: 'italic',
  },
  button: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
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