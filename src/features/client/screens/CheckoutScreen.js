import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StatusBar,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { COLORS } from '../../../theme/colors';
import { SPACING } from '../../../theme/spacing';
import { useCart } from '../../../context/CartContext';
import { useAuth } from '../../../context/AuthContext';
import { formatCurrency } from '../../../shared/utils/format';
import { showAlert } from '../../core/utils/alert';
import locationService from '../../../services/locationService';
import wompiService from '../../../services/wompiService';
import ordersService from '../../../services/ordersService';

// Componentes de Checkout
import AddressSection from '../components/checkout/AddressSection';
import PaymentSection from '../components/checkout/PaymentSection';
import ConfirmSection from '../components/checkout/ConfirmSection';

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
  } = useCart();

  const { user } = useAuth();
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState({
    latitude: 5.4894,
    longitude: -73.4894,
  });

  // Estados para el acordeón
  const [expandedSection, setExpandedSection] = useState('address');
  const [completedSections, setCompletedSections] = useState({
    address: false,
    payment: false,
  });

  const mapRef = useRef(null);

  // Coordenadas de Samacá, Boyacá
  const SAMACA_REGION = {
    latitude: 5.4894,
    longitude: -73.4894,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  useEffect(() => {
    if (user?.user_metadata?.address) setAddress(user.user_metadata.address);
    if (user?.user_metadata?.phone) setPhone(user.user_metadata.phone);
  }, [user]);

  // Funciones para manejar el acordeón
  const handleCompleteAddress = () => {
    if (!address.trim()) {
      showAlert('Error', 'Por favor ingresa tu dirección');
      return;
    }
    if (!phone.trim()) {
      showAlert('Error', 'Por favor ingresa tu teléfono');
      return;
    }
    setDeliveryAddress({ street: address, phone, instructions: orderNotes });
    setCompletedSections({ ...completedSections, address: true });
    setExpandedSection('payment');
  };

  const handleCompletePayment = () => {
    if (!paymentMethod) {
      showAlert('Error', 'Por favor selecciona un método de pago');
      return;
    }
    setCompletedSections({ ...completedSections, payment: true });
    setExpandedSection('confirm');
  };

  const toggleSection = (section) => {
    if (section === 'address' ||
      (section === 'payment' && completedSections.address) ||
      (section === 'confirm' && completedSections.address && completedSections.payment)) {
      setExpandedSection(expandedSection === section ? null : section);
    }
  };

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Inicio', params: { screen: 'HomeInitial' } }]
      });
    }
  };

  const handleGetCurrentLocation = async () => {
    try {
      setIsGettingLocation(true);
      const locationData = await locationService.getCompleteLocation();
      setCurrentLocation(locationData);
      if (locationData.address) {
        setAddress(locationData.address.formattedAddress);
      }
      showAlert('📍 Ubicación Obtenida', 'Tu ubicación actual ha sido detectada.');
    } catch (error) {
      console.error('Error obteniendo ubicación:', error);
      Alert.alert('❌ Error de Ubicación', 'No se pudo obtener tu ubicación.');
    } finally {
      setIsGettingLocation(false);
    }
  };

  const handleMapPress = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setSelectedLocation({ latitude, longitude });
    locationService.reverseGeocode(latitude, longitude)
      .then((addressInfo) => {
        if (addressInfo) {
          setAddress(addressInfo.formattedAddress);
          setCurrentLocation({
            coordinates: { latitude, longitude },
            address: addressInfo
          });
        }
      })
      .catch((error) => console.error('Error:', error));
  };

  const handleConfirmLocation = () => {
    if (selectedLocation) {
      setShowMap(false);
      showAlert('✅ Ubicación Confirmada', 'La ubicación ha sido seleccionada.');
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
      if (paymentMethod === 'wompi') {
        await handleWompiPayment();
        return;
      }

      const result = await createOrder();
      let message = 'Tu pedido ha sido enviado. Te notificaremos cuando esté listo.';
      if (paymentMethod === 'transfer') {
        message = 'Recibirás los datos bancarios por correo para completar el pago.';
      }

      Alert.alert('🎉 ¡Pedido Confirmado!', message, [
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
      ]);
    } catch (error) {
      showAlert('❌ Error', 'No se pudo procesar tu pedido.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleWompiPayment = async () => {
    try {
      console.log('🎯 Iniciando pago con Wompi...');

      // 1. Crear el pedido primero
      const orderResult = await createOrder();
      const orderId = orderResult.data.id;
      console.log('📝 Pedido creado con ID:', orderId);

      // 2. Generar referencia con el ID del pedido
      const reference = `ORDER-${orderId}`;
      console.log('📝 Referencia generada:', reference);

      // 3. Actualizar el pedido con la referencia de Wompi
      await ordersService.updateOrder(orderId, {
        wompi_reference: reference,
        payment_method: 'wompi'
      });
      console.log('✅ Referencia guardada en el pedido');

      const orderData = {
        amount: finalTotal,
        reference: reference,
        email: user.email,
        name: user.user_metadata?.full_name || user.email,
        phone: phone,
        redirectUrl: 'https://toctoc-payment.vercel.app'
      };

      console.log('📦 Datos del pedido:', orderData);

      // 4. Abrir Wompi para el pago
      console.log('🚀 Abriendo checkout de Wompi...');
      await wompiService.openCheckout(orderData);
      console.log('✅ Checkout abierto');

      // 5. Cerrar el checkout inmediatamente para evitar la pantalla de carrito vacío
      // El deep linking llevará al usuario a Pedidos cuando regrese
      navigation.goBack();

    } catch (error) {
      console.error('❌ Error en handleWompiPayment:', error);
      Alert.alert('❌ Error', 'No se pudo procesar tu pedido: ' + error.message);
    }
  };

  const renderMapModal = () => {
    if (!showMap) return null;

    return (
      <View style={styles.mapModalContainer}>
        <View style={styles.mapModalContent}>
          <View style={styles.mapHeader}>
            <Text style={styles.mapTitle}>📍 Selecciona la ubicación</Text>
            <TouchableOpacity onPress={() => setShowMap(false)} style={styles.mapCloseButton}>
              <Icon name="close" size={24} color={COLORS.dark} />
            </TouchableOpacity>
          </View>

          <View style={styles.mapContainer}>
            <MapView
              ref={mapRef}
              provider={PROVIDER_GOOGLE}
              style={styles.map}
              initialRegion={SAMACA_REGION}
              onPress={handleMapPress}
              showsUserLocation
              showsMyLocationButton
            >
              <Marker
                coordinate={selectedLocation}
                title="Ubicación de entrega"
                description={address || "Toca el mapa para seleccionar"}
                pinColor={COLORS.primary}
              />
            </MapView>
          </View>

          <View style={styles.mapFooter}>
            <Text style={styles.mapAddressText} numberOfLines={2}>
              {address || 'Toca el mapa para seleccionar una ubicación'}
            </Text>
            <TouchableOpacity style={styles.confirmLocationButton} onPress={handleConfirmLocation}>
              <Text style={styles.confirmLocationText}>✅ Confirmar Ubicación</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  // Carrito vacío
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

  // UI Principal con Acordeón
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Icon name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>💳 Verificación del Pago</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Contenido en Acordeón */}
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
        scrollEventThrottle={16}
        nestedScrollEnabled={true}
      >

        {/* Sección 1: Dirección */}
        <TouchableOpacity
          style={styles.accordionSection}
          onPress={() => toggleSection('address')}
          activeOpacity={0.9}
        >
          <View style={[styles.accordionHeader, completedSections.address && styles.accordionHeaderCompleted]}>
            <View style={styles.accordionHeaderLeft}>
              <View style={[styles.accordionNumber, completedSections.address && styles.accordionNumberCompleted]}>
                {completedSections.address ? (
                  <Icon name="check" size={20} color={COLORS.white} />
                ) : (
                  <Text style={styles.accordionNumberText}>1</Text>
                )}
              </View>
              <Text style={styles.accordionTitle}>Dirección de Entrega</Text>
            </View>
            <Icon
              name={expandedSection === 'address' ? 'expand-less' : 'expand-more'}
              size={24}
              color={COLORS.dark}
            />
          </View>

          {completedSections.address && expandedSection !== 'address' && (
            <View style={styles.accordionSummary}>
              <Text style={styles.accordionSummaryText}>📍 {address}</Text>
              <Text style={styles.accordionSummaryText}>📞 {phone}</Text>
            </View>
          )}
        </TouchableOpacity>

        {expandedSection === 'address' && (
          <AddressSection
            address={address}
            setAddress={setAddress}
            phone={phone}
            setPhone={setPhone}
            orderNotes={orderNotes}
            setOrderNotes={setOrderNotes}
            currentLocation={currentLocation}
            isGettingLocation={isGettingLocation}
            onGetLocation={handleGetCurrentLocation}
            onOpenMap={() => setShowMap(true)}
            onContinue={handleCompleteAddress}
          />
        )}

        {/* Sección 2: Pago */}
        <TouchableOpacity
          style={[styles.accordionSection, !completedSections.address && styles.accordionSectionDisabled]}
          onPress={() => toggleSection('payment')}
          activeOpacity={0.9}
          disabled={!completedSections.address}
        >
          <View style={[styles.accordionHeader, completedSections.payment && styles.accordionHeaderCompleted]}>
            <View style={styles.accordionHeaderLeft}>
              <View style={[styles.accordionNumber, completedSections.payment && styles.accordionNumberCompleted]}>
                {completedSections.payment ? (
                  <Icon name="check" size={20} color={COLORS.white} />
                ) : (
                  <Text style={styles.accordionNumberText}>2</Text>
                )}
              </View>
              <Text style={styles.accordionTitle}>Método de Pago</Text>
            </View>
            <Icon
              name={expandedSection === 'payment' ? 'expand-less' : 'expand-more'}
              size={24}
              color={completedSections.address ? COLORS.dark : COLORS.gray}
            />
          </View>

          {completedSections.payment && expandedSection !== 'payment' && (
            <View style={styles.accordionSummary}>
              <Text style={styles.accordionSummaryText}>
                {paymentMethod === 'cash' && '💵 Efectivo'}
                {paymentMethod === 'transfer' && '🏦 Nequi / Transferencia'}
                {paymentMethod === 'wompi' && '💳 Tarjeta (Wompi)'}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {expandedSection === 'payment' && (
          <PaymentSection
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            finalTotal={finalTotal}
            cartItems={cartItems}
            onContinue={handleCompletePayment}
          />
        )}

        {/* Sección 3: Confirmar */}
        <TouchableOpacity
          style={[styles.accordionSection, (!completedSections.address || !completedSections.payment) && styles.accordionSectionDisabled]}
          onPress={() => toggleSection('confirm')}
          activeOpacity={0.9}
          disabled={!completedSections.address || !completedSections.payment}
        >
          <View style={styles.accordionHeader}>
            <View style={styles.accordionHeaderLeft}>
              <View style={styles.accordionNumber}>
                <Text style={styles.accordionNumberText}>3</Text>
              </View>
              <Text style={styles.accordionTitle}>Confirmar Pedido</Text>
            </View>
            <Icon
              name={expandedSection === 'confirm' ? 'expand-less' : 'expand-more'}
              size={24}
              color={completedSections.address && completedSections.payment ? COLORS.dark : COLORS.gray}
            />
          </View>
        </TouchableOpacity>

        {expandedSection === 'confirm' && (
          <ConfirmSection
            cartItems={cartItems}
            totalPrice={totalPrice}
            deliveryFee={deliveryFee}
            finalTotal={finalTotal}
            address={address}
            phone={phone}
            paymentMethod={paymentMethod}
            orderNotes={orderNotes}
          />
        )}
      </ScrollView>

      {/* Botón inferior fijo */}
      {completedSections.address && completedSections.payment && (
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={[styles.nextButton, isProcessing && styles.nextButtonDisabled]}
            onPress={handlePlaceOrder}
            disabled={isProcessing}
          >
            <View style={styles.nextButtonGradient}>
              {isProcessing ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <>
                  <Text style={styles.nextButtonText}>🎉 Confirmar Pedido</Text>
                  <Text style={styles.nextButtonPrice}>{formatCurrency(finalTotal)}</Text>
                </>
              )}
            </View>
          </TouchableOpacity>
        </View>
      )}

      {/* Modal del mapa */}
      {renderMapModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
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
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 180,
  },
  // Acordeón
  accordionSection: {
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    overflow: 'hidden',
  },
  accordionSectionDisabled: {
    opacity: 0.5,
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    backgroundColor: COLORS.white,
  },
  accordionHeaderCompleted: {
    backgroundColor: COLORS.primary + '10',
  },
  accordionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  accordionNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  accordionNumberCompleted: {
    backgroundColor: COLORS.primary,
  },
  accordionNumberText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  accordionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  accordionSummary: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
    backgroundColor: COLORS.background,
  },
  accordionSummaryText: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 4,
  },
  // Mapa Modal
  mapModalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  mapModalContent: {
    width: width * 0.95,
    height: height * 0.8,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 10,
  },
  mapHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    backgroundColor: COLORS.primary,
  },
  mapTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  mapCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  mapFooter: {
    padding: SPACING.lg,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  mapAddressText: {
    fontSize: 14,
    color: COLORS.dark,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  confirmLocationButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmLocationText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Botón inferior
  bottomContainer: {
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: 120,
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
