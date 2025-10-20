import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    Image,
    RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, SPACING } from '../theme';
import { shortsService } from '../services/shortsService';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../config/supabase';

const ManageShortsScreen = ({ navigation, route }) => {
    const { user } = useAuth();
    const [restaurantId, setRestaurantId] = useState(null);
    const [shorts, setShorts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadRestaurantId();
    }, [user]);

    const loadRestaurantId = async () => {
        try {
            if (route.params?.restaurantId) {
                setRestaurantId(route.params.restaurantId);
                return;
            }

            if (user?.id) {
                const { data: profile, error } = await supabase
                    .from('profiles')
                    .select('restaurant_id')
                    .eq('id', user.id)
                    .single();

                if (error) throw error;
                setRestaurantId(profile.restaurant_id);
            }
        } catch (error) {
            console.error('Error loading restaurant ID:', error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            if (restaurantId) {
                loadShorts();
            }
        }, [restaurantId])
    );

    const loadShorts = async () => {
        if (!restaurantId) return;

        try {
            setLoading(true);
            const data = await shortsService.getRestaurantShorts(restaurantId);
            setShorts(data);
        } catch (error) {
            console.error('Error loading shorts:', error);
            Alert.alert('Error', 'No se pudieron cargar los shorts');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleRefresh = () => {
        setRefreshing(true);
        loadShorts();
    };

    const handleDelete = (short) => {
        Alert.alert(
            'Eliminar Short',
            `¿Estás seguro de eliminar "${short.title}"?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await shortsService.deleteShort(short.id);
                            Alert.alert('Éxito', 'Short eliminado');
                            loadShorts();
                        } catch (error) {
                            console.error('Error deleting short:', error);
                            Alert.alert('Error', 'No se pudo eliminar el short');
                        }
                    },
                },
            ]
        );
    };

    const handleToggleActive = async (short) => {
        try {
            await shortsService.updateShort(short.id, {
                is_active: !short.is_active,
            });
            loadShorts();
        } catch (error) {
            console.error('Error updating short:', error);
            Alert.alert('Error', 'No se pudo actualizar el short');
        }
    };

    const getStatusInfo = (short) => {
        if (short.is_expired) {
            return {
                text: 'Expirado',
                color: COLORS.error,
                icon: 'time-outline',
            };
        }
        if (short.is_scheduled) {
            return {
                text: 'Programado',
                color: COLORS.warning,
                icon: 'calendar-outline',
            };
        }
        if (short.is_active) {
            return {
                text: 'Activo',
                color: COLORS.success,
                icon: 'checkmark-circle',
            };
        }
        return {
            text: 'Inactivo',
            color: COLORS.textSecondary,
            icon: 'pause-circle-outline',
        };
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const getTimeRemaining = (expiresAt) => {
        if (!expiresAt) return null;
        const now = new Date();
        const expires = new Date(expiresAt);
        const diff = expires - now;

        if (diff <= 0) return 'Expirado';

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        if (hours > 24) {
            const days = Math.floor(hours / 24);
            return `${days}d ${hours % 24}h restantes`;
        }
        if (hours > 0) {
            return `${hours}h ${minutes}m restantes`;
        }
        return `${minutes}m restantes`;
    };

    const renderShort = ({ item }) => {
        const status = getStatusInfo(item);
        const timeRemaining = getTimeRemaining(item.expires_at);

        return (
            <View style={styles.shortCard}>
                <Image
                    source={{ uri: item.thumbnail_url || item.video_url }}
                    style={styles.thumbnail}
                />

                <View style={styles.shortInfo}>
                    <View style={styles.shortHeader}>
                        <Text style={styles.shortTitle} numberOfLines={2}>
                            {item.title}
                        </Text>
                        <View style={[styles.statusBadge, { backgroundColor: status.color + '20' }]}>
                            <Ionicons name={status.icon} size={12} color={status.color} />
                            <Text style={[styles.statusText, { color: status.color }]}>
                                {status.text}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.shortStats}>
                        <View style={styles.stat}>
                            <Ionicons name="eye-outline" size={16} color={COLORS.textSecondary} />
                            <Text style={styles.statText}>{item.views_count || 0}</Text>
                        </View>
                        <View style={styles.stat}>
                            <Ionicons name="heart-outline" size={16} color={COLORS.textSecondary} />
                            <Text style={styles.statText}>{item.likes_count || 0}</Text>
                        </View>
                        <View style={styles.stat}>
                            <Ionicons name="chatbubble-outline" size={16} color={COLORS.textSecondary} />
                            <Text style={styles.statText}>{item.comments_count || 0}</Text>
                        </View>
                    </View>

                    {item.publish_at && (
                        <Text style={styles.dateText}>
                            📅 Publicación: {formatDate(item.publish_at)}
                        </Text>
                    )}

                    {timeRemaining && (
                        <Text style={[styles.timeRemaining, item.is_expired && styles.expired]}>
                            ⏱️ {timeRemaining}
                        </Text>
                    )}

                    <View style={styles.actions}>
                        {!item.is_expired && (
                            <TouchableOpacity
                                style={styles.actionButton}
                                onPress={() => handleToggleActive(item)}
                            >
                                <Ionicons
                                    name={item.is_active ? 'pause' : 'play'}
                                    size={20}
                                    color={COLORS.primary}
                                />
                                <Text style={styles.actionText}>
                                    {item.is_active ? 'Pausar' : 'Activar'}
                                </Text>
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity
                            style={[styles.actionButton, styles.deleteButton]}
                            onPress={() => handleDelete(item)}
                        >
                            <Ionicons name="trash-outline" size={20} color={COLORS.error} />
                            <Text style={[styles.actionText, styles.deleteText]}>Eliminar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Mis Shorts</Text>
                <TouchableOpacity onPress={() => navigation.navigate('CreateShort', { restaurantId })}>
                    <Ionicons name="add-circle" size={28} color={COLORS.primary} />
                </TouchableOpacity>
            </View>

            <FlatList
                data={shorts}
                renderItem={renderShort}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="videocam-outline" size={64} color={COLORS.textSecondary} />
                        <Text style={styles.emptyText}>No tienes shorts publicados</Text>
                        <TouchableOpacity
                            style={styles.createButton}
                            onPress={() => navigation.navigate('CreateShort', { restaurantId })}
                        >
                            <Text style={styles.createButtonText}>Crear mi primer Short</Text>
                        </TouchableOpacity>
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
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SPACING.md,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    list: {
        padding: SPACING.md,
    },
    shortCard: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 12,
        marginBottom: SPACING.md,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    thumbnail: {
        width: 100,
        height: 150,
        backgroundColor: COLORS.border,
    },
    shortInfo: {
        flex: 1,
        padding: SPACING.md,
    },
    shortHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: SPACING.sm,
    },
    shortTitle: {
        flex: 1,
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.text,
        marginRight: SPACING.sm,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 4,
    },
    statusText: {
        fontSize: 11,
        fontWeight: '600',
    },
    shortStats: {
        flexDirection: 'row',
        gap: SPACING.md,
        marginBottom: SPACING.sm,
    },
    stat: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    statText: {
        fontSize: 12,
        color: COLORS.textSecondary,
    },
    dateText: {
        fontSize: 11,
        color: COLORS.textSecondary,
        marginBottom: 4,
    },
    timeRemaining: {
        fontSize: 12,
        color: COLORS.primary,
        fontWeight: '600',
        marginBottom: SPACING.sm,
    },
    expired: {
        color: COLORS.error,
    },
    actions: {
        flexDirection: 'row',
        gap: SPACING.sm,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SPACING.sm,
        paddingVertical: 6,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: COLORS.primary,
        gap: 4,
    },
    actionText: {
        fontSize: 12,
        color: COLORS.primary,
        fontWeight: '600',
    },
    deleteButton: {
        borderColor: COLORS.error,
    },
    deleteText: {
        color: COLORS.error,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: 16,
        color: COLORS.textSecondary,
        marginTop: SPACING.md,
        marginBottom: SPACING.lg,
    },
    createButton: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
        borderRadius: 8,
    },
    createButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
    },
});

export default ManageShortsScreen;
