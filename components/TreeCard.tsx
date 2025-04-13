import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Calendar, Droplets, MapPin, ArrowRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { TreeEntry } from '@/types';
import { colors } from '@/constants/Colors';
import { Card } from './Card';

interface TreeCardProps {
  tree: TreeEntry;
}

export const TreeCard: React.FC<TreeCardProps> = ({ tree }) => {
  const router = useRouter();

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const getLastWateredDate = () => {
    if (tree.wateringHistory.length === 0) {
      return 'Not watered yet';
    }
    
    const sortedHistory = [...tree.wateringHistory].sort((a, b) => b.date - a.date);
    return formatDate(sortedHistory[0].date);
  };

  const handleViewDetails = () => {
    router.push(`./citizen/trees/${tree.id}`);
  };

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.treeName}>{tree.treeName}</Text>
      </View>

      {tree.images && tree.images.length > 0 && (
        <Image 
          source={{ uri: tree.images[0] }} 
          style={styles.image} 
          resizeMode="cover"
        />
      )}

      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <Calendar size={16} color={colors.gray[600]} />
          <Text style={styles.infoText}>
            Planted: {formatDate(tree.plantedDate)}
          </Text>
        </View>
        <View style={styles.infoItem}>
          <Droplets size={16} color={colors.info} />
          <Text style={styles.infoText}>
            Last watered: {getLastWateredDate()}
          </Text>
        </View>
        <View style={styles.infoItem}>
          <MapPin size={16} color={colors.gray[600]} />
          <Text style={styles.infoText} numberOfLines={1}>
            {tree.location.address}
          </Text>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.viewButton} 
        onPress={handleViewDetails}
        activeOpacity={0.7}
      >
        <Text style={styles.viewButtonText}>View Details</Text>
        <ArrowRight size={16} color={colors.primary} />
      </TouchableOpacity>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 0,
    overflow: 'hidden',
  },
  header: {
    padding: 16,
    paddingBottom: 12,
  },
  treeName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.gray[900],
  },
  image: {
    width: '100%',
    height: 160,
  },
  infoContainer: {
    padding: 16,
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

export default TreeCard;