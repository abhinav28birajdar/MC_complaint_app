import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TreeEntry, WateringEntry, Location } from '@/types'; // Adjust path
import { supabase } from '@/lib/supabase'; // Adjust path
import { Database } from '@/types/supabase'; // Adjust path
import { Json } from '@/types/supabase'; // Import Json type helper

// Helper function to map Supabase row to application TreeEntry type
const mapSupabaseTree = (
    row: Database['public']['Tables']['trees']['Row']
): TreeEntry => {
     // Safely parse location JSONB (similar to complaints)
    let location: Location = { address: 'Unknown Location' };
    if (row.location && typeof row.location === 'object') {
        const locData = row.location as { latitude?: number; longitude?: number; address?: string };
        location = {
            latitude: locData.latitude,
            longitude: locData.longitude,
            address: locData.address || 'Address not provided',
        };
    } else if (typeof row.location === 'string') {
        try {
             const parsed = JSON.parse(row.location);
             location = {
                 latitude: parsed.latitude,
                 longitude: parsed.longitude,
                 address: parsed.address || 'Address not provided',
             };
        } catch (e) {
             location = { address: row.location };
        }
    }

    // *** FIX: Safely parse watering history JSONB array and ensure correct type ***
    let wateringHistory: WateringEntry[] = [];
    if (Array.isArray(row.watering_history)) {
        wateringHistory = row.watering_history
            // Map to the expected WateringEntry structure or null
            .map((entry: any): WateringEntry | null => {
                if (entry && typeof entry === 'object' && 'date' in entry && typeof entry.date === 'string') {
                    // Ensure date is valid before parsing
                    const dateTimestamp = new Date(entry.date).getTime();
                    if (!isNaN(dateTimestamp)) {
                        return {
                            date: dateTimestamp,
                            // Ensure imageUrl is a string or undefined
                            imageUrl: typeof entry.imageUrl === 'string' ? entry.imageUrl : undefined,
                        };
                    }
                }
                console.warn("Invalid watering history entry found:", entry); // Log invalid entries
                return null; // Return null for invalid entries
            })
            // Filter out the null values using a type predicate
            .filter((entry): entry is WateringEntry => entry !== null);
    }


    return {
        id: row.id,
        userId: row.user_id,
        treeName: row.tree_name,
        plantedDate: new Date(row.planted_date).getTime(),
        location: location,
        images: row.images ?? undefined,
        wateringReminder: row.watering_reminder ?? false, // Default to false if null
        wateringFrequency: row.watering_frequency ?? undefined,
        wateringHistory: wateringHistory, // Assign the correctly typed and filtered array
        createdAt: row.created_at ? new Date(row.created_at).getTime() : Date.now(),
        updatedAt: row.updated_at ? new Date(row.updated_at).getTime() : Date.now(),
    };
};

interface TreeState {
  trees: TreeEntry[];
  isLoading: boolean;
  error: string | null;

  fetchTrees: () => Promise<void>;
  fetchUserTrees: (userId: string) => Promise<TreeEntry[]>;

  addTree: (treeData: Omit<TreeEntry, 'id' | 'createdAt' | 'updatedAt' | 'wateringHistory'>) => Promise<TreeEntry>;
  updateTree: (treeId: string, treeData: Partial<Omit<TreeEntry, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'wateringHistory' | 'plantedDate'>>) => Promise<void>;
  addWateringEntry: (treeId: string, imageUrl?: string) => Promise<void>;

  clearError: () => void;
}

