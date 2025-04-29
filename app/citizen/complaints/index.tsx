import React, { useState, useEffect } from 'react';
// *** FIX: Add ScrollView to import ***
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Filter, Plus, Search, FileText } from 'lucide-react-native'; // Added FileText for empty state
import { colors } from '@/constants/Colors';
import { useComplaintsStore } from '@/store/complaints-store';
import { useAuthStore } from '@/store/auth-store';
// Assuming ComplaintCardProps is defined in '@/components/ComplaintCard'
import { ComplaintCard } from '@/components/ComplaintCard';
import { Input } from '@/components/Input';
import { ComplaintStatus, ComplaintType, Complaint } from '@/types';

export default function ComplaintsScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { complaints, isLoading, fetchUserComplaints } = useComplaintsStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<ComplaintStatus | 'all'>('all');
  const [selectedType, setSelectedType] = useState<ComplaintType | 'all'>('all');


  const [filteredComplaints, setFilteredComplaints] = useState<Complaint[]>([]); // Initialize with empty array

  useEffect(() => {
    if (user?.id && typeof fetchUserComplaints === 'function') {
      fetchUserComplaints(user.id);
    } else if (!user?.id) {
      console.log("User ID not available yet.");
      // Optionally clear complaints if user logs out
      // setFilteredComplaints([]);
    } else {
        console.error("fetchUserComplaints is not available in useComplaintsStore");
    }
  }, [user?.id, fetchUserComplaints]); // Depend on fetchUserComplaints as well

  useEffect(() => {
    let currentComplaints = complaints || []; // Handle case where complaints might be initially null/undefined
    let filtered = [...currentComplaints];

    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        complaint =>
          complaint.description?.toLowerCase().includes(lowerCaseQuery) ||
          complaint.location?.address?.toLowerCase().includes(lowerCaseQuery) ||
          complaint.id?.toLowerCase().includes(lowerCaseQuery) ||
          complaint.type?.toLowerCase().includes(lowerCaseQuery) // Search by type
      );
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(complaint => complaint.status === selectedStatus);
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(complaint => complaint.type === selectedType);
    }

    // Sort by status order then creation date (most recent first)
    const statusOrder: Record<ComplaintStatus, number> = { 'pending': 1, 'inProgress': 2, 'resolved': 3, 'rejected': 4 };
    filtered.sort((a, b) => {
        const statusA = statusOrder[a.status] ?? 5;
        const statusB = statusOrder[b.status] ?? 5;
        if (statusA !== statusB) return statusA - statusB;
        return (b.createdAt || 0) - (a.createdAt || 0);
    });

    setFilteredComplaints(filtered);
  }, [complaints, searchQuery, selectedStatus, selectedType]);

  const handleNewComplaint = () => {
    router.push('/citizen/complaints/new'); // Use root-relative path
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleStatusFilter = (status: ComplaintStatus | 'all') => {
    setSelectedStatus(status);
  };

  const handleTypeFilter = (type: ComplaintType | 'all') => {
    setSelectedType(type);
  };

   const handleCardPress = (id: string) => {
     // Use template literal for dynamic segment
     router.push(`/citizen/complaints/${id}`);
   };

  const renderStatusFilter = () => {
    const statuses: Array<ComplaintStatus | 'all'> = ['all', 'pending', 'inProgress', 'resolved', 'rejected'];

    return (
      <View style={styles.filterRow}>
        <Text style={styles.filterLabel}>Status:</Text>
        {/* *** FIX: Use imported ScrollView *** */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterOptions}>
          {statuses.map(status => (
            <TouchableOpacity
              key={status}
              style={[
                styles.filterChip,
                selectedStatus === status && styles.filterChipSelected
              ]}
              onPress={() => handleStatusFilter(status)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.filterChipText,
                  selectedStatus === status && styles.filterChipTextSelected
                ]}
              >
                {status === 'all' ? 'All' :
                 status === 'inProgress' ? 'In Progress' :
                 status.charAt(0).toUpperCase() + status.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderTypeFilter = () => {
    // *** FIX: Use correct types from ComplaintType ('streetLight', 'other') ***
    const types: Array<ComplaintType | 'all'> = ['all', 'pothole', 'garbage', 'streetLight', 'waterLeakage', 'roadDamage', 'other'];

    return (
      <View style={styles.filterRow}>
        <Text style={styles.filterLabel}>Type:</Text>
        {/* *** FIX: Use imported ScrollView *** */}
         <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterOptions}>
          {types.map(type => (
            <TouchableOpacity
              key={type}
              style={[
                styles.filterChip,
                selectedType === type && styles.filterChipSelected
              ]}
              onPress={() => handleTypeFilter(type)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.filterChipText,
                  selectedType === type && styles.filterChipTextSelected
                ]}
              >
                 {/* *** FIX: Use correct case for 'streetLight' comparison/display *** */}
                {type === 'all' ? 'All' :
                 type === 'waterLeakage' ? 'Water Leakage' :
                 type === 'roadDamage' ? 'Road Damage' :
                 type === 'streetLight' ? 'Street Light': // Corrected display name
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
        {/* Header is provided by Tabs layout */}
      {/* <View style={styles.header}>
        <Text style={styles.title}>My Complaints</Text>
        <TouchableOpacity
          style={styles.newButton}
          onPress={handleNewComplaint}
          activeOpacity={0.7}
        >
          <Plus size={20} color={colors.white} />
        </TouchableOpacity>
      </View> */}

      <View style={styles.searchContainer}>
        <Input
          placeholder="Search ID, type, description..."
          value={searchQuery}
          // Add onChangeText prop
          onChangeText={setSearchQuery}
          leftIcon={<Search size={20} color={colors.gray[500]} />}
          containerStyle={styles.searchInput}
        />

        <TouchableOpacity
          style={styles.filterButton}
          onPress={toggleFilters}
          activeOpacity={0.7}
        >
          <Filter size={20} color={showFilters ? colors.primary : colors.gray[700]} />
        </TouchableOpacity>
      </View>

      {showFilters && (
        <View style={styles.filtersContainer}>
          {renderStatusFilter()}
          {renderTypeFilter()}
        </View>
      )}

      {/* Show loading only when actually loading AND list is empty */}
      {isLoading && filteredComplaints.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading your complaints...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredComplaints}
          keyExtractor={(item: Complaint) => item.id} // Add type annotation
          renderItem={({ item }: { item: Complaint }) => ( // Add type annotation
             <TouchableOpacity onPress={() => handleCardPress(item.id)} activeOpacity={0.8}>
                 <ComplaintCard complaint={item} />
             </TouchableOpacity>
           )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <FileText size={48} color={colors.gray[400]} />
              <Text style={styles.emptyTitle}>No Complaints Found</Text>
              <Text style={styles.emptyText}>
                 {complaints && complaints.length > 0 ? 'No complaints match your current filters.' : 'You haven\'t filed any complaints yet.'}
              </Text>
              {/* Show Clear Filters only if filters/search are active */}
              {(selectedStatus !== 'all' || selectedType !== 'all' || searchQuery !== '') && (
                   <TouchableOpacity onPress={() => { setSelectedStatus('all'); setSelectedType('all'); setSearchQuery(''); setShowFilters(false); }} style={styles.clearFilterButton}>
                       <Text style={styles.clearFilterButtonText}>Clear Filters/Search</Text>
                   </TouchableOpacity>
               )}
               {/* Show New Complaint button only if the base list is empty */}
               {!(complaints && complaints.length > 0) && (!selectedStatus || selectedStatus === 'all') && (!selectedType || selectedType === 'all') && !searchQuery && (
                   <TouchableOpacity
                     style={styles.emptyButton}
                     onPress={handleNewComplaint}
                     activeOpacity={0.7}
                   >
                     <Text style={styles.emptyButtonText}>File a New Complaint</Text>
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
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  // Header style (if using a local header instead of Tabs layout)
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
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Search and Filter styles
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    marginBottom: 0, // Override default margin if present
    marginRight: 8,
  },
  filterButton: {
    padding: 12, // Make touch area larger
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 8,
    backgroundColor: colors.white,
  },
  filtersContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 4, // Reduce bottom padding
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  filterRow: {
    marginBottom: 12,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray[700],
    marginBottom: 8,
  },
  filterOptions: {
     flexDirection: 'row', // Keep horizontal
     paddingBottom: 8, // Add padding for scrollbar visibility if needed
     gap: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.gray[200],
    borderWidth: 1,
    borderColor: colors.gray[300],
  },
  filterChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: {
    fontSize: 12,
    color: colors.gray[700],
  },
  filterChipTextSelected: {
    color: colors.white,
    fontWeight: '500',
  },
  // List and Empty State styles
  listContent: {
    padding: 20,
    paddingBottom: 40, // Ensure space at the bottom
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: colors.gray[600]
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  emptyTitle: {
     fontSize: 18,
     fontWeight: '600',
     color: colors.gray[800],
     marginBottom: 8,
     marginTop: 16,
     textAlign: 'center'
   },
  emptyText: {
    fontSize: 14, // Adjusted size
    color: colors.gray[600],
    marginBottom: 24, // Increased margin
    textAlign: 'center',
    lineHeight: 20,
  },
   clearFilterButton: {
        marginBottom: 16,
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    clearFilterButtonText: {
        color: colors.primary,
        fontWeight: '500',
        fontSize: 14,
        textDecorationLine: 'underline',
    },
  emptyButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: colors.white,
    fontWeight: '500',
    fontSize: 16,
  },
});