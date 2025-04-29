import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native'; // Added ScrollView import
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Filter, Search, ClipboardList } from 'lucide-react-native';
import { colors } from '@/constants/Colors';
import { useComplaintsStore } from '@/store/complaints-store';
import { useAuthStore } from '@/store/auth-store';
// *** NOTE: Assumes ComplaintCardProps includes 'showAssignee' in its definition ***
// *** Correction needed in '@/components/ComplaintCard' if this causes an error ***
import { ComplaintCard,  } from '@/components/ComplaintCard';
import { Input } from '@/components/Input';
import { Complaint, ComplaintStatus, ComplaintType } from '@/types';

export default function EmployeeTasksScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  // Use the correct function name from the store interface (e.g., fetchEmployeeComplaints or fetchAllComplaints)
  // *** NOTE: Assumes 'fetchEmployeeComplaints' exists and is the correct function for this screen ***
  // *** Correction needed in '@/store/complaints-store' if this causes an error ***
  const { complaints, isLoading, fetchEmployeeComplaints } = useComplaintsStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  // Default to 'pending' or 'inProgress' maybe? Or 'all' assigned tasks.
  const [selectedStatus, setSelectedStatus] = useState<ComplaintStatus | 'all'>('all');
  const [selectedType, setSelectedType] = useState<ComplaintType | 'all'>('all');

  // Fetch tasks assigned to the logged-in employee
  useEffect(() => {
      if (user?.id && typeof fetchEmployeeComplaints === 'function') {
          fetchEmployeeComplaints(user.id);
      } else if (user?.id) {
          console.error("fetchEmployeeComplaints function is not available in useComplaintsStore");
      }
      // Add fetchEmployeeComplaints to dependency array if it's stable (wrapped in useCallback in store)
  }, [user?.id, fetchEmployeeComplaints]);

  // The 'complaints' state from the store should already contain only the employee's tasks
  // if fetchEmployeeComplaints was used. No local filtering by employeeId needed here.
  const employeeTasks = useMemo(() => {
       return complaints || []; // Use state directly, provide default empty array
   }, [complaints]);


  const filteredTasks = useMemo(() => {
    let filtered = [...employeeTasks]; // Start with assigned tasks

    if (searchQuery) {
       const lowerCaseQuery = searchQuery.toLowerCase();
       filtered = filtered.filter(task =>
           task.description?.toLowerCase().includes(lowerCaseQuery) ||
           task.location?.address?.toLowerCase().includes(lowerCaseQuery) ||
           task.id?.toLowerCase().includes(lowerCaseQuery) ||
           task.type?.toLowerCase().includes(lowerCaseQuery) ||
           // Optionally search by citizen ID associated with the task
           task.citizenId?.slice(-6).includes(lowerCaseQuery)
       );
    }
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(task => task.status === selectedStatus);
    }
    if (selectedType !== 'all') {
      filtered = filtered.filter(task => task.type === selectedType);
    }

    // Sort: Pending/InProgress first, then maybe by priority, then by creation date?
    const statusOrder: Record<ComplaintStatus, number> = { 'pending': 1, 'inProgress': 2, 'resolved': 3, 'rejected': 4 };
    // Define priority order if needed for sorting
    // const priorityOrder: Record<ComplaintPriority, number> = { 'low': 4, 'medium': 3, 'high': 2, 'critical': 1 };

    filtered.sort((a, b) => {
        const statusA = statusOrder[a.status] ?? 5;
        const statusB = statusOrder[b.status] ?? 5;
        if (statusA !== statusB) {
            return statusA - statusB; // Sort by status first (Pending/InProgress appear first)
        }
        // Optional: Sort by priority next (higher priority first)
        // const priorityA = priorityOrder[a.priority] ?? 5;
        // const priorityB = priorityOrder[b.priority] ?? 5;
        // if (priorityA !== priorityB) {
        //     return priorityA - priorityB;
        // }

        // Finally, sort by creation date (oldest first to address them in order?)
        return (a.createdAt || 0) - (b.createdAt || 0); // Older tasks first
        // Or newest first: return (b.createdAt || 0) - (a.createdAt || 0);
     });

    return filtered;
  }, [employeeTasks, searchQuery, selectedStatus, selectedType]);


  const toggleFilters = () => setShowFilters(!showFilters);
  const handleStatusFilter = (status: ComplaintStatus | 'all') => setSelectedStatus(status);
  const handleTypeFilter = (type: ComplaintType | 'all') => setSelectedType(type);

  const handleTaskPress = (id: string) => {
    // Navigate to the specific task detail screen for employees
    router.push(`./employee/tasks/${id}`); // Ensure this route exists
  };


  // Filter rendering functions
  const renderStatusFilter = () => {
     // Employees might only care about these statuses
     const statuses: Array<ComplaintStatus | 'all'> = ['all', 'pending', 'inProgress', 'resolved'];
      return (
       <View style={styles.filterRow}>
         <Text style={styles.filterLabel}>Task Status:</Text>
         <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterOptions}>
           {statuses.map(status => (
             <TouchableOpacity key={status} style={[styles.filterChip, selectedStatus === status && styles.filterChipSelected]} onPress={() => handleStatusFilter(status)} activeOpacity={0.7}>
               <Text style={[styles.filterChipText, selectedStatus === status && styles.filterChipTextSelected]}>
                  {status === 'all' ? 'All Assigned' : status === 'inProgress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1)}
               </Text>
             </TouchableOpacity>
           ))}
         </ScrollView>
       </View>
     );
  };

  const renderTypeFilter = () => {
     // Ensure this array matches ComplaintType definitions used in your app
     const types: Array<ComplaintType | 'all'> = ['all', 'pothole', 'garbage', 'streetLight', 'waterLeakage', 'roadDamage', 'other'];
     return (
       <View style={styles.filterRow}>
         <Text style={styles.filterLabel}>Complaint Type:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterOptions}>
           {types.map(type => (
             <TouchableOpacity key={type} style={[styles.filterChip, selectedType === type && styles.filterChipSelected]} onPress={() => handleTypeFilter(type)} activeOpacity={0.7}>
                 <Text style={[styles.filterChipText, selectedType === type && styles.filterChipTextSelected]}>
                     {/* Display Formatting */}
                     {type === 'all' ? 'All Types' :
                      type === 'waterLeakage' ? 'Water Leakage' :
                      type === 'roadDamage' ? 'Road Damage' :
                      type === 'streetLight' ? 'Street Light' : // Correct display case
                      type.charAt(0).toUpperCase() + type.slice(1)}
                 </Text>
             </TouchableOpacity>
           ))}
         </ScrollView>
       </View>
     );
  };


  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
       {/* Header is provided by Tabs layout in app/employee/_layout.tsx */}

      <View style={styles.searchContainer}>
        <Input
          placeholder="Search tasks by ID, type, address..."
          value={searchQuery}
          // Add onChangeText prop
          onChangeText={setSearchQuery}
          leftIcon={<Search size={20} color={colors.gray[500]} />}
          containerStyle={styles.searchInput}
        />
        <TouchableOpacity style={styles.filterButton} onPress={toggleFilters} activeOpacity={0.7}>
          <Filter size={20} color={showFilters ? colors.primary : colors.gray[700]} />
        </TouchableOpacity>
      </View>

      {showFilters && (
        <View style={styles.filtersContainer}>{renderStatusFilter()}{renderTypeFilter()}</View>
      )}

      {/* Show loading indicator while fetching and list is empty */}
      {isLoading && employeeTasks.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading assigned tasks...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredTasks}
          keyExtractor={(item: Complaint) => item.id} // Add type annotation
          renderItem={({ item }: { item: Complaint }) => ( // Add type annotation
            <TouchableOpacity onPress={() => handleTaskPress(item.id)} activeOpacity={0.8}>
              {/* *** FIX: Pass showAssignee={false} - assumes prop exists in ComplaintCard *** */}
              <ComplaintCard complaint={item} showAssignee={false} />
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
                <ClipboardList size={48} color={colors.gray[400]} />
              <Text style={styles.emptyTitle}>No Tasks Found</Text>
              <Text style={styles.emptyText}>
                {employeeTasks.length === 0 ? "You have no assigned tasks currently." : "No assigned tasks match your current filters."}
              </Text>
              {/* Clear Filters Button */}
              {(selectedStatus !== 'all' || selectedType !== 'all' || searchQuery !== '') && (
                 <TouchableOpacity onPress={() => { setSelectedStatus('all'); setSelectedType('all'); setSearchQuery(''); setShowFilters(false); }} style={styles.clearFilterButton}>
                     <Text style={styles.clearFilterButtonText}>Clear Filters/Search</Text>
                 </TouchableOpacity>
             )}
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

// Styles
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    searchContainer: { flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 12, backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.gray[200], alignItems: 'center' },
    searchInput: { flex: 1, marginBottom: 0, marginRight: 8 },
    filterButton: { padding: 12, borderWidth: 1, borderColor: colors.gray[300], borderRadius: 8, backgroundColor: colors.white },
    filtersContainer: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 4, backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.gray[200] },
    filterRow: { marginBottom: 12 },
    filterLabel: { fontSize: 14, fontWeight: '500', color: colors.gray[700], marginBottom: 8 },
    filterOptions: { flexDirection: 'row', paddingBottom: 8, gap: 8 },
    filterChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, backgroundColor: colors.gray[200], borderWidth: 1, borderColor: colors.gray[300] },
    filterChipSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
    filterChipText: { fontSize: 12, color: colors.gray[700] },
    filterChipTextSelected: { color: colors.white, fontWeight: '500' },
    listContent: { padding: 20, paddingBottom: 40 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    loadingText: { marginTop: 10, fontSize: 16, color: colors.gray[600] },
    emptyContainer: { padding: 24, alignItems: 'center', justifyContent: 'center', marginTop: 40 },
    emptyTitle: { fontSize: 18, fontWeight: '600', color: colors.gray[800], marginBottom: 8, marginTop: 16, textAlign: 'center' },
    emptyText: { fontSize: 14, color: colors.gray[600], marginBottom: 16, textAlign: 'center', lineHeight: 22 },
    clearFilterButton: { marginBottom: 16, paddingVertical: 8, paddingHorizontal: 12 },
    clearFilterButtonText: { color: colors.primary, fontWeight: '500', fontSize: 14, textDecorationLine: 'underline' },
});