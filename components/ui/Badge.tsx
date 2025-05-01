import React from "react";
import { View, Text, StyleSheet, ViewStyle, TextStyle } from "react-native";
import { colors } from "@/constants/Colors";

type BadgeVariant = "primary" | "secondary" | "success" | "danger" | "warning" | "info";
type BadgeSize = "sm" | "md" | "lg";

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = "primary",
  size = "md",
  style,
  textStyle,
}) => {
  const getBadgeStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      ...styles.badge,
      ...sizeStyles[size],
    };

    switch (variant) {
      case "primary":
        return {
          ...baseStyle,
          backgroundColor: colors.primary,
        };
      case "secondary":
        return {
          ...baseStyle,
          backgroundColor: colors.secondary,
        };
      case "success":
        return {
          ...baseStyle,
          backgroundColor: colors.success,
        };
      case "danger":
        return {
          ...baseStyle,
          backgroundColor: colors.danger,
        };
      case "warning":
        return {
          ...baseStyle,
          backgroundColor: colors.warning,
        };
      case "info":
        return {
          ...baseStyle,
          backgroundColor: colors.info,
        };
      default:
        return baseStyle;
    }
  };

  const getTextStyle = (): TextStyle => {
    return {
      ...styles.text,
      ...textSizeStyles[size],
    };
  };

  return (
    <View style={[getBadgeStyle(), style]}>
      <Text style={[getTextStyle(), textStyle]}>{label}</Text>
    </View>
  );
};

const sizeStyles = {
  sm: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  md: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  lg: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
};

const textSizeStyles = {
  sm: {
    fontSize: 10,
  },
  md: {
    fontSize: 12,
  },
  lg: {
    fontSize: 14,
  },
};

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
  },
  text: {
    color: "white",
    fontWeight: "600",
    textAlign: "center",
  },
});