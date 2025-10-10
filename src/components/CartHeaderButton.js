import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';
import { useCartNavigation } from '../hooks/useCartNavigation';
import { COLORS } from '../theme';

const CartHeaderButton = () => {
  const { totalQuantity } = useCart();
  const { navigateToCart } = useCartNavigation();

  const handleCartPress = () => {
    navigateToCart();
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handleCartPress}>
      <View style={styles.cartBtn}>
        <Ionicons name="cart-outline" size={28} color={COLORS.primary} />
        {totalQuantity > 0 && (
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>{totalQuantity}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginRight: 16,
  },
  cartBtn: {
    backgroundColor: '#fff',
    borderRadius: 22, // circular
    padding: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 44,
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: COLORS.accent, // Red color for the badge
    borderRadius: 12,
    height: 24,
    minWidth: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    borderWidth: 2,
    borderColor: '#fff',
  },
  cartBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default CartHeaderButton; 