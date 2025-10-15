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
    isLoading
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
  const [expandedSection, setExpandedSection] = useState('address'); // 'address', 'payment', 'confirm'
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
    // Solo permitir abrir secciones completadas o la siguiente
    if (section === 'address' ||
      (section === 'payment' && completedSections.address) ||
      (section === 'confirm' && completedSections.address && completedSections.payment)) {
      setExpandedSection(expandedSection === section ? null : section);
    }
  };

  useEffect(() => {
    if (user?.user_metadata?.address) setAddress(user.user_metadata.address);
    if (user?.user_metadata?.phone) setPhone(user.user_metadata.phone);
  }, [user]);



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

  const handleMapPress = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setSelectedLocation({ latitude, longitude });

    // Obtener dirección del punto seleccionado
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
      .catch((error) => {
        console.error('Error obteniendo dirección:', error);
      });
  };

  const handleConfirmLocation = () => {
    if (selectedLocation) {
      setShowMap(false);
      showAlert('✅ Ubicación Confirmada', 'La ubicación ha sido seleccionada en el mapa.');
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
      // Si el método de pago es Wompi, abrir checkout
      if (paymentMethod === 'wompi') {
        await handleWompiPayment();
        return;
      }

      // Para efectivo y transferencia, crear orden directamente
      const result = await createOrder();

      // Mensaje según método de pago
      let message = 'Tu pedido ha sido enviado. Te notificaremos cuando esté listo.';
      if (paymentMethod === 'transfer') {
        message = 'Recibirás los datos bancarios por correo para completar el pago.';
      }

      Alert.alert(
        '🎉 ¡Pedido Confirmado!',
        message,
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

  const handleWompiPayment = async () => {
    try {
      // Generar referencia única
      const reference = wompiService.generateReference();

      // Datos para Wompi
      const orderData = {
        amount: finalTotal,
        reference: reference,
        email: user.email,
        name: user.user_metadata?.full_name || user.email,
        phone: phone,
        redirectUrl: 'https://tuapp.com/payment-success' // Cambiar por tu URL
      };

      // Abrir checkout de Wompi
      showAlert(
        '💳 Redirigiendo a Wompi',
        'Serás redirigido al checkout seguro de Wompi para completar tu pago.',
        [
          {
            text: 'Continuar',
            onPress: async () => {
              try {
                await wompiService.openCheckout(orderData);

                // Aquí deberías crear el pedido con estado "pending_payment"
                // y actualizarlo cuando recibas el webhook de Wompi

                showAlert(
                  'ℹ️ Pago en proceso',
                  'Una vez completes el pago en Wompi, tu pedido será confirmado automáticamente.'
                );
              } catch (error) {
                showAlert('❌ Error', 'No se pudo abrir el checkout de Wompi.');
              }
            }
          },
          {
            text: 'Cancelar',
            style: 'cancel'
          }
        ]
      );
    } catch (error) {
      console.error('Error with Wompi payment:', error);
      showAlert('❌ Error', 'Hubo un problema al procesar el pago con Wompi.');
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
    <ScrollView
      style={styles.scrollViewContainer}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ paddingHorizontal: SPACING.lg, paddingTop: SPACING.md, paddingBottom: 100 }}
    >
      <Text style={styles.stepSubtitle}>Confirma tus datos de entrega y contacto</Text>

      {/* Botones de ubicación */}
      <View style={styles.locationButtonsRow}>
        <TouchableOpacity
          style={styles.locationButtonHalf}
          onPress={handleGetCurrentLocation}
          disabled={isGettingLocation}
        >
          <View style={styles.locationButtonGradient}>
            {isGettingLocation ? (
              <ActivityIndicator size="small" color={COLORS.white} />
            ) : (
              <Icon name="my-location" size={18} color={COLORS.white} />
            )}
            <Text style={styles.locationButtonTextSmall}>
              {isGettingLocation ? 'Obteniendo...' : 'Mi ubicación'}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.locationButtonHalf}
          onPress={() => setShowMap(true)}
        >
          <View style={[styles.locationButtonGradient, styles.mapButtonGradient]}>
            <Icon name="map" size={18} color={COLORS.white} />
            <Text style={styles.locationButtonTextSmall}>
              Elegir en mapa
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Información de ubicación detectada */}
      {currentLocation && (
        <View style={styles.locationInfo}>
          <Icon name="check-circle" size={16} color="#4CAF50" />
          <Text style={styles.locationInfoText}>
            GPS detectado ({currentLocation.coordinates.accuracy?.toFixed(0)}m precisión)
          </Text>
        </View>
      )}

      {/* Formulario compacto */}
      <View style={styles.formCard}>
        <View style={styles.inputWrapper}>
          <View style={styles.inputHeader}>
            <Icon name="location-on" size={20} color={COLORS.primary} />
            <Text style={styles.inputLabel}>Dirección de entrega *</Text>
          </View>
          <TextInput
            style={styles.inputField}
            placeholder="Calle, número, barrio"
            value={address}
            onChangeText={setAddress}
            multiline
            numberOfLines={2}
            placeholderTextColor={COLORS.gray}
          />
        </View>

        <View style={styles.inputWrapper}>
          <View style={styles.inputHeader}>
            <Icon name="phone" size={20} color={COLORS.primary} />
            <Text style={styles.inputLabel}>Teléfono de contacto *</Text>
          </View>
          <TextInput
            style={styles.inputField}
            placeholder="+57 300 123 4567"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholderTextColor={COLORS.gray}
          />
        </View>

        <View style={styles.inputWrapper}>
          <View style={styles.inputHeader}>
            <Icon name="note" size={20} color={COLORS.primary} />
            <Text style={styles.inputLabel}>Instrucciones (opcional)</Text>
          </View>
          <TextInput
            style={styles.inputField}
            placeholder="Ej: Casa de dos pisos, portón azul"
            value={orderNotes}
            onChangeText={setOrderNotes}
            multiline
            numberOfLines={2}
            placeholderTextColor={COLORS.gray}
          />
        </View>
      </View>

      <View style={styles.requiredNote}>
        <Icon name="info" size={14} color={COLORS.gray} />
        <Text style={styles.requiredNoteText}>* Campos obligatorios</Text>
      </View>
    </View>
      </ScrollView >
    </KeyboardAvoidingView >
  );

