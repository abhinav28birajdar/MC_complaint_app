import React from 'react';
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

export default function EmployeeDashboardScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { complaints } = useComplaintsStore();

  // Filter complaints assigned to this employee
  const employeeComplaints = complaints.filter(
    complaint => complaint.employeeId === user?.id
  );

  // Get counts
  const totalAssigned = employeeComplaints.length;
  const completedCount = employeeComplaints.filter(
    complaint => complaint.status === 'resolved'
  ).length;
  const pendingCount = employeeComplaints.filter(
    complaint => complaint.status === 'inProgress'
  ).length;

  // Get the 2 most recent assigned complaints
  const recentComplaints = [...employeeComplaints]
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 2);

  const handleViewAllTasks = () => {
    router.push('./employee/tasks');
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
          <View style={styles.notificationBadge} />
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
            <Text style={styles.statValue}>{totalAssigned}</Text>
            <Text style={styles.statLabel}>Total Assigned</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: `${colors.success}20` }]}>
              <CheckCircle size={24} color={colors.success} />
            </View>
            <Text style={styles.statValue}>{completedCount}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: `${colors.warning}20` }]}>
              <AlertCircle size={24} color={colors.warning} />
            </View>
            <Text style={styles.statValue}>{pendingCount}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
        </View>
        
        <View style={styles.todayTasksSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Tasks</Text>
            <TouchableOpacity 
              onPress={handleViewAllTasks}
              activeOpacity={0.7}
            >
              <View style={styles.viewAllButton}>
                <Text style={styles.viewAllText}>View All</Text>
                <ArrowRight size={16} color={colors.primary} />
              </View>
            </TouchableOpacity>
          </View>
          
          {recentComplaints.length > 0 ? (
            recentComplaints.map(complaint => (
              <ComplaintCard 
                key={complaint.id} 
                complaint={complaint} 
              />
            ))
          ) : (
            <Card style={styles.emptyCard}>
              <Text style={styles.emptyText}>
                No tasks assigned for today.
              </Text>
            </Card>
          )}
        </View>
        
        <View style={styles.routeSection}>
          <Text style={styles.sectionTitle}>Today's Route</Text>
          <Card style={styles.routeCard}>
            <View style={styles.routeHeader}>
              <Text style={styles.routeTitle}>South Mumbai Area</Text>
              <Text style={styles.routeSubtitle}>3 locations to visit</Text>
            </View>
            
            <View style={styles.locationItem}>
              <View style={styles.locationDot} />
              <View style={styles.locationContent}>
                <Text style={styles.locationTitle}>Garbage Collection</Text>
                <View style={styles.locationAddress}>
                  <MapPin size={14} color={colors.gray[500]} />
                  <Text style={styles.locationAddressText}>123 Main St, Mumbai</Text>
                </View>
                <Text style={styles.locationTime}>9:00 AM - 10:00 AM</Text>
              </View>
            </View>
            
            <View style={styles.locationItem}>
              <View style={styles.locationDot} />
              <View style={styles.locationContent}>
                <Text style={styles.locationTitle}>Street Light Repair</Text>
                <View style={styles.locationAddress}>
                  <MapPin size={14} color={colors.gray[500]} />
                  <Text style={styles.locationAddressText}>456 Park Ave, Mumbai</Text>
                </View>
                <Text style={styles.locationTime}>11:00 AM - 12:00 PM</Text>
              </View>
            </View>
            
            <View style={styles.locationItem}>
              <View style={styles.locationDot} />
              <View style={styles.locationContent}>
                <Text style={styles.locationTitle}>Water Leakage Inspection</Text>
                <View style={styles.locationAddress}>
                  <MapPin size={14} color={colors.gray[500]} />
                  <Text style={styles.locationAddressText}>789 Road St, Mumbai</Text>
                </View>
                <Text style={styles.locationTime}>2:00 PM - 3:00 PM</Text>
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.viewRouteButton}
              activeOpacity={0.7}
            >
              <Text style={styles.viewRouteButtonText}>View on Map</Text>
            </TouchableOpacity>
          </Card>
        </View>
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
    justifyContent: 'space-between',
    padding: 20,
  },
  statCard: {
    width: '30%',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.gray[900],
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
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
  },
  emptyCard: {
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 14,
    color: colors.gray[600],
    textAlign: 'center',
  },
  routeSection: {
    paddingHorizontal: 20,
  },
  routeCard: {
    padding: 0,
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
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
    marginTop: 4,
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
    padding: 16,
    alignItems: 'center',
  },
  viewRouteButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
  },
});