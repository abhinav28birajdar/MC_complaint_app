// src/lib/supabase.ts

import 'react-native-url-polyfill/auto'; // Required for Supabase RN
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Make sure you have @env types installed: npm install --save-dev @types/react-native-dotenv
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@env';
import { Database } from '@/types/supabase'; // Import generated types

// Runtime check for environment variables
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  const message = "CRITICAL ERROR: Supabase environment variables (SUPABASE_URL, SUPABASE_ANON_KEY) are not defined. Ensure you have a .env file and react-native-dotenv configured correctly. You may need to restart Metro with --reset-cache.";
  console.error(message);
  // In a real app, you might want to show an error screen or alert here instead of just logging
  // throw new Error(message); // Or throw an error to halt execution
}

const supabaseUrl = SUPABASE_URL!; // Use non-null assertion after check
const supabaseAnonKey = SUPABASE_ANON_KEY!; // Use non-null assertion after check

const storageAdapter = {
  getItem: async (key: string): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error(`AsyncStorage getItem Error [${key}]:`, error);
      return null;
    }
  },
  setItem: async (key: string, value: string): Promise<void> => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error(`AsyncStorage setItem Error [${key}]:`, error);
    }
  },
  removeItem: async (key: string): Promise<void> => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`AsyncStorage removeItem Error [${key}]:`, error);
    }
  },
};

// Initialize the Supabase client with Database type
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: storageAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});