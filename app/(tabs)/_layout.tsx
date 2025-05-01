import React from "react";
import { Tabs } from "expo-router";
import { colors } from "@/constants/Colors";
import { useAuthStore } from "@/store/auth-store";
import {
  Home,
  FileText,
  Calendar,
  Bell,
  User,
  // Settings, // Settings icon not used here
  Users,
} from "lucide-react-native"; // Assuming lucide-react-native is installed and working

export default function TabLayout() {
  const { user } = useAuthStore();

  // This layout structure looks correct. The warnings about layout children
  // might be due to a stale cache. Try restarting with `npx expo start -c`.
  // Also, ensure there are no actual files named 'map.tsx' or 'map.js' inside 'app/(tabs)/'
  // if you are getting the 'No route named "map"' warning, and check for any <Link> components
  // or router.push calls pointing to '/(tabs)/map'.

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopWidth: 1, // Ensure borderTopWidth is explicitly set if needed
          borderTopColor: colors.border,
        },
        tabBarLabelStyle: {
          fontSize: 10, // Slightly smaller font size for labels can help fit text
          fontWeight: '500', // Adjust weight if needed
          paddingBottom: 5, // Add some padding below label
        },
        tabBarIconStyle: {
          marginTop: 5, // Add margin above icon if needed
        },
        headerStyle: {
          backgroundColor: colors.card,
          elevation: 0, // Remove shadow on header if desired
          shadowOpacity: 0, // Remove shadow on header for iOS
          borderBottomWidth: 1, // Add bottom border to header
          borderBottomColor: colors.border,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: "600",
          fontSize: 18, // Ensure header title size is appropriate
        },
      }}
    >
      {/* Only Tabs.Screen components are direct children, which is correct */}
      <Tabs.Screen
        name="index" // Corresponds to app/(tabs)/index.tsx
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />

      <Tabs.Screen
        name="complaints" // Corresponds to app/(tabs)/complaints.tsx
        options={{
          title: "Complaints",
          tabBarIcon: ({ color, size }) => <FileText size={size} color={color} />,
        }}
      />

      <Tabs.Screen
        name="schedule" // Corresponds to app/(tabs)/schedule.tsx
        options={{
          title: "Schedule",
          tabBarIcon: ({ color, size }) => <Calendar size={size} color={color} />,
        }}
      />

      <Tabs.Screen
        name="notifications" // Corresponds to app/(tabs)/notifications.tsx
        options={{
          title: "Notifications",
          tabBarIcon: ({ color, size }) => <Bell size={size} color={color} />,
        }}
      />

      {/* Conditional rendering for admin tab based on user role */}
      {user?.role === "admin" && (
        <Tabs.Screen
          name="admin" // Corresponds to app/(tabs)/admin.tsx
          options={{
            title: "Admin",
            tabBarIcon: ({ color, size }) => <Users size={size} color={color} />,
          }}
        />
      )}

      <Tabs.Screen
        name="profile" // Corresponds to app/(tabs)/profile.tsx
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
       {/* Ensure there is NO <Tabs.Screen name="map" ... /> here unless you have app/(tabs)/map.tsx */}
    </Tabs>
  );
}