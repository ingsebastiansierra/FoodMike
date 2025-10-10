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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../theme/colors';
import { SPACING } from '../theme/spacing';
import restaurantAdminService from '../services/restaurantAdminService';
import { formatCurrency } from '../shared/utils/format';
import { DashboardCardSkeleton, ListItemSkeleton } from '../components/SkeletonLoader';

const { width } = Dimensions.get('window');

const RestaurantAdminDashboardScreen = ({ navigation }) => {
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [dashboardData, setDashboardData] = useState(null);

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

    if (loading) {
        return (
            <ScrollView style={styles.container}>
                <LinearGradient
                    colors={[COLORS.primary, COLORS.secondary || COLORS.primary]}
                    style={styles.header}
                >
                    <View style={{ opacity: 0.5 }}>
                        <Text style={styles.greeting}>Cargando...</Text>
                        <Text style={styles.restaurantName}>Dashboard</Text>
                    </View>
                </LinearGradient>

                <View style={styles.content}>
                    <View style={styles.statsGrid}>
                        {[1, 2, 3, 4].map((item) => (
                            <DashboardCardSkeleton key={item} />
                        ))}
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Pedidos Recientes</Text>
                        {[1, 2, 3].map((item) => (
                            <ListItemSkeleton key={item} />
                        ))}
                    </View>
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
            {/* Header con información del restaurante */}
            <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.header}
            >
                <View style={styles.headerContent}>
                    <Text style={styles.restaurantName}>{restaurant.name}</Text>
                    <Text style={styles.restaurantStatus}>
                        {restaurant.status === 'active' ? '🟢 Activo' : '🔴 Inactivo'}
                    </Text>
                </View>
            </LinearGradient>

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
                {dashboardData?.recentOrders?.length > 0 ? (
                    dashboardData.recentOrders.slice(0, 5).map((order) => (
                        <OrderCard key={order.id} order={order} />
                    ))
                ) : (
                    <Text style={styles.emptyText}>No hay pedidos recientes</Text>
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
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {dashboardData?.topProducts?.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
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
const OrderCard = ({ order }) => {
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

    return (
        <View style={styles.orderCard}>
            <View style={styles.orderHeader}>
                <Text style={styles.orderId}>#{order.id.slice(0, 8)}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
                    <Text style={styles.statusText}>{getStatusText(order.status)}</Text>
                </View>
            </View>
            <View style={styles.orderFooter}>
                <Text style={styles.orderTotal}>{formatCurrency(order.total)}</Text>
                <Text style={styles.orderDate}>
                    {new Date(order.created_at).toLocaleDateString()}
                </Text>
            </View>
        </View>
    );
};

// Componente de tarjeta de producto
const ProductCard = ({ product }) => (
    <View style={styles.productCard}>
        <View style={styles.productImage}>
            <Icon name="restaurant" size={40} color={COLORS.primary} />
        </View>
        <Text style={styles.productName} numberOfLines={1}>
            {product.name}
        </Text>
        <Text style={styles.productPrice}>{formatCurrency(product.price)}</Text>
        <View style={styles.productRating}>
            <Icon name="star" size={14} color="#FFD700" />
            <Text style={styles.productStars}>{product.stars || '0.0'}</Text>
        </View>
    </View>
);

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
    header: {
        padding: SPACING.xl,
        paddingTop: SPACING.xxl,
    },
    headerContent: {
        alignItems: 'center',
    },
    restaurantName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: SPACING.xs,
    },
    restaurantStatus: {
        fontSize: 14,
        color: '#FFF',
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
        alignItems: 'center',
        marginBottom: SPACING.sm,
    },
    orderId: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.text,
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
    productCard: {
        width: 140,
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: SPACING.md,
        marginRight: SPACING.sm,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    productImage: {
        width: '100%',
        height: 80,
        backgroundColor: COLORS.lightGray,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.sm,
    },
    productName: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: 4,
    },
    productPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginBottom: 4,
    },
    productRating: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    productStars: {
        fontSize: 12,
        color: COLORS.textSecondary,
        marginLeft: 4,
    },
});

export default RestaurantAdminDashboardScreen;
