import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator, Linking } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Clock, MapPin, MessageCircle, Navigation } from 'lucide-react-native';
import { colors } from '@/constants/Colors';
import { useComplaintsStore } from '@/store/complaints-store';
import { Complaint } from '@/types';
import { StatusBadge } from '@/components/StatusBadge'; // Ensure this path is correct

export default function ComplaintDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { complaints, isLoading } = useComplaintsStore();

  const [complaint, setComplaint] = useState<Complaint | null>(null);

  useEffect(() => {
    if (id && complaints) { // Check if complaints array exists
      const foundComplaint = complaints.find((c: Complaint) => c.id === id); // Added type safety
      setComplaint(foundComplaint || null); // Set to null if not found
    } else if (id && !isLoading && !complaints) {
         // Handle case where complaints finished loading but are empty or null
         console.warn("Complaints data is not available.");
         // Optionally fetch single complaint here if needed
     }
  }, [id, complaints, isLoading]); // Include isLoading in dependency array

  const formatDate = (timestamp: string | number | Date | undefined): string => {
     if (!timestamp) return 'N/A';
     try {
         const date = new Date(timestamp);
         // Check if date is valid
         if (isNaN(date.getTime())) {
             return 'Invalid Date';
         }
         return date.toLocaleDateString('en-US', {
           day: 'numeric',
           month: 'short',
           year: 'numeric',
           hour: '2-digit',
           minute: '2-digit',
           hour12: true,
         });
     } catch (e) {
         console.error("Error formatting date:", e);
         return 'Date Error';
     }
   };

  const getComplaintTypeLabel = (type: string | undefined): string => {
     if (!type) return 'Unknown Type';
     // Simple formatter: capitalize first letter, add space before caps
     return type.charAt(0).toUpperCase() + type.slice(1).replace(/([A-Z])/g, ' $1').trim();
   };


  const handleBack = () => {
     if (router.canGoBack()) {
         router.back();
     } else {
         router.replace('/citizen/complaints'); // Fallback
     }
  };

   const handleOpenMap = () => {
     if (complaint?.location?.latitude && complaint?.location?.longitude) {
       const { latitude, longitude } = complaint.location;
       const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
       Linking.openURL(url).catch(err => console.error('Failed to open map:', err));
     }
   };

  if (isLoading && !complaint) { // Show loading only if complaint is not yet loaded
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text>Loading complaint details...</Text>
      </SafeAreaView>
    );
  }

  if (!complaint) {
    return (
      <SafeAreaView style={styles.errorContainer} edges={['top']}>
         <View style={styles.header}>
             <TouchableOpacity style={styles.backButton} onPress={handleBack} activeOpacity={0.7}>
                 <ArrowLeft size={24} color={colors.gray[700]} />
             </TouchableOpacity>
             <Text style={styles.title}>Error</Text>
             <View style={styles.placeholder}/>
         </View>
         <View style={styles.errorContent}>
             <Text style={styles.errorText}>Complaint not found or could not be loaded.</Text>
             <TouchableOpacity onPress={handleBack}>
               <Text style={styles.backLink}>Go back to Complaints List</Text>
             </TouchableOpacity>
         </View>
      </SafeAreaView>
    );
  }

  // If complaint is loaded
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
            <View style={styles.headerTextContainer}>
              <Text style={styles.complaintId}>ID: #{complaint.id?.slice(-6) || 'N/A'}</Text>
              <Text style={styles.complaintType}>
                {getComplaintTypeLabel(complaint.type)}
              </Text>
            </View>
            {complaint.status && <StatusBadge status={complaint.status} size="lg" />}
          </View>

          <View style={styles.infoItem}>
            <Clock size={16} color={colors.gray[600]} />
            <Text style={styles.infoText}>
              Submitted: {formatDate(complaint.createdAt)}
            </Text>
          </View>

           {complaint.location?.address && (
             <TouchableOpacity style={styles.infoItemTouchable} onPress={handleOpenMap} activeOpacity={0.7}>
               <MapPin size={16} color={colors.primary} />
               <Text style={styles.infoTextLink} numberOfLines={2} ellipsizeMode="tail">
                 {complaint.location.address}
               </Text>
               <Navigation size={14} color={colors.primary} style={styles.navigationIcon}/>
             </TouchableOpacity>
           )}


          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{complaint.description || 'No description provided.'}</Text>

          {complaint.media && complaint.media.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Photos/Videos</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.mediaContainer}
              >
                {complaint.media.map((uri, index) => (
                   <TouchableOpacity key={index} activeOpacity={0.8}>
                      {/* Consider adding a modal viewer for images */}
                      <Image
                         key={index}
                         source={{ uri }}
                         style={styles.mediaItem}
                         resizeMode="cover"
                       />
                   </TouchableOpacity>
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
                 <View style={[styles.timelineDot, { backgroundColor: colors.info }]} />
                 <View style={styles.timelineContent}>
                   <Text style={styles.timelineTitle}>Complaint Submitted</Text>
                   <Text style={styles.timelineDate}>{formatDate(complaint.createdAt)}</Text>
                 </View>
             </View>

             {complaint.status === 'inProgress' && complaint.updatedAt && (
               <View style={styles.timelineItem}>
                 <View style={[styles.timelineDot, { backgroundColor: colors.warning }]} />
                 <View style={styles.timelineContent}>
                   <Text style={styles.timelineTitle}>In Progress</Text>
                   <Text style={styles.timelineDate}>{formatDate(complaint.updatedAt)}</Text>
                 </View>
               </View>
             )}

             {complaint.status === 'resolved' && complaint.resolvedAt && (
               <View style={styles.timelineItem}>
                 <View style={[styles.timelineDot, { backgroundColor: colors.success }]} />
                 <View style={styles.timelineContent}>
                   <Text style={styles.timelineTitle}>Resolved</Text>
                   <Text style={styles.timelineDate}>{formatDate(complaint.resolvedAt)}</Text>
                 </View>
               </View>
             )}

             {complaint.status === 'rejected' && complaint.updatedAt && ( // Assuming rejection uses updatedAt
               <View style={styles.timelineItem}>
                 <View style={[styles.timelineDot, { backgroundColor: colors.error }]} />
                 <View style={styles.timelineContent}>
                   <Text style={styles.timelineTitle}>Rejected</Text>
                   <Text style={styles.timelineDate}>{formatDate(complaint.updatedAt)}</Text>
                 </View>
               </View>
             )}

             {/* Add a placeholder if no updates yet */}
             {complaint.status === 'pending' && complaint.createdAt === complaint.updatedAt && (
                 <View style={styles.timelineItem}>
                     <View style={[styles.timelineDot, { backgroundColor: colors.gray[400] }]} />
                     <View style={styles.timelineContent}>
                         <Text style={styles.timelineTitle}>Awaiting Action</Text>
                         <Text style={styles.timelineDate}>Status updated: {formatDate(complaint.updatedAt)}</Text>
                     </View>
                 </View>
             )}
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
    backgroundColor: colors.background,
  },
   errorContent: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
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
    // alignItems: 'center', // Keep default
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
    alignItems: 'flex-start', // Align items to the top
    marginBottom: 16,
  },
   headerTextContainer: {
     flex: 1, // Allow text to take available space
     marginRight: 8, // Space between text and badge
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
     flexWrap: 'wrap', // Allow type to wrap if long
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
   infoItemTouchable: { // Style for touchable location
     flexDirection: 'row',
     alignItems: 'center',
     marginBottom: 12,
     paddingRight: 20, // Space for navigation icon
   },
  infoText: {
    fontSize: 14,
    color: colors.gray[700],
    marginLeft: 8,
    flex: 1, // Allow text to take space
  },
   infoTextLink: { // Style for link text
     fontSize: 14,
     color: colors.primary, // Make it look like a link
     marginLeft: 8,
     flex: 1,
     fontWeight: '500',
   },
   navigationIcon: {
       position: 'absolute',
       right: 0,
       top: 2 // Adjust vertical position
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
    marginBottom: 12, // Add margin below media scroll
  },
  mediaItem: {
    width: 100, // Make images smaller
    height: 100,
    borderRadius: 8,
    marginRight: 12,
     backgroundColor: colors.gray[100], // BG while loading
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
    marginTop: 2, // Align icon better with text
  },
  notesText: {
    flex: 1,
    fontSize: 14,
    color: colors.gray[700],
    lineHeight: 20,
  },
  statusTimeline: {
    marginTop: 8,
    borderTopWidth: 1, // Add separator before timeline
    borderTopColor: colors.gray[200],
    paddingTop: 20,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 20, // Increase spacing
    paddingLeft: 4, // Indent items slightly
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 4,
    marginRight: 16, // Increase spacing
     position: 'relative', // For potential line connector later
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