import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../../theme';
import { formatCurrency, formatDate, formatTime } from '../../../shared/utils/format';
import ordersService from '../../../services/ordersService';
import { showAlert, showConfirmAlert } from '../../core/utils/alert';

const OrderDetailScreen = ({ route, navigation }) => {
  const { orderId } = route.params;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrderDetail();
  }, [orderId]);

  const loadOrderDetail = async () => {
    try {
      setLoading(true);
      const response = await ordersService.getOrderById(orderId);
      setOrder(response.data);
    } catch (error) {
      console.error('Error cargando detalle del pedido:', error);
      showAlert('Error', 'No se pudo cargar el detalle del pedido');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = () => {
    if (!order || order.status !== 'pending') {
      showAlert('Error', 'Este pedido no se puede cancelar');
      return;
    }

    showConfirmAlert(
      'Cancelar Pedido',
      '¿Estás seguro de que quieres cancelar este pedido?',
      async () => {
        try {
          await ordersService.cancelOrder(order.id, 'Cancelado por el usuario');
          showAlert('Pedido Cancelado', 'Tu pedido ha sido cancelado exitosamente');
          loadOrderDetail(); // Recargar para mostrar el nuevo estado
        } catch (error) {
          console.error('Error cancelando pedido:', error);
          showAlert('Error', 'No se pudo cancelar el pedido');
        }
      }
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return colors.warning;
      case 'confirmed': return colors.info;
      case 'preparing': return colors.primary;
      case 'ready': return colors.success;
      case 'delivered': return colors.success;
      case 'cancelled': return colors.error;
      default: return colors.gray;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'confirmed': return 'Confirmado';
      case 'preparing': return 'Preparando';
      case 'ready': return 'Listo para recoger';
      case 'delivered': return 'Entregado';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  const getStatusDescription = (status) => {
    switch (status) {
      case 'pending': return 'Tu pedido está siendo revisado por el restaurante';
      case 'confirmed': return 'El restaurante ha confirmado tu pedido';
      case 'preparing': return 'Tu pedido se está preparando';
      case 'ready': return 'Tu pedido está listo para ser entregado';
      case 'delivered': return 'Tu pedido ha sido entregado exitosamente';
      case 'cancelled': return 'Este pedido ha sido cancelado';
      default: return '';
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Cargando detalle del pedido...</Text>
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={80} color={colors.error} />
        <Text style={styles.errorTitle}>Pedido no encontrado</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.dark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalle del Pedido</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Estado del pedido */}
        <View style={styles.statusCard}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
            <Text style={styles.statusText}>{getStatusText(order.status)}</Text>
          </View>
          <Text style={styles.statusDescription}>
            {getStatusDescription(order.status)}
          </Text>
          <Text style={styles.orderNumber}>Pedido #{order.id.slice(-8)}</Text>
          <Text style={styles.orderDate}>
            {formatDate(order.created_at)} • {formatTime(order.created_at)}
          </Text>
        </View>

        {/* Información del restaurante */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Restaurante</Text>
          <View style={styles.restaurantInfo}>
            <Image 
              source={{ uri: order.restaurants?.image || 'https://via.placeholder.com/60' }}
              style={styles.restaurantImage}
            />
            <View style={styles.restaurantDetails}>
              <Text style={styles.restaurantName}>{order.restaurants?.name}</Text>
              <Text style={styles.restaurantAddress}>{order.restaurants?.address}</Text>
              {order.restaurants?.phone && (
                <TouchableOpacity style={styles.phoneContainer}>
                  <Ionicons name="call-outline" size={16} color={colors.primary} />
                  <Text style={styles.phoneText}>{order.restaurants.phone}</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        {/* Items del pedido */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Productos</Text>
          {order.order_items?.map((item, index) => (
            <View key={index} style={styles.orderItem}>
              <Image 
                source={{ uri: item.products?.image || 'https://via.placeholder.com/50' }}
                style={styles.productImage}
              />
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.products?.name}</Text>
                <Text style={styles.productDescription}>
                  {item.products?.description}
                </Text>
                <Text style={styles.productQuantity}>Cantidad: {item.quantity}</Text>
              </View>
              <View style={styles.productPricing}>
                <Text style={styles.productPrice}>
                  {formatCurrency(item.unit_price)}
                </Text>
                <Text style={styles.productTotal}>
                  {formatCurrency(item.total_price)}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Dirección de entrega */}
        {order.delivery_address && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Dirección de Entrega</Text>
            <View style={styles.addressContainer}>
              <Ionicons name="location-outline" size={20} color={colors.primary} />
              <View style={styles.addressInfo}>
                <Text style={styles.addressText}>
                  {order.delivery_address.street}
                </Text>
                {order.delivery_address.phone && (
                  <Text style={styles.addressPhone}>
                    Tel: {order.delivery_address.phone}
                  </Text>
                )}
                {order.delivery_address.instructions && (
                  <Text style={styles.addressInstructions}>
                    Instrucciones: {order.delivery_address.instructions}
                  </Text>
                )}
              </View>
            </View>
          </View>
        )}

        {/* Resumen de precios */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumen</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>{formatCurrency(order.subtotal)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Envío</Text>
            <Text style={styles.summaryValue}>
              {order.delivery_fee === 0 ? 'Gratis' : formatCurrency(order.delivery_fee)}
            </Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatCurrency(order.total)}</Text>
          </View>
        </View>

        {/* Método de pago */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Método de Pago</Text>
          <View style={styles.paymentMethod}>
            <Ionicons 
              name={order.payment_method === 'cash' ? 'cash-outline' : 'card-outline'} 
              size={20} 
              color={colors.primary} 
            />
            <Text style={styles.paymentText}>
              {order.payment_method === 'cash' ? 'Efectivo' : 'Tarjeta'}
            </Text>
          </View>
        </View>

        {/* Información de ubicación GPS */}
        {order.delivery_coordinates && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ubicación GPS de Entrega</Text>
            <View style={styles.locationContainer}>
              <Ionicons name="location" size={20} color={colors.primary} />
              <View style={styles.locationDetails}>
                <Text style={styles.locationText}>
                  Coordenadas: {order.delivery_coordinates.latitude?.toFixed(6)}, {order.delivery_coordinates.longitude?.toFixed(6)}
                </Text>
                <Text style={styles.locationAccuracy}>
                  Precisión GPS: {order.delivery_coordinates.accuracy ? `${order.delivery_coordinates.accuracy.toFixed(0)} metros` : 'No disponible'}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Notas */}
        {order.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notas</Text>
            <Text style={styles.notesText}>{order.notes}</Text>
          </View>
        )}
      </ScrollView>

      {/* Botón de cancelar (solo si está pendiente) */}
      {order.status === 'pending' && (
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancelOrder}
          >
            <Ionicons name="close-circle-outline" size={24} color={colors.white} />
            <Text style={styles.cancelButtonText}>Cancelar Pedido</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: typography.sizes.md,
    color: colors.gray,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  errorTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: 'bold',
    color: colors.dark,
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  backButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderRadius: 12,
  },
  backButtonText: {
    color: colors.white,
    fontSize: typography.sizes.md,
    fontWeight: 'bold',
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
  scrollView: {
    flex: 1,
  },
  statusCard: {
    backgroundColor: colors.white,
    margin: spacing.lg,
    padding: spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statusBadge: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    marginBottom: spacing.md,
  },
  statusText: {
    color: colors.white,
    fontSize: typography.sizes.md,
    fontWeight: 'bold',
  },
  statusDescription: {
    fontSize: typography.sizes.md,
    color: colors.gray,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  orderNumber: {
    fontSize: typography.sizes.lg,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: spacing.xs,
  },
  orderDate: {
    fontSize: typography.sizes.sm,
    color: colors.gray,
  },
  section: {
    backgroundColor: colors.white,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    padding: spacing.lg,
    borderRadius: 12,
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: spacing.md,
  },
  restaurantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  restaurantImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: spacing.md,
  },
  restaurantDetails: {
    flex: 1,
  },
  restaurantName: {
    fontSize: typography.sizes.md,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: spacing.xs,
  },
  restaurantAddress: {
    fontSize: typography.sizes.sm,
    color: colors.gray,
    marginBottom: spacing.xs,
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  phoneText: {
    fontSize: typography.sizes.sm,
    color: colors.primary,
    marginLeft: spacing.xs,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: spacing.md,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: typography.sizes.md,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: spacing.xs,
  },
  productDescription: {
    fontSize: typography.sizes.sm,
    color: colors.gray,
    marginBottom: spacing.xs,
  },
  productQuantity: {
    fontSize: typography.sizes.sm,
    color: colors.primary,
    fontWeight: '600',
  },
  productPricing: {
    alignItems: 'flex-end',
  },
  productPrice: {
    fontSize: typography.sizes.sm,
    color: colors.gray,
  },
  productTotal: {
    fontSize: typography.sizes.md,
    fontWeight: 'bold',
    color: colors.dark,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  addressInfo: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  addressText: {
    fontSize: typography.sizes.md,
    color: colors.dark,
    marginBottom: spacing.xs,
  },
  addressPhone: {
    fontSize: typography.sizes.sm,
    color: colors.gray,
    marginBottom: spacing.xs,
  },
  addressInstructions: {
    fontSize: typography.sizes.sm,
    color: colors.gray,
    fontStyle: 'italic',
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
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentText: {
    fontSize: typography.sizes.md,
    color: colors.dark,
    marginLeft: spacing.sm,
  },
  notesText: {
    fontSize: typography.sizes.md,
    color: colors.gray,
    lineHeight: 22,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  locationDetails: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  locationText: {
    fontSize: typography.sizes.sm,
    color: colors.dark,
    marginBottom: spacing.xs,
  },
  locationAccuracy: {
    fontSize: typography.sizes.xs,
    color: colors.gray,
  },
  bottomContainer: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
  },
  cancelButton: {
    backgroundColor: colors.error,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    borderRadius: 12,
  },
  cancelButtonText: {
    color: colors.white,
    fontSize: typography.sizes.md,
    fontWeight: 'bold',
    marginLeft: spacing.sm,
  },
});

export default OrderDetailScreen;