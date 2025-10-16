import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    RefreshControl,
    ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../theme/colors';
import { SPACING } from '../theme/spacing';
import restaurantAdminService from '../services/restaurantAdminService';
import { formatCurrency } from '../shared/utils/format';
import { OrderCardSkeleton } from '../components/AdminSkeleton';

const RestaurantOrdersScreen = ({ navigation }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        loadOrders();
    }, [filter]);

    const loadOrders = async () => {
        try {
            setLoading(true);
            const statusFilter = filter === 'all' ? null : filter;
            const response = await restaurantAdminService.getOrders(statusFilter);
            setOrders(response.data || []);
        } catch (error) {
            console.error('Error loading orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadOrders();
        setRefreshing(false);
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

    const getTimeElapsed = (createdAt) => {
        const now = new Date();
        const created = new Date(createdAt);
        const diffMs = now - created;
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 1) return 'Recién llegado';
        if (diffMins < 60) return `Hace ${diffMins} min`;
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `Hace ${diffHours}h ${diffMins % 60}min`;
        return `Hace ${Math.floor(diffHours / 24)} días`;
    };

    const getPriorityColor = (createdAt) => {
        const now = new Date();
        const created = new Date(createdAt);
        const diffMins = Math.floor((now - created) / 60000);

        if (diffMins > 60) return '#FF6B6B'; // Rojo - Urgente (más de 1 hora)
        if (diffMins > 30) return '#FFD93D'; // Amarillo - Atención (más de 30 min)
        return '#4ECDC4'; // Verde - Normal
    };

    const getPaymentMethodIcon = (method) => {
        if (method === 'wompi') return 'credit-card';
        if (method === 'transfer') return 'account-balance';
        return 'money';
    };

    const renderOrder = ({ item, index }) => {
        const timeElapsed = getTimeElapsed(item.created_at);
        const priorityColor = getPriorityColor(item.created_at);
        const isPaid = item.payment_status === 'paid';

        return (
            <TouchableOpacity
                style={[styles.orderCard, { borderLeftColor: priorityColor, borderLeftWidth: 4 }]}
                onPress={() => navigation.navigate('OrderDetail', { orderId: item.id })}
            >
                {/* Número de orden en la cola */}
                <View style={[styles.queueNumber, { backgroundColor: priorityColor }]}>
                    <Text style={styles.queueNumberText}>#{index + 1}</Text>
                </View>

                <View style={styles.orderHeader}>
                    <View style={styles.orderHeaderLeft}>
                        <Text style={styles.orderId}>Pedido #{item.id.slice(0, 8)}</Text>
                        <View style={styles.timeContainer}>
                            <Icon name="schedule" size={14} color={priorityColor} />
                            <Text style={[styles.timeText, { color: priorityColor }]}>
                                {timeElapsed}
                            </Text>
                        </View>
                    </View>
                    <View
                        style={[
                            styles.statusBadge,
                            { backgroundColor: getStatusColor(item.status) },
                        ]}
                    >
                        <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
                    </View>
                </View>

                {/* Estado de pago */}
                <View style={styles.paymentRow}>
                    <Icon
                        name={getPaymentMethodIcon(item.payment_method)}
                        size={16}
                        color={COLORS.textSecondary}
                    />
                    <Text style={styles.paymentMethod}>
                        {item.payment_method === 'wompi' ? 'Wompi' :
                            item.payment_method === 'transfer' ? 'Transferencia' :
                                'Efectivo'}
                    </Text>
                    {isPaid && (
                        <>
                            <Icon name="check-circle" size={16} color="#4ECDC4" />
                            <Text style={styles.paidText}>Pagado</Text>
                        </>
                    )}
                    {!isPaid && item.payment_method !== 'cash' && (
                        <>
                            <Icon name="schedule" size={16} color="#FFD93D" />
                            <Text style={styles.pendingText}>Pendiente</Text>
                        </>
                    )}
                </View>

                <View style={styles.orderBody}>
                    <View style={styles.orderInfo}>
                        <Icon name="restaurant" size={18} color={COLORS.textSecondary} />
                        <Text style={styles.orderInfoText}>
                            {item.order_items?.length || 0} productos
                        </Text>
                    </View>
                    <View style={styles.orderInfo}>
                        <Icon name="attach-money" size={20} color={COLORS.primary} />
                        <Text style={styles.orderTotal}>{formatCurrency(item.total)}</Text>
                    </View>
                </View>

                <View style={styles.orderFooter}>
                    <Icon name="chevron-right" size={24} color={COLORS.textSecondary} />
                </View>
            </TouchableOpacity>
        );
    };

    const FilterButton = ({ label, value }) => (
        <TouchableOpacity
            style={[styles.filterButton, filter === value && styles.filterButtonActive]}
            onPress={() => setFilter(value)}
        >
            <Text
                style={[
                    styles.filterButtonText,
                    filter === value && styles.filterButtonTextActive,
                ]}
            >
                {label}
            </Text>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.container}>
                <View style={styles.filtersContainer}>
                    <View style={[styles.filterButton, styles.filterButtonActive]}>
                        <Text style={styles.filterButtonTextActive}>Cargando...</Text>
                    </View>
                </View>
                <View style={styles.listContainer}>
                    <OrderCardSkeleton />
                    <OrderCardSkeleton />
                    <OrderCardSkeleton />
                    <OrderCardSkeleton />
                    <OrderCardSkeleton />
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.filtersContainer}>
                <FilterButton label="Todos" value="all" />
                <FilterButton label="Pendientes" value="pending" />
                <FilterButton label="Preparando" value="preparing" />
                <FilterButton label="Listos" value="ready" />
            </View>

            <FlatList
                data={orders}
                renderItem={renderOrder}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContainer}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Icon name="receipt-long" size={80} color={COLORS.textSecondary} />
                        <Text style={styles.emptyText}>No hay pedidos</Text>
                    </View>
                }
            />
        </View>
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
    },
    loadingText: {
        marginTop: SPACING.md,
        fontSize: 16,
        color: COLORS.textSecondary,
    },
    filtersContainer: {
        flexDirection: 'row',
        padding: SPACING.md,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: COLORS.lightGray,
    },
    filterButton: {
        flex: 1,
        paddingVertical: SPACING.sm,
        paddingHorizontal: SPACING.xs,
        marginHorizontal: 4,
        borderRadius: 8,
        backgroundColor: COLORS.lightGray,
        alignItems: 'center',
    },
    filterButtonActive: {
        backgroundColor: COLORS.primary,
    },
    filterButtonText: {
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.textSecondary,
    },
    filterButtonTextActive: {
        color: '#FFF',
    },
    listContainer: {
        padding: SPACING.md,
    },
    orderCard: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: SPACING.md,
        marginBottom: SPACING.md,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        position: 'relative',
    },
    queueNumber: {
        position: 'absolute',
        top: -8,
        left: 12,
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        elevation: 2,
    },
    queueNumberText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#FFF',
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: SPACING.sm,
        marginTop: 8,
    },
    orderHeaderLeft: {
        flex: 1,
    },
    orderId: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    timeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
        gap: 4,
    },
    timeText: {
        fontSize: 12,
        fontWeight: '600',
    },
    statusBadge: {
        paddingHorizontal: SPACING.sm,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#FFF',
    },
    paymentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.sm,
        paddingVertical: SPACING.xs,
        paddingHorizontal: SPACING.sm,
        backgroundColor: COLORS.background,
        borderRadius: 8,
        gap: 6,
    },
    paymentMethod: {
        fontSize: 13,
        color: COLORS.textSecondary,
        fontWeight: '600',
    },
    paidText: {
        fontSize: 12,
        color: '#4ECDC4',
        fontWeight: 'bold',
        marginLeft: 'auto',
    },
    pendingText: {
        fontSize: 12,
        color: '#FFD93D',
        fontWeight: 'bold',
        marginLeft: 'auto',
    },
    orderBody: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: SPACING.sm,
    },
    orderInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    orderInfoText: {
        fontSize: 13,
        color: COLORS.textSecondary,
        marginLeft: 2,
    },
    orderTotal: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginLeft: 2,
    },
    orderFooter: {
        alignItems: 'flex-end',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: SPACING.xxl * 2,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
        marginTop: SPACING.md,
    },
});

export default RestaurantOrdersScreen;
