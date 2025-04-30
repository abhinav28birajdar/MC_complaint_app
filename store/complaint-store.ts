import { create } from "zustand";
import { Complaint, ComplaintStatus, ComplaintUpdate } from "@/types";
import { mockComplaints } from "@/mocks/complaints";

interface ComplaintState {
  complaints: Complaint[];
  isLoading: boolean;
  error: string | null;
  
  fetchComplaints: () => Promise<void>;
  fetchUserComplaints: (userId: string) => Promise<Complaint[]>;
  fetchAssignedComplaints: (employeeId: string) => Promise<Complaint[]>;
  getComplaintById: (id: string) => Complaint | undefined;
  createComplaint: (complaint: Omit<Complaint, "id" | "createdAt" | "updatedAt" | "status">) => Promise<Complaint>;
  updateComplaintStatus: (complaintId: string, status: ComplaintStatus, notes?: string, photoUrls?: string[]) => Promise<void>;
  assignComplaint: (complaintId: string, employeeId: string) => Promise<void>;
}

export const useComplaintStore = create<ComplaintState>((set, get) => ({
  complaints: [],
  isLoading: false,
  error: null,
  
  fetchComplaints: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      set({ complaints: mockComplaints, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : "An error occurred", 
        isLoading: false 
      });
    }
  },
  
  fetchUserComplaints: async (userId) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const userComplaints = mockComplaints.filter(c => c.citizenId === userId);
      return userComplaints;
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
  
  fetchAssignedComplaints: async (employeeId) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const assignedComplaints = mockComplaints.filter(c => c.assignedEmployeeId === employeeId);
      return assignedComplaints;
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
  
  getComplaintById: (id) => {
    return get().complaints.find(c => c.id === id);
  },
  
  createComplaint: async (complaintData) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newComplaint: Complaint = {
        id: `complaint-${Date.now()}`,
        ...complaintData,
        status: "new",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      set(state => ({
        complaints: [...state.complaints, newComplaint],
        isLoading: false
      }));
      
      return newComplaint;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : "An error occurred", 
        isLoading: false 
      });
      throw error;
    }
  },
  
  updateComplaintStatus: async (complaintId, status, notes, photoUrls) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      set(state => ({
        complaints: state.complaints.map(c => 
          c.id === complaintId 
            ? { ...c, status, updatedAt: new Date().toISOString() } 
            : c
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
  
  assignComplaint: async (complaintId, employeeId) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      set(state => ({
        complaints: state.complaints.map(c => 
          c.id === complaintId 
            ? { 
                ...c, 
                assignedEmployeeId: employeeId, 
                status: "assigned", 
                updatedAt: new Date().toISOString() 
              } 
            : c
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