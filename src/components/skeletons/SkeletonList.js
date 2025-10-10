import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS, SPACING } from '../../theme';
import SkeletonCard from './SkeletonCard';
import SkeletonBase from './SkeletonBase';

const SkeletonList = ({ 
  itemCount = 5, 
  itemType = 'card',
  horizontal = false,
  style 
}) => {
  const renderSkeletonItem = (index) => {
    switch (itemType) {
      case 'card':
        return <SkeletonCard key={index} />;
      case 'simple':
        return <SkeletonSimpleItem key={index} />;
      case 'restaurant':
        return <SkeletonRestaurantItem key={index} />;
      default:
        return <SkeletonCard key={index} />;
    }
  };

  return (
    <View style={[
      horizontal ? styles.horizontalContainer : styles.verticalContainer,
      style
    ]}>
      {Array.from({ length: itemCount }, (_, index) => renderSkeletonItem(index))}
    </View>
  );
};

const SkeletonSimpleItem = () => (
  <View style={styles.simpleItem}>
    <View style={styles.simpleItemLeft}>
      <SkeletonBase width={50} height={50} borderRadius={25} />
    </View>
    <View style={styles.simpleItemContent}>
      <SkeletonBase width="70%" height={16} borderRadius={4} style={{ marginBottom: 8 }} />
      <SkeletonBase width="50%" height={14} borderRadius={4} />
    </View>
    <SkeletonBase width={60} height={20} borderRadius={4} />
  </View>
);

const SkeletonRestaurantItem = () => (
  <View style={styles.restaurantItem}>
    <SkeletonBase width="100%" height={120} borderRadius={12} style={{ marginBottom: 12 }} />
    <SkeletonBase width="80%" height={18} borderRadius={4} style={{ marginBottom: 8 }} />
    <SkeletonBase width="60%" height={14} borderRadius={4} style={{ marginBottom: 8 }} />
    <View style={styles.restaurantFooter}>
      <SkeletonBase width={40} height={14} borderRadius={4} />
      <SkeletonBase width={80} height={14} borderRadius={4} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  verticalContainer: {
    flex: 1,
  },
  horizontalContainer: {
    flexDirection: 'row',
  },
  simpleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  simpleItemLeft: {
    marginRight: SPACING.md,
  },
  simpleItemContent: {
    flex: 1,
  },
  restaurantItem: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: SPACING.md,
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    width: 280,
    shadowColor: COLORS.shadow.light,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  restaurantFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default SkeletonList;