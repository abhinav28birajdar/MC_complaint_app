import React from 'react';
import { Tabs } from 'expo-router';
import { Home, ClipboardList, Calendar, User } from 'lucide-react-native';
import { colors } from '@/constants/Colors';

export default function EmployeeTabLayout() {
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
        name="tasks"
        options={{
          title: 'My Tasks',
          // headerShown: false, // Let nested stack handle header if needed
          tabBarIcon: ({ color, size }) => (
            <ClipboardList size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="schedule"
        options={{
          title: 'Schedule',
          // headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Calendar size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          // headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <User size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}