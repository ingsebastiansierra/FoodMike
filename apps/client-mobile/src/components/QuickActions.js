import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { COLORS } from '../theme/colors';
import { SPACING } from '../theme/spacing';
import Card from './Card';

const QuickActions = ({ actions, columns = 4, style }) => {
  const renderAction = (action, index) => (
    <TouchableOpacity 
      key={action.key || index}
      style={[
        styles.actionItem, 
        { 
          width: actions.length === 1 ? '50%' : `${100 / columns}%`,
          alignSelf: actions.length === 1 ? 'center' : 'flex-start'
        }
      ]} 
      onPress={action.onPress}
    >
      <Card style={styles.actionCard} elevation={3}>
        <Icon name={action.icon} size={32} color={action.color || COLORS.primary} />
        <Text style={[styles.actionText, { color: action.color || COLORS.primary }]}>
          {action.label}
        </Text>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, style]}>
      {actions.map((action, index) => renderAction(action, index))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginVertical: SPACING.lg,
  },
  actionItem: {
    marginBottom: SPACING.sm,
  },
  actionCard: {
    alignItems: 'center',
    padding: SPACING.lg,
    minWidth: 120,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: SPACING.sm,
    textAlign: 'center',
  },
});

export default QuickActions; 