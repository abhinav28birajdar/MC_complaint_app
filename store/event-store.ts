// File: store/event-store.ts
import { create } from "zustand";
import { Event } from "@/types"; // camelCase type
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "./auth-store";

interface EventState {
  events: Event[];
  isLoading: boolean;
  error: string | null;

  fetchEvents: () => Promise<void>;
  getEventById: (id: string) => Promise<Event | null>;
  createEvent: (eventData: Omit<Event, "id" | "createdAt" | "createdBy">) => Promise<Event>;
  updateEvent: (id: string, eventData: Partial<Omit<Event, "id" | "createdAt" | "createdBy">>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
}

export const useEventStore = create<EventState>((set, get) => ({
  events: [],
  isLoading: false,
  error: null,

  fetchEvents: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('events') // DB table name
        .select('*')
        .order('date', { ascending: true }); // Order by event date

      if (error) throw error;
      set({ events: data as Event[], isLoading: false });
    } catch (error: any) {
      console.error("Failed to fetch events:", error.message);
      set({
        error: error.message || "Failed to fetch events",
        isLoading: false
      });
    }
  },

  getEventById: async (id) => {
    const cached = get().events.find(e => e.id === id);
    // if (cached) return cached; // Optional immediate return

    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single();

       if (error) {
         if (error.code === 'PGRST116') {
           set({ isLoading: false }); return null;
         }
         throw error;
       }
      set({ isLoading: false });
      return data as Event;
    } catch (error: any) {
       console.error("Failed to fetch event by ID:", error.message);
      set({
        error: error.message || "Failed to fetch event details",
        isLoading: false
      });
      return null;
    }
  },

  createEvent: async (eventData) => {
     const userId = useAuthStore.getState().user?.id;
     if (!userId) {
       const errorMsg = "User must be logged in to create an event.";
       set({ error: errorMsg, isLoading: false });
       throw new Error(errorMsg);
     }

    set({ isLoading: true, error: null });
    try {
       // Map to snake_case for DB
      const newEventDataForDb = {
        title: eventData.title,
        description: eventData.description,
        date: eventData.date,
        photo_url: eventData.photoUrl,
        created_by: userId,
         // created_at handled by DB
      };

      const { data, error } = await supabase
        .from('events')
        .insert(newEventDataForDb)
        .select()
        .single();

      if (error) throw error;

      set(state => ({
        // Add event, potentially sorting by date
        events: [...state.events, data as Event].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
        isLoading: false
      }));

      return data as Event;
    } catch (error: any) {
      console.error("Failed to create event:", error.message);
      set({
        error: error.message || "Failed to create event",
        isLoading: false
      });
      throw error;
    }
  },

  updateEvent: async (id, eventData) => {
    set({ isLoading: true, error: null });
    try {
      // Map partial camelCase data to snake_case for DB update
      const updatePayload: any = {};
      if (eventData.title !== undefined) updatePayload.title = eventData.title;
      if (eventData.description !== undefined) updatePayload.description = eventData.description;
      if (eventData.date !== undefined) updatePayload.date = eventData.date;
      if (eventData.photoUrl !== undefined) updatePayload.photo_url = eventData.photoUrl;
      // created_by and created_at should generally not be updated

      if (Object.keys(updatePayload).length === 0) {
         set({ isLoading: false }); // Nothing to update
         return;
      }


      const { error } = await supabase
        .from('events')
        .update(updatePayload)
        .eq('id', id);

      if (error) throw error;

      set(state => ({
        events: state.events.map(e =>
          e.id === id ? { ...e, ...eventData } : e // Update local state with camelCase data
        ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()), // Re-sort if date changed
        isLoading: false
      }));
    } catch (error: any) {
      console.error("Failed to update event:", error.message);
      set({
        error: error.message || "Failed to update event",
        isLoading: false
      });
      throw error;
    }
  },

  deleteEvent: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set(state => ({
        events: state.events.filter(e => e.id !== id), // Remove from local state
        isLoading: false
      }));
    } catch (error: any) {
      console.error("Failed to delete event:", error.message);
      set({
        error: error.message || "Failed to delete event",
        isLoading: false
      });
      throw error;
    }
  }
}));