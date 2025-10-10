import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS, SPACING } from '../../theme';
import SkeletonBase from './SkeletonBase';

const SkeletonProfile = ({ style }) => {
  return (
    <View style={[styles.container, style]}>
      {/* Header con avatar */}
      <View style={styles.header}>
        <SkeletonBase 
          width={80} 
          height={80} 
          borderRadius={40} 
          style={styles.avatar}
        />
        <View style={styles.headerInfo}>
          <SkeletonBase 
            width="70%" 
            height={24} 
            borderRadius={4} 
            style={styles.name}
          />
          <SkeletonBase 
            width="50%" 
            height={16} 
            borderRadius={4} 
            style={styles.email}
          />
        </View>
      </View>

      {/* Estadísticas */}
      <View style={styles.stats}>
        {[1, 2, 3].map((item) => (
          <View key={item} style={styles.statItem}>
            <SkeletonBase 
              width={40} 
              height={20} 
              borderRadius={4} 
              style={styles.statNumber}
            />
            <SkeletonBase 
              width={60} 
              height={14} 
              borderRadius={4} 
              style={styles.statLabel}
            />
          </View>
        ))}
      </View>

      {/* Opciones del menú */}
      <View style={styles.menuOptions}>
        {[1, 2, 3, 4, 5].map((item) => (
          <View key={item} style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <SkeletonBase 
                width={24} 
                height={24} 
                borderRadius={4} 
                style={styles.menuIcon}
              />
              <SkeletonBase 
                width="60%" 
                height={16} 
                borderRadius={4} 
                style={styles.menuText}
              />
            </View>
            <SkeletonBase 
              width={20} 
              height={20} 
              borderRadius={4} 
            />
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.primary,
    padding: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xl,
    paddingBottom: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  avatar: {
    marginRight: SPACING.lg,
  },
  headerInfo: {
    flex: 1,
  },
  name: {
    marginBottom: SPACING.sm,
  },
  email: {},
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: SPACING.xl,
    paddingVertical: SPACING.lg,
    backgroundColor: COLORS.white,
    borderRadius: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    marginBottom: SPACING.xs,
  },
  statLabel: {},
  menuOptions: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: SPACING.md,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    marginRight: SPACING.md,
  },
  menuText: {},
});

export default SkeletonProfile;