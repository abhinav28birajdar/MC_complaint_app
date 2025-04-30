import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { AuthForm, AuthFormData } from "@/components/auth/AuthForm";
import { RoleSelector } from "@/components/auth/RoleSelector";
import { colors } from "@/constants/colors";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/store/auth-store";
import { UserRole } from "@/types";
import { StatusBar } from "expo-status-bar";

export default function RegisterScreen() {
  const router = useRouter();
  const { register, isAuthenticated, isLoading, error, clearError } = useAuthStore();
  const [selectedRole, setSelectedRole] = useState<UserRole>("citizen");

  useEffect(() => {
    if (isAuthenticated) {
      // Using type assertion to bypass TypeScript check
      (router as any).replace("/(tabs)");
    }
  }, [isAuthenticated]);

  const handleRegister = async (data: AuthFormData) => {
    await register(
      {
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: selectedRole,
      },
      data.password
    );
  };

  const handleLogin = () => {
    clearError();
    // Using type assertion to bypass TypeScript check
    (router as any).push("/login");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
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

          <AuthForm
            type="register"
            onSubmit={handleRegister}
            isLoading={isLoading}
            error={error}
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
    marginTop: 40,
    marginBottom: 24,
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
    marginBottom: 20,
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
  loginText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: "600",
    marginLeft: 4,
  },
});