import React from 'react';
import { Stack } from 'expo-router';

export default function ProfileLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen name="index" options={{ title: 'My Profile', headerShown: false }} />
      <Stack.Screen name="edit" options={{ title: 'Edit Profile' }} />
      <Stack.Screen name="notifications" options={{ title: 'Notifications' }} />
      <Stack.Screen name="privacy" options={{ title: 'Privacy & Security' }} />
      <Stack.Screen name="support" options={{ title: 'Help & Support' }} />
      <Stack.Screen name="terms" options={{ title: 'Terms & Conditions' }} />
      <Stack.Screen name="settings" options={{ title: 'Settings' }} />
    </Stack>
  );
}