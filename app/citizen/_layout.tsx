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
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Home size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="complaints"
        options={{
          title: 'Complaints',
          tabBarIcon: ({ color, size }) => (
            <FileText size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="trees"
        options={{
          title: 'Trees',
          tabBarIcon: ({ color, size }) => (
            <Trees size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="recycle"
        options={{
          title: 'Recycle',
          tabBarIcon: ({ color, size }) => (
            <Recycle size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <User size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}