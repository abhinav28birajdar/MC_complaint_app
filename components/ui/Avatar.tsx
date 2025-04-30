import React from "react";
import { View, Text, StyleSheet, Image, ViewStyle } from "react-native";
import { colors } from "@/constants/colors";

type AvatarSize = "sm" | "md" | "lg" | "xl";

interface AvatarProps {
  source?: string;
  name?: string;
  size?: AvatarSize;
  style?: ViewStyle;
}

export const Avatar: React.FC<AvatarProps> = ({
  source,
  name,
  size = "md",
  style,
}) => {
  const getInitials = (name: string) => {
    if (!name) return "";
    const parts = name.split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (
      parts[0].charAt(0).toUpperCase() + parts[parts.length - 1].charAt(0).toUpperCase()
    );
  };

  const sizeStyles = {
    sm: {
      width: 32,
      height: 32,
      borderRadius: 16,
      fontSize: 12,
    },
    md: {
      width: 40,
      height: 40,
      borderRadius: 20,
      fontSize: 16,
    },
    lg: {
      width: 56,
      height: 56,
      borderRadius: 28,
      fontSize: 20,
    },
    xl: {
      width: 80,
      height: 80,
      borderRadius: 40,
      fontSize: 28,
    },
  };

  const containerStyle = {
    width: sizeStyles[size].width,
    height: sizeStyles[size].height,
    borderRadius: sizeStyles[size].borderRadius,
  };

  const textStyle = {
    fontSize: sizeStyles[size].fontSize,
  };

  return (
    <View style={[styles.container, containerStyle, style]}>
      {source ? (
        <Image
          source={{ uri: source }}
          style={[styles.image, containerStyle]}
        />
      ) : name ? (
        <Text style={[styles.initials, textStyle]}>{getInitials(name)}</Text>
      ) : (
        <Text style={[styles.initials, textStyle]}>?</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  initials: {
    color: "white",
    fontWeight: "600",
  },
});