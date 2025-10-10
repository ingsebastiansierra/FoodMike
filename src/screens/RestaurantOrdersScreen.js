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

    const renderOrder = ({ item }) => (
        <TouchableOpacity
            style={styles.orderCard}
            onPress={() => navigation.navigate('OrderDetail', { order: item })}
        >
            <View style={styles.orderHeader}>
                <View>
                    <Text style={styles.orderId}>Pedido #{item.id.slice(0, 8)}</Text>
                    <Text style={styles.orderDate}>
                        {new Date(item.created_at).toLocaleString()}
                    </Text>
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

            <View style={styles.orderBody}>
                <View style={styles.orderInfo}>
                    <Icon name="shopping-cart" size={20} color={COLORS.textSecondary} />
                    <Text style={styles.orderInfoText}>
                        {item.order_items?.length || 0} productos
                    </Text>
                </View>
                <View style={styles.orderInfo}>
                    <Icon name="attach-money" size={20} color={COLORS.textSecondary} />
                    <Text style={styles.orderTotal}>{formatCurrency(item.total)}</Text>
                </View>
            </View>

            <View style={styles.orderFooter}>
                <Icon name="chevron-right" size={24} color={COLORS.textSecondary} />
            </View>
        </TouchableOpacity>
    );

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
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>Cargando pedidos...</Text>
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
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: SPACING.sm,
    },
    orderId: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    orderDate: {
        fontSize: 12,
        color: COLORS.textSecondary,
        marginTop: 2,
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
    orderBody: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: SPACING.sm,
    },
    orderInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    orderInfoText: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginLeft: 4,
    },
    orderTotal: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginLeft: 4,
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
