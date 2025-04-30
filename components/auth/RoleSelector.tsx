import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { colors } from "@/constants/colors";
import { UserRole } from "@/types";
import { User, Briefcase, ShieldCheck } from "lucide-react-native";

interface RoleSelectorProps {
  selectedRole: UserRole;
  onSelectRole: (role: UserRole) => void;
}

interface RoleOption {
  role: UserRole;
  label: string;
  icon: React.ReactNode;
  description: string;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({
  selectedRole,
  onSelectRole,
}) => {
  const roleOptions: RoleOption[] = [
    {
      role: "citizen",
      label: "Citizen",
      icon: <User size={24} color={colors.primary} />,
      description: "Report issues and track their progress",
    },
    {
      role: "employee",
      label: "Employee",
      icon: <Briefcase size={24} color={colors.primary} />,
      description: "Manage and resolve assigned complaints",
    },
    {
      role: "admin",
      label: "Admin",
      icon: <ShieldCheck size={24} color={colors.primary} />,
      description: "Oversee all operations and manage employees",
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Your Role</Text>
      
      <View style={styles.optionsContainer}>
        {roleOptions.map(option => (
          <TouchableOpacity
            key={option.role}
            style={[
              styles.option,
              selectedRole === option.role && styles.selectedOption,
            ]}
            onPress={() => onSelectRole(option.role)}
            activeOpacity={0.7}
          >
            <View style={styles.iconContainer}>{option.icon}</View>
            <Text style={styles.optionLabel}>{option.label}</Text>
            <Text style={styles.optionDescription}>{option.description}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 16,
    textAlign: "center",
  },
  optionsContainer: {
    gap: 12,
  },
  option: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  selectedOption: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}10`,
  },
  iconContainer: {
    marginBottom: 8,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});