import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../theme/colors';
import { SPACING } from '../theme/spacing';

const Card = ({ 
  children, 
  style, 
  onPress, 
  disabled = false,
  elevation = 2,
  borderRadius = 12,
  padding = SPACING.md,
  marginBottom = SPACING.sm,
  borderLeftColor,
  borderLeftWidth = 0
}) => {
  const CardComponent = onPress ? TouchableOpacity : View;
  
  return (
    <CardComponent 
      style={[
        styles.card,
        {
          elevation,
          borderRadius,
          padding,
          marginBottom,
          borderLeftWidth,
          borderLeftColor,
          shadowRadius: elevation,
        },
        style
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      {children}
    </CardComponent>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
  },
});

export default Card; 