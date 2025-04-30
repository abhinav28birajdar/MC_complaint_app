import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Platform } from "react-native";

import { ErrorBoundary } from "./error-boundary";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) {
      console.error(error);
      throw error;
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ErrorBoundary>
      <RootLayoutNav />
    </ErrorBoundary>
  );
}

function RootLayoutNav() {
  return (
    <Stack
      screenOptions={{
        headerBackTitle: "Back",
        headerStyle: {
          backgroundColor: "#FFFFFF",
        },
        headerTintColor: "#3B82F6",
        headerTitleStyle: {
          fontWeight: "600",
        },
        contentStyle: {
          backgroundColor: "#F9FAFB",
        },
      }}
    >
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="complaints/[id]" options={{ title: "Complaint Details" }} />
      <Stack.Screen name="complaints/[id]/chat" options={{ title: "Chat" }} />
      <Stack.Screen name="complaints/new" options={{ title: "New Complaint" }} />
      <Stack.Screen name="events/[id]" options={{ title: "Event Details" }} />
      <Stack.Screen name="events" options={{ title: "All Events" }} />
      <Stack.Screen name="admin/employees" options={{ title: "Manage Employees" }} />
      <Stack.Screen name="admin/employees/[id]" options={{ title: "Employee Details" }} />
      <Stack.Screen name="admin/events/new" options={{ title: "Create Event" }} />
    </Stack>
  );
}