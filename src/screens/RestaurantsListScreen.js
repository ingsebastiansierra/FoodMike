import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
    RefreshControl,
    ActivityIndicator,
    TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../theme/colors';
import { SPACING } from '../theme/spacing';
import restaurantsService from '../services/restaurantsService';

const RestaurantsListScreen = ({ navigation }) => {
    const [restaurants, setRestaurants] = useState([]);
    const [filteredRestaurants, setFilteredRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadRestaurants();
    }, []);

    useEffect(() => {
        filterRestaurants();
    }, [searchQuery, restaurants]);

    const loadRestaurants = async () => {
        try {
            setLoading(true);
            const response = await restaurantsService.getOpen();
            setRestaurants(response.data || []);
        } catch (error) {
            console.error('Error loading restaurants:', error);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadRestaurants();
        setRefreshing(false);
    };

    const filterRestaurants = () => {
        if (!searchQuery.trim()) {
            setFilteredRestaurants(restaurants);
            return;
        }

        const filtered = restaurants.filter((restaurant) =>
            restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            restaurant.description?.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredRestaurants(filtered);
    };

    const renderRestaurant = ({ item }) => (
        <TouchableOpacity
            style={styles.restaurantCard}
            onPress={() => navigation.navigate('RestaurantDetail', { restaurant: item })}
        >
            <Image source={{ uri: item.image }} style={styles.restaurantImage} />
            <View style={styles.restaurantInfo}>
                <View style={styles.restaurantHeader}>
                    <Text style={styles.restaurantName} numberOfLines={1}>
                        {item.name}
                    </Text>
                    {item.isfeatured && (
                        <View style={styles.featuredBadge}>
                            <Icon name="star" size={12} color="#FFD700" />
                        </View>
                    )}
                </View>
                <Text style={styles.restaurantDescription} numberOfLines={2}>
                    {item.description || 'Comida deliciosa'}
                </Text>
                <View style={styles.restaurantMeta}>
                    <View style={styles.metaItem}>
                        <Icon name="star" size={14} color="#FFD700" />
                        <Text style={styles.metaText}>{item.stars || '4.5'}</Text>
                    </View>
                    <View style={styles.metaItem}>
                        <Icon name="access-time" size={14} color={COLORS.textSecondary} />
                        <Text style={styles.metaText}>25-35 min</Text>
                    </View>
                    <View style={styles.metaItem}>
                        <Icon name="delivery-dining" size={14} color={COLORS.textSecondary} />
                        <Text style={styles.metaText}>${item.deliveryfee || '0'}</Text>
                    </View>
                </View>
                {item.isopen ? (
                    <View style={styles.openBadge}>
                        <View style={styles.openDot} />
                        <Text style={styles.openText}>Abierto ahora</Text>
                    </View>
                ) : (
                    <View style={styles.closedBadge}>
                        <Text style={styles.closedText}>Cerrado</Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>Cargando restaurantes...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Barra de búsqueda */}
            <View style={styles.searchContainer}>
                <Icon name="search" size={20} color={COLORS.textSecondary} style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar restaurantes..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholderTextColor={COLORS.textSecondary}
                />
                {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchQuery('')}>
                        <Icon name="close" size={20} color={COLORS.textSecondary} />
                    </TouchableOpacity>
                )}
            </View>

            {/* Contador de resultados */}
            <View style={styles.resultsHeader}>
                <Text style={styles.resultsText}>
                    {filteredRestaurants.length} restaurante{filteredRestaurants.length !== 1 ? 's' : ''} disponible{filteredRestaurants.length !== 1 ? 's' : ''}
                </Text>
            </View>

            {/* Lista de restaurantes */}
            <FlatList
                data={filteredRestaurants}
                renderItem={renderRestaurant}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContainer}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Icon name="restaurant" size={80} color={COLORS.textSecondary} />
                        <Text style={styles.emptyText}>
                            {searchQuery ? 'No se encontraron restaurantes' : 'No hay restaurantes disponibles'}
                        </Text>
                        {searchQuery && (
                            <TouchableOpacity
                                style={styles.clearButton}
                                onPress={() => setSearchQuery('')}
                            >
                                <Text style={styles.clearButtonText}>Limpiar búsqueda</Text>
                            </TouchableOpacity>
                        )}
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
        backgroundColor: COLORS.background,
    },
    loadingText: {
        marginTop: SPACING.md,
        fontSize: 16,
        color: COLORS.textSecondary,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        margin: SPACING.md,
        paddingHorizontal: SPACING.md,
        borderRadius: 25,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    searchIcon: {
        marginRight: SPACING.sm,
    },
    searchInput: {
        flex: 1,
        paddingVertical: SPACING.md,
        fontSize: 16,
        color: COLORS.text,
    },
    resultsHeader: {
        paddingHorizontal: SPACING.md,
        paddingBottom: SPACING.sm,
    },
    resultsText: {
        fontSize: 14,
        color: COLORS.textSecondary,
        fontWeight: '600',
    },
    listContainer: {
        padding: SPACING.md,
    },
    restaurantCard: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        marginBottom: SPACING.md,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    restaurantImage: {
        width: '100%',
        height: 180,
        backgroundColor: COLORS.lightGray,
    },
    restaurantInfo: {
        padding: SPACING.md,
    },
    restaurantHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.xs,
    },
    restaurantName: {
        flex: 1,
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    featuredBadge: {
        backgroundColor: '#FFF3CD',
        padding: 4,
        borderRadius: 12,
        marginLeft: SPACING.xs,
    },
    restaurantDescription: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginBottom: SPACING.sm,
    },
    restaurantMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.sm,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: SPACING.md,
    },
    metaText: {
        fontSize: 13,
        color: COLORS.textSecondary,
        marginLeft: 4,
    },
    openBadge: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    openDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#4ECDC4',
        marginRight: 6,
    },
    openText: {
        fontSize: 13,
        color: '#4ECDC4',
        fontWeight: '600',
    },
    closedBadge: {
        alignSelf: 'flex-start',
    },
    closedText: {
        fontSize: 13,
        color: '#FF6B6B',
        fontWeight: '600',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: SPACING.xxl * 2,
    },
    emptyText: {
        fontSize: 16,
        color: COLORS.textSecondary,
        marginTop: SPACING.md,
        textAlign: 'center',
    },
    clearButton: {
        marginTop: SPACING.md,
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.sm,
        backgroundColor: COLORS.primary,
        borderRadius: 20,
    },
    clearButtonText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '600',
    },
});

export default RestaurantsListScreen;
