import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { COLORS, SPACING } from '../../theme';
import SkeletonBase from './SkeletonBase';

const SkeletonProfile = () => {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Skeleton */}
      <View style={styles.header}>
        <View style={styles.profileSection}>
          <SkeletonBase width={80} height={80} borderRadius={40} style={{ marginRight: 16 }} />
          <View style={{ flex: 1 }}>
            <SkeletonBase width="70%" height={24} borderRadius={4} style={{ marginBottom: 8 }} />
            <SkeletonBase width="50%" height={16} borderRadius={4} />
          </View>
        </View>
      </View>

      {/* Stats Skeleton */}
      <View style={styles.statsContainer}>
        {[1, 2, 3, 4].map(item => (
          <View key={item} style={styles.statCard}>
            <SkeletonBase width={40} height={40} borderRadius={20} style={{ marginBottom: 8 }} />
            <SkeletonBase width={40} height={20} borderRadius={4} style={{ marginBottom: 4 }} />
            <SkeletonBase width={60} height={14} borderRadius={4} />
          </View>
        ))}
      </View>

      {/* Menu Items Skeleton */}
      <View style={styles.menuContainer}>
        {[1, 2, 3, 4, 5, 6].map(item => (
          <View key={item} style={styles.menuItem}>
            <SkeletonBase width={48} height={48} borderRadius={24} style={{ marginRight: 16 }} />
            <View style={{ flex: 1 }}>
              <SkeletonBase width="60%" height={16} borderRadius={4} style={{ marginBottom: 6 }} />
              <SkeletonBase width="40%" height={14} borderRadius={4} />
            </View>
            <SkeletonBase width={20} height={20} borderRadius={4} />
          </View>
        ))}
      </View>

      {/* Settings Section Skeleton */}
      <View style={styles.settingsSection}>
        <SkeletonBase width="40%" height={20} borderRadius={4} style={{ marginBottom: 16, marginLeft: 16 }} />
        {[1, 2, 3].map(item => (
          <View key={item} style={styles.settingItem}>
            <SkeletonBase width={20} height={20} borderRadius={4} style={{ marginRight: 16 }} />
            <SkeletonBase width="60%" height={16} borderRadius={4} style={{ flex: 1 }} />
            <SkeletonBase width={20} height={20} borderRadius={4} />
          </View>
        ))}
      </View>

      {/* Logout Button Skeleton */}
      <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
        <SkeletonBase width="100%" height={56} borderRadius={20} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background?.primary || COLORS.lightGray,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 50,
    paddingBottom: 40,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 20,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  menuContainer: {
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    borderRadius: 24,
    paddingVertical: 8,
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  settingsSection: {
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    borderRadius: 24,
    paddingVertical: 12,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});

export default SkeletonProfile;