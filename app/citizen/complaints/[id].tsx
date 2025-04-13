import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Clock, MapPin, MessageCircle } from 'lucide-react-native';
import { colors } from '@/constants/Colors';
import { useComplaintsStore } from '@/store/complaints-store';
import { Complaint } from '@/types';
import { StatusBadge } from '@/components/StatusBadge';

export default function ComplaintDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { complaints, isLoading } = useComplaintsStore();
  
  const [complaint, setComplaint] = useState<Complaint | null>(null);

  useEffect(() => {
    if (id) {
      const foundComplaint = complaints.find((c: { id: string; }) => c.id === id);
      if (foundComplaint) {
        setComplaint(foundComplaint);
      }
    }
  }, [id, complaints]);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getComplaintTypeLabel = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1).replace(/([A-Z])/g, ' $1');
  };

  const handleBack = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  if (!complaint) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>Complaint not found</Text>
        <TouchableOpacity onPress={handleBack}>
          <Text style={styles.backLink}>Go back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleBack}
          activeOpacity={0.7}
        >
          <ArrowLeft size={24} color={colors.gray[700]} />
        </TouchableOpacity>
        <Text style={styles.title}>Complaint Details</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.complaintId}>#{complaint.id.slice(-6)}</Text>
              <Text style={styles.complaintType}>
                {getComplaintTypeLabel(complaint.type)}
              </Text>
            </View>
            <StatusBadge status={complaint.status} size="lg" />
          </View>
          
          <View style={styles.infoItem}>
            <Clock size={16} color={colors.gray[600]} />
            <Text style={styles.infoText}>
              Submitted: {formatDate(complaint.createdAt)}
            </Text>
          </View>
          
          <View style={styles.infoItem}>
            <MapPin size={16} color={colors.gray[600]} />
            <Text style={styles.infoText}>
              {complaint.location.address}
            </Text>
          </View>
          
          <View style={styles.divider} />
          
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{complaint.description}</Text>
          
          {complaint.media && complaint.media.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Photos/Videos</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.mediaContainer}
              >
                {complaint.media.map((uri, index) => (
                  <Image 
                    key={index}
                    source={{ uri }} 
                    style={styles.mediaItem} 
                    resizeMode="cover"
                  />
                ))}
              </ScrollView>
            </>
          )}
          
          {complaint.notes && (
            <>
              <Text style={styles.sectionTitle}>Notes from Employee</Text>
              <View style={styles.notesContainer}>
                <View style={styles.noteIcon}>
                  <MessageCircle size={16} color={colors.white} />
                </View>
                <Text style={styles.notesText}>{complaint.notes}</Text>
              </View>
            </>
          )}
          
          <View style={styles.statusTimeline}>
            <Text style={styles.sectionTitle}>Status Timeline</Text>
            
            <View style={styles.timelineItem}>
              <View style={[styles.timelineDot, { backgroundColor: colors.success }]} />
              <View style={styles.timelineContent}>
                <Text style={styles.timelineTitle}>Complaint Submitted</Text>
                <Text style={styles.timelineDate}>{formatDate(complaint.createdAt)}</Text>
              </View>
            </View>
            
            {complaint.status === 'inProgress' || complaint.status === 'resolved' || complaint.status === 'rejected' ? (
              <View style={styles.timelineItem}>
                <View style={[styles.timelineDot, { backgroundColor: colors.info }]} />
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineTitle}>In Progress</Text>
                  <Text style={styles.timelineDate}>{formatDate(complaint.updatedAt)}</Text>
                </View>
              </View>
            ) : null}
            
            {complaint.status === 'resolved' && complaint.resolvedAt ? (
              <View style={styles.timelineItem}>
                <View style={[styles.timelineDot, { backgroundColor: colors.success }]} />
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineTitle}>Resolved</Text>
                  <Text style={styles.timelineDate}>{formatDate(complaint.resolvedAt)}</Text>
                </View>
              </View>
            ) : null}
            
            {complaint.status === 'rejected' ? (
              <View style={styles.timelineItem}>
                <View style={[styles.timelineDot, { backgroundColor: colors.error }]} />
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineTitle}>Rejected</Text>
                  <Text style={styles.timelineDate}>{formatDate(complaint.updatedAt)}</Text>
                </View>
              </View>
            ) : null}
          </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: colors.gray[700],
    marginBottom: 16,
    textAlign: 'center',
  },
  backLink: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '500',
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
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.gray[900],
  },
  placeholder: {
    width: 40,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  complaintId: {
    fontSize: 14,
    color: colors.gray[500],
    marginBottom: 4,
  },
  complaintType: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.gray[900],
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: colors.gray[700],
    marginLeft: 8,
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: colors.gray[200],
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.gray[800],
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: colors.gray[700],
    lineHeight: 22,
    marginBottom: 20,
  },
  mediaContainer: {
    paddingBottom: 8,
  },
  mediaItem: {
    width: 200,
    height: 150,
    borderRadius: 8,
    marginRight: 12,
  },
  notesContainer: {
    flexDirection: 'row',
    backgroundColor: colors.gray[100],
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  noteIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.info,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notesText: {
    flex: 1,
    fontSize: 14,
    color: colors.gray[700],
    lineHeight: 20,
  },
  statusTimeline: {
    marginTop: 8,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 4,
    marginRight: 12,
  },
  timelineContent: {
    flex: 1,
  },
  timelineTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray[800],
    marginBottom: 4,
  },
  timelineDate: {
    fontSize: 12,
    color: colors.gray[500],
  },
});