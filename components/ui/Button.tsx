import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from "react-native";
import { colors } from "@/constants/Colors";

type ButtonVariant = "primary" | "secondary" | "outline" | "danger" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
  disabled,
  ...rest
}) => {
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      ...styles.button,
      ...sizeStyles[size],
    };

    if (disabled) {
      return {
        ...baseStyle,
        ...styles.disabled,
      };
    }

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
      case "outline":
        return {
          ...baseStyle,
          backgroundColor: "transparent",
          borderWidth: 1,
          borderColor: colors.primary,
        };
      case "danger":
        return {
          ...baseStyle,
          backgroundColor: colors.danger,
        };
      case "ghost":
        return {
          ...baseStyle,
          backgroundColor: "transparent",
        };
      default:
        return baseStyle;
    }
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      ...styles.text,
      ...textSizeStyles[size],
    };

    if (disabled) {
      return {
        ...baseStyle,
        color: colors.textSecondary,
      };
    }

    switch (variant) {
      case "outline":
        return {
          ...baseStyle,
          color: colors.primary,
        };
      case "ghost":
        return {
          ...baseStyle,
          color: colors.primary,
        };
      default:
        return baseStyle;
    }
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      disabled={disabled || isLoading}
      activeOpacity={0.7}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator
          color={variant === "outline" || variant === "ghost" ? colors.primary : "white"}
          size="small"
        />
      ) : (
        <>
          {leftIcon && <>{leftIcon}</>}
          <Text style={[getTextStyle(), textStyle]}>{title}</Text>
          {rightIcon && <>{rightIcon}</>}
        </>
      )}
    </TouchableOpacity>
  );
};

const sizeStyles = {
  sm: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  md: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  lg: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
};

const textSizeStyles = {
  sm: {
    fontSize: 14,
  },
  md: {
    fontSize: 16,
  },
  lg: {
    fontSize: 18,
  },
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  text: {
    color: "white",
    fontWeight: "600",
    textAlign: "center",
  },
  disabled: {
    backgroundColor: colors.disabled,
    opacity: 0.7,
  },
});