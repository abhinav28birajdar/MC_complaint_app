import { create } from "zustand";
import { Schedule } from "@/types";
import { mockSchedules } from "@/mocks/schedules";

interface ScheduleState {
  schedules: Schedule[];
  isLoading: boolean;
  error: string | null;
  
  fetchSchedules: () => Promise<void>;
  getScheduleById: (id: string) => Schedule | undefined;
  createSchedule: (schedule: Omit<Schedule, "id" | "createdAt">) => Promise<Schedule>;
  updateSchedule: (id: string, scheduleData: Partial<Schedule>) => Promise<void>;
  deleteSchedule: (id: string) => Promise<void>;
}

export const useScheduleStore = create<ScheduleState>((set, get) => ({
  schedules: [],
  isLoading: false,
  error: null,
  
  fetchSchedules: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      set({ schedules: mockSchedules, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : "An error occurred", 
        isLoading: false 
      });
    }
  },
  
  getScheduleById: (id) => {
    return get().schedules.find(s => s.id === id);
  },
  
  createSchedule: async (scheduleData) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newSchedule: Schedule = {
        id: `schedule-${Date.now()}`,
        ...scheduleData,
        createdAt: new Date().toISOString()
      };
      
      set(state => ({
        schedules: [...state.schedules, newSchedule],
        isLoading: false
      }));
      
      return newSchedule;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : "An error occurred", 
        isLoading: false 
      });
      throw error;
    }
  },
  
  updateSchedule: async (id, scheduleData) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      set(state => ({
        schedules: state.schedules.map(s => 
          s.id === id ? { ...s, ...scheduleData } : s
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
  
  deleteSchedule: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      set(state => ({
        schedules: state.schedules.filter(s => s.id !== id),
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