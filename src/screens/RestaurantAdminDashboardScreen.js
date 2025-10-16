import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    RefreshControl,
    ActivityIndicator,
    Dimensions,
    Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../theme/colors';
import { SPACING } from '../theme/spacing';
import restaurantAdminService from '../services/restaurantAdminService';
import { formatCurrency } from '../shared/utils/format';
import { StatCardSkeleton, OrderCardSkeleton, ProductCardSkeleton } from '../components/AdminSkeleton';

const { width } = Dimensions.get('window');

const RestaurantAdminDashboardScreen = ({ navigation }) => {
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [dashboardData, setDashboardData] = useState(null);
    const [orderFilter, setOrderFilter] = useState('all'); // all, paid, pending

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {
            setLoading(true);
            const response = await restaurantAdminService.getDashboard();
            setDashboardData(response.data);
        } catch (error) {
            console.error('Error loading dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadDashboard();
        setRefreshing(false);
    };

    const getFilteredOrders = () => {
        if (!dashboardData?.recentOrders) return [];
        if (orderFilter === 'all') return dashboardData.recentOrders;
        if (orderFilter === 'paid') {
            return dashboardData.recentOrders.filter(o => o.payment_status === 'paid');
        }
        if (orderFilter === 'pending') {
            return dashboardData.recentOrders.filter(o => o.payment_status === 'pending');
        }
        return dashboardData.recentOrders;
    };

    if (loading) {
        return (
            <ScrollView style={styles.container}>
                {/* Header skeleton */}
                <View style={styles.header}>
                    <LinearGradient colors={['#667eea', '#764ba2']} style={styles.headerBackgroundGradient} />
                    <View style={styles.headerOverlay} />
                    <View style={styles.headerContent}>
                        <View style={styles.restaurantIconContainer}>
                            <Icon name="restaurant" size={40} color="#FFF" />
                        </View>
                        <Text style={styles.restaurantName}>Cargando...</Text>
                    </View>
                </View>

                {/* Stats skeleton */}
                <View style={styles.statsContainer}>
                    <View style={styles.statsRow}>
                        <StatCardSkeleton />
                        <StatCardSkeleton />
                    </View>
                    <View style={styles.statsRow}>
                        <StatCardSkeleton />
                        <StatCardSkeleton />
                    </View>
                </View>

                {/* Orders skeleton */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Pedidos Recientes</Text>
                    <OrderCardSkeleton />
                    <OrderCardSkeleton />
                    <OrderCardSkeleton />
                </View>

                {/* Products skeleton */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Productos Destacados</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <ProductCardSkeleton />
                        <ProductCardSkeleton />
                        <ProductCardSkeleton />
                    </ScrollView>
                </View>
            </ScrollView>
        );
    }

    const stats = dashboardData?.stats || {};
    const restaurant = dashboardData?.restaurant || {};

    return (
        <ScrollView
            style={styles.container}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            {/* Header con imagen de fondo del restaurante */}
            <View style={styles.header}>
                {restaurant.image ? (
                    <Image
                        source={{ uri: restaurant.image }}
                        style={styles.headerBackgroundImage}
                        blurRadius={2}
                    />
                ) : (
                    <LinearGradient
                        colors={['#667eea', '#764ba2']}
                        style={styles.headerBackgroundGradient}
                    />
                )}
                {/* Overlay oscuro para mejorar legibilidad */}
                <View style={styles.headerOverlay} />

                <View style={styles.headerContent}>
                    <View style={styles.restaurantIconContainer}>
                        <Icon name="restaurant" size={40} color="#FFF" />
                    </View>
                    <Text style={styles.restaurantName}>{restaurant.name || 'Mi Restaurante'}</Text>
                    <Text style={styles.restaurantStatus}>
                        {restaurant.status === 'active' ? '🟢 Activo' : '🔴 Inactivo'}
                    </Text>
                </View>
            </View>

            {/* Estadísticas principales */}
            <View style={styles.statsContainer}>
                <View style={styles.statsRow}>
                    <StatCard
                        icon="shopping-cart"
                        label="Pedidos"
                        value={stats.total_orders || 0}
                        color="#4ECDC4"
                    />
                    <StatCard
                        icon="attach-money"
                        label="Ingresos"
                        value={formatCurrency(stats.total_revenue || 0)}
                        color="#FFD93D"
                    />
                </View>
                <View style={styles.statsRow}>
                    <StatCard
                        icon="restaurant"
                        label="Productos"
                        value={stats.total_products || 0}
                        color="#FF6B6B"
                    />
                    <StatCard
                        icon="star"
                        label="Rating"
                        value={(stats.avg_rating || 0).toFixed(1)}
                        color="#6BCF7F"
                    />
                </View>
            </View>

            {/* Acciones rápidas */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
                <View style={styles.actionsGrid}>
                    <ActionButton
                        icon="add-circle"
                        label="Nuevo Producto"
                        color="#667eea"
                        onPress={() => navigation.navigate('Products', { screen: 'AddProduct' })}
                    />
                    <ActionButton
                        icon="list-alt"
                        label="Ver Productos"
                        color="#4ECDC4"
                        onPress={() => navigation.navigate('Products')}
                    />
                    <ActionButton
                        icon="receipt"
                        label="Pedidos"
                        color="#FFD93D"
                        onPress={() => navigation.navigate('Orders')}
                    />
                    <ActionButton
                        icon="settings"
                        label="Configuración"
                        color="#FF6B6B"
                        onPress={() => navigation.navigate('Settings')}
                    />
                </View>
            </View>

            {/* Pedidos recientes */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Pedidos Recientes</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Orders')}>
                        <Text style={styles.seeAllText}>Ver todos</Text>
                    </TouchableOpacity>
                </View>

                {/* Filtros de pedidos */}
                <View style={styles.filterContainer}>
                    <TouchableOpacity
                        style={[styles.filterButton, orderFilter === 'all' && styles.filterButtonActive]}
                        onPress={() => setOrderFilter('all')}
                    >
                        <Text style={[styles.filterText, orderFilter === 'all' && styles.filterTextActive]}>
                            Todos
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.filterButton, orderFilter === 'paid' && styles.filterButtonActive]}
                        onPress={() => setOrderFilter('paid')}
                    >
                        <Icon name="check-circle" size={16} color={orderFilter === 'paid' ? '#FFF' : '#4ECDC4'} />
                        <Text style={[styles.filterText, orderFilter === 'paid' && styles.filterTextActive]}>
                            Pagados
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.filterButton, orderFilter === 'pending' && styles.filterButtonActive]}
                        onPress={() => setOrderFilter('pending')}
                    >
                        <Icon name="schedule" size={16} color={orderFilter === 'pending' ? '#FFF' : '#FFD93D'} />
                        <Text style={[styles.filterText, orderFilter === 'pending' && styles.filterTextActive]}>
                            Pendientes
                        </Text>
                    </TouchableOpacity>
                </View>

                {getFilteredOrders().length > 0 ? (
                    getFilteredOrders().slice(0, 5).map((order) => (
                        <OrderCard key={order.id} order={order} navigation={navigation} />
                    ))
                ) : (
                    <Text style={styles.emptyText}>
                        {orderFilter === 'all' ? 'No hay pedidos recientes' :
                            orderFilter === 'paid' ? 'No hay pedidos pagados' :
                                'No hay pedidos pendientes'}
                    </Text>
                )}
            </View>

            {/* Productos destacados */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Productos Destacados</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Products')}>
                        <Text style={styles.seeAllText}>Ver todos</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.productsScrollContent}
                >
                    {dashboardData?.topProducts && dashboardData.topProducts.length > 0 ? (
                        dashboardData.topProducts.map((product) => (
                            <AdminProductCard
                                key={product.id}
                                product={product}
                                onPress={() => navigation.navigate('Products', {
                                    screen: 'EditProduct',
                                    params: { product: product }
                                })}
                                onEdit={() => navigation.navigate('Products', {
                                    screen: 'EditProduct',
                                    params: { product: product }
                                })}
                            />
                        ))
                    ) : (
                        <View style={styles.emptyProducts}>
                            <Icon name="inventory-2" size={40} color={COLORS.textSecondary} />
                            <Text style={styles.emptyProductsText}>No hay productos destacados</Text>
                        </View>
                    )}
                </ScrollView>
            </View>
        </ScrollView>
    );
};

// Componente de tarjeta de estadística
const StatCard = ({ icon, label, value, color }) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
        <Icon name={icon} size={32} color={color} />
        <View style={styles.statInfo}>
            <Text style={styles.statValue}>{value}</Text>
            <Text style={styles.statLabel}>{label}</Text>
        </View>
    </View>
);

