import React from 'react';
import { Stack } from 'expo-router';

export default function RecycleLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: 'Recycling' }} />
      <Stack.Screen name="new" options={{ title: 'Request Pickup' }} />
    </Stack>
  );
}