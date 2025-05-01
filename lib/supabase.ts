import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL or Anon Key is missing in environment variables.");
}

// Use AsyncStorage for session persistence in React Native
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false, 
  },
});

// Optional: Helper to handle errors (keep as is)
export const handleSupabaseError = (error: any) => {
  console.error('Supabase error:', error);
  // Depending on your app's needs, you might want to:
  // - Show a user-friendly message
  // - Log to a monitoring service
  // For now, just re-throwing is okay for development
  throw error;
};