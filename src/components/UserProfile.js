import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { COLORS } from '../theme/colors';
import { SPACING } from '../theme/spacing';
import Card from './Card';

const UserProfile = ({ 
  user, 
  role, 
  actions = [], 
  style,
  showRole = true 
}) => {
  return (
    <Card style={[styles.profileCard, style]} elevation={2}>
      <View style={styles.profileHeader}>
        <Icon name="user-circle" size={60} color={COLORS.primary} />
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{user?.name || 'Sin nombre'}</Text>
          <Text style={styles.profileEmail}>{user?.email}</Text>
          {showRole && role && (
            <View style={styles.roleBadge}>
              <Text style={styles.roleText}>{role}</Text>
            </View>
          )}
        </View>
      </View>
      
      {actions.length > 0 && (
        <View style={styles.profileActions}>
          {actions.map((action, index) => (
            <View key={action.key || index} style={styles.actionWrapper}>
              {action.component}
            </View>
          ))}
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  profileCard: {
    marginBottom: SPACING.lg,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  profileInfo: {
    marginLeft: SPACING.md,
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  profileEmail: {
    fontSize: 14,
    color: COLORS.gray,
    marginTop: 2,
  },
  roleBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: SPACING.xs,
  },
  roleText: {
    fontSize: 12,
    color: COLORS.white,
    fontWeight: '600',
  },
  profileActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionWrapper: {
    flex: 1,
    marginHorizontal: SPACING.xs,
  },
});

export default UserProfile; 