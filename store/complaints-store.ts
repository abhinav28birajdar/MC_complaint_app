import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Import ComplaintPriority along with other types
import { Complaint, ComplaintStatus, ComplaintType, Location, ComplaintPriority } from '@/types'; // Adjust path
import { supabase } from '@/lib/supabase'; // Adjust path
import { Database } from '@/types/supabase'; // Adjust path
import { Json } from '@/types/supabase'; // Import Json type helper if needed, or use assertion

// Helper function to map Supabase row to application Complaint type
const mapSupabaseComplaint = (
    row: Database['public']['Tables']['complaints']['Row']
): Complaint => {
    // Safely parse location JSONB
    let location: Location = { address: 'Unknown Location' }; // Default value
    if (row.location && typeof row.location === 'object') {
        // Check for common properties to be safer than 'as any'
        const locData = row.location as { latitude?: number; longitude?: number; address?: string };
        location = {
            latitude: locData.latitude,
            longitude: locData.longitude,
            address: locData.address || 'Address not provided',
        };
    } else if (typeof row.location === 'string') {
         // Attempt to parse if it's a JSON string (legacy or error)
         try {
            const parsed = JSON.parse(row.location);
            location = {
                 latitude: parsed.latitude,
                 longitude: parsed.longitude,
                 address: parsed.address || 'Address not provided',
            };
         } catch (e) {
            // If parsing fails, treat the string as the address
            location = { address: row.location };
         }
    }

    return {
        id: row.id,
        type: row.type as ComplaintType, // Consider adding validation if type is critical
        description: row.description,
        location: location,
        media: row.media ?? undefined,
        status: row.status as ComplaintStatus, // Consider validation
        priority: row.priority as ComplaintPriority, // Consider validation
        notes: row.notes ?? undefined,
        citizenId: row.citizen_id,
        employeeId: row.employee_id ?? undefined,
        createdAt: row.created_at ? new Date(row.created_at).getTime() : Date.now(), // Handle potential null
        updatedAt: row.updated_at ? new Date(row.updated_at).getTime() : Date.now(), // Handle potential null
        resolvedAt: row.resolved_at ? new Date(row.resolved_at).getTime() : undefined,
    };
};


interface ComplaintsState {
  complaints: Complaint[];
  isLoading: boolean;
  error: string | null;

  fetchComplaints: () => Promise<void>;
  fetchUserComplaints: (userId: string) => Promise<Complaint[]>;
  fetchEmployeeComplaints: (employeeId: string) => Promise<Complaint[]>;
  // Input type includes optional priority, matching the Complaint definition allows flexibility
  addComplaint: (complaintData: Omit<Complaint, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'resolvedAt'>) => Promise<Complaint>;
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

          const formattedComplaints = data.map(mapSupabaseComplaint);
          set({ complaints: formattedComplaints, isLoading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to fetch complaints';
           console.error("Fetch Complaints Error:", errorMessage, error);
          set({ error: errorMessage, isLoading: false });
        }
      },

      fetchUserComplaints: async (userId: string): Promise<Complaint[]> => {
        try {
          const { data, error } = await supabase
            .from('complaints')
            .select('*')
            .eq('citizen_id', userId)
            .order('created_at', { ascending: false });

          if (error) throw error;

          const userComplaints = data.map(mapSupabaseComplaint);
          return userComplaints;
        } catch (error) {
           const errorMessage = error instanceof Error ? error.message : 'Failed to fetch user complaints';
           console.error("Fetch User Complaints Error:", errorMessage, error);
          set({ error: errorMessage }); // Set global error if needed
          return []; // Return empty array on failure
        }
      },

      fetchEmployeeComplaints: async (employeeId: string): Promise<Complaint[]> => {
         try {
            const { data, error } = await supabase
                .from('complaints')
                .select('*')
                .eq('employee_id', employeeId)
                .order('created_at', { ascending: false });

            if (error) throw error;

            const employeeComplaints = data.map(mapSupabaseComplaint);
            return employeeComplaints;
          } catch (error) {
              const errorMessage = error instanceof Error ? error.message : 'Failed to fetch employee complaints';
              console.error("Fetch Employee Complaints Error:", errorMessage, error);
              set({ error: errorMessage });
              return [];
          }
      },

