import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { COLORS } from '../theme/colors';
import { SPACING } from '../theme/spacing';
import Card from './Card';

const StatsCard = ({ 
  icon, 
  value, 
  label, 
  color = COLORS.primary,
  style,
  onPress
}) => {
  return (
    <Card 
      style={[styles.statsCard, style]} 
      onPress={onPress}
      elevation={2}
    >
      <Icon name={icon} size={24} color={color} />
      <Text style={[styles.value, { color }]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </Card>
  );
};

const styles = StyleSheet.create({
  statsCard: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: SPACING.xs,
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: SPACING.xs,
  },
  label: {
    fontSize: 12,
    color: COLORS.gray,
    textAlign: 'center',
    marginTop: SPACING.xs,
  },
});

export default StatsCard; 