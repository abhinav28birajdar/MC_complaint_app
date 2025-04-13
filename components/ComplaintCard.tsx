import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { MapPin, Clock, ArrowRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Complaint } from '@/types';
import { colors } from '@/constants/Colors';
import { Card } from './Card';
import { StatusBadge } from './StatusBadge';

interface ComplaintCardProps {
  complaint: Complaint;
  showActions?: boolean;
}

export const ComplaintCard: React.FC<ComplaintCardProps> = ({ 
  complaint,
  showActions = true
}) => {
  const router = useRouter();

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const getComplaintTypeLabel = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1).replace(/([A-Z])/g, ' $1');
  };

  const handleViewDetails = () => {
    router.push(`./citizen/complaints/${complaint.id}`);
  };

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.complaintId}>#{complaint.id.slice(-6)}</Text>
          <Text style={styles.complaintType}>
            {getComplaintTypeLabel(complaint.type)}
          </Text>
        </View>
        <StatusBadge status={complaint.status} />
      </View>

      {complaint.media && complaint.media.length > 0 && (
        <Image 
          source={{ uri: complaint.media[0] }} 
          style={styles.image} 
          resizeMode="cover"
        />
      )}

      <Text style={styles.description} numberOfLines={2}>
        {complaint.description}
      </Text>

      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <MapPin size={16} color={colors.gray[600]} />
          <Text style={styles.infoText} numberOfLines={1}>
            {complaint.location.address}
          </Text>
        </View>
        <View style={styles.infoItem}>
          <Clock size={16} color={colors.gray[600]} />
          <Text style={styles.infoText}>
            {formatDate(complaint.createdAt)}
          </Text>
        </View>
      </View>

      {showActions && (
        <TouchableOpacity 
          style={styles.viewButton} 
          onPress={handleViewDetails}
          activeOpacity={0.7}
        >
          <Text style={styles.viewButtonText}>View Details</Text>
          <ArrowRight size={16} color={colors.primary} />
        </TouchableOpacity>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 0,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
    paddingBottom: 12,
  },
  complaintId: {
    fontSize: 12,
    color: colors.gray[500],
    marginBottom: 4,
  },
  complaintType: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.gray[900],
  },
  image: {
    width: '100%',
    height: 160,
  },
  description: {
    fontSize: 14,
    color: colors.gray[700],
    lineHeight: 20,
    padding: 16,
    paddingTop: 12,
    paddingBottom: 12,
  },
  infoContainer: {
    padding: 16,
    paddingTop: 0,
    paddingBottom: 12,
    gap: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: colors.gray[600],
    flex: 1,
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
    gap: 8,
  },
  viewButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
  },
});

export default ComplaintCard;