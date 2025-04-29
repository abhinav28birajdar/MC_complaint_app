import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet, Text, View } from "react-native";
import { colors } from "@/constants/Colors"; // Import colors

export default function ModalScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Modal Screen</Text>
      <View style={styles.separator} />
      <Text style={styles.text}>This is a modal screen example.</Text>
      <Text style={styles.text}>You can customize its content.</Text>

      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background, // Use background color
    padding: 20,
  },
  title: {
    fontSize: 22, // Adjust size
    fontWeight: "bold",
    color: colors.gray[900], // Use theme color
  },
  separator: {
    marginVertical: 20, // Adjust spacing
    height: 1,
    width: "80%",
    backgroundColor: colors.gray[300], // Use theme color for separator
  },
  text: {
     fontSize: 16,
     color: colors.gray[700], // Use theme color
     textAlign: 'center',
     marginBottom: 8,
   },
});