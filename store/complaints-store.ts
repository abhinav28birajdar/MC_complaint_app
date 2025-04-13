import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Complaint, ComplaintStatus, ComplaintType } from '@/types';
import { supabase } from '@/lib/supabase';

interface ComplaintsState {
  complaints: Complaint[];
  isLoading: boolean;
  error: string | null;

  fetchComplaints: () => Promise<void>;
  fetchUserComplaints: (userId: string) => Promise<Complaint[]>;
  fetchEmployeeComplaints: (employeeId: string) => Promise<Complaint[]>;
  addComplaint: (complaint: Omit<Complaint, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => Promise<Complaint>;
  updateComplaintStatus: (complaintId: string, status: ComplaintStatus, notes?: string) => Promise<void>;
  assignComplaint: (complaintId: string, employeeId: string) => Promise<void>;
  clearError: () => void;
}

export const useComplaintsStore = create<ComplaintsState>()(
  persist(
    (set, get) => ({
      complaints: [],
      isLoading: false,
      error: null,

      fetchComplaints: async () => {
        set({ isLoading: true, error: null });
        try {
          const { data, error } = await supabase
            .from('complaints')
            .select('*')
            .order('created_at', { ascending: false });
          
          if (error) throw error;
          
          const formattedComplaints = data.map(complaint => ({
            ...complaint,
            citizenId: complaint.citizen_id,
            employeeId: complaint.employee_id,
            createdAt: new Date(complaint.created_at).getTime(),
            updatedAt: new Date(complaint.updated_at).getTime(),
            resolvedAt: complaint.resolved_at ? new Date(complaint.resolved_at).getTime() : undefined
          }));
          
          set({ complaints: formattedComplaints, isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to fetch complaints',
            isLoading: false,
          });
        }
      },

      fetchUserComplaints: async (userId: string) => {
        set({ isLoading: true, error: null });
        try {
          const { data, error } = await supabase
            .from('complaints')
            .select('*')
            .eq('citizen_id', userId)
            .order('created_at', { ascending: false });
          
          if (error) throw error;
          
          const userComplaints = data.map(complaint => ({
            ...complaint,
            citizenId: complaint.citizen_id,
            employeeId: complaint.employee_id,
            createdAt: new Date(complaint.created_at).getTime(),
            updatedAt: new Date(complaint.updated_at).getTime(),
            resolvedAt: complaint.resolved_at ? new Date(complaint.resolved_at).getTime() : undefined
          }));
          
          set({ isLoading: false });
          return userComplaints;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to fetch user complaints',
            isLoading: false,
          });
          return [];
        }
      },

      fetchEmployeeComplaints: async (employeeId: string) => {
        set({ isLoading: true, error: null });
        try {
          const { data, error } = await supabase
            .from('complaints')
            .select('*')
            .eq('employee_id', employeeId)
            .order('created_at', { ascending: false });
          
          if (error) throw error;
          
          const employeeComplaints = data.map(complaint => ({
            ...complaint,
            citizenId: complaint.citizen_id,
            employeeId: complaint.employee_id,
            createdAt: new Date(complaint.created_at).getTime(),
            updatedAt: new Date(complaint.updated_at).getTime(),
            resolvedAt: complaint.resolved_at ? new Date(complaint.resolved_at).getTime() : undefined
          }));
          
          set({ isLoading: false });
          return employeeComplaints;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to fetch employee complaints',
            isLoading: false,
          });
          return [];
        }
      },

      addComplaint: async (complaintData) => {
        set({ isLoading: true, error: null });
        try {
          const newComplaint = {
            type: complaintData.type,
            description: complaintData.description,
            location: complaintData.location,
            media: complaintData.media,
            status: 'pending',
            citizen_id: complaintData.citizenId,
            priority: complaintData.priority || 'medium'
          };

          const { data, error } = await supabase
            .from('complaints')
            .insert(newComplaint)
            .select()
            .single();
          
          if (error) throw error;
          
          const formattedComplaint = {
            ...data,
            citizenId: data.citizen_id,
            employeeId: data.employee_id,
            createdAt: new Date(data.created_at).getTime(),
            updatedAt: new Date(data.updated_at).getTime(),
            resolvedAt: data.resolved_at ? new Date(data.resolved_at).getTime() : undefined
          };

          set(state => ({
            complaints: [formattedComplaint, ...state.complaints],
            isLoading: false,
          }));

          return formattedComplaint;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to add complaint',
            isLoading: false,
          });
          throw error;
        }
      },

      updateComplaintStatus: async (complaintId, status, notes) => {
        set({ isLoading: true, error: null });
        try {
          const updateData: any = {
            status,
            updated_at: new Date().toISOString()
          };
          
          if (notes) updateData.notes = notes;
          if (status === 'resolved') updateData.resolved_at = new Date().toISOString();
          
          const { error } = await supabase
            .from('complaints')
            .update(updateData)
            .eq('id', complaintId);
          
          if (error) throw error;

          set(state => ({
            complaints: state.complaints.map(c =>
              c.id === complaintId
                ? {
                    ...c,
                    status,
                    notes: notes || c.notes,
                    updatedAt: Date.now(),
                    ...(status === 'resolved' ? { resolvedAt: Date.now() } : {}),
                  }
                : c
            ),
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to update status',
            isLoading: false,
          });
        }
      },

      assignComplaint: async (complaintId, employeeId) => {
        set({ isLoading: true, error: null });
        try {
          const { error } = await supabase
            .from('complaints')
            .update({
              employee_id: employeeId,
              updated_at: new Date().toISOString(),
              status: 'inProgress'
            })
            .eq('id', complaintId);
          
          if (error) throw error;

          set(state => ({
            complaints: state.complaints.map(c =>
              c.id === complaintId
                ? {
                    ...c,
                    employeeId,
                    updatedAt: Date.now(),
                    status: 'inProgress'
                  }
                : c
            ),
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to assign complaint',
            isLoading: false,
          });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'complaints-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);