      addComplaint: async (complaintData) => {
        set({ isLoading: true, error: null });
        try {
          // Prepare data for Supabase insert
          const newComplaintData: Database['public']['Tables']['complaints']['Insert'] = {
            type: complaintData.type,
            description: complaintData.description,
            // *** FIX: Assert the type when sending to Supabase ***
            location: complaintData.location as unknown as Json,
            media: complaintData.media,
            status: 'pending', // Default status on creation
            citizen_id: complaintData.citizenId,
            priority: complaintData.priority || 'medium', // Use provided or default
          };

          const { data, error } = await supabase
            .from('complaints')
            .insert(newComplaintData)
            .select() // Select the newly inserted row
            .single(); // Expect a single row back

          if (error) throw error;
          if (!data) throw new Error('Failed to add complaint: No data returned.');

          const formattedComplaint = mapSupabaseComplaint(data);

          // Add to local state
          set(state => ({
            complaints: [formattedComplaint, ...state.complaints],
            isLoading: false,
          }));

          return formattedComplaint;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to add complaint';
           console.error("Add Complaint Error:", errorMessage, error);
          set({ error: errorMessage, isLoading: false });
          throw error; // Re-throw for UI
        }
      },

      updateComplaintStatus: async (complaintId, status, notes) => {
        set({ isLoading: true, error: null });
        try {
          const updateData: Partial<Database['public']['Tables']['complaints']['Update']> = {
            status: status,
            // Supabase trigger handles updated_at
          };

          if (notes !== undefined) updateData.notes = notes; // Only update notes if provided
          if (status === 'resolved') updateData.resolved_at = new Date().toISOString();

          const { error } = await supabase
            .from('complaints')
            .update(updateData)
            .eq('id', complaintId);

          if (error) throw error;

          // Update local state
          set(state => ({
            complaints: state.complaints.map(c =>
              c.id === complaintId
                ? {
                    ...c,
                    status,
                    notes: notes !== undefined ? notes : c.notes, // Update notes if provided
                    updatedAt: Date.now(), // Reflect update time locally
                    resolvedAt: status === 'resolved' ? Date.now() : c.resolvedAt, // Set resolved time locally
                  }
                : c
            ),
            isLoading: false,
          }));
        } catch (error) {
           const errorMessage = error instanceof Error ? error.message : 'Failed to update complaint status';
           console.error("Update Status Error:", errorMessage, error);
          set({ error: errorMessage, isLoading: false });
           throw error; // Re-throw
        }
      },

      assignComplaint: async (complaintId, employeeId) => {
        set({ isLoading: true, error: null });
        try {
          const updateData: Partial<Database['public']['Tables']['complaints']['Update']> = {
            employee_id: employeeId,
            status: 'inProgress', // Typically assigning moves status to inProgress
            // Supabase trigger handles updated_at
          };

          const { error } = await supabase
            .from('complaints')
            .update(updateData)
            .eq('id', complaintId);

          if (error) throw error;

          // Update local state
          set(state => ({
            complaints: state.complaints.map(c =>
              c.id === complaintId
                ? {
                    ...c,
                    employeeId,
                    status: 'inProgress',
                    updatedAt: Date.now(), // Reflect update time locally
                  }
                : c
            ),
            isLoading: false,
          }));
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to assign complaint';
           console.error("Assign Complaint Error:", errorMessage, error);
          set({ error: errorMessage, isLoading: false });
           throw error; // Re-throw
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'complaints-storage-v1', // Consider versioning storage name
      storage: createJSONStorage(() => AsyncStorage),
      // Optionally add partialize or migrate functions if needed
      // partialize: (state) => ({ complaints: state.complaints }), // Example: only persist complaints
    }
  )
);