import React, { useMemo } from 'react'; // Added useMemo
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, CheckCircle, Clock, MapPin, AlertCircle, ArrowRight } from 'lucide-react-native';
import { colors } from '@/constants/Colors';
import { useAuthStore } from '@/store/auth-store';
import { useComplaintsStore } from '@/store/complaints-store';
import { Card } from '@/components/Card';
import { ComplaintCard } from '@/components/ComplaintCard';
import { Complaint } from '@/types'; // Import Complaint type

export default function EmployeeDashboardScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { complaints } = useComplaintsStore();

  // Memoize filtering and sorting for performance
   const employeeComplaints = useMemo(() => {
     if (!user?.id || !complaints) return [];
     return complaints.filter((complaint: Complaint) => complaint.employeeId === user.id);
   }, [complaints, user?.id]);

  const stats = useMemo(() => {
      const totalAssigned = employeeComplaints.length;
      const completedCount = employeeComplaints.filter(
           complaint => complaint.status === 'resolved'
       ).length;
      const pendingCount = employeeComplaints.filter(
           complaint => complaint.status === 'pending' || complaint.status === 'inProgress' // Include both pending and inProgress
       ).length;
       return { totalAssigned, completedCount, pendingCount };
  }, [employeeComplaints]);

  const recentComplaints = useMemo(() => {
       return [...employeeComplaints]
         .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
         .slice(0, 3); // Show 3 recent tasks
   }, [employeeComplaints]);


  const handleViewAllTasks = () => {
    router.push('./employee/tasks'); // Use root-relative path
  };

   const handleTaskPress = (id: string) => {
     // Navigate to a task detail screen if you have one
     router.push(`./employee/tasks/${id}`); // Assuming tasks detail route exists
   };


  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {user?.name?.split(' ')[0] || 'Employee'}</Text>
          <Text style={styles.subtitle}>Welcome to your dashboard</Text>
        </View>

        <TouchableOpacity
          style={styles.notificationButton}
          activeOpacity={0.7}
        >
          <Bell size={24} color={colors.gray[700]} />
          {/* Add badge logic if needed */}
          {/* <View style={styles.notificationBadge} /> */}
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: `${colors.primary}20` }]}>
              <Clock size={24} color={colors.primary} />
            </View>
            <Text style={styles.statValue}>{stats.totalAssigned}</Text>
            <Text style={styles.statLabel}>Total Assigned</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: `${colors.warning}20` }]}>
              <AlertCircle size={24} color={colors.warning} />
            </View>
            <Text style={styles.statValue}>{stats.pendingCount}</Text>
            <Text style={styles.statLabel}>Pending Tasks</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: `${colors.success}20` }]}>
              <CheckCircle size={24} color={colors.success} />
            </View>
            <Text style={styles.statValue}>{stats.completedCount}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
        </View>

        <View style={styles.todayTasksSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Tasks</Text>
            {employeeComplaints.length > 0 && (
                 <TouchableOpacity
                   onPress={handleViewAllTasks}
                   activeOpacity={0.7}
                 >
                   <View style={styles.viewAllButton}>
                     <Text style={styles.viewAllText}>View All</Text>
                     <ArrowRight size={16} color={colors.primary} />
                   </View>
                 </TouchableOpacity>
             )}
          </View>

          {recentComplaints.length > 0 ? (
            recentComplaints.map(complaint => (
              <TouchableOpacity key={complaint.id} onPress={() => handleTaskPress(complaint.id)} activeOpacity={0.8}>
                 <ComplaintCard complaint={complaint} />
              </TouchableOpacity>
            ))
          ) : (
            <Card style={styles.emptyCard}>
              <Text style={styles.emptyText}>
                No tasks assigned currently.
              </Text>
            </Card>
          )}
        </View>

        {/* Commenting out Route Section - needs real data */}
        {/* <View style={styles.routeSection}>
          <Text style={styles.sectionTitle}>Today's Route</Text>
          <Card style={styles.routeCard}>
            <View style={styles.routeHeader}>
              <Text style={styles.routeTitle}>Sample Route Area</Text>
              <Text style={styles.routeSubtitle}>3 locations to visit</Text>
            </View>

            <View style={styles.locationItem}>
              <View style={styles.locationDot} />
              <View style={styles.locationContent}>
                <Text style={styles.locationTitle}>Task Type 1</Text>
                <View style={styles.locationAddress}>
                  <MapPin size={14} color={colors.gray[500]} />
                  <Text style={styles.locationAddressText}>123 Address St, City</Text>
                </View>
                <Text style={styles.locationTime}>Time Slot 1</Text>
              </View>
            </View>

            <View style={styles.locationItem}>
               <View style={styles.locationDot} />
               <View style={styles.locationContent}>
                 <Text style={styles.locationTitle}>Task Type 2</Text>
                 <View style={styles.locationAddress}>
                   <MapPin size={14} color={colors.gray[500]} />
                   <Text style={styles.locationAddressText}>456 Another Rd, City</Text>
                 </View>
                 <Text style={styles.locationTime}>Time Slot 2</Text>
               </View>
            </View>

            <TouchableOpacity
              style={styles.viewRouteButton}
              activeOpacity={0.7}
            >
              <Text style={styles.viewRouteButtonText}>View on Map</Text>
            </TouchableOpacity>
          </Card>
        </View> */}
      </ScrollView>
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
  greeting: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.gray[900],
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.gray[600],
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.error,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around', // Use space-around for better distribution
    paddingVertical: 20,
    paddingHorizontal: 10, // Reduce horizontal padding slightly
  },
  statCard: {
    width: '31%', // Adjust width slightly
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 12, // Reduce padding slightly
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    minHeight: 130, // Ensure cards have similar height
     justifyContent: 'center', // Center content vertically
  },
  statIconContainer: {
    width: 40, // Slightly smaller icon container
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10, // Adjust spacing
  },
  statValue: {
    fontSize: 18, // Adjust font size
    fontWeight: 'bold',
    color: colors.gray[900],
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11, // Adjust font size
    color: colors.gray[600],
    textAlign: 'center',
  },
  todayTasksSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.gray[900],
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 14,
    color: colors.primary,
    marginRight: 4,
    fontWeight: '500',
  },
  emptyCard: {
    alignItems: 'center',
    padding: 24,
    marginTop: 10, // Add margin if needed
  },
  emptyText: {
    fontSize: 14,
    color: colors.gray[600],
    textAlign: 'center',
  },
  routeSection: { // Keep styles even if section is commented out
    paddingHorizontal: 20,
    marginBottom: 24, // Add margin below section
  },
  routeCard: {
    padding: 0, // Remove padding if children handle it
    overflow: 'hidden', // Ensure border radius applies to children
  },
  routeHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  routeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.gray[900],
    marginBottom: 4,
  },
  routeSubtitle: {
    fontSize: 14,
    color: colors.gray[600],
  },
  locationItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  locationDot: {
    width: 10, // Smaller dot
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
    marginTop: 5, // Adjust alignment
    marginRight: 12,
  },
  locationContent: {
    flex: 1,
  },
  locationTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray[900],
    marginBottom: 4,
  },
  locationAddress: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  locationAddressText: {
    fontSize: 12,
    color: colors.gray[600],
    marginLeft: 4,
  },
  locationTime: {
    fontSize: 12,
    color: colors.gray[500],
  },
  viewRouteButton: {
    paddingVertical: 12, // Adjust padding
    paddingHorizontal: 16,
    alignItems: 'center',
    backgroundColor: colors.primaryLight, // Lighter background for button
  },
  viewRouteButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
  },
});