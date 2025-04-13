import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, BarChart2, Users, Recycle, Trees, ArrowRight, AlertTriangle } from 'lucide-react-native';
import { colors } from '@/constants/Colors';
import { useAuthStore } from '@/store/auth-store';
import { useComplaintsStore } from '@/store/complaints-store';
import { Card } from '@/components/Card';
import { ComplaintCard } from '@/components/ComplaintCard';

export default function AdminDashboardScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { complaints } = useComplaintsStore();

  // Get counts
  const totalComplaints = complaints.length;
  const resolvedComplaints = complaints.filter(
      (    complaint: { status: string; }) => complaint.status === 'resolved'
  ).length;
  const pendingComplaints = complaints.filter(
      (    complaint: { status: string; }) => complaint.status === 'pending'
  ).length;
  const inProgressComplaints = complaints.filter(
      (    complaint: { status: string; }) => complaint.status === 'inProgress'
  ).length;

  // Get the 2 most recent complaints
  const recentComplaints = [...complaints]
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 2);

  const handleViewAllComplaints = () => {
    router.push('./admin/complaints');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {user?.name?.split(' ')[0] || 'Admin'}</Text>
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
        <View style={styles.overviewSection}>
          <Text style={styles.sectionTitle}>Overview</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <View style={[styles.statIconContainer, { backgroundColor: `${colors.primary}20` }]}>
                <BarChart2 size={24} color={colors.primary} />
              </View>
              <Text style={styles.statValue}>{totalComplaints}</Text>
              <Text style={styles.statLabel}>Total Complaints</Text>
            </View>
            
            <View style={styles.statCard}>
              <View style={[styles.statIconContainer, { backgroundColor: `${colors.success}20` }]}>
                <Users size={24} color={colors.success} />
              </View>
              <Text style={styles.statValue}>24</Text>
              <Text style={styles.statLabel}>Employees</Text>
            </View>
            
            <View style={styles.statCard}>
              <View style={[styles.statIconContainer, { backgroundColor: `${colors.info}20` }]}>
                <Recycle size={24} color={colors.info} />
              </View>
              <Text style={styles.statValue}>18</Text>
              <Text style={styles.statLabel}>Recycle Requests</Text>
            </View>
            
            <View style={styles.statCard}>
              <View style={[styles.statIconContainer, { backgroundColor: `${colors.accent}20` }]}>
                <Trees size={24} color={colors.accent} />
              </View>
              <Text style={styles.statValue}>42</Text>
              <Text style={styles.statLabel}>Trees Planted</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.complaintsStatusSection}>
          <Text style={styles.sectionTitle}>Complaints Status</Text>
          
          <Card style={styles.complaintsStatusCard}>
            <View style={styles.statusItem}>
              <View style={styles.statusInfo}>
                <View style={[styles.statusDot, { backgroundColor: colors.warning }]} />
                <Text style={styles.statusLabel}>Pending</Text>
              </View>
              <Text style={styles.statusValue}>{pendingComplaints}</Text>
            </View>
            
            <View style={styles.statusItem}>
              <View style={styles.statusInfo}>
                <View style={[styles.statusDot, { backgroundColor: colors.info }]} />
                <Text style={styles.statusLabel}>In Progress</Text>
              </View>
              <Text style={styles.statusValue}>{inProgressComplaints}</Text>
            </View>
            
            <View style={styles.statusItem}>
              <View style={styles.statusInfo}>
                <View style={[styles.statusDot, { backgroundColor: colors.success }]} />
                <Text style={styles.statusLabel}>Resolved</Text>
              </View>
              <Text style={styles.statusValue}>{resolvedComplaints}</Text>
            </View>
          </Card>
        </View>
        
        <View style={styles.recentComplaintsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Complaints</Text>
            <TouchableOpacity 
              onPress={handleViewAllComplaints}
              activeOpacity={0.7}
            >
              <View style={styles.viewAllButton}>
                <Text style={styles.viewAllText}>View All</Text>
                <ArrowRight size={16} color={colors.primary} />
              </View>
            </TouchableOpacity>
          </View>
          
          {recentComplaints.map(complaint => (
            <ComplaintCard 
              key={complaint.id} 
              complaint={complaint} 
            />
          ))}
        </View>
        
        <View style={styles.alertsSection}>
          <Text style={styles.sectionTitle}>Alerts</Text>
          
          <Card style={styles.alertCard}>
            <View style={styles.alertHeader}>
              <View style={styles.alertIconContainer}>
                <AlertTriangle size={20} color={colors.error} />
              </View>
              <Text style={styles.alertTitle}>High Priority Issues</Text>
            </View>
            
            <View style={styles.alertItem}>
              <View style={styles.alertDot} />
              <Text style={styles.alertText}>
                3 complaints marked as high priority need attention
              </Text>
            </View>
            
            <View style={styles.alertItem}>
              <View style={styles.alertDot} />
              <Text style={styles.alertText}>
                Water leakage reported in Bandra area
              </Text>
            </View>
            
            <TouchableOpacity 
              style={styles.viewAlertsButton}
              activeOpacity={0.7}
            >
              <Text style={styles.viewAlertsButtonText}>View All Alerts</Text>
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
  overviewSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.gray[900],
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
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
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.gray[900],
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.gray[600],
    textAlign: 'center',
  },
  complaintsStatusSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  complaintsStatusCard: {
    padding: 16,
  },
  statusItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusLabel: {
    fontSize: 14,
    color: colors.gray[700],
  },
  statusValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.gray[900],
  },
  recentComplaintsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
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
  alertsSection: {
    paddingHorizontal: 20,
  },
  alertCard: {
    padding: 0,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  alertIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: `${colors.error}20`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.gray[900],
  },
  alertItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  alertDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.error,
    marginTop: 6,
    marginRight: 12,
  },
  alertText: {
    flex: 1,
    fontSize: 14,
    color: colors.gray[700],
    lineHeight: 20,
  },
  viewAlertsButton: {
    padding: 16,
    alignItems: 'center',
  },
  viewAlertsButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
  },
});