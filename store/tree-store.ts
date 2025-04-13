import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TreeEntry } from '@/types';
import { supabase } from '@/lib/supabase';

interface TreeState {
  trees: TreeEntry[];
  isLoading: boolean;
  error: string | null;
  
  fetchTrees: () => Promise<void>;
  fetchUserTrees: (userId: string) => Promise<TreeEntry[]>;
  
  addTree: (tree: Omit<TreeEntry, 'id' | 'createdAt' | 'updatedAt' | 'wateringHistory'>) => Promise<TreeEntry>;
  updateTree: (treeId: string, treeData: Partial<TreeEntry>) => Promise<void>;
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
          
          const formattedTrees = data.map(tree => ({
            ...tree,
            userId: tree.user_id,
            treeName: tree.tree_name,
            plantedDate: new Date(tree.planted_date).getTime(),
            createdAt: new Date(tree.created_at).getTime(),
            updatedAt: new Date(tree.updated_at).getTime(),
            wateringHistory: tree.watering_history || []
          }));
          
          set({ trees: formattedTrees, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch trees', 
            isLoading: false 
          });
        }
      },
      
      fetchUserTrees: async (userId: string) => {
        set({ isLoading: true, error: null });
        try {
          const { data, error } = await supabase
            .from('trees')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
          
          if (error) throw error;
          
          const userTrees = data.map(tree => ({
            ...tree,
            userId: tree.user_id,
            treeName: tree.tree_name,
            plantedDate: new Date(tree.planted_date).getTime(),
            createdAt: new Date(tree.created_at).getTime(),
            updatedAt: new Date(tree.updated_at).getTime(),
            wateringHistory: tree.watering_history || []
          }));
          
          set({ isLoading: false });
          return userTrees;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch user trees', 
            isLoading: false 
          });
          return [];
        }
      },
      
      addTree: async (treeData) => {
        set({ isLoading: true, error: null });
        try {
          const newTree = {
            user_id: treeData.userId,
            tree_name: treeData.treeName,
            planted_date: new Date(treeData.plantedDate).toISOString(),
            location: treeData.location,
            images: treeData.images,
            watering_reminder: treeData.wateringReminder,
            watering_frequency: treeData.wateringFrequency,
            watering_history: []
          };
          
          const { data, error } = await supabase
            .from('trees')
            .insert(newTree)
            .select()
            .single();
          
          if (error) throw error;
          
          const formattedTree = {
            ...data,
            id: data.id,
            userId: data.user_id,
            treeName: data.tree_name,
            plantedDate: new Date(data.planted_date).getTime(),
            createdAt: new Date(data.created_at).getTime(),
            updatedAt: new Date(data.updated_at).getTime(),
            wateringHistory: data.watering_history || []
          };
          
          set(state => ({ 
            trees: [formattedTree, ...state.trees],
            isLoading: false 
          }));
          
          return formattedTree;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to add tree', 
            isLoading: false 
          });
          throw error;
        }
      },
      
      updateTree: async (treeId, treeData) => {
        set({ isLoading: true, error: null });
        try {
          const updateData: any = {
            updated_at: new Date().toISOString()
          };
          
          if (treeData.treeName) updateData.tree_name = treeData.treeName;
          if (treeData.location) updateData.location = treeData.location;
          if (treeData.images) updateData.images = treeData.images;
          if (treeData.wateringReminder !== undefined) updateData.watering_reminder = treeData.wateringReminder;
          if (treeData.wateringFrequency) updateData.watering_frequency = treeData.wateringFrequency;
          
          const { error } = await supabase
            .from('trees')
            .update(updateData)
            .eq('id', treeId);
          
          if (error) throw error;
          
          set(state => {
            const updatedTrees = state.trees.map(tree => {
              if (tree.id === treeId) {
                return {
                  ...tree,
                  ...treeData,
                  updatedAt: Date.now(),
                };
              }
              return tree;
            });
            
            return { 
              trees: updatedTrees,
              isLoading: false 
            };
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to update tree', 
            isLoading: false 
          });
        }
      },
      
      addWateringEntry: async (treeId, imageUrl) => {
        set({ isLoading: true, error: null });
        try {
          const tree = get().trees.find(t => t.id === treeId);
          if (!tree) throw new Error('Tree not found');
          
          const newWateringEntry = {
            date: new Date().toISOString(),
            imageUrl
          };
          
          const { error } = await supabase
            .from('trees')
            .update({
              watering_history: [...tree.wateringHistory, newWateringEntry],
              updated_at: new Date().toISOString()
            })
            .eq('id', treeId);
          
          if (error) throw error;
          
          set(state => {
            const updatedTrees = state.trees.map(tree => {
              if (tree.id === treeId) {
                return {
                  ...tree,
                  wateringHistory: [...tree.wateringHistory, {
                    date: Date.now(),
                    imageUrl
                  }],
                  updatedAt: Date.now(),
                };
              }
              return tree;
            });
            
            return { 
              trees: updatedTrees,
              isLoading: false 
            };
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to add watering entry', 
            isLoading: false 
          });
        }
      },
      
      clearError: () => set({ error: null }),
    }),
    {
      name: 'trees-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);