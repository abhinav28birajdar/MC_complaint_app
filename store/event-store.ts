import { create } from "zustand";
import { Event } from "@/types";
import { mockEvents } from "@/mocks/events";

interface EventState {
  events: Event[];
  isLoading: boolean;
  error: string | null;
  
  fetchEvents: () => Promise<void>;
  getEventById: (id: string) => Event | undefined;
  createEvent: (event: Omit<Event, "id" | "createdAt">) => Promise<Event>;
  updateEvent: (id: string, eventData: Partial<Event>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
}

export const useEventStore = create<EventState>((set, get) => ({
  events: [],
  isLoading: false,
  error: null,
  
  fetchEvents: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      set({ events: mockEvents, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : "An error occurred", 
        isLoading: false 
      });
    }
  },
  
  getEventById: (id) => {
    return get().events.find(e => e.id === id);
  },
  
  createEvent: async (eventData) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newEvent: Event = {
        id: `event-${Date.now()}`,
        ...eventData,
        createdAt: new Date().toISOString()
      };
      
      set(state => ({
        events: [...state.events, newEvent],
        isLoading: false
      }));
      
      return newEvent;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : "An error occurred", 
        isLoading: false 
      });
      throw error;
    }
  },
  
  updateEvent: async (id, eventData) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      set(state => ({
        events: state.events.map(e => 
          e.id === id ? { ...e, ...eventData } : e
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
  
  deleteEvent: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      set(state => ({
        events: state.events.filter(e => e.id !== id),
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