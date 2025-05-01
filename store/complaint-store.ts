// File: store/complaint-store.ts
import { create } from "zustand";
import { Complaint, ComplaintStatus, ComplaintUpdate } from "@/types"; // Using camelCase types
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "./auth-store"; // To get current user ID

interface ComplaintState {
  complaints: Complaint[]; // State uses camelCase
  isLoading: boolean;
  error: string | null;

  fetchComplaints: (filters?: { status?: ComplaintStatus, departmentId?: string }) => Promise<void>;
  fetchUserComplaints: (userId: string) => Promise<Complaint[]>;
  fetchAssignedComplaints: (employeeId: string) => Promise<Complaint[]>;
  getComplaintById: (id: string) => Promise<Complaint | null>;
  createComplaint: (complaintData: Omit<Complaint, "id" | "createdAt" | "updatedAt" | "status" | "resolvedAt" | "citizenId">) => Promise<Complaint>; // citizenId comes from auth user
  updateComplaintStatus: (complaintId: string, status: ComplaintStatus, notes?: string, photoUrls?: string[]) => Promise<void>;
  assignComplaint: (complaintId: string, employeeId: string, departmentId?: string) => Promise<void>; // Added departmentId
  getComplaintUpdates: (complaintId: string) => Promise<ComplaintUpdate[]>; // Added function
}

