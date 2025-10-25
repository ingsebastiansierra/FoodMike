import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { CartContext } from '../context/CartContext';
import CartItemCard from '../components/CartItemCard';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { COLORS } from '../theme/colors';
import { SPACING } from '../theme/spacing';
import { showAlert, showConfirmAlert } from '../features/core/utils/alert';
import { formatCurrency } from '../shared/utils/format';
import AppHeader from './AppHeader';

const CarritoComponent = () => {
  const { cartItems, totalPrice, clearCart } = useContext(CartContext);
  const navigation = useNavigation();

  const shippingCost = totalPrice >= 50 ? 0 : 5;
  const finalTotal = totalPrice + shippingCost;

  const handleClearCart = () => {
    showConfirmAlert(
      'Vaciar Carrito',
      '¿Estás seguro de que quieres vaciar todo el carrito?',
      () => {
        clearCart();
        showAlert('Carrito Vacío', 'Se han eliminado todos los productos del carrito.');
      }
    );
  };

  const handleConfirmOrder = () => {
    if (cartItems.length === 0) {
      showAlert('Carrito Vacío', 'No hay productos en el carrito para confirmar.');
      return;
    }
    navigation.navigate('Checkout');
  };

  const renderItem = ({ item }) => (
    <CartItemCard item={item} />
  );

  const renderEmptyCart = () => (
    <View style={styles.emptyContainer}>
      <Icon name="shopping-cart" size={80} color={COLORS.gray} />
      <Text style={styles.emptyTitle}>Carrito Vacío</Text>
      <Text style={styles.emptySubtitle}>No hay productos en el carrito</Text>
      <TouchableOpacity
        style={styles.continueButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.continueButtonText}>Seguir Comprando</Text>
      </TouchableOpacity>
    </View>
  );

  const renderFooter = () => (
    <View style={styles.footerSpace} />
  );

  if (cartItems.length === 0) {
    return (
      <View style={styles.container}>
        <AppHeader
          screenName="CART"
          navigation={navigation}
          showCart={false}
        />
        {renderEmptyCart()}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader
        screenName="CART"
        navigation={navigation}
        showCart={false}
      />

      <FlatList
        data={cartItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        horizontal
        showsHorizontalScrollIndicator={false}
        ListFooterComponent={renderFooter}
      />

      <View style={styles.bottomContainer}>
        <View style={styles.totalSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal:</Text>
            <Text style={styles.totalValue}>{formatCurrency(totalPrice)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Envío:</Text>
            <Text style={styles.totalValue}>
              {shippingCost === 0 ? 'Gratis' : formatCurrency(shippingCost)}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.totalRow}>
            <Text style={styles.finalTotalLabel}>Total:</Text>
            <Text style={styles.finalTotalValue}>{formatCurrency(finalTotal)}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.confirmButton}
          onPress={handleConfirmOrder}
        >
          <Text style={styles.confirmButtonText}>
            Confirmar Pedido
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  listContent: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    paddingBottom: 100,
  },
  footerSpace: {
    width: SPACING.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.gray,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  emptySubtitle: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  continueButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: 12,
  },
  continueButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: 120,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  totalSection: {
    marginBottom: SPACING.md,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  totalLabel: {
    fontSize: 16,
    color: COLORS.gray,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.dark,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.lightGray,
    marginVertical: SPACING.sm,
  },
  finalTotalLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  finalTotalValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  confirmButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CarritoComponent;
