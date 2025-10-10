import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { COLORS, SPACING } from '../../theme';
import SkeletonBase from './SkeletonBase';

const SkeletonOrderDetail = ({ style }) => {
  return (
    <View style={[styles.container, style]}>
      {/* Header Skeleton */}
      <View style={styles.header}>
        <SkeletonBase width={24} height={24} borderRadius={12} />
        <SkeletonBase width="50%" height={20} borderRadius={4} />
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Status Card Skeleton */}
        <View style={styles.statusCard}>
          <SkeletonBase 
            width={120} 
            height={40} 
            borderRadius={20} 
            style={styles.statusBadge}
          />
          <SkeletonBase 
            width="80%" 
            height={16} 
            borderRadius={4} 
            style={styles.statusDescription}
          />
          <SkeletonBase 
            width="60%" 
            height={20} 
            borderRadius={4} 
            style={styles.orderNumber}
          />
          <SkeletonBase 
            width="40%" 
            height={14} 
            borderRadius={4} 
          />
        </View>

        {/* Restaurant Section Skeleton */}
        <View style={styles.section}>
          <SkeletonBase 
            width="30%" 
            height={20} 
            borderRadius={4} 
            style={styles.sectionTitle}
          />
          <View style={styles.restaurantInfo}>
            <SkeletonBase 
              width={60} 
              height={60} 
              borderRadius={30} 
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
              <SkeletonBase 
                width="50%" 
                height={14} 
                borderRadius={4} 
              />
            </View>
          </View>
        </View>

        {/* Products Section Skeleton */}
        <View style={styles.section}>
          <SkeletonBase 
            width="25%" 
            height={20} 
            borderRadius={4} 
            style={styles.sectionTitle}
          />
          {[1, 2, 3].map(item => (
            <SkeletonOrderItem key={item} />
          ))}
        </View>

        {/* Address Section Skeleton */}
        <View style={styles.section}>
          <SkeletonBase 
            width="45%" 
            height={20} 
            borderRadius={4} 
            style={styles.sectionTitle}
          />
          <View style={styles.addressContainer}>
            <SkeletonBase 
              width={20} 
              height={20} 
              borderRadius={4} 
              style={styles.addressIcon}
            />
            <View style={styles.addressInfo}>
              <SkeletonBase 
                width="90%" 
                height={16} 
                borderRadius={4} 
                style={styles.addressText}
              />
              <SkeletonBase 
                width="60%" 
                height={14} 
                borderRadius={4} 
                style={styles.addressPhone}
              />
              <SkeletonBase 
                width="80%" 
                height={14} 
                borderRadius={4} 
              />
            </View>
          </View>
        </View>

        {/* Summary Section Skeleton */}
        <View style={styles.section}>
          <SkeletonBase 
            width="25%" 
            height={20} 
            borderRadius={4} 
            style={styles.sectionTitle}
          />
          {[1, 2].map(item => (
            <View key={item} style={styles.summaryRow}>
              <SkeletonBase width="30%" height={16} borderRadius={4} />
              <SkeletonBase width="25%" height={16} borderRadius={4} />
            </View>
          ))}
          <View style={[styles.summaryRow, styles.totalRow]}>
            <SkeletonBase width="20%" height={20} borderRadius={4} />
            <SkeletonBase width="30%" height={20} borderRadius={4} />
          </View>
        </View>

        {/* Payment Method Section Skeleton */}
        <View style={styles.section}>
          <SkeletonBase 
            width="40%" 
            height={20} 
            borderRadius={4} 
            style={styles.sectionTitle}
          />
          <View style={styles.paymentMethod}>
            <SkeletonBase width={20} height={20} borderRadius={4} />
            <SkeletonBase 
              width="30%" 
              height={16} 
              borderRadius={4} 
              style={styles.paymentText}
            />
          </View>
        </View>
      </ScrollView>

      {/* Bottom Button Skeleton */}
      <View style={styles.bottomContainer}>
        <SkeletonBase 
          width="100%" 
          height={56} 
          borderRadius={12} 
        />
      </View>
    </View>
  );
};

const SkeletonOrderItem = () => (
  <View style={styles.orderItem}>
    <SkeletonBase 
      width={50} 
      height={50} 
      borderRadius={8} 
      style={styles.productImage}
    />
    <View style={styles.productInfo}>
      <SkeletonBase 
        width="80%" 
        height={16} 
        borderRadius={4} 
        style={styles.productName}
      />
      <SkeletonBase 
        width="60%" 
        height={14} 
        borderRadius={4} 
        style={styles.productDescription}
      />
      <SkeletonBase 
        width="40%" 
        height={14} 
        borderRadius={4} 
      />
    </View>
    <View style={styles.productPricing}>
      <SkeletonBase 
        width={60} 
        height={14} 
        borderRadius={4} 
        style={styles.productPrice}
      />
      <SkeletonBase 
        width={70} 
        height={16} 
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  scrollView: {
    flex: 1,
  },
  statusCard: {
    backgroundColor: COLORS.white,
    margin: SPACING.lg,
    padding: SPACING.lg,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: COLORS.shadow?.light || '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statusBadge: {
    marginBottom: SPACING.md,
  },
  statusDescription: {
    marginBottom: SPACING.md,
  },
  orderNumber: {
    marginBottom: SPACING.xs,
  },
  section: {
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    padding: SPACING.lg,
    borderRadius: 12,
    shadowColor: COLORS.shadow?.light || '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    marginBottom: SPACING.md,
  },
  restaurantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
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
  restaurantAddress: {
    marginBottom: SPACING.xs,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  productImage: {
    marginRight: SPACING.md,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    marginBottom: SPACING.xs,
  },
  productDescription: {
    marginBottom: SPACING.xs,
  },
  productPricing: {
    alignItems: 'flex-end',
  },
  productPrice: {
    marginBottom: SPACING.xs,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  addressIcon: {
    marginRight: SPACING.sm,
  },
  addressInfo: {
    flex: 1,
  },
  addressText: {
    marginBottom: SPACING.xs,
  },
  addressPhone: {
    marginBottom: SPACING.xs,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    marginTop: SPACING.sm,
    paddingTop: SPACING.md,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentText: {
    marginLeft: SPACING.sm,
  },
  bottomContainer: {
    backgroundColor: COLORS.white,
    padding: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
});

export default SkeletonOrderDetail;