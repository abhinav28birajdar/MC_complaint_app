// File: app/(auth)/login.tsx
import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { AuthForm, AuthFormData } from "@/components/auth/AuthForm";
import { colors } from "@/constants/Colors";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/store/auth-store";
import { StatusBar } from "expo-status-bar";
import { Button } from "@/components/ui/Button"; // Your Button component
import { Ionicons } from '@expo/vector-icons'; // <--- IMPORT ICON LIBRARY

export default function LoginScreen() {
  const router = useRouter();
  const {
    login,
    isAuthenticated,
    isLoading,
    error,
    clearError,
    signInWithGoogle,
    signInWithFacebook
  } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/(tabs)");
    }
  }, [isAuthenticated]);

  const handleLogin = async (data: AuthFormData) => {
    await login(data.email, data.password);
  };

  const handleRegister = () => {
    clearError();
    router.push("/register");
  };

  // Determine icon color based on the custom text style
  const iconColor = styles.socialButtonText.color || colors.text;
  const iconSize = 20; // Choose an appropriate size

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Image
            source={{ uri: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80" }}
            style={styles.logo}
          />
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>
            Login to access your account and manage your complaints
          </Text>
        </View>

        <View style={styles.formContainer}>
          <AuthForm
            type="login"
            onSubmit={handleLogin}
            isLoading={isLoading}
            error={error}
          />

          <View style={styles.socialButtons}>
            {/* Use leftIcon prop and pass the Icon component */}
            <Button
              title="Continue with Google"
              onPress={signInWithGoogle}
              style={styles.socialButton} // Keep custom styles
              textStyle={styles.socialButtonText} // Keep custom styles
              // Pass the actual icon component instance to leftIcon
              leftIcon={<Ionicons name="logo-google" size={iconSize} color={iconColor} />}
              // variant="outline" // Optionally use a variant if it matches, but custom style is safer
            />
            {/* Use leftIcon prop and pass the Icon component */}
            <Button
              title="Continue with Facebook"
              onPress={signInWithFacebook}
              style={styles.socialButton} // Keep custom styles
              textStyle={styles.socialButtonText} // Keep custom styles
              // Pass the actual icon component instance to leftIcon
              leftIcon={<Ionicons name="logo-facebook" size={iconSize} color={iconColor} />}
              // variant="outline" // Optionally use a variant if it matches, but custom style is safer
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account?</Text>
            <TouchableOpacity onPress={handleRegister}>
              <Text style={styles.registerText}>Register</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
  },
  formContainer: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  socialButtons: {
    marginTop: 20,
    gap: 12,
  },
  socialButton: {
    // Custom styles for the social buttons
    backgroundColor: colors.card, // Use card background
    borderColor: colors.border,   // Add a border
    borderWidth: 1,
    // The Button component already sets flexDirection: 'row', alignItems: 'center' etc.
  },
  socialButtonText: {
    // Custom text style for social buttons
    color: colors.text, // Use default text color
    // fontWeight: '500', // Optional: adjust font weight if needed
    // No need for marginLeft here, the Button handles gap
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  registerText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: "600",
    marginLeft: 4,
  },
});