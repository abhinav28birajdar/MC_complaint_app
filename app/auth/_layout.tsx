import React from 'react';
import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen name="role-selection" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
      <Stack.Screen name="confirm-pending" options={{ title: 'Confirm Email' }} />
      <Stack.Screen name="confirm" options={{ title: 'Email Confirmation' }} />
    </Stack>
  );
}