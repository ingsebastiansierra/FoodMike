import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { COLORS, SPACING } from '../../theme';
import SkeletonBase from './SkeletonBase';

const SkeletonOrders = ({ itemCount = 5, style }) => {
  return (
    <View style={[styles.container, style]}>
      {/* Header Skeleton */}
      <View style={styles.header}>
        <SkeletonBase 
          width="40%" 
          height={28} 
          borderRadius={4} 
        />
      </View>

      {/* Filters Skeleton */}
      <View style={styles.filtersContainer}>
        {[1, 2, 3, 4].map(item => (
          <SkeletonBase 
            key={item}
            width={80} 
            height={35} 
            borderRadius={20} 
            style={styles.filterItem}
          />
        ))}
      </View>

      {/* Orders List Skeleton */}
      <ScrollView style={styles.listContainer}>
        {Array.from({ length: itemCount }, (_, index) => (
          <SkeletonOrderCard key={index} />
        ))}
      </ScrollView>
    </View>
  );
};

const SkeletonOrderCard = () => (
  <View style={styles.orderCard}>
    {/* Order Header */}
    <View style={styles.orderHeader}>
      <View style={styles.orderInfo}>
        <SkeletonBase 
          width="60%" 
          height={18} 
          borderRadius={4} 
          style={styles.orderNumber}
        />
        <SkeletonBase 
          width="40%" 
          height={14} 
          borderRadius={4} 
          style={styles.orderDate}
        />
      </View>
      <SkeletonBase 
        width={90} 
        height={28} 
        borderRadius={14} 
      />
    </View>

    {/* Restaurant Info */}
    <View style={styles.restaurantInfo}>
      <SkeletonBase 
        width={50} 
        height={50} 
        borderRadius={25} 
        style={styles.restaurantImage}
      />
      <View style={styles.restaurantDetails}>
        <SkeletonBase 
          width="80%" 
          height={16} 
          borderRadius={4} 
          style={styles.restaurantName}
        />
        <SkeletonBase 
          width="60%" 
          height={14} 
          borderRadius={4} 
          style={styles.restaurantAddress}
        />
      </View>
    </View>

    {/* Order Items */}
    <View style={styles.orderItems}>
      <SkeletonBase 
        width="50%" 
        height={14} 
        borderRadius={4} 
        style={styles.itemsTitle}
      />
      {[1, 2].map(item => (
        <SkeletonBase 
          key={item}
          width="70%" 
          height={14} 
          borderRadius={4} 
          style={styles.itemName}
        />
      ))}
    </View>

    {/* Order Footer */}
    <View style={styles.orderFooter}>
      <SkeletonBase 
        width={100} 
        height={20} 
        borderRadius={4} 
      />
      <SkeletonBase 
        width={20} 
        height={20} 
        borderRadius={4} 
      />
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background?.primary || COLORS.lightGray,
  },
  header: {
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.white,
  },
  filterItem: {
    marginRight: SPACING.sm,
  },
  listContainer: {
    flex: 1,
    padding: SPACING.lg,
  },
  orderCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    shadowColor: COLORS.shadow?.light || '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  orderInfo: {
    flex: 1,
  },
  orderNumber: {
    marginBottom: SPACING.xs,
  },
  orderDate: {},
  restaurantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  restaurantImage: {
    marginRight: SPACING.md,
  },
  restaurantDetails: {
    flex: 1,
  },
  restaurantName: {
    marginBottom: SPACING.xs,
  },
  restaurantAddress: {},
  orderItems: {
    marginBottom: SPACING.md,
  },
  itemsTitle: {
    marginBottom: SPACING.xs,
  },
  itemName: {
    marginBottom: SPACING.xs,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    paddingTop: SPACING.md,
  },
});

export default SkeletonOrders;