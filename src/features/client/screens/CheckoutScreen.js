import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../../theme';
import { useCart } from '../../../context/CartContext';
import { useAuth } from '../../../context/AuthContext';
import { formatCurrency } from '../../../shared/utils/format';
import CartItemCard from '../../../components/CartItemCard';
import locationService from '../../../services/locationService';

const CheckoutScreen = ({ navigation }) => {
  const { 
    cartItems, 
    totalPrice, 
    deliveryFee, 
    finalTotal,
    deliveryAddress,
    setDeliveryAddress,
    paymentMethod,
    setPaymentMethod,
    orderNotes,
    setOrderNotes,
    createOrder,
    canCheckout,
    isLoading,
    cartRestaurant
  } = useCart();
  
  const { user } = useAuth();
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);

  useEffect(() => {
    // Cargar dirección guardada del usuario si existe
    if (user?.user_metadata?.address) {
      setAddress(user.user_metadata.address);
    }
    if (user?.user_metadata?.phone) {
      setPhone(user.user_metadata.phone);
    }
  }, [user]);

  useEffect(() => {
    // Actualizar dirección de entrega en el contexto
    if (address.trim()) {
      setDeliveryAddress({
        street: address,
        phone: phone,
        instructions: orderNotes,
        coordinates: currentLocation?.coordinates || null
      });
    }
  }, [address, phone, orderNotes, currentLocation, setDeliveryAddress]);

  const handleGetCurrentLocation = async () => {
    try {
      setIsGettingLocation(true);
      
      const locationData = await locationService.getCompleteLocation();
      
      setCurrentLocation(locationData);
      
      if (locationData.address) {
        setAddress(locationData.address.formattedAddress);
      }
      
      Alert.alert(
        'Ubicación Obtenida',
        'Tu ubicación actual ha sido detectada y agregada como dirección de entrega.',
        [{ text: 'OK' }]
      );
      
    } catch (error) {
      console.error('Error obteniendo ubicación:', error);
      
      let errorMessage = 'No se pudo obtener tu ubicación. ';
      
      if (error.message.includes('denegados')) {
        errorMessage += 'Por favor habilita los permisos de ubicación en la configuración de tu dispositivo.';
      } else if (error.message.includes('timeout')) {
        errorMessage += 'La búsqueda de ubicación tardó demasiado. Intenta nuevamente.';
      } else {
        errorMessage += 'Verifica que tengas GPS activado e intenta nuevamente.';
      }
      
      Alert.alert('Error de Ubicación', errorMessage, [
        { text: 'Cancelar' },
        { text: 'Reintentar', onPress: handleGetCurrentLocation }
      ]);
    } finally {
      setIsGettingLocation(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!canCheckout) {
      Alert.alert('Error', 'Por favor completa todos los campos requeridos');
      return;
    }

    if (!address.trim()) {
      Alert.alert('Error', 'Por favor ingresa tu dirección de entrega');
      return;
    }

    if (!phone.trim()) {
      Alert.alert('Error', 'Por favor ingresa tu número de teléfono');
      return;
    }

    Alert.alert(
      'Confirmar Pedido',
      `¿Confirmas tu pedido por ${formatCurrency(finalTotal)}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Confirmar', onPress: processOrder }
      ]
    );
  };

  const processOrder = async () => {
    setIsProcessing(true);
    try {
      const result = await createOrder();
      
      Alert.alert(
        '¡Pedido Confirmado!',
        'Tu pedido ha sido enviado al restaurante. Te notificaremos cuando esté listo.',
        [
          { 
            text: 'Ver Pedido', 
            onPress: () => navigation.navigate('OrderDetail', { orderId: result.data.id })
          },
          { 
            text: 'Ir a Inicio', 
            onPress: () => navigation.navigate('ClientHome')
          }
        ]
      );
    } catch (error) {
      console.error('Error procesando pedido:', error);
      Alert.alert(
        'Error',
        'No se pudo procesar tu pedido. Por favor intenta nuevamente.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="basket-outline" size={80} color={colors.gray} />
        <Text style={styles.emptyTitle}>Tu carrito está vacío</Text>
        <Text style={styles.emptySubtitle}>Agrega algunos productos para continuar</Text>
        <TouchableOpacity 
          style={styles.shopButton}
          onPress={() => navigation.navigate('ClientHome')}
        >
          <Text style={styles.shopButtonText}>Explorar Restaurantes</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={colors.dark} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Checkout</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Restaurante */}
        {cartRestaurant && (
          <View style={styles.restaurantCard}>
            <Text style={styles.restaurantName}>{cartRestaurant.name}</Text>
            <Text style={styles.restaurantAddress}>{cartRestaurant.address}</Text>
          </View>
        )}

        {/* Items del carrito */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tu Pedido</Text>
          {cartItems.map((item, index) => (
            <CartItemCard key={item.id} item={item} index={index} />
          ))}
        </View>

        {/* Dirección de entrega */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Dirección de Entrega</Text>
            <TouchableOpacity 
              style={styles.locationButton}
              onPress={handleGetCurrentLocation}
              disabled={isGettingLocation}
            >
              {isGettingLocation ? (
                <ActivityIndicator size="small" color={colors.white} />
              ) : (
                <Ionicons name="location" size={16} color={colors.white} />
              )}
              <Text style={styles.locationButtonText}>
                {isGettingLocation ? 'Obteniendo...' : 'Mi Ubicación'}
              </Text>
            </TouchableOpacity>
          </View>
          
          {currentLocation && (
            <View style={styles.locationInfo}>
              <Ionicons name="checkmark-circle" size={16} color={colors.success} />
              <Text style={styles.locationInfoText}>
                Ubicación GPS detectada ({currentLocation.coordinates.accuracy?.toFixed(0)}m de precisión)
              </Text>
            </View>
          )}
          
          <View style={styles.inputContainer}>
            <Ionicons name="location-outline" size={20} color={colors.primary} />
            <TextInput
              style={styles.input}
              placeholder="Ingresa tu dirección completa o usa 'Mi Ubicación'"
              value={address}
              onChangeText={setAddress}
              multiline
            />
          </View>
          <View style={styles.inputContainer}>
            <Ionicons name="call-outline" size={20} color={colors.primary} />
            <TextInput
              style={styles.input}
              placeholder="Número de teléfono"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        {/* Método de pago */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Método de Pago</Text>
          <TouchableOpacity 
            style={[styles.paymentOption, paymentMethod === 'cash' && styles.paymentOptionActive]}
            onPress={() => setPaymentMethod('cash')}
          >
            <Ionicons name="cash-outline" size={24} color={paymentMethod === 'cash' ? colors.white : colors.primary} />
            <Text style={[styles.paymentText, paymentMethod === 'cash' && styles.paymentTextActive]}>
              Efectivo
            </Text>
            {paymentMethod === 'cash' && (
              <Ionicons name="checkmark-circle" size={20} color={colors.white} />
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.paymentOption, paymentMethod === 'card' && styles.paymentOptionActive]}
            onPress={() => setPaymentMethod('card')}
          >
            <Ionicons name="card-outline" size={24} color={paymentMethod === 'card' ? colors.white : colors.primary} />
            <Text style={[styles.paymentText, paymentMethod === 'card' && styles.paymentTextActive]}>
              Tarjeta (Próximamente)
            </Text>
            {paymentMethod === 'card' && (
              <Ionicons name="checkmark-circle" size={20} color={colors.white} />
            )}
          </TouchableOpacity>
        </View>

        {/* Notas adicionales */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notas Adicionales (Opcional)</Text>
          <TextInput
            style={styles.notesInput}
            placeholder="Instrucciones especiales para tu pedido..."
            value={orderNotes}
            onChangeText={setOrderNotes}
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Resumen de precios */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>{formatCurrency(totalPrice)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Envío</Text>
            <Text style={styles.summaryValue}>
              {deliveryFee === 0 ? 'Gratis' : formatCurrency(deliveryFee)}
            </Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatCurrency(finalTotal)}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Botón de confirmar pedido */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[styles.orderButton, (!canCheckout || isProcessing) && styles.orderButtonDisabled]}
          onPress={handlePlaceOrder}
          disabled={!canCheckout || isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <>
              <Ionicons name="checkmark-circle-outline" size={24} color={colors.white} />
              <Text style={styles.orderButtonText}>
                Confirmar Pedido • {formatCurrency(finalTotal)}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  headerTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: 'bold',
    color: colors.dark,
  },
  restaurantCard: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    borderRadius: 12,
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  restaurantName: {
    fontSize: typography.sizes.lg,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: spacing.xs,
  },
  restaurantAddress: {
    fontSize: typography.sizes.sm,
    color: colors.gray,
  },
  section: {
    backgroundColor: colors.white,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    padding: spacing.lg,
    borderRadius: 12,
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: typography.sizes.md,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
  },
  locationButtonText: {
    color: colors.white,
    fontSize: typography.sizes.sm,
    fontWeight: '600',
    marginLeft: spacing.xs,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.success + '20',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    marginBottom: spacing.md,
  },
  locationInfoText: {
    color: colors.success,
    fontSize: typography.sizes.sm,
    fontWeight: '600',
    marginLeft: spacing.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.md,
  },
  input: {
    flex: 1,
    marginLeft: spacing.sm,
    fontSize: typography.sizes.md,
    color: colors.dark,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 8,
    marginBottom: spacing.sm,
  },
  paymentOptionActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  paymentText: {
    flex: 1,
    marginLeft: spacing.md,
    fontSize: typography.sizes.md,
    color: colors.dark,
  },
  paymentTextActive: {
    color: colors.white,
  },
  notesInput: {
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 8,
    padding: spacing.md,
    fontSize: typography.sizes.md,
    color: colors.dark,
    textAlignVertical: 'top',
  },
  summaryCard: {
    backgroundColor: colors.white,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    marginBottom: spacing.xl,
    padding: spacing.lg,
    borderRadius: 12,
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  summaryLabel: {
    fontSize: typography.sizes.md,
    color: colors.gray,
  },
  summaryValue: {
    fontSize: typography.sizes.md,
    color: colors.dark,
    fontWeight: '600',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
    marginTop: spacing.sm,
    paddingTop: spacing.md,
  },
  totalLabel: {
    fontSize: typography.sizes.lg,
    fontWeight: 'bold',
    color: colors.dark,
  },
  totalValue: {
    fontSize: typography.sizes.lg,
    fontWeight: 'bold',
    color: colors.primary,
  },
  bottomContainer: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
  },
  orderButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    borderRadius: 12,
    elevation: 2,
  },
  orderButtonDisabled: {
    backgroundColor: colors.gray,
  },
  orderButtonText: {
    color: colors.white,
    fontSize: typography.sizes.lg,
    fontWeight: 'bold',
    marginLeft: spacing.sm,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: 'bold',
    color: colors.dark,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    fontSize: typography.sizes.md,
    color: colors.gray,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  shopButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderRadius: 12,
  },
  shopButtonText: {
    color: colors.white,
    fontSize: typography.sizes.md,
    fontWeight: 'bold',
  },
});

export default CheckoutScreen;