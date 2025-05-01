// File: store/message-store.ts
import { create } from "zustand";
import { Message } from "@/types"; // camelCase type
import { supabase } from "@/lib/supabase";
// import { useAuthStore } from "./auth-store"; // Needed if sender isn't passed explicitly

interface MessageState {
  // Storing all messages might be inefficient; consider scoping by complaint ID if needed
  // messages: { [complaintId: string]: Message[] };
  isLoading: boolean;
  error: string | null;

  fetchComplaintMessages: (complaintId: string) => Promise<Message[]>;
  sendMessage: (messageData: Omit<Message, "id" | "timestamp" | "read">) => Promise<Message>;
  // markAsRead is complex with real-time; often handled by UI/subscriptions
  // markAsRead: (messageId: string) => Promise<void>;
}

export const useMessageStore = create<MessageState>((set, get) => ({
  isLoading: false,
  error: null,

  fetchComplaintMessages: async (complaintId) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('messages') // DB table name
        .select('*')
        .eq('complaint_id', complaintId) // snake_case column
        .order('timestamp', { ascending: true }); // Oldest first

      if (error) throw error;
      set({ isLoading: false });
      return data as Message[]; // Return messages for this complaint
    } catch (error: any) {
      console.error("Failed to fetch messages:", error.message);
      set({
        error: error.message || "Failed to fetch messages",
        isLoading: false
      });
      return [];
    }
  },

  sendMessage: async (messageData) => {
    // Assuming messageData contains senderId, senderRole, receiverId, complaintId, message
    // const senderId = useAuthStore.getState().user?.id; // Or get from messageData
    // if (!senderId) throw new Error("User must be logged in to send messages");

    set({ isLoading: true, error: null }); // Indicate sending
    try {
       // Map to snake_case for DB
      const newMessageDataForDb = {
         complaint_id: messageData.complaintId,
         sender_id: messageData.senderId,
         sender_role: messageData.senderRole,
         receiver_id: messageData.receiverId,
         message: messageData.message,
         // read is false by default in DB
         // timestamp is set by DB default
      };

      const { data, error } = await supabase
        .from('messages')
        .insert(newMessageDataForDb)
        .select()
        .single();

      if (error) throw error;

      set({ isLoading: false }); // Sending finished
      // Note: We don't add to a central store here, rely on fetchComplaintMessages
      // Or, if using real-time, subscription would add it.
      return data as Message;
    } catch (error: any) {
      console.error("Failed to send message:", error.message);
      set({
        error: error.message || "Failed to send message",
        isLoading: false
      });
      throw error;
    }
  },

  // markAsRead: async (messageId) => { ... } // Implementation depends on requirements
}));