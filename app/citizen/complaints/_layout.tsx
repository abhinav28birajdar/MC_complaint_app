import React from 'react';
import { Stack } from 'expo-router';

export default function ComplaintsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: 'My Complaints' }} />
      <Stack.Screen name="new" options={{ title: 'File Complaint' }} />
      <Stack.Screen name="[id]" options={{ title: 'Complaint Details' }} />
    </Stack>
  );
}