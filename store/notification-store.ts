// File: store/notification-store.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Notification, UserRole } from "@/types"; // camelCase types
import { supabase } from "@/lib/supabase";
// import { useAuthStore } from "./auth-store"; // To get current user ID/role

interface NotificationState {
  notifications: Notification[]; // Persisted notifications
  isLoading: boolean;
  error: string | null;
  lastFetchedUserId: string | null; // Track for whom notifications were fetched

  fetchUserNotifications: (userId: string, userRole: UserRole) => Promise<void>; // Fetches AND sets state
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: (userId: string) => Promise<void>;
  addNotification: (notificationData: Omit<Notification, "id" | "timestamp" | "read">) => Promise<Notification | null>; // Can be called server-side potentially
  clearNotifications: (userId: string) => Promise<void>; // Clear local and potentially remote
  getUnreadCount: () => number; // Added helper
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [],
      isLoading: false,
      error: null,
      lastFetchedUserId: null,

      fetchUserNotifications: async (userId, userRole) => {
         // Avoid refetching for the same user unless needed
         // if (get().lastFetchedUserId === userId && get().notifications.length > 0) {
         //    return;
         // }

        set({ isLoading: true, error: null });
        try {
          const { data, error } = await supabase
            .from('notifications') // DB table name
            .select('*')
            .eq('user_id', userId) // snake_case column
            // .eq('user_role', userRole) // Filter by role if needed, index this column!
            .order('timestamp', { ascending: false }); // Newest first

          if (error) throw error;
          set({ notifications: data as Notification[], isLoading: false, lastFetchedUserId: userId });
        } catch (error: any) {
           console.error("Failed to fetch notifications:", error.message);
          set({
            error: error.message || "Failed to fetch notifications",
            isLoading: false,
            lastFetchedUserId: null, // Reset last fetched on error
             notifications: [], // Clear notifications on error? Or keep stale?
          });
        }
      },

      markAsRead: async (notificationId) => {
        // Optimistic update
        const originalNotifications = get().notifications;
        set(state => ({
           notifications: state.notifications.map(n =>
             n.id === notificationId ? { ...n, read: true } : n
           ),
        }));

        // set({ isLoading: true }); // Avoid showing loading for quick actions
        try {
          const { error } = await supabase
            .from('notifications')
            .update({ read: true }) // snake_case column
            .eq('id', notificationId);

          if (error) {
             // Revert optimistic update on error
             set({ notifications: originalNotifications, error: error.message || "Failed to mark notification as read" });
             throw error;
          }
           set({ error: null }); // Clear error on success
          // isLoading remains false
        } catch (error: any) {
          console.error("Failed to mark notification as read:", error.message);
           // Error is already set in the catch block above
           // set({ isLoading: false }); // Ensure loading is false
        }
      },

      markAllAsRead: async (userId) => {
        // Optimistic update
        const originalNotifications = get().notifications;
         set(state => ({
           notifications: state.notifications.map(n =>
             n.userId === userId ? { ...n, read: true } : n // Ensure userId matches
           ),
         }));

        // set({ isLoading: true });
        try {
          const { error } = await supabase
            .from('notifications')
            .update({ read: true })
            .eq('user_id', userId)
            .eq('read', false); // Only update unread ones

          if (error) {
             set({ notifications: originalNotifications, error: error.message || "Failed to mark all notifications as read" });
             throw error;
          }
           set({ error: null });
        } catch (error: any) {
          console.error("Failed to mark all notifications as read:", error.message);
          // Error already set
          // set({ isLoading: false });
        }
      },

      // This function might be called from backend triggers more often than client-side
      addNotification: async (notificationData) => {
        // Don't set loading as this might be background
        try {
          // Map camelCase to snake_case for DB
           const newNotificationForDb = {
              user_id: notificationData.userId,
              user_role: notificationData.userRole,
              title: notificationData.title,
              message: notificationData.message,
              // read: false by default in DB
              // timestamp: set by DB default
           };

          const { data, error } = await supabase
            .from('notifications')
            .insert(newNotificationForDb)
            .select()
            .single();

          if (error) throw error;

          // Add to local state ONLY if it's for the currently fetched user
          if (get().lastFetchedUserId === notificationData.userId) {
            set(state => ({
              notifications: [data as Notification, ...state.notifications],
            }));
          }
          return data as Notification;
        } catch (error: any) {
          console.error("Failed to add notification:", error.message);
          // Don't set global error state for potential background failures
          return null;
        }
      },

      clearNotifications: async (userId) => {
        // Optimistic removal
        const originalNotifications = get().notifications;
         set(state => ({
            notifications: state.notifications.filter(n => n.userId !== userId)
         }));

        // set({ isLoading: true });
        try {
          // Choose whether to delete from DB or just hide locally
          // Deleting from DB:
          const { error } = await supabase
            .from('notifications')
            .delete()
            .eq('user_id', userId);

           if (error) {
              set({ notifications: originalNotifications, error: error.message || "Failed to clear notifications" });
              throw error;
           }
           set({ error: null });
        } catch (error: any) {
           console.error("Failed to clear notifications:", error.message);
           // Error already set
           // set({ isLoading: false });
        }
      },

      // Helper to get unread count
      getUnreadCount: () => {
         return get().notifications.filter(n => !n.read).length;
      }

    }),
    {
      name: "notification-storage", // Unique name
      storage: createJSONStorage(() => AsyncStorage),
       partialize: (state) => ({
         // Persist only the notifications list and potentially last fetched user
         notifications: state.notifications,
         lastFetchedUserId: state.lastFetchedUserId,
       }),
    }
  )
);

// Optional: Listen for new notifications via Supabase Realtime
// const notificationSubscription = supabase
//   .channel('public:notifications')
//   .on<Notification>( // Use the Notification type from types/index.ts
//     'postgres_changes',
//     { event: 'INSERT', schema: 'public', table: 'notifications' },
//     (payload) => {
//       console.log('New notification received via Realtime:', payload.new);
//       const newNotification = payload.new as Notification;
//       const { addNotification, lastFetchedUserId } = useNotificationStore.getState();
//       // Add notification to store only if it's for the current user
//       if (newNotification.userId === lastFetchedUserId) {
//          // Check if already added (to prevent duplicates if addNotification was also called manually)
//          if (!useNotificationStore.getState().notifications.some(n => n.id === newNotification.id)) {
//             set(state => ({
//               notifications: [newNotification, ...state.notifications],
//             }));
//          }
//       }
//       // Potentially trigger an OS notification here as well
//     }
//   )
//   .subscribe();

// Remember to unsubscribe when the app closes or user logs out
// notificationSubscription.unsubscribe();