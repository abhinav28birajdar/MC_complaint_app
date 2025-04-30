import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Notification, UserRole } from "@/types";
import { mockNotifications } from "@/mocks/notifications";

interface NotificationState {
  notifications: Notification[];
  isLoading: boolean;
  error: string | null;
  
  fetchNotifications: () => Promise<void>;
  fetchUserNotifications: (userId: string, userRole: UserRole) => Promise<Notification[]>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: (userId: string) => Promise<void>;
  addNotification: (notification: Omit<Notification, "id" | "timestamp" | "read">) => Promise<Notification>;
  clearNotifications: (userId: string) => Promise<void>;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [],
      isLoading: false,
      error: null,
      
      fetchNotifications: async () => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          set({ notifications: mockNotifications, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : "An error occurred", 
            isLoading: false 
          });
        }
      },
      
      fetchUserNotifications: async (userId, userRole) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const userNotifications = mockNotifications.filter(
            n => n.userId === userId && n.userRole === userRole
          );
          return userNotifications;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : "An error occurred", 
            isLoading: false 
          });
          return [];
        } finally {
          set({ isLoading: false });
        }
      },
      
      markAsRead: async (notificationId) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 300));
          
          set(state => ({
            notifications: state.notifications.map(n => 
              n.id === notificationId ? { ...n, read: true } : n
            ),
            isLoading: false
          }));
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : "An error occurred", 
            isLoading: false 
          });
          throw error;
        }
      },
      
      markAllAsRead: async (userId) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          set(state => ({
            notifications: state.notifications.map(n => 
              n.userId === userId ? { ...n, read: true } : n
            ),
            isLoading: false
          }));
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : "An error occurred", 
            isLoading: false 
          });
          throw error;
        }
      },
      
      addNotification: async (notificationData) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 300));
          
          const newNotification: Notification = {
            id: `notification-${Date.now()}`,
            ...notificationData,
            timestamp: new Date().toISOString(),
            read: false
          };
          
          set(state => ({
            notifications: [...state.notifications, newNotification],
            isLoading: false
          }));
          
          return newNotification;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : "An error occurred", 
            isLoading: false 
          });
          throw error;
        }
      },
      
      clearNotifications: async (userId) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          set(state => ({
            notifications: state.notifications.filter(n => n.userId !== userId),
            isLoading: false
          }));
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : "An error occurred", 
            isLoading: false 
          });
          throw error;
        }
      }
    }),
    {
      name: "notification-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);