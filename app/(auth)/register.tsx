import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert, // <-- Import Alert
} from "react-native";
import { AuthForm, AuthFormData } from "@/components/auth/AuthForm";
import { RoleSelector } from "@/components/auth/RoleSelector";
import { colors } from "@/constants/Colors";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/store/auth-store";
import { UserRole } from "@/types";
import { StatusBar } from "expo-status-bar";

export default function RegisterScreen() {
  const router = useRouter();
  // Get latest state directly if needed, or rely on props passed to AuthForm
  const { register, isAuthenticated, isLoading, error, clearError } = useAuthStore();
  const [selectedRole, setSelectedRole] = useState<UserRole>("citizen");

  useEffect(() => {
    // This navigation still happens if the user somehow becomes authenticated
    // (e.g., if email confirmation was turned off temporarily, or for other auth flows)
    if (isAuthenticated) {
      console.log("RegisterScreen: User is authenticated, replacing route to /tabs");
      router.replace("/(tabs)");
    }
  }, [isAuthenticated, router]); // Added router dependency

  const handleRegister = async (data: AuthFormData) => {
    clearError(); // Clear previous errors first
    console.log("RegisterScreen: Attempting registration...");

    try {
      // Call the register function from your store
      await register(
        {
          name: data.name,
          email: data.email,
          phone: data.phone,
          role: selectedRole,
        },
        data.password
      );

      // --- Check Registration Outcome ---
      // We need to get the latest state *after* the await register() call.
      // Using a small delay with getState() can help ensure the store had time to update.
      // A more robust solution involves the store exposing a specific 'needsConfirmation' status.
      setTimeout(() => {
        const { error: currentError, isAuthenticated: currentlyAuthenticated } = useAuthStore.getState();

        if (currentError) {
          // If the store ended up with an error, log it (AuthForm should display it)
          console.error("RegisterScreen: Registration failed:", currentError);
          // Optionally show an Alert here too, but AuthForm likely handles it
          // Alert.alert("Registration Failed", currentError || "An error occurred.");
        } else if (!currentlyAuthenticated) {
          // *** THIS IS THE KEY CONDITION ***
          // If there's NO error AND the user is NOT authenticated,
          // it implies registration succeeded but requires email confirmation.
          console.log("RegisterScreen: Registration successful, showing email confirmation alert.");
          Alert.alert(
            "Registration Successful!",
            "Please check your email inbox (and spam folder!) to find the confirmation link. Click it to activate your account before logging in.",
            [
              {
                text: "OK",
                onPress: () => {
                  // Optional: Navigate to login screen after user acknowledges the alert
                  // router.push('/login');
                  console.log("OK Pressed on confirmation alert");
                },
              },
            ]
          );
        } else {
          // If user is authenticated immediately (e.g., email confirmation off),
          // the useEffect above will handle navigation.
           console.log("RegisterScreen: Registration successful and user authenticated.");
        }
      }, 100); // 100ms delay - adjust if needed, but prefer store-based status

    } catch (registrationError) {
      // Catch errors thrown *by* the register function call itself (e.g., network)
      console.error("RegisterScreen: Unexpected error during register call:", registrationError);
      Alert.alert("Registration Error", "An unexpected error occurred. Please try again.");
      // Update store error state if necessary, though the store might do this already
      // useAuthStore.setState({ error: "An unexpected error occurred." });
    }
  };

  const handleLogin = () => {
    clearError();
    router.push("/login");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar style="dark" />
      <ScrollView
         contentContainerStyle={styles.scrollContent}
         keyboardShouldPersistTaps="handled" // Good practice for forms in ScrollViews
      >
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>
            Join our platform to report and track municipal issues
          </Text>
        </View>

        <View style={styles.formContainer}>
          <RoleSelector
            selectedRole={selectedRole}
            onSelectRole={setSelectedRole}
          />

          {/* Pass necessary props to AuthForm */}
          <AuthForm
            type="register"
            onSubmit={handleRegister} // Pass the handler
            isLoading={isLoading}      // Pass loading state
            error={error}              // Pass error state (AuthForm should display it)
            userRole={selectedRole}
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <TouchableOpacity onPress={handleLogin}>
              <Text style={styles.loginText}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// --- Styles remain the same ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  formContainer: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: 'center',
    marginTop: 20,
    paddingBottom: 10,
  },
  footerText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  loginText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: "600",
    marginLeft: 4,
  },
});