export const useTreeStore = create<TreeState>()(
  persist(
    (set, get) => ({
      trees: [],
      isLoading: false,
      error: null,

      fetchTrees: async () => {
        set({ isLoading: true, error: null });
        try {
          const { data, error } = await supabase
            .from('trees')
            .select('*')
            .order('created_at', { ascending: false });

          if (error) throw error;

          const formattedTrees = data.map(mapSupabaseTree);
          set({ trees: formattedTrees, isLoading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to fetch trees';
          console.error("Fetch Trees Error:", errorMessage, error);
          set({ error: errorMessage, isLoading: false });
        }
      },

      fetchUserTrees: async (userId: string): Promise<TreeEntry[]> => {
         try {
            const { data, error } = await supabase
                .from('trees')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (error) throw error;

            const userTrees = data.map(mapSupabaseTree);
            return userTrees;
         } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch user trees';
            console.error("Fetch User Trees Error:", errorMessage, error);
            set({ error: errorMessage }); // Set global error if needed
            return [];
         }
      },

      addTree: async (treeData) => {
        set({ isLoading: true, error: null });
        try {
          const newTreeData: Database['public']['Tables']['trees']['Insert'] = {
            user_id: treeData.userId,
            tree_name: treeData.treeName,
            planted_date: new Date(treeData.plantedDate).toISOString(),
             // *** FIX: Assert the type when sending to Supabase ***
            location: treeData.location as unknown as Json,
            images: treeData.images,
            watering_reminder: treeData.wateringReminder,
            watering_frequency: treeData.wateringFrequency,
            watering_history: [], // Initialize empty history
          };

          const { data, error } = await supabase
            .from('trees')
            .insert(newTreeData)
            .select()
            .single();

          if (error) throw error;
          if (!data) throw new Error('Failed to add tree: No data returned.');

          const formattedTree = mapSupabaseTree(data);

          set(state => ({
            trees: [formattedTree, ...state.trees],
            isLoading: false,
          }));

          return formattedTree;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to add tree';
          console.error("Add Tree Error:", errorMessage, error);
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },

      updateTree: async (treeId, treeData) => {
        set({ isLoading: true, error: null });
        try {
           // Explicitly type the payload for clarity
           const updatePayload: Partial<Database['public']['Tables']['trees']['Update']> = {};

           // Assign properties carefully, checking for undefined
           if (treeData.treeName !== undefined) updatePayload.tree_name = treeData.treeName;
           if (treeData.images !== undefined) updatePayload.images = treeData.images;
           if (treeData.wateringReminder !== undefined) updatePayload.watering_reminder = treeData.wateringReminder;
           if (treeData.wateringFrequency !== undefined) updatePayload.watering_frequency = treeData.wateringFrequency;

           // *** FIX: Assert the type for location if it's provided ***
           if (treeData.location !== undefined) {
               updatePayload.location = treeData.location as unknown as Json;
           }

           // Only proceed if there's something to update
           if (Object.keys(updatePayload).length === 0) {
               console.log("No fields to update for tree:", treeId);
               set({ isLoading: false }); // Nothing to do
               return;
           }

          // Supabase trigger handles updated_at

          const { error } = await supabase
            .from('trees')
            .update(updatePayload)
            .eq('id', treeId);

          if (error) throw error;

          // Update local state accurately
          set(state => ({
            trees: state.trees.map(tree => {
              if (tree.id === treeId) {
                // Create the updated tree object merging existing and new data
                const updatedTree = { ...tree };
                if (treeData.treeName !== undefined) updatedTree.treeName = treeData.treeName;
                if (treeData.location !== undefined) updatedTree.location = treeData.location;
                if (treeData.images !== undefined) updatedTree.images = treeData.images;
                if (treeData.wateringReminder !== undefined) updatedTree.wateringReminder = treeData.wateringReminder;
                if (treeData.wateringFrequency !== undefined) updatedTree.wateringFrequency = treeData.wateringFrequency;
                updatedTree.updatedAt = Date.now(); // Update timestamp locally
                return updatedTree;
              }
              return tree;
            }),
            isLoading: false,
          }));
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to update tree';
          console.error("Update Tree Error:", errorMessage, error);
          set({ error: errorMessage, isLoading: false });
          throw error; // Re-throw error
        }
      },

      addWateringEntry: async (treeId, imageUrl) => {
        set({ isLoading: true, error: null });
        try {
          // Fetch the current tree to get existing history reliably
          const { data: currentTreeData, error: fetchError } = await supabase
            .from('trees')
            .select('watering_history')
            .eq('id', treeId)
            .single();

          if (fetchError) throw fetchError;
          if (!currentTreeData) throw new Error('Tree not found to add watering entry.');

          // Safely parse current history from DB data
          const currentHistory = (Array.isArray(currentTreeData.watering_history) ? currentTreeData.watering_history : []) as Json[];

          const newWateringEntry = {
            date: new Date().toISOString(), // Store as ISO string in DB
            // Only include imageUrl if it's provided and not empty
            ...(imageUrl ? { imageUrl: imageUrl } : {})
          };

          const { error: updateError } = await supabase
            .from('trees')
            .update({
              watering_history: [...currentHistory, newWateringEntry],
               // Supabase trigger handles updated_at
            })
            .eq('id', treeId);

          if (updateError) throw updateError;

          // Update local state optimistically/accurately
          set(state => ({
            trees: state.trees.map(tree => {
              if (tree.id === treeId) {
                // Create the new local entry with timestamp
                const localWateringEntry: WateringEntry = {
                  date: Date.now(),
                  ...(imageUrl ? { imageUrl: imageUrl } : {})
                };
                return {
                  ...tree,
                  wateringHistory: [
                    ...tree.wateringHistory,
                    localWateringEntry,
                  ],
                  updatedAt: Date.now(), // Update timestamp locally
                };
              }
              return tree;
            }),
            isLoading: false,
          }));
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to add watering entry';
          console.error("Add Watering Error:", errorMessage, error);
          set({ error: errorMessage, isLoading: false });
          throw error; // Re-throw error
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'trees-storage-v1', // Consider versioning
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);