export const useComplaintStore = create<ComplaintState>((set, get) => ({
  complaints: [],
  isLoading: false,
  error: null,

  fetchComplaints: async (filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      let query = supabase
        .from('complaints') // DB table name
        .select('*') // Select all columns
        .order('created_at', { ascending: false }); // Order by creation date

      // Apply filters dynamically
      if (filters.status) {
         query = query.eq('status', filters.status);
      }
       if (filters.departmentId) {
         query = query.eq('department_id', filters.departmentId);
       }
       // Add more filters as needed (e.g., priority, date range)

      const { data, error } = await query;

      if (error) throw error;
      // Data from Supabase is snake_case, map to camelCase if necessary
      // Supabase JS v2 often does this automatically, but check console output if unsure
      set({ complaints: data as Complaint[], isLoading: false });
    } catch (error: any) {
      console.error("Failed to fetch complaints:", error.message);
      set({
        error: error.message || "Failed to fetch complaints",
        isLoading: false
      });
    }
  },

  fetchUserComplaints: async (userId) => {
    // Note: This might duplicate data if fetchComplaints was already called.
    // Consider filtering the main 'complaints' array if performance is critical
    // or ensure this is called specifically when only user complaints are needed.
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('complaints')
        .select('*')
        .eq('citizen_id', userId) // Use snake_case for DB column
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ isLoading: false }); // Don't overwrite main complaints array here
      return data as Complaint[];
    } catch (error: any) {
      console.error("Failed to fetch user complaints:", error.message);
      set({
        error: error.message || "Failed to fetch user complaints",
        isLoading: false
      });
      return [];
    }
  },

  fetchAssignedComplaints: async (employeeId) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('complaints')
        .select('*')
        .eq('assigned_employee_id', employeeId) // Use snake_case for DB column
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ isLoading: false }); // Don't overwrite main complaints array
      return data as Complaint[];
    } catch (error: any) {
      console.error("Failed to fetch assigned complaints:", error.message);
      set({
        error: error.message || "Failed to fetch assigned complaints",
        isLoading: false
      });
      return [];
    }
  },

  getComplaintById: async (id) => {
    // Check cache first
    const cachedComplaint = get().complaints.find(c => c.id === id);
    // if (cachedComplaint) return cachedComplaint; // Optional: return cached version immediately

    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('complaints')
        .select('*')
        .eq('id', id)
        .single(); // Expect one result

      if (error) {
        // Handle 'PGRST116' (resource not found) gracefully
        if (error.code === 'PGRST116') {
          set({ isLoading: false, error: null }); // Not really an error state
          return null;
        }
        throw error; // Throw other errors
      }
      set({ isLoading: false });
      return data as Complaint;
    } catch (error: any) {
      console.error("Failed to fetch complaint by ID:", error.message);
      set({
        error: error.message || "Failed to fetch complaint details",
        isLoading: false
      });
      return null;
    }
  },

  createComplaint: async (complaintData) => {
     const userId = useAuthStore.getState().user?.id;
     if (!userId) {
       const errorMsg = "User must be logged in to create a complaint.";
       set({ error: errorMsg, isLoading: false });
       throw new Error(errorMsg);
     }

    set({ isLoading: true, error: null });
    try {
       // Map camelCase from input (complaintData) to snake_case for DB insert
      const newComplaintDataForDb = {
        citizen_id: userId, // Get current user's ID
        type: complaintData.type,
        description: complaintData.description,
        photo_urls: complaintData.photoUrls,
        location_lat: complaintData.locationLat,
        location_long: complaintData.locationLong,
        address: complaintData.address,
        priority: complaintData.priority || 'normal', // Default priority
        status: 'new' as const, // Initial status
        department_id: complaintData.departmentId, // Optional
        // assigned_employee_id is initially null
        // created_at, updated_at are set by DB defaults
      };


      const { data, error } = await supabase
        .from('complaints')
        .insert(newComplaintDataForDb)
        .select() // Select the newly inserted row
        .single(); // Expect one row back

      if (error) throw error;

      // Add the new complaint (already in correct camelCase from select) to the state
      set(state => ({
        complaints: [data as Complaint, ...state.complaints],
        isLoading: false
      }));

      return data as Complaint;
    } catch (error: any) {
      console.error("Failed to create complaint:", error.message);
      set({
        error: error.message || "Failed to create complaint",
        isLoading: false
      });
      throw error; // Re-throw to allow UI to handle failure
    }
  },

  updateComplaintStatus: async (complaintId, status, notes, photoUrls) => {
     const userId = useAuthStore.getState().user?.id;
     if (!userId) {
       const errorMsg = "User must be logged in to update a complaint.";
       set({ error: errorMsg, isLoading: false });
       throw new Error(errorMsg);
     }

    set({ isLoading: true, error: null });
    try {
      const updatePayload: any = {
          status,
          updated_at: new Date().toISOString(),
      };
      if (status === 'completed') {
          updatePayload.resolved_at = new Date().toISOString();
      }

      // 1. Update the main complaint record
      const { error: updateError } = await supabase
        .from('complaints')
        .update(updatePayload) // Use snake_case if payload keys need mapping (Supabase might handle it)
        .eq('id', complaintId);

      if (updateError) throw updateError;

      // 2. Add a record to complaint_updates if notes or photos provided
      if (notes || (photoUrls && photoUrls.length > 0)) {
        const { error: logError } = await supabase
          .from('complaint_updates') // DB table name
          .insert({
            complaint_id: complaintId,
            status,
            notes: notes || undefined, // Use undefined if null/empty
            photo_urls: photoUrls,
            updated_by: userId, // ID of the user making the update
             // updated_at is set by DB default
          });
        if (logError) {
           console.warn("Complaint status updated, but failed to log update details:", logError.message);
           // Decide if this should be a partial success or throw error
           // throw new Error(`Status updated, but log failed: ${logError.message}`);
        }
      }

      // 3. Update local state
      set(state => ({
        complaints: state.complaints.map(c =>
          c.id === complaintId
            ? {
                ...c, // Spread existing complaint
                status: status, // Update status
                updatedAt: updatePayload.updated_at, // Use the same timestamp
                resolvedAt: status === 'completed' ? updatePayload.resolved_at : c.resolvedAt, // Update resolvedAt if completed
              }
            : c // Return other complaints unchanged
        ),
        isLoading: false
      }));
    } catch (error: any) {
      console.error("Failed to update complaint status:", error.message);
      set({
        error: error.message || "Failed to update complaint status",
        isLoading: false
      });
      throw error;
    }
  },

  assignComplaint: async (complaintId, employeeId, departmentId) => {
     const userId = useAuthStore.getState().user?.id; // User performing the assignment (e.g., admin)
     if (!userId) {
       const errorMsg = "User must be logged in to assign a complaint.";
       set({ error: errorMsg, isLoading: false });
       throw new Error(errorMsg);
     }

    set({ isLoading: true, error: null });
    try {
      const updatePayload: any = {
          assigned_employee_id: employeeId,
          status: 'assigned' as const,
          updated_at: new Date().toISOString(),
      };
       // Optionally update department if provided
       if (departmentId) {
         updatePayload.department_id = departmentId;
       }

      // 1. Update the complaint record
      const { error: updateError } = await supabase
        .from('complaints')
        .update(updatePayload)
        .eq('id', complaintId);

      if (updateError) throw updateError;

      // 2. Optionally add to complaint_updates log
       await supabase.from('complaint_updates').insert({
         complaint_id: complaintId,
         status: 'assigned',
         notes: `Assigned to employee ID: ${employeeId}`, // Example note
         updated_by: userId,
       });
       // Handle log error similarly to updateComplaintStatus if needed

      // 3. Update local state
      set(state => ({
        complaints: state.complaints.map(c =>
          c.id === complaintId
            ? {
                ...c,
                assignedEmployeeId: employeeId, // camelCase state
                departmentId: departmentId || c.departmentId, // Update department if changed
                status: 'assigned',
                updatedAt: updatePayload.updated_at,
              }
            : c
        ),
        isLoading: false
      }));

      // TODO: Add notification for the assigned employee
      // useNotificationStore.getState().addNotification(...)

    } catch (error: any) {
      console.error("Failed to assign complaint:", error.message);
      set({
        error: error.message || "Failed to assign complaint",
        isLoading: false
      });
      throw error;
    }
  },

   // Function to get update history for a specific complaint
   getComplaintUpdates: async (complaintId: string): Promise<ComplaintUpdate[]> => {
      set({ isLoading: true, error: null }); // Indicate loading for this specific action
      try {
         const { data, error } = await supabase
         .from('complaint_updates') // DB table name
         .select('*')
         .eq('complaint_id', complaintId) // snake_case column
         .order('updated_at', { ascending: false }); // Show latest first

         if (error) throw error;

         set({ isLoading: false }); // Loading finished
         return data as ComplaintUpdate[]; // Return the fetched updates

      } catch (error: any) {
         console.error("Failed to fetch complaint updates:", error.message);
         set({
            error: error.message || "Failed to fetch complaint history",
            isLoading: false, // Ensure loading is off on error
         });
         return []; // Return empty array on failure
      }
   },

}));