const renderPaymentStep = () => (
  <ScrollView
    style={styles.scrollViewContainer}
    showsVerticalScrollIndicator={false}
  >
    <View style={styles.stepScrollContent}>
      <Text style={styles.stepTitle}>💳 Método de Pago</Text>
      <Text style={styles.stepSubtitle}>Selecciona cómo deseas pagar</Text>

      {/* Resumen del total */}
      <View style={styles.paymentSummaryCard}>
        <Text style={styles.paymentSummaryLabel}>Total a pagar</Text>
        <Text style={styles.paymentSummaryAmount}>{formatCurrency(finalTotal)}</Text>
        <Text style={styles.paymentSummaryNote}>
          {cartItems.length} {cartItems.length === 1 ? 'producto' : 'productos'}
        </Text>
      </View>

      {/* Efectivo */}
      <TouchableOpacity
        style={styles.paymentOption}
        onPress={() => setPaymentMethod('cash')}
        activeOpacity={0.7}
      >
        <View style={[
          styles.paymentCard,
          paymentMethod === 'cash' && styles.paymentCardActive
        ]}>
          <View style={[
            styles.paymentIconContainer,
            paymentMethod === 'cash' && styles.paymentIconContainerActive
          ]}>
            <Icon name="payments" size={26} color={paymentMethod === 'cash' ? COLORS.white : COLORS.primary} />
          </View>
          <View style={styles.paymentInfo}>
            <Text style={styles.paymentTitle}>💵 Efectivo</Text>
            <Text style={styles.paymentSubtitle}>Paga al recibir tu pedido</Text>
          </View>
          {paymentMethod === 'cash' && (
            <Icon name="check-circle" size={26} color={COLORS.primary} />
          )}
        </View>
      </TouchableOpacity>

      {/* Nequi / Transferencia */}
      <TouchableOpacity
        style={styles.paymentOption}
        onPress={() => setPaymentMethod('transfer')}
        activeOpacity={0.7}
      >
        <View style={[
          styles.paymentCard,
          paymentMethod === 'transfer' && styles.paymentCardActive
        ]}>
          <View style={[
            styles.paymentIconContainer,
            paymentMethod === 'transfer' && styles.paymentIconContainerActive
          ]}>
            <Icon name="account-balance" size={26} color={paymentMethod === 'transfer' ? COLORS.white : '#4CAF50'} />
          </View>
          <View style={styles.paymentInfo}>
            <Text style={styles.paymentTitle}>🏦 Nequi / Transferencia</Text>
            <Text style={styles.paymentSubtitle}>Paga por Nequi o transferencia</Text>
          </View>
          {paymentMethod === 'transfer' && (
            <Icon name="check-circle" size={26} color="#4CAF50" />
          )}
        </View>
      </TouchableOpacity>

      {/* Wompi - Tarjetas */}
      <TouchableOpacity
        style={styles.paymentOption}
        onPress={() => setPaymentMethod('wompi')}
        activeOpacity={0.7}
      >
        <View style={[
          styles.paymentCard,
          paymentMethod === 'wompi' && styles.paymentCardActive
        ]}>
          <View style={[
            styles.paymentIconContainer,
            paymentMethod === 'wompi' && styles.paymentIconContainerActive
          ]}>
            <Icon name="credit-card" size={26} color={paymentMethod === 'wompi' ? COLORS.white : '#FF6B35'} />
          </View>
          <View style={styles.paymentInfo}>
            <Text style={styles.paymentTitle}>💳 Tarjeta (Wompi)</Text>
            <Text style={styles.paymentSubtitle}>Pago seguro con tarjeta</Text>
          </View>
          {paymentMethod === 'wompi' && (
            <Icon name="check-circle" size={26} color="#FF6B35" />
          )}
        </View>
      </TouchableOpacity>

      {/* Información según método */}
      {paymentMethod === 'cash' && (
        <View style={styles.paymentInfoBox}>
          <Icon name="info" size={18} color="#4CAF50" />
          <Text style={styles.paymentInfoText}>
            Prepara el monto exacto. El repartidor recibirá el pago al entregar.
          </Text>
        </View>
      )}

      {paymentMethod === 'transfer' && (
        <View style={styles.paymentInfoBox}>
          <Icon name="info" size={18} color="#2196F3" />
          <Text style={styles.paymentInfoText}>
            Recibirás los datos bancarios y Nequi después de confirmar tu pedido.
          </Text>
        </View>
      )}

      {paymentMethod === 'wompi' && (
        <View style={styles.paymentInfoBox}>
          <Icon name="info" size={18} color="#FF6B35" />
          <Text style={styles.paymentInfoText}>
            Serás redirigido a Wompi para completar el pago de forma segura.
          </Text>
        </View>
      )}

      {/* Nota de seguridad */}
      <View style={styles.securityNote}>
        <Icon name="verified-user" size={16} color={COLORS.primary} />
        <Text style={styles.securityNoteText}>Pago 100% seguro</Text>
      </View>
    </View>
  </ScrollView>
);

