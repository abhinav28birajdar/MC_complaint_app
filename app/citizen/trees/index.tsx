import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus } from 'lucide-react-native';
import { colors } from '@/constants/Colors';
import { useTreeStore } from '@/store/tree-store';
import { useAuthStore } from '@/store/auth-store';
import { TreeCard } from '@/components/TreeCard'; // Ensure this path is correct

export default function TreesScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { trees, isLoading, fetchUserTrees } = useTreeStore();

  useEffect(() => {
    if (user?.id) {
      fetchUserTrees(user.id);
    }
  }, [user?.id, fetchUserTrees]); // Added fetchUserTrees dependency

  const handleNewTree = () => {
    router.push('./citizen/trees/new'); // Use root-relative path
  };

  // Optional: Handle press on a tree card
   const handleTreePress = (id: string) => {
       // Navigate to tree detail screen if it exists
       // router.push(`/citizen/trees/${id}`);
       console.log("Tree pressed:", id);
   };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <Text style={styles.title}>My Tree Plantation</Text>
        <TouchableOpacity
          style={styles.newButton}
          onPress={handleNewTree}
          activeOpacity={0.7}
        >
          <Plus size={20} color={colors.white} />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.success} />
          <Text style={styles.loadingText}>Loading your trees...</Text>
        </View>
      ) : (
        <FlatList
          data={trees}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
             <TouchableOpacity onPress={() => handleTreePress(item.id)} activeOpacity={0.8}>
               <TreeCard tree={item} />
             </TouchableOpacity>
           )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>No trees planted yet</Text>
              <Text style={styles.emptyText}>
                Start your green journey by planting your first tree and tracking its growth.
              </Text>
              <TouchableOpacity
                style={styles.emptyButton}
                onPress={handleNewTree}
                activeOpacity={0.7}
              >
                <Text style={styles.emptyButtonText}>Plant a Tree</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.gray[900],
  },
  newButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.success, // Use success color for trees
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 20,
    paddingBottom: 40, // Ensure space at bottom
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: colors.gray[600],
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    margin: 20, // Add margin around the empty state card
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.gray[800],
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: colors.gray[600],
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 22,
  },
  emptyButton: {
    backgroundColor: colors.success, // Match button color
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: colors.white,
    fontWeight: '500',
  },
});