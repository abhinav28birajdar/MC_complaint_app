import { Link, Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "@/constants/Colors"; // Import colors

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View style={styles.container}>
        <Text style={styles.title}>Screen Not Found</Text>
        <Text style={styles.subtitle}>The screen you are looking for does not exist or may have been moved.</Text>

        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Go to Home Screen</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: colors.background, // Use background color
  },
  title: {
    fontSize: 24, // Larger title
    fontWeight: "bold",
    color: colors.gray[900], // Use theme color
    marginBottom: 8,
  },
  subtitle: {
     fontSize: 16,
     color: colors.gray[600],
     textAlign: 'center',
     marginBottom: 24,
   },
  link: {
    marginTop: 15,
    paddingVertical: 12, // Adjust padding
    paddingHorizontal: 24,
    backgroundColor: colors.primary, // Button-like background
    borderRadius: 8,
  },
  linkText: {
    fontSize: 16, // Larger link text
    color: colors.white, // White text on button
    fontWeight: '500',
  },
});