const renderConfirmStep = () => (
  <ScrollView
    style={styles.scrollViewContainer}
    showsVerticalScrollIndicator={false}
  >
    <View style={styles.stepScrollContent}>
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
          {paymentMethod === 'cash' && '💵 Efectivo al recibir'}
          {paymentMethod === 'transfer' && '🏦 Nequi / Transferencia'}
          {paymentMethod === 'wompi' && '💳 Tarjeta (Wompi)'}
        </Text>
        {paymentMethod === 'transfer' && (
          <View style={styles.transferNote}>
            <Icon name="info" size={16} color="#2196F3" />
            <Text style={styles.transferNoteText}>
              Recibirás los datos bancarios después de confirmar
            </Text>
          </View>
        )}
        {paymentMethod === 'wompi' && (
          <View style={styles.transferNote}>
            <Icon name="info" size={16} color="#FF6B35" />
            <Text style={styles.transferNoteText}>
              Serás redirigido a Wompi para completar el pago
            </Text>
          </View>
        )}
      </View>

      {orderNotes && (
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>📝 Notas</Text>
          <Text style={styles.infoText}>{orderNotes}</Text>
        </View>
      )}
    </View>
  </ScrollView>
);

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
          <TouchableOpacity
            style={styles.confirmLocationButton}
            onPress={handleConfirmLocation}
          >
            <Text style={styles.confirmLocationText}>✅ Confirmar Ubicación</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

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
      <Text style={styles.headerTitle}>💳 Verificación del Pago</Text>
      <View style={styles.headerSpacer} />
    </View>

    {/* Contenido en Acordeón */}
    <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
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

      {expandedSection === 'address' && renderAddressStep()}

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

      {expandedSection === 'payment' && renderPaymentStep()}

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

      {expandedSection === 'confirm' && renderConfirmStep()}
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
  contentContainer: {
    flex: 1,
  },
  stepContainer: {
    width: width,
    flex: 1,
  },
  scrollViewContainer: {
    flex: 1,
  },
  stepContent: {
    width: width,
    padding: SPACING.lg,
    paddingTop: SPACING.xl,
  },
  stepScrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: 100,
  },
  stepTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: SPACING.xs,
    textAlign: 'center',
    marginTop: SPACING.md,
  },
  stepSubtitle: {
    fontSize: 15,
    color: COLORS.gray,
    textAlign: 'center',
    marginBottom: SPACING.lg,
    lineHeight: 22,
  },

  // Form Card
  formCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  inputWrapper: {
    marginBottom: SPACING.md,
  },
  inputHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.dark,
    marginLeft: SPACING.xs,
  },
  inputField: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontSize: 15,
    color: COLORS.dark,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    minHeight: 44,
  },
  requiredNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  requiredNoteText: {
    fontSize: 12,
    color: COLORS.gray,
    marginLeft: SPACING.xs,
    fontStyle: 'italic',
  },

  // Location Buttons
  locationButtonsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  locationButtonHalf: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
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
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.primary,
  },
  mapButtonGradient: {
    backgroundColor: '#FF6B35',
  },
  locationButtonTextSmall: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '600',
    marginLeft: SPACING.xs,
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

  // Payment Summary
  paymentSummaryCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  paymentSummaryLabel: {
    fontSize: 14,
    color: COLORS.white,
    opacity: 0.9,
    marginBottom: 4,
  },
  paymentSummaryAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 4,
  },
  paymentSummaryNote: {
    fontSize: 13,
    color: COLORS.white,
    opacity: 0.8,
  },

  // Payment Options
  paymentOption: {
    marginBottom: SPACING.sm,
  },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SPACING.md,
    borderWidth: 2,
    borderColor: COLORS.lightGray,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  paymentCardActive: {
    borderColor: COLORS.primary,
    borderWidth: 2,
    elevation: 3,
    shadowOpacity: 0.1,
  },
  paymentIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  paymentIconContainerActive: {
    backgroundColor: COLORS.primary,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: 2,
  },
  paymentSubtitle: {
    fontSize: 13,
    color: COLORS.gray,
  },

  // Payment Info Box
  paymentInfoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    borderRadius: 10,
    padding: SPACING.md,
    marginTop: SPACING.sm,
    marginBottom: SPACING.md,
  },
  paymentInfoText: {
    fontSize: 13,
    color: COLORS.dark,
    marginLeft: SPACING.sm,
    flex: 1,
    lineHeight: 18,
  },

  // Security Note
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    marginTop: SPACING.sm,
  },
  securityNoteText: {
    fontSize: 13,
    color: COLORS.gray,
    marginLeft: SPACING.xs,
    fontWeight: '500',
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
  transferNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    padding: SPACING.sm,
    borderRadius: 8,
    marginTop: SPACING.sm,
  },
  transferNoteText: {
    fontSize: 12,
    color: '#1976D2',
    marginLeft: SPACING.xs,
    flex: 1,
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

  // Map Modal
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
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: SPACING.xl,
  },
  mapPlaceholderText: {
    fontSize: 16,
    color: COLORS.dark,
    textAlign: 'center',
    marginTop: SPACING.lg,
    fontWeight: '600',
  },
  mapPlaceholderSubtext: {
    fontSize: 14,
    color: COLORS.gray,
    textAlign: 'center',
    marginTop: SPACING.sm,
    fontFamily: 'monospace',
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
});

export default CheckoutScreen;