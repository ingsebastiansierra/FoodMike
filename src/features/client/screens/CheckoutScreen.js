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
  StatusBar,
  Dimensions,
  Animated,
  BackHandler
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../../../theme/colors';
import { SPACING } from '../../../theme/spacing';
import { useCart } from '../../../context/CartContext';
import { useAuth } from '../../../context/AuthContext';
import { formatCurrency } from '../../../shared/utils/format';
import { showAlert } from '../../core/utils/alert';
import locationService from '../../../services/locationService';

const { width, height } = Dimensions.get('window');

const CheckoutScreen = ({ navigation }) => {
  const {
    cartItems,
    totalPrice,
    deliveryFee,
    finalTotal,
    setDeliveryAddress,
    paymentMethod,
    setPaymentMethod,
    orderNotes,
    setOrderNotes,
    createOrder,
    isLoading
  } = useCart();

  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [slideAnim] = useState(new Animated.Value(0));

  const steps = [
    { title: 'Dirección', icon: 'location-on' },
    { title: 'Pago', icon: 'payment' },
    { title: 'Confirmar', icon: 'check-circle' }
  ];

  useEffect(() => {
    if (user?.user_metadata?.address) setAddress(user.user_metadata.address);
    if (user?.user_metadata?.phone) setPhone(user.user_metadata.phone);
  }, [user]);

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: currentStep,
      useNativeDriver: true,
    }).start();
  }, [currentStep]);

  // Manejar el botón de hardware "atrás" en Android
  useEffect(() => {
    const backAction = () => {
      handleBack();
      return true; // Prevenir el comportamiento por defecto
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, [currentStep]);

  const handleGetCurrentLocation = async () => {
    try {
      setIsGettingLocation(true);

      const locationData = await locationService.getCompleteLocation();

      setCurrentLocation(locationData);

      if (locationData.address) {
        setAddress(locationData.address.formattedAddress);
      }

      showAlert(
        '📍 Ubicación Obtenida',
        'Tu ubicación actual ha sido detectada y agregada como dirección de entrega.'
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

      Alert.alert('❌ Error de Ubicación', errorMessage, [
        { text: 'Cancelar' },
        { text: '🔄 Reintentar', onPress: handleGetCurrentLocation }
      ]);
    } finally {
      setIsGettingLocation(false);
    }
  };

  const handleNext = () => {
    if (currentStep === 0) {
      if (!address.trim()) {
        showAlert('Error', 'Por favor ingresa tu dirección');
        return;
      }
      if (!phone.trim()) {
        showAlert('Error', 'Por favor ingresa tu teléfono');
        return;
      }
      setDeliveryAddress({ street: address, phone, instructions: orderNotes });
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handlePlaceOrder();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      // Si estamos en el primer paso, volver al carrito o inicio
      if (navigation.canGoBack()) {
        navigation.goBack();
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Inicio', params: { screen: 'HomeInitial' } }]
        });
      }
    }
  };

  const handlePlaceOrder = async () => {
    Alert.alert(
      '🎉 Confirmar Pedido',
      `¿Confirmas tu pedido por ${formatCurrency(finalTotal)}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: '✅ Confirmar', onPress: processOrder }
      ]
    );
  };

  const processOrder = async () => {
    setIsProcessing(true);
    try {
      const result = await createOrder();

      Alert.alert(
        '🎉 ¡Pedido Confirmado!',
        'Tu pedido ha sido enviado. Te notificaremos cuando esté listo.',
        [
          {
            text: '📋 Ver Pedido',
            onPress: () => {
              navigation.reset({
                index: 1,
                routes: [
                  { name: 'Inicio', params: { screen: 'HomeInitial' } },
                  { name: 'OrderDetail', params: { orderId: result.data.id } }
                ]
              });
            }
          },
          {
            text: '🏠 Ir a Inicio',
            onPress: () => {
              navigation.reset({
                index: 0,
                routes: [{ name: 'Inicio', params: { screen: 'HomeInitial' } }]
              });
            }
          }
        ]
      );
    } catch (error) {
      showAlert('❌ Error', 'No se pudo procesar tu pedido. Intenta nuevamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  const renderStepIndicator = () => (
    <View style={styles.stepContainer}>
      {steps.map((step, index) => (
        <View key={index} style={styles.stepItem}>
          <View style={[
            styles.stepCircle,
            index <= currentStep && styles.stepCircleActive
          ]}>
            <Icon
              name={step.icon}
              size={20}
              color={index <= currentStep ? COLORS.white : COLORS.gray}
            />
          </View>
          <Text style={[
            styles.stepText,
            index <= currentStep && styles.stepTextActive
          ]}>
            {step.title}
          </Text>
          {index < steps.length - 1 && (
            <View style={[
              styles.stepLine,
              index < currentStep && styles.stepLineActive
            ]} />
          )}
        </View>
      ))}
    </View>
  );

  const renderAddressStep = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>📍 Dirección de Entrega</Text>

      {/* Botón de ubicación actual */}
      <TouchableOpacity
        style={styles.locationButton}
        onPress={handleGetCurrentLocation}
        disabled={isGettingLocation}
      >
        <View style={styles.locationButtonGradient}>
          {isGettingLocation ? (
            <ActivityIndicator size="small" color={COLORS.white} />
          ) : (
            <Icon name="my-location" size={20} color={COLORS.white} />
          )}
          <Text style={styles.locationButtonText}>
            {isGettingLocation ? 'Obteniendo ubicación...' : '📍 Usar mi ubicación actual'}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Información de ubicación detectada */}
      {currentLocation && (
        <View style={styles.locationInfo}>
          <Icon name="check-circle" size={16} color={COLORS.primary} />
          <Text style={styles.locationInfoText}>
            ✅ Ubicación GPS detectada ({currentLocation.coordinates.accuracy?.toFixed(0)}m de precisión)
          </Text>
        </View>
      )}

      <View style={styles.inputGroup}>
        <View style={styles.inputContainer}>
          <Icon name="location-on" size={24} color={COLORS.primary} />
          <TextInput
            style={styles.input}
            placeholder="Dirección completa (Calle, número, barrio)"
            value={address}
            onChangeText={setAddress}
            multiline
            placeholderTextColor={COLORS.gray}
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon name="phone" size={24} color={COLORS.primary} />
          <TextInput
            style={styles.input}
            placeholder="Número de teléfono"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholderTextColor={COLORS.gray}
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon name="note" size={24} color={COLORS.primary} />
          <TextInput
            style={styles.input}
            placeholder="Instrucciones adicionales (opcional)"
            value={orderNotes}
            onChangeText={setOrderNotes}
            multiline
            placeholderTextColor={COLORS.gray}
          />
        </View>
      </View>
    </View>
  );

  const renderPaymentStep = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>💳 Método de Pago</Text>

      <TouchableOpacity
        style={[styles.paymentOption, paymentMethod === 'cash' && styles.paymentOptionActive]}
        onPress={() => setPaymentMethod('cash')}
      >
        <LinearGradient
          colors={paymentMethod === 'cash' ? [COLORS.primary, COLORS.primary] : ['#f8f9fa', '#f8f9fa']}
          style={styles.paymentGradient}
        >
          <Icon name="money" size={32} color={paymentMethod === 'cash' ? COLORS.white : COLORS.primary} />
          <View style={styles.paymentInfo}>
            <Text style={[styles.paymentTitle, paymentMethod === 'cash' && styles.paymentTitleActive]}>
              💵 Efectivo
            </Text>
            <Text style={[styles.paymentSubtitle, paymentMethod === 'cash' && styles.paymentSubtitleActive]}>
              Paga al recibir tu pedido
            </Text>
          </View>
          {paymentMethod === 'cash' && (
            <Icon name="check-circle" size={24} color={COLORS.white} />
          )}
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.paymentOption, paymentMethod === 'card' && styles.paymentOptionActive]}
        onPress={() => setPaymentMethod('card')}
      >
        <LinearGradient
          colors={paymentMethod === 'card' ? [COLORS.primary, COLORS.primary] : ['#f8f9fa', '#f8f9fa']}
          style={styles.paymentGradient}
        >
          <Icon name="credit-card" size={32} color={paymentMethod === 'card' ? COLORS.white : COLORS.gray} />
          <View style={styles.paymentInfo}>
            <Text style={[styles.paymentTitle, paymentMethod === 'card' && styles.paymentTitleActive, paymentMethod !== 'card' && styles.paymentDisabled]}>
              💳 Tarjeta
            </Text>
            <Text style={[styles.paymentSubtitle, paymentMethod === 'card' && styles.paymentSubtitleActive, paymentMethod !== 'card' && styles.paymentDisabled]}>
              Próximamente disponible
            </Text>
          </View>
          {paymentMethod === 'card' && (
            <Icon name="check-circle" size={24} color={COLORS.white} />
          )}
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  const renderConfirmStep = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>✅ Confirmar Pedido</Text>

      {/* Resumen del pedido */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>📋 Resumen</Text>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>🍽️ Productos ({cartItems.length})</Text>
          <Text style={styles.summaryValue}>{formatCurrency(totalPrice)}</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>🚚 Envío</Text>
          <Text style={[styles.summaryValue, deliveryFee === 0 && styles.freeShipping]}>
            {deliveryFee === 0 ? '¡Gratis!' : formatCurrency(deliveryFee)}
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.summaryRow}>
          <Text style={styles.totalLabel}>💰 Total</Text>
          <Text style={styles.totalValue}>{formatCurrency(finalTotal)}</Text>
        </View>
      </View>

      {/* Información de entrega */}
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>📍 Entrega</Text>
        <Text style={styles.infoText}>{address}</Text>
        <Text style={styles.infoText}>📞 {phone}</Text>
      </View>

      {/* Método de pago */}
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>💳 Pago</Text>
        <Text style={styles.infoText}>
          {paymentMethod === 'cash' ? '💵 Efectivo al recibir' : '💳 Tarjeta de crédito'}
        </Text>
      </View>

      {orderNotes && (
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>📝 Notas</Text>
          <Text style={styles.infoText}>{orderNotes}</Text>
        </View>
      )}
    </View>
  );

  if (cartItems.length === 0) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
        <LinearGradient colors={[COLORS.primary, COLORS.accent]} style={styles.emptyContainer}>
          <Icon name="shopping-cart" size={80} color={COLORS.white} />
          <Text style={styles.emptyTitle}>🛒 Carrito Vacío</Text>
          <Text style={styles.emptySubtitle}>Agrega productos para continuar</Text>
          <TouchableOpacity
            style={styles.shopButton}
            onPress={() => {
              navigation.reset({
                index: 0,
                routes: [{ name: 'Inicio', params: { screen: 'HomeInitial' } }]
              });
            }}
          >
            <Text style={styles.shopButtonText}>🍽️ Explorar Restaurantes</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Icon name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>🛒 Checkout</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Indicador de pasos */}
      {renderStepIndicator()}

      {/* Contenido del paso actual */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Animated.View style={[
          styles.stepWrapper,
          {
            transform: [{
              translateX: slideAnim.interpolate({
                inputRange: [0, 1, 2],
                outputRange: [0, -width, -width * 2],
              })
            }]
          }
        ]}>
          {currentStep === 0 && renderAddressStep()}
          {currentStep === 1 && renderPaymentStep()}
          {currentStep === 2 && renderConfirmStep()}
        </Animated.View>
      </ScrollView>

      {/* Botón inferior */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[styles.nextButton, isProcessing && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={isProcessing}
        >
          <View style={styles.nextButtonGradient}>
            {isProcessing ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <>
                <Text style={styles.nextButtonText}>
                  {currentStep === steps.length - 1 ? '🎉 Confirmar Pedido' : '➡️ Continuar'}
                </Text>
                {currentStep === steps.length - 1 && (
                  <Text style={styles.nextButtonPrice}>{formatCurrency(finalTotal)}</Text>
                )}
              </>
            )}
          </View>
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

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    backgroundColor: COLORS.primary,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.white,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },

  // Step Indicator
  stepContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.lg,
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING.lg,
    marginTop: -20,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  stepItem: {
    alignItems: 'center',
    flex: 1,
    position: 'relative',
  },
  stepCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  stepCircleActive: {
    backgroundColor: COLORS.primary,
  },
  stepText: {
    fontSize: 12,
    color: COLORS.gray,
    fontWeight: '600',
  },
  stepTextActive: {
    color: COLORS.primary,
  },
  stepLine: {
    position: 'absolute',
    top: 20,
    left: '70%',
    width: '60%',
    height: 2,
    backgroundColor: COLORS.lightGray,
  },
  stepLineActive: {
    backgroundColor: COLORS.primary,
  },

  // Content
  scrollView: {
    flex: 1,
  },
  stepWrapper: {
    width: width * 3,
    flexDirection: 'row',
  },
  stepContent: {
    width: width,
    padding: SPACING.lg,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },

  // Input Group
  inputGroup: {
    gap: SPACING.md,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  input: {
    flex: 1,
    marginLeft: SPACING.md,
    fontSize: 16,
    color: COLORS.dark,
    minHeight: 20,
  },

  // Location Button
  locationButton: {
    alignSelf: 'center',
    borderRadius: 25,
    overflow: 'hidden',
    marginBottom: SPACING.lg,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  locationButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    minWidth: 200,
    backgroundColor: COLORS.primary,
  },
  locationButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: SPACING.sm,
  },

  // Location Info
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary + '15',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 12,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.primary + '30',
  },
  locationInfoText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '600',
    marginLeft: SPACING.sm,
    flex: 1,
  },

  // Payment Options
  paymentOption: {
    marginBottom: SPACING.md,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  paymentOptionActive: {
    elevation: 4,
    shadowOpacity: 0.2,
  },
  paymentGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  paymentInfo: {
    flex: 1,
    marginLeft: SPACING.lg,
  },
  paymentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: 4,
  },
  paymentTitleActive: {
    color: COLORS.white,
  },
  paymentSubtitle: {
    fontSize: 14,
    color: COLORS.gray,
  },
  paymentSubtitleActive: {
    color: 'rgba(255,255,255,0.8)',
  },
  paymentDisabled: {
    color: COLORS.gray,
  },

  // Summary Cards
  summaryCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.dark,
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
  freeShipping: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.lightGray,
    marginVertical: SPACING.md,
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

  // Info Cards
  infoCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.dark,
    lineHeight: 20,
  },

  // Bottom Button
  bottomContainer: {
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  nextButton: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  nextButtonDisabled: {
    elevation: 0,
    shadowOpacity: 0,
  },
  nextButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xl,
    backgroundColor: COLORS.primary,
  },
  nextButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  nextButtonPrice: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: SPACING.sm,
    opacity: 0.9,
  },

  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  emptySubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  shopButton: {
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
    borderRadius: 16,
  },
  shopButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CheckoutScreen;