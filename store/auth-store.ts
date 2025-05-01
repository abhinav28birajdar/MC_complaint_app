// File: store/auth-store.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User, UserRole } from "@/types"; // Ensure types are imported
import { supabase } from "@/lib/supabase"; // Ensure supabase client is imported
import { Session } from "@supabase/supabase-js";

interface AuthState {
  user: User | null;
  session: Session | null; // Store session info as well
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  checkSession: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Partial<User>, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  signInWithGoogle: () => Promise<void>;
  signInWithFacebook: () => Promise<void>;
  _setUserAndSession: (user: User | null, session: Session | null) => void; // Helper
}

// Helper function to fetch user profile
const fetchUserProfile = async (userId: string): Promise<User | null> => {
  try {
    const { data: profile, error } = await supabase
      .from('users') // Ensure 'users' is your profile table name
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error("Error fetching profile:", error.message);
      // Don't throw here, allow login/signup to potentially proceed
      // but maybe clear auth state if profile is essential and missing?
      return null;
    }
    return profile as User | null;
  } catch (e) {
    console.error("Exception fetching profile:", e);
    return null;
  }
};


export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      isAuthenticated: false,
      isLoading: true, // Start loading initially until checkSession completes
      error: null,

      _setUserAndSession: (user, session) => {
         set({
           user,
           session,
           isAuthenticated: !!user && !!session,
           isLoading: false,
           error: null,
         });
      },

      checkSession: async () => {
        // Don't set loading true if already loading to prevent UI flicker
        if (!get().isLoading) {
          set({ isLoading: true, error: null });
        }
        try {
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();

          if (sessionError) {
            console.error("Error getting session:", sessionError.message);
            get()._setUserAndSession(null, null); // Clear state on error
            return;
          }

          if (session?.user) {
            const profile = await fetchUserProfile(session.user.id);
            if (profile) {
               get()._setUserAndSession(profile, session);
            } else {
               console.warn("User session found but profile missing for ID:", session.user.id);
               // Decide recovery strategy: logout or allow limited access?
               await get().logout(); // Log out if profile is mandatory
               // OR: get()._setUserAndSession(null, null); // Clear state but keep session potentially for retry?
            }
          } else {
             get()._setUserAndSession(null, null); // No session or user
          }
        } catch (error) {
          console.error("Exception in checkSession:", error);
           get()._setUserAndSession(null, null); // Clear state on unexpected error
        } finally {
           // Ensure loading is false even if already set by _setUserAndSession
           set({ isLoading: false });
        }
      },

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) throw error; // Throw Supabase Auth errors

          if (data.user && data.session) {
             const profile = await fetchUserProfile(data.user.id);
             if (profile) {
                get()._setUserAndSession(profile, data.session);
             } else {
                 // Handle case where login succeeds but profile fetch fails
                 console.error("Login successful but failed to fetch profile.");
                 await get().logout(); // Log out the user immediately
                 throw new Error("Login succeeded but user profile could not be loaded.");
             }
          } else {
             // Should not happen if no error, but handle defensively
             throw new Error("Login response missing user or session data.");
          }
        } catch (error: any) {
           console.error("Login failed:", error.message);
           set({
             error: error.message || "Login failed. Please check your credentials.",
             isLoading: false,
             isAuthenticated: false, // Ensure auth state is false on error
             user: null,
             session: null,
           });
        }
      },

      register: async (userData, password) => {
        set({ isLoading: true, error: null });
        try {
          // 1. Sign up the user with Supabase Auth
          const { data: authData, error: signUpError } = await supabase.auth.signUp({
            email: userData.email!,
            password,
            options: {
              // Data to be available in `auth.users` table (and possibly via trigger to `users` profile table)
              data: {
                name: userData.name, // Pass name here if your trigger uses it
                role: userData.role, // Pass role here if your trigger uses it
                // Add other fields ONLY IF your auth.users table has them
                // OR if a trigger uses them to populate the public.users table.
                // Avoid putting sensitive or large data here.
              }
            }
          });

          if (signUpError) throw signUpError;
          if (!authData.user || !authData.session) throw new Error("Registration response missing user or session data.");


          // 2. Create the user profile in the public 'users' table
          // Make sure userData includes all necessary fields for the 'users' table
           const profileData: Omit<User, 'id'> & { id: string } = { // Ensure ID is included
              id: authData.user.id, // Use the ID from the auth user
              name: userData.name || '',
              email: userData.email || '',
              phone: userData.phone || undefined, // Use undefined if empty string is not desired
              role: userData.role || 'citizen', // Default role
              avatarUrl: userData.avatarUrl, // Use camelCase from type def
              address: userData.address,
              department: userData.department,
              areaAssigned: userData.areaAssigned,
              registrationNumber: userData.registrationNumber,
              departmentId: userData.departmentId,
            };

          const { error: profileError } = await supabase
            .from('users') // Your public profile table
            .insert(profileData);

          if (profileError) {
            console.error("Profile creation failed:", profileError.message);
            // Optional: Attempt to clean up the auth user if profile creation fails?
            // This is complex and depends on your requirements.
            // For now, throw an error indicating partial failure.
            throw new Error(`Registration succeeded but profile creation failed: ${profileError.message}`);
          }

          // 3. Set the state with the newly created profile and session
          // We fetch the profile again to ensure we have the definitive data from the DB
          const finalProfile = await fetchUserProfile(authData.user.id);
          if (finalProfile) {
             get()._setUserAndSession(finalProfile, authData.session);
          } else {
              throw new Error("Registration and profile creation succeeded, but failed to fetch final profile.");
          }

        } catch (error: any) {
          console.error("Registration failed:", error.message);
          set({
            error: error.message || "Registration failed. Please try again.",
            isLoading: false,
            isAuthenticated: false,
            user: null,
            session: null,
          });
        }
      },

      // --- Social Logins ---
      // Ensure EXPO_PUBLIC_APP_SCHEME is set in your .env and matches app.json scheme
      signInWithGoogle: async () => {
        set({ isLoading: true, error: null });
        try {
          const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
              // redirectTo is where Supabase redirects after auth
              // For Expo Go / Dev Client, deeplinking handles the return
               redirectTo: `${process.env.EXPO_PUBLIC_APP_SCHEME}://auth/callback`,
               // Optional: Add scopes if needed e.g. 'profile email'
            },
          });
          if (error) throw error;
          // IMPORTANT: Don't set loading false here. The auth listener will handle the SIGNED_IN event
          // and update the state, including setting loading to false.
        } catch (error: any) {
          console.error("Google sign-in initiation failed:", error.message);
          set({
            error: error.message || "Google sign-in failed.",
            isLoading: false, // Set loading false on error
          });
        }
      },

      signInWithFacebook: async () => {
         set({ isLoading: true, error: null });
        try {
          const { error } = await supabase.auth.signInWithOAuth({
            provider: 'facebook',
            options: {
               redirectTo: `${process.env.EXPO_PUBLIC_APP_SCHEME}://auth/callback`,
               // Optional: Add scopes
            },
          });
          if (error) throw error;
          // Auth listener handles success
        } catch (error: any) {
          console.error("Facebook sign-in initiation failed:", error.message);
          set({
            error: error.message || "Facebook sign-in failed.",
            isLoading: false,
          });
        }
      },

      logout: async () => {
        // Don't set loading if already logging out
        if (!get().isLoading) {
           set({ isLoading: true });
        }
        try {
          const { error } = await supabase.auth.signOut();
          if (error) throw error;
          // Clear state explicitly
          get()._setUserAndSession(null, null);
        } catch (error: any) {
          console.error("Logout failed:", error.message);
          set({
            error: error.message || "Logout failed.",
            isLoading: false, // Ensure loading is false even on error
             // Keep isAuthenticated false etc.
          });
        } finally {
           // Double ensure state is cleared and loading is false
           set(state => ({
             ...state, // keep potential error message
             user: null,
             session: null,
             isAuthenticated: false,
             isLoading: false,
           }));
        }
      },

      clearError: () => {
        set({ error: null });
      }
    }),
    {
      name: "auth-storage", // Unique name for storage
      storage: createJSONStorage(() => AsyncStorage), // Use AsyncStorage for React Native
       partialize: (state) => ({
         // Only persist session, not user, isLoading, or error
         // The user object will be re-fetched based on the session
         session: state.session,
       }),
       // Custom merge function to re-check session on rehydration
       merge: (persistedState: any, currentState) => {
         const merged = { ...currentState, ...persistedState };
         // Trigger checkSession after rehydrating the session
         // Use setTimeout to ensure it runs after initial setup
         setTimeout(() => {
           useAuthStore.getState().checkSession();
         }, 0);
         return merged;
       },
    }
  )
);

