// File: store/schedule-store.ts
import { create } from "zustand";
import { Schedule } from "@/types"; // camelCase type
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "./auth-store";

interface ScheduleState {
  schedules: Schedule[];
  isLoading: boolean;
  error: string | null;

  fetchSchedules: (filters?: { area?: string, eventType?: Schedule['eventType'] }) => Promise<void>;
  getScheduleById: (id: string) => Promise<Schedule | null>;
  createSchedule: (scheduleData: Omit<Schedule, "id" | "createdAt" | "createdBy">) => Promise<Schedule>;
  updateSchedule: (id: string, scheduleData: Partial<Omit<Schedule, "id" | "createdAt" | "createdBy">>) => Promise<void>;
  deleteSchedule: (id: string) => Promise<void>;
}

export const useScheduleStore = create<ScheduleState>((set, get) => ({
  schedules: [],
  isLoading: false,
  error: null,

  fetchSchedules: async (filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      let query = supabase
        .from('schedules') // DB table name
        .select('*')
        .order('schedule_date', { ascending: true }); // Order by date

       // Apply filters
       if (filters.area) {
         query = query.eq('area', filters.area); // snake_case column? Assume area is stored directly
       }
       if (filters.eventType) {
          query = query.eq('event_type', filters.eventType); // snake_case column
       }

      const { data, error } = await query;

      if (error) throw error;
      set({ schedules: data as Schedule[], isLoading: false });
    } catch (error: any) {
      console.error("Failed to fetch schedules:", error.message);
      set({
        error: error.message || "Failed to fetch schedules",
        isLoading: false
      });
    }
  },

  getScheduleById: async (id) => {
     const cached = get().schedules.find(s => s.id === id);
     // if (cached) return cached;

    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('schedules')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') { set({isLoading: false}); return null;}
        throw error;
      }
      set({ isLoading: false });
      return data as Schedule;
    } catch (error: any) {
      console.error("Failed to fetch schedule by ID:", error.message);
      set({
        error: error.message || "Failed to fetch schedule details",
        isLoading: false
      });
      return null;
    }
  },

  createSchedule: async (scheduleData) => {
    const userId = useAuthStore.getState().user?.id;
    if (!userId) {
      const errorMsg = "User must be logged in to create a schedule.";
      set({ error: errorMsg, isLoading: false });
      throw new Error(errorMsg);
    }

    set({ isLoading: true, error: null });
    try {
       // Map camelCase to snake_case for DB
       const newScheduleForDb = {
          area: scheduleData.area,
          event_type: scheduleData.eventType,
          schedule_date: scheduleData.scheduleDate,
          remarks: scheduleData.remarks,
          created_by: userId,
          // created_at set by DB
       };

      const { data, error } = await supabase
        .from('schedules')
        .insert(newScheduleForDb)
        .select()
        .single();

      if (error) throw error;

      set(state => ({
        // Add and re-sort schedules
        schedules: [...state.schedules, data as Schedule].sort((a, b) => new Date(a.scheduleDate).getTime() - new Date(b.scheduleDate).getTime()),
        isLoading: false
      }));

      return data as Schedule;
    } catch (error: any) {
      console.error("Failed to create schedule:", error.message);
      set({
        error: error.message || "Failed to create schedule",
        isLoading: false
      });
      throw error;
    }
  },

  updateSchedule: async (id, scheduleData) => {
    set({ isLoading: true, error: null });
    try {
      // Map partial camelCase to snake_case for DB
      const updatePayload: any = {};
      if (scheduleData.area !== undefined) updatePayload.area = scheduleData.area;
      if (scheduleData.eventType !== undefined) updatePayload.event_type = scheduleData.eventType;
      if (scheduleData.scheduleDate !== undefined) updatePayload.schedule_date = scheduleData.scheduleDate;
      if (scheduleData.remarks !== undefined) updatePayload.remarks = scheduleData.remarks;
      // created_by, created_at not usually updated

      if (Object.keys(updatePayload).length === 0) {
          set({ isLoading: false }); return;
      }

      const { error } = await supabase
        .from('schedules')
        .update(updatePayload)
        .eq('id', id);

      if (error) throw error;

      set(state => ({
        schedules: state.schedules.map(s =>
          s.id === id ? { ...s, ...scheduleData } : s // Update local state with camelCase
        ).sort((a, b) => new Date(a.scheduleDate).getTime() - new Date(b.scheduleDate).getTime()), // Re-sort
        isLoading: false
      }));
    } catch (error: any) {
      console.error("Failed to update schedule:", error.message);
      set({
        error: error.message || "Failed to update schedule",
        isLoading: false
      });
      throw error;
    }
  },

  deleteSchedule: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('schedules')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set(state => ({
        schedules: state.schedules.filter(s => s.id !== id), // Remove from local state
        isLoading: false
      }));
    } catch (error: any) {
      console.error("Failed to delete schedule:", error.message);
      set({
        error: error.message || "Failed to delete schedule",
        isLoading: false
      });
      throw error;
    }
  }
}));