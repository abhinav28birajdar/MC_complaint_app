import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '@/constants/Colors';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'elevated' | 'outlined' | 'filled';
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  style,
  variant = 'elevated'
}) => {
  const getCardStyle = () => {
    switch (variant) {
      case 'elevated':
        return styles.elevatedCard;
      case 'outlined':
        return styles.outlinedCard;
      case 'filled':
        return styles.filledCard;
      default:
        return styles.elevatedCard;
    }
  };

  return (
    <View style={[styles.card, getCardStyle(), style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
  },
  elevatedCard: {
    backgroundColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  outlinedCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray[300],
  },
  filledCard: {
    backgroundColor: colors.gray[100],
  },
});

export default Card;