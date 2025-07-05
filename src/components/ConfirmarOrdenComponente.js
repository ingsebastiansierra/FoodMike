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

const { width, height } = Dimensions.get('window');

const ConfirmarOrdenComponente = () => {
  const { cartItems, getTotalPrice, clearCart } = useContext(CartContext);
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const totalPrice = getTotalPrice();
  const shippingCost = totalPrice >= 50 ? 0 : 5;
  const finalTotal = totalPrice + shippingCost;

  const handleBack = () => {
    navigation.goBack();
  };

  const handlePayment = () => {
    if (cartItems.length === 0) {
      showAlert('Carrito Vacío', 'No hay productos en el carrito para procesar.');
      return;
    }

    showConfirmAlert(
      'Confirmar Pago',
      `¿Estás seguro de que quieres procesar el pago por $${finalTotal.toFixed(2)}?`,
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
      <Text style={styles.emptySubtitle}>No hay productos para confirmar</Text>
      <TouchableOpacity 
        style={styles.continueButton}
        onPress={() => navigation.navigate('ClientDashboard')}
      >
        <Text style={styles.continueButtonText}>Seguir Comprando</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      {/* Header */}
      <LinearGradient
        colors={[COLORS.primary, COLORS.primary + 'DD']}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Icon name="arrow-left" size={18} color={COLORS.white} />
          </TouchableOpacity>
          
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Confirmar Pedido</Text>
            <Text style={styles.headerSubtitle}>
              {cartItems.length} {cartItems.length === 1 ? 'producto' : 'productos'}
            </Text>
          </View>
          
          <View style={styles.placeholder} />
        </View>
      </LinearGradient>

      {/* Content */}
      <View style={styles.content}>
        {cartItems.length === 0 ? (
          renderEmptyCart()
        ) : (
          <>
            {/* Order Summary */}
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Resumen del Pedido</Text>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal:</Text>
                <Text style={styles.summaryValue}>${totalPrice.toFixed(2)}</Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Envío:</Text>
                <Text style={styles.summaryValue}>
                  {shippingCost === 0 ? 'Gratis' : `$${shippingCost.toFixed(2)}`}
                </Text>
              </View>
              
              <View style={styles.divider} />
              
              <View style={styles.summaryRow}>
                <Text style={styles.totalLabel}>Total:</Text>
                <Text style={styles.totalValue}>${finalTotal.toFixed(2)}</Text>
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
          </>
        )}
      </View>

      {/* Payment Button */}
      {cartItems.length > 0 && (
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={[styles.paymentButton, isProcessing && styles.paymentButtonDisabled]}
            onPress={handlePayment}
            disabled={isProcessing}
          >
            <LinearGradient
              colors={isProcessing ? [COLORS.gray, COLORS.gray] : [COLORS.primary, COLORS.primary + 'DD']}
              style={styles.paymentButtonGradient}
            >
              <Icon 
                name={isProcessing ? "spinner" : "credit-card"} 
                size={20} 
                color={COLORS.white} 
              />
              <Text style={styles.paymentButtonText}>
                {isProcessing ? 'Procesando...' : `Pagar $${finalTotal.toFixed(2)}`}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
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
  headerGradient: {
    paddingTop: 40,
    paddingBottom: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
    marginTop: SPACING.xs,
  },
  headerSubtitle: {
    fontSize: 12,
    color: COLORS.white,
    opacity: 0.9,
  },
  placeholder: {
    width: 36,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
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
    paddingBottom: SPACING.lg,
  },
  bottomContainer: {
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
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

export default ConfirmarOrdenComponente;
