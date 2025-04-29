import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Filter, Search, FileText } from 'lucide-react-native';
import { colors } from '@/constants/Colors';
import { useComplaintsStore } from '@/store/complaints-store';
import { ComplaintCard } from '@/components/ComplaintCard';
import { Input } from '@/components/Input';
import { Complaint, ComplaintStatus, ComplaintType } from '@/types';

// Update the ComplaintCardProps interface to include the showAssignee prop
interface ComplaintCardProps {
  complaint: Complaint;
  showAssignee?: boolean;
}

export default function AdminComplaintsScreen() {
  const router = useRouter();
  const { complaints, isLoading, fetchAllComplaints } = useComplaintsStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<ComplaintStatus | 'all'>('all');
  const [selectedType, setSelectedType] = useState<ComplaintType | 'all'>('all');

  useEffect(() => {
    // Safely check if fetchAllComplaints exists and is a function
    if (typeof fetchAllComplaints === 'function') {
      fetchAllComplaints();
    } else {
      console.error("fetchAllComplaints is not available in useComplaintsStore");
    }
  }, [fetchAllComplaints]);

  const filteredComplaints = useMemo(() => {
    let filtered = complaints ? [...complaints] : [];

    if (searchQuery) {
       const lowerCaseQuery = searchQuery.toLowerCase();
       filtered = filtered.filter(c =>
           c.description?.toLowerCase().includes(lowerCaseQuery) ||
           c.location?.address?.toLowerCase().includes(lowerCaseQuery) ||
           c.id?.toLowerCase().includes(lowerCaseQuery) ||
           c.type?.toLowerCase().includes(lowerCaseQuery) ||
           // Safely access citizenId and employeeId before slicing
           (c.citizenId && c.citizenId.slice(-6).includes(lowerCaseQuery)) ||
           (c.employeeId && c.employeeId.slice(-6).includes(lowerCaseQuery))
       );
    }
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(c => c.status === selectedStatus);
    }
    if (selectedType !== 'all') {
      filtered = filtered.filter(c => c.type === selectedType);
    }

     // Define status order correctly using ComplaintStatus keys
     const statusOrder: Record<ComplaintStatus, number> = { 'pending': 1, 'inProgress': 2, 'resolved': 3, 'rejected': 4 };

     filtered.sort((a, b) => {
        const statusA = statusOrder[a.status] ?? 5; // Use nullish coalescing for safety
        const statusB = statusOrder[b.status] ?? 5;
        if (statusA !== statusB) return statusA - statusB;
        // Ensure createdAt is treated as a number (timestamp) for comparison
        return (b.createdAt || 0) - (a.createdAt || 0);
     });

    return filtered;
  }, [complaints, searchQuery, selectedStatus, selectedType]);


  const toggleFilters = () => setShowFilters(!showFilters);
  const handleStatusFilter = (status: ComplaintStatus | 'all') => setSelectedStatus(status);
  const handleTypeFilter = (type: ComplaintType | 'all') => setSelectedType(type);

  const handleComplaintPress = (id: string) => {
    // Correct path using root-relative path
    router.push(`./admin/complaints/${id}`);
  };

  const renderStatusFilter = () => {
     const statuses: Array<ComplaintStatus | 'all'> = ['all', 'pending', 'inProgress', 'resolved', 'rejected'];
      return (
       <View style={styles.filterRow}>
         <Text style={styles.filterLabel}>Status:</Text>
         <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterOptions}>
           {statuses.map(status => (
             <TouchableOpacity 
               key={status} 
               style={[styles.filterChip, selectedStatus === status && styles.filterChipSelected]} 
               onPress={() => handleStatusFilter(status)} 
               activeOpacity={0.7}
             >
               <Text style={[styles.filterChipText, selectedStatus === status && styles.filterChipTextSelected]}>
                  {status === 'all' ? 'All' : status === 'inProgress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1)}
               </Text>
             </TouchableOpacity>
           ))}
         </ScrollView>
       </View>
     );
  };
  
  const renderTypeFilter = () => {
     // Ensure array matches ComplaintType exactly
     const types: Array<ComplaintType | 'all'> = ['all', 'pothole', 'garbage', 'streetLight', 'waterLeakage', 'roadDamage', 'other'];
     return (
       <View style={styles.filterRow}>
         <Text style={styles.filterLabel}>Type:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterOptions}>
           {types.map(type => (
             <TouchableOpacity 
               key={type} 
               style={[styles.filterChip, selectedType === type && styles.filterChipSelected]} 
               onPress={() => handleTypeFilter(type)} 
               activeOpacity={0.7}
             >
                 <Text style={[styles.filterChipText, selectedType === type && styles.filterChipTextSelected]}>
                     {type === 'all' ? 'All' :
                      type === 'waterLeakage' ? 'Water Leakage' :
                      type === 'roadDamage' ? 'Road Damage' :
                      type === 'streetLight' ? 'Street Light' :
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
        {/* Header provided by Tabs layout */}

      <View style={styles.searchContainer}>
        <Input
          placeholder="Search ID, type, citizen, employee..."
          value={searchQuery}
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

      {isLoading && filteredComplaints.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading complaints...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredComplaints}
          keyExtractor={(item: Complaint) => item.id}
          renderItem={({ item }: { item: Complaint }) => (
            <TouchableOpacity onPress={() => handleComplaintPress(item.id)} activeOpacity={0.8}>
              {/* ComplaintCard now accepts showAssignee prop with the updated interface */}
              <ComplaintCard
                complaint={item}
                showAssignee={true}
              />
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
             <View style={styles.emptyContainer}>
                <FileText size={48} color={colors.gray[400]} />
               <Text style={styles.emptyTitle}>No Complaints Found</Text>
               <Text style={styles.emptyText}>
                 {complaints && complaints.length === 0 ? "There are no complaints in the system." : "No complaints match your current filters."}
               </Text>
               {(selectedStatus !== 'all' || selectedType !== 'all' || searchQuery !== '') && (
                  <TouchableOpacity 
                    onPress={() => { 
                      setSelectedStatus('all'); 
                      setSelectedType('all'); 
                      setSearchQuery(''); 
                      setShowFilters(false); 
                    }} 
                    style={styles.clearFilterButton}
                  >
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
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText: { marginTop: 10, fontSize: 16, color: colors.gray[600] },
    emptyContainer: { padding: 24, alignItems: 'center', justifyContent: 'center', marginTop: 40 },
    emptyTitle: { fontSize: 18, fontWeight: '600', color: colors.gray[800], marginBottom: 8, marginTop: 16, textAlign: 'center' },
    emptyText: { fontSize: 14, color: colors.gray[600], marginBottom: 16, textAlign: 'center', lineHeight: 22 },
    clearFilterButton: { marginBottom: 16, paddingVertical: 8, paddingHorizontal: 12 },
    clearFilterButtonText: { color: colors.primary, fontWeight: '500', fontSize: 14, textDecorationLine: 'underline' },
});