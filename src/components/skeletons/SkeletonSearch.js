import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { COLORS, SPACING } from '../../theme';
import SkeletonBase from './SkeletonBase';

const SkeletonSearch = ({ style }) => {
  return (
    <View style={[styles.container, style]}>
      {/* Search Bar Skeleton */}
      <View style={styles.searchSection}>
        <SkeletonBase 
          width="85%" 
          height={50} 
          borderRadius={25} 
          style={styles.searchBar}
        />
        <SkeletonBase 
          width={50} 
          height={50} 
          borderRadius={25} 
          style={styles.filterButton}
        />
      </View>

      {/* Categories Skeleton */}
      <View style={styles.categoriesSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {[1, 2, 3, 4, 5].map(item => (
            <SkeletonBase 
              key={item}
              width={80} 
              height={35} 
              borderRadius={20} 
              style={styles.categoryItem}
            />
          ))}
        </ScrollView>
      </View>

      {/* Results Header Skeleton */}
      <View style={styles.resultsHeader}>
        <SkeletonBase 
          width="40%" 
          height={20} 
          borderRadius={4} 
        />
        <SkeletonBase 
          width="30%" 
          height={20} 
          borderRadius={4} 
        />
      </View>

      {/* Products Grid Skeleton */}
      <View style={styles.productsGrid}>
        {Array.from({ length: 8 }, (_, index) => (
          <View key={index} style={styles.productCard}>
            <SkeletonBase 
              width="100%" 
              height={120} 
              borderRadius={12} 
              style={styles.productImage}
            />
            <View style={styles.productInfo}>
              <SkeletonBase 
                width="90%" 
                height={16} 
                borderRadius={4} 
                style={styles.productName}
              />
              <SkeletonBase 
                width="70%" 
                height={14} 
                borderRadius={4} 
                style={styles.productDescription}
              />
              <View style={styles.productFooter}>
                <SkeletonBase 
                  width={60} 
                  height={18} 
                  borderRadius={4} 
                />
                <SkeletonBase 
                  width={40} 
                  height={14} 
                  borderRadius={4} 
                />
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: SPACING.lg,
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  searchBar: {
    marginRight: SPACING.sm,
  },
  filterButton: {},
  categoriesSection: {
    marginBottom: SPACING.lg,
  },
  categoryItem: {
    marginRight: SPACING.md,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productCard: {
    width: '48%',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: SPACING.sm,
    marginBottom: SPACING.md,
    shadowColor: COLORS.shadow?.light || '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  productImage: {
    marginBottom: SPACING.sm,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    marginBottom: SPACING.xs,
  },
  productDescription: {
    marginBottom: SPACING.sm,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default SkeletonSearch;