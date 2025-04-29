import React from 'react';
import { Tabs } from 'expo-router';
import { Home, FileText, Trees, Recycle, User } from 'lucide-react-native';
import { colors } from '@/constants/Colors';

export default function CitizenTabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray[500],
        tabBarStyle: {
          borderTopColor: colors.gray[200],
          backgroundColor: colors.white,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerStyle: {
          backgroundColor: colors.white,
        },
        headerTintColor: colors.primary,
        headerTitleStyle: {
          fontWeight: '600',
        },
        headerShadowVisible: false,
        headerShown: true, // Ensure headers are shown for nested stacks
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerShown: false, // Hide header for the main home tab screen itself
          tabBarIcon: ({ color, size }) => (
            <Home size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="complaints"
        options={{
          title: 'Complaints',
          headerShown: false, // Let the nested stack handle header
          tabBarIcon: ({ color, size }) => (
            <FileText size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="trees"
        options={{
          title: 'Trees',
          headerShown: false, // Let the nested stack handle header
          tabBarIcon: ({ color, size }) => (
            <Trees size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="recycle"
        options={{
          title: 'Recycle',
          headerShown: false, // Let the nested stack handle header
          tabBarIcon: ({ color, size }) => (
            <Recycle size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
           headerShown: false, // Let the nested stack handle header
          tabBarIcon: ({ color, size }) => (
            <User size={size} color={color} />
          ),
        }}
      />
      {/* Add hidden screens if needed, like cleaning-schedule if not a tab */}
       <Tabs.Screen
         name="cleaning-schedule"
         options={{ href: null, title: 'Cleaning Schedule' }} // Hide from tab bar
       />
    </Tabs>
  );
}