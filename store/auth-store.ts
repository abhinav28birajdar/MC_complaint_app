import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/lib/supabase';
import { UserRole } from '@/types';

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  profileImage?: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  requiresConfirmation: boolean;
  
  login: (email: string, password: string) => Promise<void>;
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
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
          });
          
          if (error) throw error;
          if (!data.user) throw new Error('No user returned');
          
          const { data: profile } = await supabase
            .from('users')
            .select('*')
            .eq('id', data.user.id)
            .single();
            
          if (!profile) throw new Error('User profile not found');
          
          set({
            user: {
              id: data.user.id,
              email: data.user.email!,
              name: profile.name,
              role: profile.role,
              profileImage: profile.profile_image
            },
            isAuthenticated: true,
            isLoading: false
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Login failed',
            isLoading: false
          });
          throw error;
        }
      },
      
      register: async (name, email, password, role) => {
        set({ isLoading: true, error: null });
        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: { name, role }
            }
          });

          if (error) throw error;
          if (!data.user) throw new Error('Registration failed');

          const { error: profileError } = await supabase
            .from('users')
            .upsert({
              id: data.user.id,
              email,
              name,
              role
            });

          if (profileError) throw profileError;

          set({ 
            isLoading: false,
            requiresConfirmation: !data.session 
          });

          return { requiresConfirmation: !data.session };
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Registration failed',
            isLoading: false
          });
          throw error;
        }
      },
      
      logout: async () => {
        set({ isLoading: true });
        try {
          const { error } = await supabase.auth.signOut();
          if (error) throw error;
          
          set({ 
            user: null, 
            isAuthenticated: false,
            isLoading: false 
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Logout failed',
            isLoading: false
          });
          throw error;
        }
      },
      
      verifySession: async () => {
        set({ isLoading: true });
        try {
          const { data } = await supabase.auth.getSession();
          if (!data.session) {
            set({ isLoading: false });
            return;
          }
          
          const { data: profile } = await supabase
            .from('users')
            .select('*')
            .eq('id', data.session.user.id)
            .single();
            
          set({
            user: {
              id: data.session.user.id,
              email: data.session.user.email!,
              name: profile.name,
              role: profile.role,
              profileImage: profile.profile_image
            },
            isAuthenticated: true,
            isLoading: false
          });
        } catch (error) {
          set({ 
            isLoading: false,
            isAuthenticated: false
          });
        }
      },
      
      updateProfileImage: async (url: string) => {
        const user = get().user;
        if (!user) return;
        
        try {
          const { error } = await supabase
            .from('users')
            .update({ profile_image: url })
            .eq('id', user.id);
            
          if (error) throw error;
          
          set({
            user: {
              ...user,
              profileImage: url
            }
          });
        } catch (error) {
          console.error('Failed to update profile image:', error);
        }
      },
      
      resendConfirmation: async (email: string) => {
        set({ isLoading: true });
        try {
          const { error } = await supabase.auth.resend({
            type: 'signup',
            email,
            options: {
              emailRedirectTo: `${window.location.origin}/auth/confirm`
            }
          });
          if (error) throw error;
        } catch (error) {
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
      
      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);