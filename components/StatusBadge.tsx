import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, statusColors } from '@/constants/Colors';
import { ComplaintStatus } from '@/types';

interface StatusBadgeProps {
  status: ComplaintStatus;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status,
  size = 'md'
}) => {
  const getStatusColor = () => {
    return statusColors[status] || colors.gray[500];
  };

  const getStatusText = () => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'inProgress':
        return 'In Progress';
      case 'resolved':
        return 'Resolved';
      case 'rejected':
        return 'Rejected';
      default:
        return status;
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          container: styles.containerSm,
          text: styles.textSm,
        };
      case 'lg':
        return {
          container: styles.containerLg,
          text: styles.textLg,
        };
      default:
        return {
          container: {},
          text: {},
        };
    }
  };

  const sizeStyles = getSizeStyles();

  return (
    <View 
      style={[
        styles.container, 
        { backgroundColor: getStatusColor() + '20' },
        sizeStyles.container
      ]}
    >
      <View style={[styles.dot, { backgroundColor: getStatusColor() }]} />
      <Text style={[styles.text, { color: getStatusColor() }, sizeStyles.text]}>
        {getStatusText()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
  },
  containerSm: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
  },
  containerLg: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
  },
  textSm: {
    fontSize: 12,
  },
  textLg: {
    fontSize: 16,
  },
});

export default StatusBadge;