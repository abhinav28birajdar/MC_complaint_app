import React from 'react';
import { Tabs } from 'expo-router';
import { Home, ClipboardList, Users, Settings } from 'lucide-react-native';
import { colors } from '@/constants/Colors';

export default function AdminTabLayout() {
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
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
           headerShown: false, // Hide header for dashboard screen itself
          tabBarIcon: ({ color, size }) => (
            <Home size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="complaints"
        options={{
          title: 'Complaints',
          // headerShown: false, // Let nested stack handle header if needed
          tabBarIcon: ({ color, size }) => (
            <ClipboardList size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="users"
        options={{
          title: 'Users',
          // headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Users size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          // headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Settings size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}