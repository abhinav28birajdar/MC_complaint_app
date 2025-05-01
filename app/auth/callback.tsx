import { useEffect } from 'react';
import { useRouter, useGlobalSearchParams } from 'expo-router';
import { View, Text, ActivityIndicator } from 'react-native';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth-store';

export default function AuthCallback() {
  const router = useRouter();
  const params = useGlobalSearchParams();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(tabs)');
      return;
    }

    // Handle OAuth callback
    if (params?.code) {
      supabase.auth.exchangeCodeForSession(String(params.code))
        .then(({ data, error }) => {
          if (error) {
            console.error('Error exchanging code for session:', error);
            router.replace('/login');
          } else if (data.session) {
            router.replace('/(tabs)');
          }
        });
    } else {
      router.replace('/login');
    }
  }, [params, isAuthenticated]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
      <Text style={{ marginTop: 16 }}>Signing you in...</Text>
    </View>
  );
}