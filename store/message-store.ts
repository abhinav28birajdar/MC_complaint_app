import { create } from "zustand";
import { Message } from "@/types";
import { mockMessages } from "@/mocks/messages";

interface MessageState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  
  fetchMessages: () => Promise<void>;
  fetchComplaintMessages: (complaintId: string) => Promise<Message[]>;
  sendMessage: (message: Omit<Message, "id" | "timestamp" | "read">) => Promise<Message>;
  markAsRead: (messageId: string) => Promise<void>;
}

export const useMessageStore = create<MessageState>((set, get) => ({
  messages: [],
  isLoading: false,
  error: null,
  
  fetchMessages: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      set({ messages: mockMessages, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : "An error occurred", 
        isLoading: false 
      });
    }
  },
  
  fetchComplaintMessages: async (complaintId) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const complaintMessages = mockMessages.filter(m => m.complaintId === complaintId);
      return complaintMessages;
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
  
  sendMessage: async (messageData) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newMessage: Message = {
        id: `message-${Date.now()}`,
        ...messageData,
        timestamp: new Date().toISOString(),
        read: false
      };
      
      set(state => ({
        messages: [...state.messages, newMessage],
        isLoading: false
      }));
      
      return newMessage;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : "An error occurred", 
        isLoading: false 
      });
      throw error;
    }
  },
  
  markAsRead: async (messageId) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      set(state => ({
        messages: state.messages.map(m => 
          m.id === messageId ? { ...m, read: true } : m
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
  }
}));
