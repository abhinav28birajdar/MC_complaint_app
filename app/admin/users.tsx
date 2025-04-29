import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Users, UserCog, UserPlus } from 'lucide-react-native'; // Added UserPlus
import { colors } from '@/constants/Colors';
import { useAuthStore } from '@/store/auth-store';
import { Input } from '@/components/Input';
import { User, UserRole } from '@/types';

// Update the AuthState interface to include missing properties
interface AuthState {
  user: User | null;
  users: User[];
  isLoading: boolean;
  fetchAllUsers: () => Promise<void>;
  // Add other properties as needed
}

// Placeholder User Card Component
const UserCard = ({ user, onPress }: { user: User, onPress: () => void }) => (
  <TouchableOpacity onPress={onPress} style={styles.userCard} activeOpacity={0.7}>
     <View style={styles.profileImageContainer}>
          {user.profileImage ? 
            <Image source={{ uri: user.profileImage }} style={styles.profileImage} /> : 
            <View style={styles.profileImagePlaceholder}>
              <Text style={styles.profileImagePlaceholderText}>
                {user.name?.charAt(0).toUpperCase() || '?'}
              </Text>
            </View>
          }
      </View>
      <View style={styles.userInfo}>
          <Text style={styles.userName}>{user.name || 'Unknown Name'}</Text>
          <Text style={styles.userEmail}>{user.email || 'No email'}</Text>
      </View>
      {/* Fix style access with proper type safety */}
      <View style={[
        styles.roleBadge, 
        user.role === 'admin' ? styles.role_admin : 
        user.role === 'employee' ? styles.role_employee : 
        styles.role_citizen
      ]}>
        <Text style={styles.roleText}>{user.role?.toUpperCase()}</Text>
      </View>
  </TouchableOpacity>
);

export default function AdminUsersScreen() {
  const router = useRouter();
  // Use the updated AuthState interface
  const { users, isLoading, fetchAllUsers } = useAuthStore() as unknown as AuthState;

  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Safely check if fetchAllUsers exists and is a function
    if (typeof fetchAllUsers === 'function') {
        fetchAllUsers(); // Fetch users on mount
    } else {
        console.error("fetchAllUsers is not available in useAuthStore");
    }
  }, [fetchAllUsers]);

  const filteredUsers = useMemo(() => {
    // Provide default empty array if users is null/undefined
    let filtered = users ? [...users] : [];
    if (searchQuery) {
       const lowerCaseQuery = searchQuery.toLowerCase();
       filtered = filtered.filter(u =>
           u.name?.toLowerCase().includes(lowerCaseQuery) ||
           u.email?.toLowerCase().includes(lowerCaseQuery) ||
           u.role?.toLowerCase().includes(lowerCaseQuery) ||
           // Safely access id before slicing
           (u.id && u.id.slice(-6).includes(lowerCaseQuery)) // Search by partial ID
       );
    }
    // Sort by role then name
    const roleOrder: Record<UserRole, number> = { 'admin': 1, 'employee': 2, 'citizen': 3 };
    filtered.sort((a: User, b: User) => {
        const roleA = roleOrder[a.role] ?? 4; // Use nullish coalescing
        const roleB = roleOrder[b.role] ?? 4;
        if (roleA !== roleB) return roleA - roleB;
        return (a.name || '').localeCompare(b.name || '');
    });
    return filtered;
  }, [users, searchQuery]);

  const handleUserPress = (userId: string) => {
    // Fix path type issue by casting
    router.push(`/admin/users/${userId}` as any);
  };

  const handleAddUser = () => {
    // Navigate to a screen to add/invite a new user
    console.log("Navigate to Add User Screen");
    // router.push('/admin/users/new' as any);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      {/* Header provided by Tabs layout */}

      <View style={styles.headerActions}>
         <View style={styles.searchContainer}>
             <Input
               placeholder="Search name, email, role, ID..."
               value={searchQuery}
               onChangeText={setSearchQuery}
               leftIcon={<Search size={20} color={colors.gray[500]} />}
               containerStyle={styles.searchInput}
             />
         </View>
         {/* Optional: Add User Button */}
         {/* <TouchableOpacity style={styles.addUserButton} onPress={handleAddUser} activeOpacity={0.7}>
             <UserPlus size={20} color={colors.primary} />
         </TouchableOpacity> */}
      </View>

      {isLoading && filteredUsers.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading users...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredUsers}
          keyExtractor={(item: User) => item.id}
          renderItem={({ item }: { item: User }) => (
             <UserCard user={item} onPress={() => handleUserPress(item.id)} />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Users size={48} color={colors.gray[400]} />
              <Text style={styles.emptyTitle}>No Users Found</Text>
              <Text style={styles.emptyText}>
                {users && users.length === 0 ? "There are no users in the system." : "No users match your search."}
              </Text>
              {searchQuery !== '' && (
                <TouchableOpacity 
                  onPress={() => { setSearchQuery(''); }} 
                  style={styles.clearFilterButton}
                >
                  <Text style={styles.clearFilterButtonText}>Clear Search</Text>
                </TouchableOpacity>
              )}
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

// Fix style type issues by extracting text styles
const textStyles = {
  clearFilterButtonText: { 
    color: colors.primary, 
    fontWeight: '500' as const, 
    fontSize: 14, 
    textDecorationLine: 'underline' as const 
  }
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    headerActions: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12, backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.gray[200] },
    searchContainer: { flex: 1 },
    searchInput: { marginBottom: 0 }, // Remove margin from input component
    addUserButton: { padding: 12, marginLeft: 8 }, // Style for add user button
    listContent: { padding: 20, paddingBottom: 40 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText: { marginTop: 10, fontSize: 16, color: colors.gray[600] },
    emptyContainer: { padding: 24, alignItems: 'center', justifyContent: 'center', marginTop: 40 },
    emptyTitle: { fontSize: 18, fontWeight: '600', color: colors.gray[800], marginBottom: 8, marginTop: 16, textAlign: 'center' },
    emptyText: { fontSize: 14, color: colors.gray[600], marginBottom: 16, textAlign: 'center', lineHeight: 22 },
    clearFilterButton: { marginBottom: 16, paddingVertical: 8, paddingHorizontal: 12 },
    // Move text style to a separate object
    clearFilterButtonText: textStyles.clearFilterButtonText,
    // User Card Styles
    userCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, padding: 12, borderRadius: 8, marginBottom: 12, shadowColor: colors.black, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1, borderWidth: 1, borderColor: colors.gray[100] },
    profileImageContainer: { width: 40, height: 40, borderRadius: 20, overflow: 'hidden', marginRight: 12 },
    profileImage: { width: '100%', height: '100%' },
    profileImagePlaceholder: { width: '100%', height: '100%', backgroundColor: colors.gray[200], justifyContent: 'center', alignItems: 'center' },
    profileImagePlaceholderText: { fontSize: 18, fontWeight: 'bold', color: colors.gray[500] },
    userInfo: { flex: 1, marginRight: 8 },
    userName: { fontSize: 15, fontWeight: '600', color: colors.gray[800], marginBottom: 2 },
    userEmail: { fontSize: 13, color: colors.gray[600] },
    roleBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4 },
    // Define styles for each role explicitly
    role_admin: { backgroundColor: colors.errorLight },
    role_employee: { backgroundColor: colors.infoLight },
    role_citizen: { backgroundColor: colors.successLight },
    roleText: { fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', color: colors.gray[700] },
});