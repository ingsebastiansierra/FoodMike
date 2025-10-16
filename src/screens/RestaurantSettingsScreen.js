import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    Image,
    Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../theme/colors';
import { SPACING } from '../theme/spacing';
import { useAuth } from '../context/AuthContext';
import restaurantAdminService from '../services/restaurantAdminService';
import { MenuItemSkeleton } from '../components/AdminSkeleton';

const { width } = Dimensions.get('window');

const RestaurantSettingsScreen = ({ navigation }) => {
    const { logout, user } = useAuth();
    const [restaurant, setRestaurant] = useState(null);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadRestaurantData();
    }, []);

    const loadRestaurantData = async () => {
        try {
            setLoading(true);
            const response = await restaurantAdminService.getDashboard();
            setRestaurant(response.data.restaurant);
            setStats(response.data.stats);
        } catch (error) {
            console.error('Error loading restaurant data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        Alert.alert(
            'Cerrar Sesión',
            '¿Estás seguro de que deseas cerrar sesión?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Cerrar Sesión',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await logout();
                        } catch (error) {
                            Alert.alert('Error', 'No se pudo cerrar sesión');
                        }
                    },
                },
            ]
        );
    };

    const MenuItem = ({ icon, title, subtitle, onPress, color = COLORS.primary, badge }) => (
        <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
            <View style={[styles.menuIconContainer, { backgroundColor: color + '15' }]}>
                <Icon name={icon} size={26} color={color} />
            </View>
            <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>{title}</Text>
                {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
            </View>
            {badge && (
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>{badge}</Text>
                </View>
            )}
            <Icon name="chevron-right" size={24} color={COLORS.textSecondary} />
        </TouchableOpacity>
    );

    const SettingsMenuSkeleton = () => (
        <View style={styles.menuItem}>
            <View style={[styles.skeletonCircle, { width: 48, height: 48, borderRadius: 24 }]} />
            <View style={[styles.menuContent, { gap: 6 }]}>
                <View style={[styles.skeletonLine, { width: '60%', height: 16 }]} />
                <View style={[styles.skeletonLine, { width: '80%', height: 12 }]} />
            </View>
            <View style={[styles.skeletonCircle, { width: 24, height: 24, borderRadius: 12 }]} />
        </View>
    );

    if (loading) {
        return (
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                {/* Header skeleton */}
                <LinearGradient colors={['#667eea', '#764ba2']} style={styles.header}>
                    <View style={styles.profileContainer}>
                        <View style={[styles.skeletonCircle, { width: 100, height: 100, borderRadius: 50, borderWidth: 4, borderColor: '#FFF', marginBottom: SPACING.md }]} />
                        <View style={[styles.skeletonLine, { width: 150, height: 24, marginBottom: SPACING.xs }]} />
                        <View style={[styles.skeletonLine, { width: 120, height: 14, marginBottom: SPACING.lg }]} />

                        {/* Stats skeleton */}
                        <View style={styles.statsRow}>
                            <View style={styles.statItem}>
                                <View style={[styles.skeletonLine, { width: 40, height: 20, marginBottom: 4 }]} />
                                <View style={[styles.skeletonLine, { width: 50, height: 12 }]} />
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.statItem}>
                                <View style={[styles.skeletonLine, { width: 40, height: 20, marginBottom: 4 }]} />
                                <View style={[styles.skeletonLine, { width: 60, height: 12 }]} />
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.statItem}>
                                <View style={[styles.skeletonLine, { width: 40, height: 20, marginBottom: 4 }]} />
                                <View style={[styles.skeletonLine, { width: 45, height: 12 }]} />
                            </View>
                        </View>
                    </View>
                </LinearGradient>

                {/* Menu skeletons */}
                <View style={styles.menuSection}>
                    <View style={[styles.skeletonLine, { width: 120, height: 16, marginBottom: SPACING.sm }]} />
                    <View style={styles.menuCard}>
                        <SettingsMenuSkeleton />
                        <SettingsMenuSkeleton />
                        <SettingsMenuSkeleton />
                    </View>
                </View>

                <View style={styles.menuSection}>
                    <View style={[styles.skeletonLine, { width: 100, height: 16, marginBottom: SPACING.sm }]} />
                    <View style={styles.menuCard}>
                        <SettingsMenuSkeleton />
                        <SettingsMenuSkeleton />
                        <SettingsMenuSkeleton />
                    </View>
                </View>

                <View style={styles.menuSection}>
                    <View style={[styles.skeletonLine, { width: 90, height: 16, marginBottom: SPACING.sm }]} />
                    <View style={styles.menuCard}>
                        <SettingsMenuSkeleton />
                        <SettingsMenuSkeleton />
                        <SettingsMenuSkeleton />
                    </View>
                </View>
            </ScrollView>
        );
    }

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Header con gradiente y foto del restaurante */}
            <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.header}
            >
                <View style={styles.profileContainer}>
                    {restaurant?.image ? (
                        <Image
                            source={{ uri: restaurant.image }}
                            style={styles.restaurantAvatar}
                        />
                    ) : (
                        <View style={styles.avatarPlaceholder}>
                            <Icon name="restaurant" size={40} color="#FFF" />
                        </View>
                    )}
                    <Text style={styles.restaurantName}>{restaurant?.name || 'Mi Restaurante'}</Text>
                    <Text style={styles.restaurantEmail}>{user?.email}</Text>

                    {/* Stats rápidas */}
                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{stats?.total_orders || 0}</Text>
                            <Text style={styles.statLabel}>Pedidos</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{stats?.total_products || 0}</Text>
                            <Text style={styles.statLabel}>Productos</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{stats?.avg_rating?.toFixed(1) || '0.0'}</Text>
                            <Text style={styles.statLabel}>Rating</Text>
                        </View>
                    </View>
                </View>
            </LinearGradient>

            {/* Menú de opciones */}
            <View style={styles.menuSection}>
                <Text style={styles.sectionTitle}>🏪 Restaurante</Text>
                <View style={styles.menuCard}>
                    <MenuItem
                        icon="store"
                        title="Información del Restaurante"
                        subtitle="Nombre, dirección, contacto"
                        color="#667eea"
                        onPress={() => Alert.alert('Próximamente', 'Esta función estará disponible pronto')}
                    />
                    <MenuItem
                        icon="schedule"
                        title="Horarios de Atención"
                        subtitle="Configura tus horarios"
                        color="#4ECDC4"
                        onPress={() => Alert.alert('Próximamente', 'Esta función estará disponible pronto')}
                    />
                    <MenuItem
                        icon="image"
                        title="Imágenes y Logo"
                        subtitle="Actualiza tus fotos"
                        color="#FFD93D"
                        onPress={() => Alert.alert('Próximamente', 'Esta función estará disponible pronto')}
                    />
                </View>
            </View>

            <View style={styles.menuSection}>
                <Text style={styles.sectionTitle}>🚚 Delivery</Text>
                <View style={styles.menuCard}>
                    <MenuItem
                        icon="delivery-dining"
                        title="Tarifa de Envío"
                        subtitle="Configura costos de delivery"
                        color="#FF6B6B"
                        onPress={() => Alert.alert('Próximamente', 'Esta función estará disponible pronto')}
                    />
                    <MenuItem
                        icon="attach-money"
                        title="Pedido Mínimo"
                        subtitle="Monto mínimo requerido"
                        color="#6BCF7F"
                        onPress={() => Alert.alert('Próximamente', 'Esta función estará disponible pronto')}
                    />
                    <MenuItem
                        icon="map"
                        title="Zona de Cobertura"
                        subtitle="Áreas de entrega"
                        color="#95E1D3"
                        onPress={() => Alert.alert('Próximamente', 'Esta función estará disponible pronto')}
                    />
                </View>
            </View>

            <View style={styles.menuSection}>
                <Text style={styles.sectionTitle}>📊 Gestión</Text>
                <View style={styles.menuCard}>
                    <MenuItem
                        icon="category"
                        title="Categorías"
                        subtitle="Organiza tus productos"
                        color="#764ba2"
                        onPress={() => Alert.alert('Próximamente', 'Esta función estará disponible pronto')}
                    />
                    <MenuItem
                        icon="assessment"
                        title="Reportes y Estadísticas"
                        subtitle="Análisis de ventas"
                        color="#667eea"
                        onPress={() => Alert.alert('Próximamente', 'Esta función estará disponible pronto')}
                    />
                    <MenuItem
                        icon="notifications"
                        title="Notificaciones"
                        subtitle="Preferencias de avisos"
                        color="#FFD93D"
                        badge="3"
                        onPress={() => Alert.alert('Próximamente', 'Esta función estará disponible pronto')}
                    />
                </View>
            </View>

            <View style={styles.menuSection}>
                <Text style={styles.sectionTitle}>⚙️ Cuenta</Text>
                <View style={styles.menuCard}>
                    <MenuItem
                        icon="person"
                        title="Mi Perfil"
                        subtitle="Información personal"
                        color="#4ECDC4"
                        onPress={() => Alert.alert('Próximamente', 'Esta función estará disponible pronto')}
                    />
                    <MenuItem
                        icon="help"
                        title="Ayuda y Soporte"
                        subtitle="Centro de ayuda"
                        color="#95E1D3"
                        onPress={() => Alert.alert('Próximamente', 'Esta función estará disponible pronto')}
                    />
                    <MenuItem
                        icon="info"
                        title="Acerca de TOC TOC"
                        subtitle="Versión 1.0.0"
                        color="#667eea"
                        onPress={() => Alert.alert('TOC TOC Admin', 'Versión 1.0.0\n\nPlataforma de gestión de restaurantes')}
                    />
                </View>
            </View>

            {/* Botón de cerrar sesión */}
            <View style={styles.logoutSection}>
                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={handleLogout}
                    activeOpacity={0.8}
                >
                    <Icon name="logout" size={24} color="#FFF" />
                    <Text style={styles.logoutText}>Cerrar Sesión</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.footer}>
                <Text style={styles.footerText}>TOC TOC - Administrador</Text>
                <Text style={styles.footerVersion}>© 2024 Todos los derechos reservados</Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        paddingTop: SPACING.xl,
        paddingBottom: SPACING.xxl,
        alignItems: 'center',
    },
    profileContainer: {
        alignItems: 'center',
    },
    restaurantAvatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 4,
        borderColor: '#FFF',
        marginBottom: SPACING.md,
    },
    avatarPlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: '#FFF',
        marginBottom: SPACING.md,
    },
    restaurantName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: SPACING.xs,
        textAlign: 'center',
    },
    restaurantEmail: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.9)',
        marginBottom: SPACING.lg,
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: 16,
        padding: SPACING.md,
        marginTop: SPACING.md,
    },
    statItem: {
        alignItems: 'center',
        paddingHorizontal: SPACING.lg,
    },
    statDivider: {
        width: 1,
        height: 30,
        backgroundColor: 'rgba(255,255,255,0.3)',
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFF',
    },
    statLabel: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.8)',
        marginTop: 2,
    },
    menuSection: {
        marginTop: SPACING.lg,
        paddingHorizontal: SPACING.md,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: SPACING.sm,
        paddingHorizontal: SPACING.xs,
    },
    menuCard: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.md,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.lightGray,
    },
    menuIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.md,
    },
    menuContent: {
        flex: 1,
    },
    menuTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: 2,
    },
    menuSubtitle: {
        fontSize: 13,
        color: COLORS.textSecondary,
    },
    badge: {
        backgroundColor: '#FF6B6B',
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 2,
        marginRight: SPACING.sm,
    },
    badgeText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: 'bold',
    },
    logoutSection: {
        paddingHorizontal: SPACING.md,
        marginTop: SPACING.xl,
        marginBottom: SPACING.lg,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FF6B6B',
        paddingVertical: SPACING.lg,
        borderRadius: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    logoutText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: SPACING.sm,
    },
    footer: {
        padding: SPACING.xl,
        alignItems: 'center',
        marginBottom: SPACING.lg,
    },
    footerText: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.textSecondary,
    },
    footerVersion: {
        fontSize: 12,
        color: COLORS.textSecondary,
        marginTop: 4,
    },
    // Skeleton styles
    skeletonLine: {
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: 4,
    },
    skeletonCircle: {
        backgroundColor: 'rgba(255,255,255,0.3)',
    },
});

export default RestaurantSettingsScreen;
