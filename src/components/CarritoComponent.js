import React, { useContext, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ScrollView,
  StatusBar,
  Dimensions
} from 'react-native';
import { CartContext } from '../context/CartContext';
import CartItemCard from './CartItemCard';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../theme/colors';
import { SPACING } from '../theme/spacing';
import { showAlert, showConfirmAlert } from '../features/core/utils/alert';
import { formatCurrency } from '../shared/utils/format';

const { width, height } = Dimensions.get('window');

const CarritoComponent = () => {
  const { cartItems, totalPrice, clearCart } = useContext(CartContext);
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [showConfirmarOrden, setShowConfirmarOrden] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  
  const shippingCost = totalPrice >= 50 ? 0 : 5;
  const finalTotal = totalPrice + shippingCost;

  const handleBack = () => {
    if (showConfirmarOrden) {
      setShowConfirmarOrden(false);
    } else {
      navigation.goBack();
    }
  };

  const handleClearCart = () => {
    showConfirmAlert(
      'Vaciar Carrito',
      '¿Estáss seguro de que quieres vaciar todo el carrito?',
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
    // Navegar a la pantalla de checkout
    navigation.navigate('Checkout');
  };

  const handlePayment = () => {
    if (cartItems.length === 0) {
      showAlert('Carrito Vacío', 'No hay productos en el carrito para procesar.');
      return;
    }

    showConfirmAlert(
      'Confirmar Pago',
      `¿Estás seguro de que quieres procesar el pago por ${formatCurrency(finalTotal)}?`,
      () => {
        setIsProcessing(true);
        // Simular procesamiento de pago
        setTimeout(() => {
          setIsProcessing(false);
          showAlert(
            '¡Pago Exitoso!', 
            'Tu pedido ha sido procesado correctamente. Recibirás una confirmación por email.',
            () => {
              clearCart();
              setShowConfirmarOrden(false);
              navigation.navigate('ClientDashboard');
            }
          );
        }, 2000);
      }
    );
  };

  const renderItem = ({ item, index }) => (
    <CartItemCard item={item} index={index} />
  );

  const renderEmptyCart = () => (
    <View style={styles.emptyContainer}>
      <Icon name="shopping-cart" size={80} color={COLORS.gray} />
      <Text style={styles.emptyTitle}>Carrito Vacío</Text>
      <Text style={styles.emptySubtitle}>No hay productos en el carrito</Text>
      <TouchableOpacity 
        style={styles.continueButton}
        onPress={() => navigation.navigate('ClientDashboard')}
      >
        <Text style={styles.continueButtonText}>Seguir Comprando</Text>
      </TouchableOpacity>
    </View>
  );

  const renderConfirmarOrden = () => (
    <View style={styles.content}>
      {/* Order Summary */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Resumen del Pedido</Text>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal:</Text>
          <Text style={styles.summaryValue}>{formatCurrency(totalPrice)}</Text>
        </View>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Envío:</Text>
          <Text style={styles.summaryValue}>
            {shippingCost === 0 ? 'Gratis' : formatCurrency(shippingCost)}
          </Text>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.summaryRow}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalValue}>{formatCurrency(finalTotal)}</Text>
        </View>
        
        {shippingCost === 0 && (
          <Text style={styles.freeShippingText}>
            🎉 ¡Envío gratis en pedidos superiores a $50!
          </Text>
        )}
      </View>

      {/* Items List */}
      <View style={styles.itemsContainer}>
        <Text style={styles.itemsTitle}>Productos ({cartItems.length})</Text>
        <FlatList
          data={cartItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.itemsList}
        />
      </View>
    </View>
  );

  const renderCarrito = () => (
    <View style={styles.content}>
      {cartItems.length === 0 ? (
        renderEmptyCart()
      ) : (
        <>
          <View style={styles.listHeader}>
            <Text style={styles.listHeaderTitle}>
              Mi Carrito ({cartItems.length} {cartItems.length === 1 ? 'producto' : 'productos'})
            </Text>
          </View>
          
          <FlatList
            data={cartItems}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.cartList}
          />
        </>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {showConfirmarOrden ? renderConfirmarOrden() : renderCarrito()}
      {/* Bottom Container */}
      {cartItems.length > 0 && (
        <View style={styles.bottomContainer}>
          {showConfirmarOrden ? (
            <TouchableOpacity
              style={[styles.paymentButton, isProcessing && styles.paymentButtonDisabled]}
              onPress={handlePayment}
              disabled={isProcessing}
            >
              <LinearGradient
                colors={isProcessing ? [COLORS.gray, COLORS.gray] : [COLORS.primary, COLORS.accent]}
                style={styles.paymentButtonGradient}
              >
                <Icon 
                  name={isProcessing ? "spinner" : "credit-card"} 
                  size={20} 
                  color={COLORS.white} 
                />
                <Text style={styles.paymentButtonText}>
                  {isProcessing ? 'Procesando...' : `Pagar ${formatCurrency(finalTotal)}`}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleConfirmOrder}
            >
              <View
                style={styles.confirmButtonGradient}
              >
                <Text style={styles.confirmButtonText}>
                  Confirmar Pedido • {formatCurrency(finalTotal)}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
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
  listHeader: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  listHeaderTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  cartList: {
    flexGrow: 1,
    paddingBottom: SPACING.xl,
  },
  summaryCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  summaryLabel: {
    fontSize: 16,
    color: COLORS.gray,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.dark,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.lightGray,
    marginVertical: SPACING.sm,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  freeShippingText: {
    fontSize: 12,
    color: COLORS.success,
    textAlign: 'center',
    marginTop: SPACING.sm,
    fontWeight: '600',
  },
  itemsContainer: {
    flex: 1,
  },
  itemsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.md,
  },
  itemsList: {
    paddingBottom: SPACING.xl,
  },
  bottomContainer: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.lg,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  confirmButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  confirmButtonGradient: {
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
  },
  confirmButtonText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  paymentButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  paymentButtonDisabled: {
    opacity: 0.7,
  },
  paymentButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xl,
  },
  paymentButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: SPACING.sm,
  },
});

export default CarritoComponent;
