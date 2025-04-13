import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowRight, Bell, Calendar, FileText, MapPin, Recycle, Trees } from 'lucide-react-native';
import { colors } from '@/constants/Colors';
import { useAuthStore } from '@/store/auth-store';
import { useComplaintsStore } from '@/store/complaints-store';
import { Card } from '@/components/Card';
import { ComplaintCard } from '@/components/ComplaintCard';

export default function CitizenHomeScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { complaints } = useComplaintsStore();

  // Get the 2 most recent complaints
  const recentComplaints = [...complaints]
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 2);

  const handleViewAllComplaints = () => {
    router.push('/citizen/complaints');
  };

  const handleFileComplaint = () => {
    router.push('/citizen/complaints/new');
  };

  const handleAddTree = () => {
    router.push('./citizen/trees/new');
  };

  const handleRecyclePickup = () => {
    router.push('./citizen/recycle/new');
  };

  const handleCleaningSchedule = () => {
    router.push('./citizen/cleaning-schedule');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {user?.name?.split(' ')[0] || 'Citizen'}</Text>
          <View style={styles.locationContainer}>
            <MapPin size={16} color={colors.gray[600]} />
            <Text style={styles.location}>Mumbai, Maharashtra</Text>
          </View>
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
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <View style={styles.actionsGrid}>
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={handleFileComplaint}
              activeOpacity={0.7}
            >
              <View style={[styles.actionIcon, { backgroundColor: `${colors.primary}20` }]}>
                <FileText size={24} color={colors.primary} />
              </View>
              <Text style={styles.actionText}>File Complaint</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={handleAddTree}
              activeOpacity={0.7}
            >
              <View style={[styles.actionIcon, { backgroundColor: `${colors.success}20` }]}>
                <Trees size={24} color={colors.success} />
              </View>
              <Text style={styles.actionText}>Add Tree</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={handleRecyclePickup}
              activeOpacity={0.7}
            >
              <View style={[styles.actionIcon, { backgroundColor: `${colors.accent}20` }]}>
                <Recycle size={24} color={colors.accent} />
              </View>
              <Text style={styles.actionText}>Recycle Pickup</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={handleCleaningSchedule}
              activeOpacity={0.7}
            >
              <View style={[styles.actionIcon, { backgroundColor: `${colors.info}20` }]}>
                <Calendar size={24} color={colors.info} />
              </View>
              <Text style={styles.actionText}>Cleaning Schedule</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.announcementSection}>
          <Card style={styles.announcementCard}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1617450365226-9bf28c04e130?q=80&w=500&auto=format&fit=crop' }} 
              style={styles.announcementImage}
              resizeMode="cover"
            />
            <View style={styles.announcementContent}>
              <Text style={styles.announcementTitle}>Tree Plantation Drive</Text>
              <Text style={styles.announcementDate}>June 5, 2023</Text>
              <Text style={styles.announcementText}>
                Join us for the annual tree plantation drive to make our city greener and healthier.
              </Text>
            </View>
          </Card>
        </View>
        
        <View style={styles.complaintsSection}>
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
                You haven't filed any complaints yet.
              </Text>
              <TouchableOpacity 
                style={styles.fileComplaintButton}
                onPress={handleFileComplaint}
                activeOpacity={0.7}
              >
                <Text style={styles.fileComplaintText}>File a Complaint</Text>
              </TouchableOpacity>
            </Card>
          )}
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
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: 14,
    color: colors.gray[600],
    marginLeft: 4,
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
  quickActions: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.gray[900],
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
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
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray[800],
    textAlign: 'center',
  },
  announcementSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  announcementCard: {
    padding: 0,
    overflow: 'hidden',
  },
  announcementImage: {
    width: '100%',
    height: 120,
  },
  announcementContent: {
    padding: 16,
  },
  announcementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.gray[900],
    marginBottom: 4,
  },
  announcementDate: {
    fontSize: 12,
    color: colors.gray[500],
    marginBottom: 8,
  },
  announcementText: {
    fontSize: 14,
    color: colors.gray[700],
    lineHeight: 20,
  },
  complaintsSection: {
    paddingHorizontal: 20,
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
  emptyCard: {
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 14,
    color: colors.gray[600],
    marginBottom: 16,
    textAlign: 'center',
  },
  fileComplaintButton: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  fileComplaintText: {
    color: colors.white,
    fontWeight: '500',
  },
});