// --- Global Auth State Listener ---
// This listens for auth events from Supabase globally
supabase.auth.onAuthStateChange(async (event, session) => {
  const { _setUserAndSession, logout, isLoading: storeIsLoading } = useAuthStore.getState();
  console.log(`Auth Event: ${event}`, session ? `User: ${session.user?.id}` : 'No session');


  switch (event) {
    case 'INITIAL_SESSION':
      // Handled by checkSession on store initialization/rehydration
      // We check manually to fetch the profile along with the session
      break;
    case 'SIGNED_IN':
      if (session?.user) {
         // Avoid fetching profile if store is currently in a login/register process
         if (!storeIsLoading) {
            const profile = await fetchUserProfile(session.user.id);
            if (profile) {
                _setUserAndSession(profile, session);
            } else {
                console.warn("SIGNED_IN event, but profile fetch failed for ID:", session.user.id);
                // Decide action: logout or wait? Logging out might be safer.
                 await logout();
            }
         }
      } else {
          console.warn("SIGNED_IN event but session or user is missing.");
          _setUserAndSession(null, null); // Clear state if data is inconsistent
      }
      break;
    case 'SIGNED_OUT':
       _setUserAndSession(null, null);
      break;
    case 'PASSWORD_RECOVERY':
      // Handle password recovery UI flow if needed
      break;
    case 'TOKEN_REFRESHED':
      if (session) {
        // Update the session in the store without changing user/auth state if not needed
        useAuthStore.setState({ session, isLoading: false });
      } else {
         // If token refresh fails and results in no session, sign out
         _setUserAndSession(null, null);
      }
      break;
    case 'USER_UPDATED':
      if (session?.user) {
        // Re-fetch profile if user data might have changed
        const profile = await fetchUserProfile(session.user.id);
        if (profile) {
           useAuthStore.setState({ user: profile, session, isLoading: false });
        }
        // Keep existing session
      }
      break;
    default:
      // Handle other events if necessary
      break;
  }
});