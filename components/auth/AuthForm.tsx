import React, { useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { colors } from "@/constants/Colors";
import { Mail, Lock, User, Phone } from "lucide-react-native";
import { UserRole } from "@/types";

interface AuthFormProps {
  type: "login" | "register";
  onSubmit: (data: AuthFormData) => void;
  isLoading: boolean;
  error?: string | null;
  userRole?: UserRole;
}

export interface AuthFormData {
  registrationNumber: string | undefined;
  department: string | undefined;
  areaAssigned: string | undefined;
  name?: string;
  email: string;
  phone?: string;
  password: string;
  role?: UserRole;
}

export const AuthForm: React.FC<AuthFormProps> = ({
  type,
  onSubmit,
  isLoading,
  error,
  userRole = "citizen",
}) => {
  const [formData, setFormData] = useState<AuthFormData>({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: userRole,
  });

  const [formErrors, setFormErrors] = useState<Partial<AuthFormData>>({});

  const handleChange = (field: keyof AuthFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const errors: Partial<AuthFormData> = {};

    if (type === "register" && !formData.name) {
      errors.name = "Name is required";
    }

    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }

    if (type === "register" && !formData.phone) {
      errors.phone = "Phone number is required";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <View style={styles.container}>
      {error && <Text style={styles.errorText}>{error}</Text>}

      {type === "register" && (
        <Input
          label="Full Name"
          placeholder="Enter your full name"
          value={formData.name}
          onChangeText={value => handleChange("name", value)}
          error={formErrors.name}
          leftIcon={<User size={20} color={colors.textSecondary} />}
          autoCapitalize="words"
        />
      )}

      <Input
        label="Email"
        placeholder="Enter your email"
        value={formData.email}
        onChangeText={value => handleChange("email", value)}
        error={formErrors.email}
        leftIcon={<Mail size={20} color={colors.textSecondary} />}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {type === "register" && (
        <Input
          label="Phone Number"
          placeholder="Enter your phone number"
          value={formData.phone}
          onChangeText={value => handleChange("phone", value)}
          error={formErrors.phone}
          leftIcon={<Phone size={20} color={colors.textSecondary} />}
          keyboardType="phone-pad"
        />
      )}

      <Input
        label="Password"
        placeholder="Enter your password"
        value={formData.password}
        onChangeText={value => handleChange("password", value)}
        error={formErrors.password}
        leftIcon={<Lock size={20} color={colors.textSecondary} />}
        isPassword
      />

      <Button
        title={type === "login" ? "Login" : "Register"}
        onPress={handleSubmit}
        isLoading={isLoading}
        style={styles.button}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  errorText: {
    color: colors.danger,
    marginBottom: 16,
    textAlign: "center",
  },
  button: {
    marginTop: 16,
  },
});