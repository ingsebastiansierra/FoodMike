import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../theme/colors';
import { SPACING } from '../theme/spacing';
import { formatCurrency } from '../shared/utils/format';
import restaurantAdminService from '../services/restaurantAdminService';
import ordersService from '../services/ordersService';

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
            console.error('Error loading order:', error);
            Alert.alert('Error', 'No se pudo cargar el pedido');
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (newStatus) => {
        try {
            await restaurantAdminService.updateOrderStatus(order.id, newStatus);
            Alert.alert('Éxito', 'Estado actualizado correctamente');
            loadOrderDetail(); // Recargar el pedido
        } catch (error) {
            console.error('Error updating status:', error);
            Alert.alert('Error', 'No se pudo actualizar el estado');
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: '#FFD93D',
            confirmed: '#4ECDC4',
            preparing: '#667eea',
            ready: '#6BCF7F',
            delivered: '#95E1D3',
            cancelled: '#FF6B6B',
        };
        return colors[status] || '#999';
    };

    const getStatusText = (status) => {
        const texts = {
            pending: 'Pendiente',
            confirmed: 'Confirmado',
            preparing: 'Preparando',
            ready: 'Listo',
            delivered: 'Entregado',
            cancelled: 'Cancelado',
        };
        return texts[status] || status;
    };

    const getPaymentMethodText = (method) => {
        const methods = {
            cash: '💵 Efectivo',
            transfer: '🏦 Nequi / Transferencia',
            wompi: '💳 Wompi',
        };
        return methods[method] || method;
    };

    const getPaymentStatusColor = (paymentStatus) => {
        if (paymentStatus === 'paid') return '#4ECDC4';
        if (paymentStatus === 'failed') return '#FF6B6B';
        return '#FFD93D';
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>Cargando pedido...</Text>
            </View>
        );
    }

    if (!order) {
        return (
            <View style={styles.loadingContainer}>
                <Icon name="error-outline" size={60} color={COLORS.error} />
                <Text style={styles.errorText}>No se pudo cargar el pedido</Text>
                <TouchableOpacity style={styles.retryButton} onPress={loadOrderDetail}>
                    <Text style={styles.retryButtonText}>Reintentar</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const deliveryAddress = typeof order.delivery_address === 'string'
        ? JSON.parse(order.delivery_address)
        : order.delivery_address;

    return (
        <ScrollView style={styles.container}>
            {/* Header con estado */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.orderId}>Pedido #{order.id.slice(0, 8)}</Text>
                    <Text style={styles.orderDate}>
                        {new Date(order.created_at).toLocaleString('es-ES', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
                    <Text style={styles.statusText}>{getStatusText(order.status)}</Text>
                </View>
            </View>

            {/* Información de Pago */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>💳 Información de Pago</Text>

                <View style={styles.paymentCard}>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Método de pago:</Text>
                        <Text style={styles.infoValue}>{getPaymentMethodText(order.payment_method)}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Estado del pago:</Text>
                        <View style={styles.paymentStatusContainer}>
                            <Icon
                                name={order.payment_status === 'paid' ? 'check-circle' : 'schedule'}
                                size={18}
                                color={getPaymentStatusColor(order.payment_status)}
                            />
                            <Text style={[styles.paymentStatusText, { color: getPaymentStatusColor(order.payment_status) }]}>
                                {order.payment_status === 'paid' ? 'Pagado' :
                                    order.payment_status === 'failed' ? 'Fallido' :
                                        'Pendiente'}
                            </Text>
                        </View>
                    </View>

                    {order.wompi_payment_method && (
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Método Wompi:</Text>
                            <Text style={styles.infoValue}>{order.wompi_payment_method}</Text>
                        </View>
                    )}

                    {order.wompi_transaction_id && (
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>ID Transacción:</Text>
                            <Text style={styles.infoValueSmall}>{order.wompi_transaction_id}</Text>
                        </View>
                    )}

                    {order.paid_at && (
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Pagado el:</Text>
                            <Text style={styles.infoValue}>
                                {new Date(order.paid_at).toLocaleString('es-ES', {
                                    day: '2-digit',
                                    month: 'short',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </Text>
                        </View>
                    )}
                </View>
            </View>

            {/* Información del Cliente */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>👤 Cliente</Text>
                <View style={styles.infoRow}>
                    <Icon name="location-on" size={20} color={COLORS.textSecondary} />
                    <Text style={styles.infoText}>{deliveryAddress?.street || 'No especificada'}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Icon name="phone" size={20} color={COLORS.textSecondary} />
                    <Text style={styles.infoText}>{deliveryAddress?.phone || 'No especificado'}</Text>
                </View>
                {deliveryAddress?.instructions && (
                    <View style={styles.infoRow}>
                        <Icon name="info" size={20} color={COLORS.textSecondary} />
                        <Text style={styles.infoText}>{deliveryAddress.instructions}</Text>
                    </View>
                )}
            </View>

            {/* Productos */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>🍔 Productos</Text>
                {order.order_items && order.order_items.length > 0 ? (
                    order.order_items.map((item, index) => (
                        <View key={index} style={styles.productItem}>
                            <View style={styles.productInfo}>
                                <Text style={styles.productQuantity}>{item.quantity}x</Text>
                                <Text style={styles.productName}>{item.products?.name || 'Producto'}</Text>
                            </View>
                            <Text style={styles.productPrice}>{formatCurrency(item.total_price)}</Text>
                        </View>
                    ))
                ) : (
                    <View style={styles.emptyProducts}>
                        <Icon name="info-outline" size={40} color={COLORS.textSecondary} />
                        <Text style={styles.emptyProductsText}>
                            No se encontraron productos para este pedido
                        </Text>
                        <Text style={styles.emptyProductsSubtext}>
                            Los items pueden no haberse guardado correctamente
                        </Text>
                    </View>
                )}
            </View>

            {/* Resumen de Costos */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>💰 Resumen</Text>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Subtotal:</Text>
                    <Text style={styles.summaryValue}>{formatCurrency(order.subtotal)}</Text>
                </View>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Domicilio:</Text>
                    <Text style={styles.summaryValue}>{formatCurrency(order.delivery_fee)}</Text>
                </View>
                <View style={[styles.summaryRow, styles.totalRow]}>
                    <Text style={styles.totalLabel}>Total:</Text>
                    <Text style={styles.totalValue}>{formatCurrency(order.total)}</Text>
                </View>
            </View>

            {/* Acciones */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>⚡ Acciones</Text>
                {order.status === 'pending' && (
                    <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: '#4ECDC4' }]}
                        onPress={() => updateStatus('confirmed')}
                    >
                        <Icon name="check-circle" size={20} color="#FFF" />
                        <Text style={styles.actionButtonText}>Confirmar Pedido</Text>
                    </TouchableOpacity>
                )}
                {order.status === 'confirmed' && (
                    <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: '#667eea' }]}
                        onPress={() => updateStatus('preparing')}
                    >
                        <Icon name="restaurant" size={20} color="#FFF" />
                        <Text style={styles.actionButtonText}>Marcar como Preparando</Text>
                    </TouchableOpacity>
                )}
                {order.status === 'preparing' && (
                    <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: '#6BCF7F' }]}
                        onPress={() => updateStatus('ready')}
                    >
                        <Icon name="done-all" size={20} color="#FFF" />
                        <Text style={styles.actionButtonText}>Marcar como Listo</Text>
                    </TouchableOpacity>
                )}
                {order.status === 'ready' && (
                    <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: '#95E1D3' }]}
                        onPress={() => updateStatus('delivered')}
                    >
                        <Icon name="local-shipping" size={20} color="#FFF" />
                        <Text style={styles.actionButtonText}>Marcar como Entregado</Text>
                    </TouchableOpacity>
                )}
            </View>

            <View style={{ height: 20 }} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.background,
    },
    loadingText: {
        marginTop: SPACING.md,
        fontSize: 16,
        color: COLORS.textSecondary,
    },
    errorText: {
        marginTop: SPACING.md,
        fontSize: 16,
        color: COLORS.error,
        textAlign: 'center',
    },
    retryButton: {
        marginTop: SPACING.lg,
        paddingHorizontal: SPACING.xl,
        paddingVertical: SPACING.md,
        backgroundColor: COLORS.primary,
        borderRadius: 8,
    },
    retryButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    header: {
        backgroundColor: '#FFF',
        padding: SPACING.lg,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    orderId: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    orderDate: {
        fontSize: 13,
        color: COLORS.textSecondary,
        marginTop: 4,
    },
    statusBadge: {
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#FFF',
    },
    section: {
        backgroundColor: '#FFF',
        marginTop: SPACING.md,
        padding: SPACING.lg,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: SPACING.md,
    },
    paymentCard: {
        backgroundColor: COLORS.background,
        padding: SPACING.md,
        borderRadius: 8,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.sm,
        justifyContent: 'space-between',
    },
    infoLabel: {
        fontSize: 14,
        color: COLORS.textSecondary,
        fontWeight: '600',
    },
    infoValue: {
        fontSize: 14,
        color: COLORS.text,
        fontWeight: '600',
    },
    infoValueSmall: {
        fontSize: 12,
        color: COLORS.text,
        fontWeight: '600',
    },
    infoText: {
        fontSize: 14,
        color: COLORS.text,
        marginLeft: SPACING.sm,
        flex: 1,
    },
    paymentStatusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    paymentStatusText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    productItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: SPACING.sm,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.lightGray,
    },
    productInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    productQuantity: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginRight: SPACING.sm,
        width: 30,
    },
    productName: {
        fontSize: 15,
        color: COLORS.text,
        flex: 1,
    },
    productPrice: {
        fontSize: 15,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: SPACING.sm,
    },
    summaryLabel: {
        fontSize: 15,
        color: COLORS.textSecondary,
    },
    summaryValue: {
        fontSize: 15,
        color: COLORS.text,
        fontWeight: '600',
    },
    totalRow: {
        borderTopWidth: 2,
        borderTopColor: COLORS.primary,
        marginTop: SPACING.sm,
        paddingTop: SPACING.md,
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    totalValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    actionButton: {
        flexDirection: 'row',
        padding: SPACING.md,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.sm,
        gap: 8,
    },
    actionButtonText: {
        color: '#FFF',
        fontSize: 15,
        fontWeight: 'bold',
    },
    emptyProducts: {
        alignItems: 'center',
        paddingVertical: SPACING.xl,
    },
    emptyProductsText: {
        fontSize: 15,
        color: COLORS.textSecondary,
        marginTop: SPACING.md,
        textAlign: 'center',
    },
    emptyProductsSubtext: {
        fontSize: 13,
        color: COLORS.textSecondary,
        marginTop: SPACING.xs,
        textAlign: 'center',
        fontStyle: 'italic',
    },
});

export default OrderDetailScreen;
