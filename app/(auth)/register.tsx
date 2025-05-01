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
  
  const { register, isAuthenticated, isLoading, error, clearError } = useAuthStore();
  const [selectedRole, setSelectedRole] = useState<UserRole>("citizen");

  useEffect(() => {
   
    if (isAuthenticated) {
      console.log("RegisterScreen: User is authenticated, replacing route to /tabs");
      router.replace("/(tabs)");
    }
  }, [isAuthenticated, router]); 

  const handleRegister = async (data: AuthFormData) => {
    clearError(); 
    console.log("RegisterScreen: Attempting registration...");

    try {
 
      await register(
        {
          name: data.name,
          email: data.email,
          phone: data.phone,
          role: selectedRole,
        },
        data.password
      );


      setTimeout(() => {
        const { error: currentError, isAuthenticated: currentlyAuthenticated } = useAuthStore.getState();

        if (currentError) {
 
          console.error("RegisterScreen: Registration failed:", currentError);
     
        } else if (!currentlyAuthenticated) {
       
          console.log("RegisterScreen: Registration successful, showing email confirmation alert.");
          Alert.alert(
            "Registration Successful!",
            "Please check your email inbox (and spam folder!) to find the confirmation link. Click it to activate your account before logging in.",
            [
              {
                text: "OK",
                onPress: () => {
                 
                  console.log("OK Pressed on confirmation alert");
                },
              },
            ]
          );
        } else {
          
           console.log("RegisterScreen: Registration successful and user authenticated.");
        }
      }, 100); 

    } catch (registrationError) {
     
      console.error("RegisterScreen: Unexpected error during register call:", registrationError);
      Alert.alert("Registration Error", "An unexpected error occurred. Please try again.");
     
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