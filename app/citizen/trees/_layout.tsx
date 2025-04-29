import React from 'react';
import { Stack } from 'expo-router';

export default function TreesLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: 'My Trees' }} />
      <Stack.Screen name="new" options={{ title: 'Add New Tree' }} />
      {/* Add screen for tree details if you have one */}
      {/* <Stack.Screen name="[id]" options={{ title: 'Tree Details' }} /> */}
    </Stack>
  );
}