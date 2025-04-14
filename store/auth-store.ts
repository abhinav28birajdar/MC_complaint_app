// src/store/auth-store.ts

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/lib/supabase'; // Adjust path if necessary
import { UserRole, User } from '@/types'; // Adjust path if necessary

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  requiresConfirmation: boolean;

  login: (email: string, password: string) => Promise<void>;
  // *** MODIFIED: Removed userData from the type here ***
  register: (name: string, email: string, password: string, role: UserRole) => Promise<{ requiresConfirmation: boolean }>;
  logout: () => Promise<void>;
  verifySession: () => Promise<void>;
  resendConfirmation: (email: string) => Promise<void>;
  updateProfileImage: (url: string) => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      error: null,
      isAuthenticated: false,
      requiresConfirmation: false,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (signInError) throw signInError;
          if (!authData.user) throw new Error('Login failed: No user data returned.');

          // Fetch profile from 'users' table - this should exist now thanks to the trigger
          const { data: profile, error: profileError } = await supabase
            .from('users')
            .select('*')
            .eq('id', authData.user.id)
            .single();

          // Handle case where profile might be missing (trigger failed, deleted, etc.)
          if (profileError || !profile) {
            console.error(`Profile fetch failed after login for ${authData.user.id}:`, profileError);
            await get().logout(); // Log out user if profile is inconsistent
            throw new Error(profileError?.message ?? 'User profile not found after login.');
          }

          set({
            user: {
              id: authData.user.id,
              email: authData.user.email!,
              name: profile.name,
              role: profile.role as UserRole,
              profileImage: profile.profile_image ?? undefined,
              address: profile.address ?? undefined,
              phone: profile.phone ?? undefined,
              pinCode: profile.pin_code ?? undefined,
            },
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'An unknown login error occurred.';
          console.error("Login Error:", errorMessage, error);
          set({
            error: errorMessage,
            isLoading: false,
            isAuthenticated: false,
            user: null,
          });
          throw error;
        }
      },

      // *** MODIFIED register function ***
      register: async (name, email, password, role) => { // Removed userData parameter
        set({ isLoading: true, error: null, requiresConfirmation: false });
        try {
          // Step 1: Sign up the user, passing name and role in metadata for the database trigger
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
              // This data is used by the handle_new_user trigger in the database
              data: {
                name: name, // Pass name for the trigger
                role: role   // Pass role for the trigger
              },
              // Configure your email redirect URL if using email confirmation deep links
              // emailRedirectTo: 'yourapp://auth/confirm' // Example deep link
            },
          });

          // Handle Supabase Auth Errors
          if (signUpError) {
            console.error("Supabase signUp Error:", signUpError);
            throw signUpError; // Throw the specific Supabase error
          }

          // --- Profile insertion is now handled by the database trigger ---
          // --- NO client-side supabase.from('users').insert(...) call ---

          // Determine if email confirmation is required based on the session object
          // If signUpData.session exists, the user is likely auto-confirmed or confirmation is off
          const confirmationRequired = !signUpData.session;
          let registeredUser: User | null = null;

          // If confirmation is NOT required AND we have user data (auto-confirm / confirmation disabled)
          // We can set a basic user object in the state immediately.
          if (!confirmationRequired && signUpData.user) {
             registeredUser = {
                 id: signUpData.user.id,
                 email: signUpData.user.email!,
                 name: name, // Use name passed to register function
                 role: role, // Use role passed to register function
                 // Profile details like address, phone, pinCode, profileImage
                 // will be NULL initially (inserted by trigger) and need to be fetched
                 // separately via verifySession or login later.
             };
          }

          // Update the store state
          set({
            isLoading: false,
            isAuthenticated: !confirmationRequired, // User is authenticated only if no confirmation needed
            user: registeredUser, // Set basic user object if authenticated now, otherwise null
            requiresConfirmation: confirmationRequired,
            error: null, // Clear any previous error
          });

          console.log(`Registration initiated for ${email}. Confirmation required: ${confirmationRequired}`);
          // Return whether confirmation is needed so the UI can navigate appropriately
          return { requiresConfirmation: confirmationRequired };

        } catch (error) {
          // Catch errors from supabase.auth.signUp or other issues
          const errorMessage = error instanceof Error ? error.message : 'An unknown registration error occurred.';
           console.error("Registration Process Error:", errorMessage, error);
          set({
            error: errorMessage, // Set the error message in the store
            isLoading: false,
            isAuthenticated: false,
            user: null,
            requiresConfirmation: false,
          });
          throw error; // Re-throw the error so the UI component's catch block can handle it if needed
        }
      }, // End register function


      logout: async () => {
        set({ isLoading: true });
        try {
          const { error } = await supabase.auth.signOut();
          if (error) throw error;
          // Clear local state completely on logout
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
            requiresConfirmation: false,
          });
        } catch (error) {
           const errorMessage = error instanceof Error ? error.message : 'Logout failed';
           console.error("Logout Error:", errorMessage, error);
          set({
            error: errorMessage,
            isLoading: false // Ensure loading is stopped even on error
          });
          throw error;
        }
      },


      verifySession: async () => {
        set({ isLoading: true, error: null });
        try {
          const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

          if (sessionError) throw sessionError;

          if (!sessionData.session || !sessionData.session.user) {
             set({ user: null, isAuthenticated: false, isLoading: false, error: null, requiresConfirmation: false });
             return;
          }

          // Session exists, fetch the full profile from public.users
          const { data: profile, error: profileError } = await supabase
            .from('users')
            .select('*')
            .eq('id', sessionData.session.user.id)
            .single();

          // Handle profile fetch errors or missing profile
          if (profileError || !profile) {
             console.error("Error fetching profile during verifySession or profile missing:", profileError);
             await get().logout(); // Log out user if profile is inconsistent
             set({ error: profileError?.message ?? "User profile missing during session verification." });
             return;
          }

          // Successfully verified session and fetched profile
          set({
            user: {
              id: sessionData.session.user.id,
              email: sessionData.session.user.email!,
              name: profile.name,
              role: profile.role as UserRole,
              profileImage: profile.profile_image ?? undefined,
              address: profile.address ?? undefined,
              phone: profile.phone ?? undefined,
              pinCode: profile.pin_code ?? undefined,
            },
            isAuthenticated: true,
            isLoading: false,
            error: null,
            requiresConfirmation: false, // User is confirmed if they have a valid session
          });
        } catch (error) {
           const errorMessage = error instanceof Error ? error.message : 'Failed to verify session';
           console.error("Verify Session Error:", errorMessage, error);
           await get().logout(); // Log out on failure
           set({ isLoading: false, error: errorMessage }); // Stop loading, set error
        }
      },


       updateProfileImage: async (url: string) => {
        const user = get().user;
        if (!user) {
          console.warn("Attempted to update profile image with no user logged in.");
          return;
        }

        set({ isLoading: true });
        try {
          const { error } = await supabase
            .from('users')
            .update({ profile_image: url })
            .eq('id', user.id); // RLS policy must allow this update

          if (error) throw error;

          // Update local state immediately
          set(state => ({
            user: state.user ? { ...state.user, profileImage: url } : null,
            isLoading: false,
            error: null,
          }));
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to update profile image';
          console.error("Update Profile Image Error:", errorMessage, error);
          set({
             isLoading: false,
             error: errorMessage
           });
        }
      },


      resendConfirmation: async (email: string) => {
        set({ isLoading: true, error: null });
        try {
          const { error } = await supabase.auth.resend({
            type: 'signup', // Use 'signup' for initial account confirmation email
            email: email,
            // options: {
            //   emailRedirectTo: 'yourapp://auth/confirm' // Use your deep link if needed
            // }
          });
          if (error) throw error;
          set({ isLoading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to resend confirmation email';
          console.error("Resend Confirmation Error:", errorMessage, error);
          set({
            isLoading: false,
            error: errorMessage
          });
          throw error; // Re-throw for UI feedback
        }
      },


      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage-v1', // Use a consistent name for AsyncStorage key
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);