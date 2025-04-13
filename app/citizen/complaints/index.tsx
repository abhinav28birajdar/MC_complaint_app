import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Filter, Plus, Search } from 'lucide-react-native';
import { colors } from '@/constants/Colors';
import { useComplaintsStore } from '@/store/complaints-store';
import { useAuthStore } from '@/store/auth-store';
import { ComplaintCard } from '@/components/ComplaintCard';
import { Input } from '@/components/Input';
import { ComplaintStatus, ComplaintType } from '@/types';

export default function ComplaintsScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { complaints, isLoading, fetchUserComplaints } = useComplaintsStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<ComplaintStatus | 'all'>('all');
  const [selectedType, setSelectedType] = useState<ComplaintType | 'all'>('all');
  
  const [filteredComplaints, setFilteredComplaints] = useState(complaints);

  useEffect(() => {
    if (user) {
      fetchUserComplaints(user.id);
    }
  }, [user]);

  useEffect(() => {
    let filtered = [...complaints];
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        complaint => 
          complaint.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          complaint.location.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(complaint => complaint.status === selectedStatus);
    }
    
    // Apply type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter(complaint => complaint.type === selectedType);
    }
    
    // Sort by most recent
    filtered.sort((a, b) => b.createdAt - a.createdAt);
    
    setFilteredComplaints(filtered);
  }, [complaints, searchQuery, selectedStatus, selectedType]);

  const handleNewComplaint = () => {
    router.push('./citizen/complaints/new');
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

  const renderStatusFilter = () => {
    const statuses: Array<ComplaintStatus | 'all'> = ['all', 'pending', 'inProgress', 'resolved', 'rejected'];
    
    return (
      <View style={styles.filterRow}>
        <Text style={styles.filterLabel}>Status:</Text>
        <View style={styles.filterOptions}>
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
        </View>
      </View>
    );
  };

  const renderTypeFilter = () => {
    const types: Array<ComplaintType | 'all'> = ['all', 'garbage', 'waterLeakage', 'streetlight', 'roadDamage', 'others'];
    
    return (
      <View style={styles.filterRow}>
        <Text style={styles.filterLabel}>Type:</Text>
        <View style={styles.filterOptions}>
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
                {type === 'all' ? 'All' : 
                 type === 'waterLeakage' ? 'Water Leakage' :
                 type === 'roadDamage' ? 'Road Damage' :
                 type.charAt(0).toUpperCase() + type.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Text style={styles.title}>My Complaints</Text>
        <TouchableOpacity 
          style={styles.newButton}
          onPress={handleNewComplaint}
          activeOpacity={0.7}
        >
          <Plus size={20} color={colors.white} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.searchContainer}>
        <Input
          placeholder="Search complaints..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon={<Search size={20} color={colors.gray[500]} />}
          containerStyle={styles.searchInput}
        />
        
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={toggleFilters}
          activeOpacity={0.7}
        >
          <Filter size={20} color={colors.gray[700]} />
        </TouchableOpacity>
      </View>
      
      {showFilters && (
        <View style={styles.filtersContainer}>
          {renderStatusFilter()}
          {renderTypeFilter()}
        </View>
      )}
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredComplaints}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <ComplaintCard complaint={item} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No complaints found</Text>
              <TouchableOpacity 
                style={styles.emptyButton}
                onPress={handleNewComplaint}
                activeOpacity={0.7}
              >
                <Text style={styles.emptyButtonText}>File a Complaint</Text>
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
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  searchInput: {
    flex: 1,
    marginBottom: 0,
  },
  filterButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 8,
    backgroundColor: colors.white,
  },
  filtersContainer: {
    padding: 16,
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
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.gray[200],
  },
  filterChipSelected: {
    backgroundColor: colors.primary,
  },
  filterChipText: {
    fontSize: 12,
    color: colors.gray[700],
  },
  filterChipTextSelected: {
    color: colors.white,
  },
  listContent: {
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: colors.gray[600],
    marginBottom: 16,
    textAlign: 'center',
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
  },
});