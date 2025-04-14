// src/lib/supabase.ts

import 'react-native-url-polyfill/auto'; // Required for Supabase RN
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@env'; 


if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("ERROR: Supabase environment variables (SUPABASE_URL, SUPABASE_ANON_KEY) are not defined.");
  console.error("Ensure you have a .env file in the project root and have configured react-native-dotenv in babel.config.js.");
  console.error("You may need to restart your Metro bundler with --reset-cache.");

}

const supabaseUrl = SUPABASE_URL;
const supabaseAnonKey = SUPABASE_ANON_KEY;

const storageAdapter = {
  getItem: async (key: string): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error(`Error getting item [${key}] from AsyncStorage:`, error);
      return null;
    }
  },
  setItem: async (key: string, value: string): Promise<void> => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error(`Error setting item [${key}] in AsyncStorage:`, error);
    }
  },
  removeItem: async (key: string): Promise<void> => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing item [${key}] from AsyncStorage:`, error);
    }
  },
};

// Initialize the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: storageAdapter,        // Use AsyncStorage for session persistence
    autoRefreshToken: true,         // Automatically refresh expiring sessions
    persistSession: true,           // Persist session across app restarts
    detectSessionInUrl: false,      // Disable URL session detection (not needed for RN)
  },
 
});
