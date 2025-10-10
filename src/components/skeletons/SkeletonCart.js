import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS, SPACING } from '../../theme';
import SkeletonBase from './SkeletonBase';

const SkeletonCart = ({ itemCount = 3, style }) => {
  return (
    <View style={[styles.container, style]}>
      {/* Header del carrito */}
      <View style={styles.header}>
        <SkeletonBase 
          width="40%" 
          height={24} 
          borderRadius={4} 
          style={styles.title}
        />
        <SkeletonBase 
          width={60} 
          height={20} 
          borderRadius={4} 
        />
      </View>

      {/* Items del carrito */}
      <View style={styles.itemsContainer}>
        {Array.from({ length: itemCount }, (_, index) => (
          <SkeletonCartItem key={index} />
        ))}
      </View>

      {/* Resumen de precios */}
      <View style={styles.summary}>
        <SkeletonBase 
          width="100%" 
          height={1} 
          borderRadius={0} 
          style={styles.divider}
        />
        
        {[1, 2, 3].map((item) => (
          <View key={item} style={styles.summaryRow}>
            <SkeletonBase 
              width="40%" 
              height={16} 
              borderRadius={4} 
            />
            <SkeletonBase 
              width={80} 
              height={16} 
              borderRadius={4} 
            />
          </View>
        ))}
        
        <View style={styles.totalRow}>
          <SkeletonBase 
            width="30%" 
            height={20} 
            borderRadius={4} 
          />
          <SkeletonBase 
            width={100} 
            height={24} 
            borderRadius={4} 
          />
        </View>
      </View>

      {/* Botón de checkout */}
      <SkeletonBase 
        width="100%" 
        height={56} 
        borderRadius={16} 
        style={styles.checkoutButton}
      />
    </View>
  );
};

const SkeletonCartItem = () => (
  <View style={styles.cartItem}>
    <SkeletonBase 
      width={60} 
      height={60} 
      borderRadius={12} 
      style={styles.itemImage}
    />
    
    <View style={styles.itemInfo}>
      <SkeletonBase 
        width="80%" 
        height={16} 
        borderRadius={4} 
        style={styles.itemName}
      />
      <SkeletonBase 
        width="60%" 
        height={14} 
        borderRadius={4} 
        style={styles.itemDescription}
      />
      
      <View style={styles.itemFooter}>
        <SkeletonBase 
          width={70} 
          height={18} 
          borderRadius={4} 
        />
        <View style={styles.quantityControls}>
          <SkeletonBase 
            width={30} 
            height={30} 
            borderRadius={15} 
          />
          <SkeletonBase 
            width={20} 
            height={16} 
            borderRadius={4} 
            style={styles.quantity}
          />
          <SkeletonBase 
            width={30} 
            height={30} 
            borderRadius={15} 
          />
        </View>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.primary,
    padding: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  title: {},
  itemsContainer: {
    flex: 1,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    shadowColor: COLORS.shadow.light,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemImage: {
    marginRight: SPACING.md,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    marginBottom: SPACING.xs,
  },
  itemDescription: {
    marginBottom: SPACING.sm,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantity: {
    marginHorizontal: SPACING.sm,
  },
  summary: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  divider: {
    marginBottom: SPACING.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  checkoutButton: {},
});

export default SkeletonCart;