// Componente de botón de acción
const ActionButton = ({ icon, label, color, onPress }) => (
    <TouchableOpacity style={styles.actionButton} onPress={onPress}>
        <LinearGradient
            colors={[color, color + 'CC']}
            style={styles.actionGradient}
        >
            <Icon name={icon} size={32} color="#FFF" />
            <Text style={styles.actionLabel}>{label}</Text>
        </LinearGradient>
    </TouchableOpacity>
);

// Componente de tarjeta de pedido
const OrderCard = ({ order, navigation }) => {
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

    const getPaymentStatusIcon = (paymentStatus) => {
        if (paymentStatus === 'paid') return 'check-circle';
        if (paymentStatus === 'failed') return 'cancel';
        return 'schedule';
    };

    const getPaymentStatusColor = (paymentStatus) => {
        if (paymentStatus === 'paid') return '#4ECDC4';
        if (paymentStatus === 'failed') return '#FF6B6B';
        return '#FFD93D';
    };

    const getPaymentMethodText = (method) => {
        const methods = {
            cash: '💵 Efectivo',
            transfer: '🏦 Transferencia',
            wompi: '💳 Wompi',
        };
        return methods[method] || method;
    };

    return (
        <TouchableOpacity
            style={styles.orderCard}
            onPress={() => navigation?.navigate('OrderDetail', { orderId: order.id })}
        >
            <View style={styles.orderHeader}>
                <View style={styles.orderIdContainer}>
                    <Text style={styles.orderId}>#{order.id.slice(0, 8)}</Text>
                    <Text style={styles.orderPaymentMethod}>
                        {getPaymentMethodText(order.payment_method)}
                    </Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
                    <Text style={styles.statusText}>{getStatusText(order.status)}</Text>
                </View>
            </View>

            {/* Estado de pago */}
            <View style={styles.paymentStatusContainer}>
                <Icon
                    name={getPaymentStatusIcon(order.payment_status)}
                    size={16}
                    color={getPaymentStatusColor(order.payment_status)}
                />
                <Text style={[styles.paymentStatusText, { color: getPaymentStatusColor(order.payment_status) }]}>
                    {order.payment_status === 'paid' ? 'Pagado' :
                        order.payment_status === 'failed' ? 'Pago fallido' :
                            'Pago pendiente'}
                </Text>
                {order.wompi_payment_method && (
                    <Text style={styles.wompiMethod}>
                        ({order.wompi_payment_method})
                    </Text>
                )}
            </View>

            <View style={styles.orderFooter}>
                <Text style={styles.orderTotal}>{formatCurrency(order.total)}</Text>
                <Text style={styles.orderDate}>
                    {new Date(order.created_at).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

// Importar el componente de card
import AdminProductCard from '../components/AdminProductCard';

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
        fontWeight: '600',
    },
    header: {
        height: 220,
        position: 'relative',
        overflow: 'hidden',
    },
    headerBackgroundImage: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    headerBackgroundGradient: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    headerOverlay: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    headerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: SPACING.xl,
        zIndex: 1,
    },
    restaurantIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.md,
        borderWidth: 3,
        borderColor: '#FFF',
    },
    restaurantName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: SPACING.xs,
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
        paddingHorizontal: SPACING.lg,
    },
    restaurantStatus: {
        fontSize: 16,
        color: '#FFF',
        fontWeight: '600',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },
    statsContainer: {
        padding: SPACING.md,
    },
    statsRow: {
        flexDirection: 'row',
        marginBottom: SPACING.md,
    },
    statCard: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: SPACING.md,
        marginHorizontal: SPACING.xs,
        borderLeftWidth: 4,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    statInfo: {
        marginLeft: SPACING.md,
        justifyContent: 'center',
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    statLabel: {
        fontSize: 12,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    section: {
        padding: SPACING.md,
        marginBottom: SPACING.md,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    seeAllText: {
        fontSize: 14,
        color: COLORS.primary,
    },
    filterContainer: {
        flexDirection: 'row',
        marginBottom: SPACING.md,
        gap: SPACING.sm,
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        borderRadius: 20,
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        gap: 4,
    },
    filterButtonActive: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    filterText: {
        fontSize: 13,
        color: COLORS.text,
        fontWeight: '600',
    },
    filterTextActive: {
        color: '#FFF',
    },
    actionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -SPACING.xs,
    },
    actionButton: {
        width: (width - SPACING.md * 2 - SPACING.xs * 4) / 2,
        margin: SPACING.xs,
        borderRadius: 12,
        overflow: 'hidden',
    },
    actionGradient: {
        padding: SPACING.lg,
        alignItems: 'center',
    },
    actionLabel: {
        marginTop: SPACING.sm,
        fontSize: 14,
        fontWeight: '600',
        color: '#FFF',
    },
    orderCard: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: SPACING.md,
        marginBottom: SPACING.sm,
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
    orderIdContainer: {
        flex: 1,
    },
    orderId: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: 2,
    },
    orderPaymentMethod: {
        fontSize: 12,
        color: COLORS.textSecondary,
    },
    paymentStatusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.sm,
        gap: 4,
    },
    paymentStatusText: {
        fontSize: 12,
        fontWeight: '600',
    },
    wompiMethod: {
        fontSize: 11,
        color: COLORS.textSecondary,
        fontStyle: 'italic',
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
    orderFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    orderTotal: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    orderDate: {
        fontSize: 12,
        color: COLORS.textSecondary,
    },
    emptyText: {
        textAlign: 'center',
        color: COLORS.textSecondary,
        fontSize: 14,
        paddingVertical: SPACING.lg,
    },
    productsScrollContent: {
        paddingRight: SPACING.md,
    },
    emptyProducts: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: SPACING.xl,
        paddingHorizontal: SPACING.lg,
    },
    emptyProductsText: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginTop: SPACING.sm,
        textAlign: 'center',
    },
});

export default RestaurantAdminDashboardScreen;
