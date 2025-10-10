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
    Alert,
    TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../theme/colors';
import { SPACING } from '../theme/spacing';
import restaurantAdminService from '../services/restaurantAdminService';
import { formatCurrency } from '../shared/utils/format';
import { ProductCardSkeleton } from '../components/SkeletonLoader';

const RestaurantProductsScreen = ({ navigation }) => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            setLoading(true);
            const response = await restaurantAdminService.getProducts();
            setProducts(response.data || []);
            setFilteredProducts(response.data || []);
        } catch (error) {
            console.error('Error loading products:', error);
            Alert.alert('Error', 'No se pudieron cargar los productos');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (text) => {
        setSearchQuery(text);
        if (!text.trim()) {
            setFilteredProducts(products);
            return;
        }

        const filtered = products.filter((product) =>
            product.name.toLowerCase().includes(text.toLowerCase()) ||
            product.description?.toLowerCase().includes(text.toLowerCase()) ||
            product.categories?.name?.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredProducts(filtered);
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadProducts();
        setRefreshing(false);
    };

    const handleDeleteProduct = (productId) => {
        Alert.alert(
            'Eliminar Producto',
            '¿Estás seguro de que deseas eliminar este producto?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await restaurantAdminService.deleteProduct(productId);
                            Alert.alert('Éxito', 'Producto eliminado correctamente');
                            loadProducts();
                        } catch (error) {
                            console.error('Error deleting product:', error);
                            Alert.alert('Error', 'No se pudo eliminar el producto');
                        }
                    },
                },
            ]
        );
    };

    const toggleAvailability = async (product) => {
        try {
            await restaurantAdminService.updateProduct(product.id, {
                is_available: !product.is_available,
            });
            loadProducts();
        } catch (error) {
            console.error('Error updating availability:', error);
            Alert.alert('Error', 'No se pudo actualizar la disponibilidad');
        }
    };

    const renderProduct = ({ item }) => (
        <View style={styles.productCard}>
            {/* Imagen del producto */}
            <View style={styles.productImageContainer}>
                {item.image ? (
                    <Image source={{ uri: item.image }} style={styles.productImage} />
                ) : (
                    <LinearGradient
                        colors={['#667eea', '#764ba2']}
                        style={[styles.productImage, styles.placeholderImage]}
                    >
                        <Icon name="restaurant" size={50} color="#FFF" />
                    </LinearGradient>
                )}

                {/* Overlay gradient */}
                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.3)']}
                    style={styles.imageOverlay}
                />

                {/* Badge de disponibilidad */}
                <View
                    style={[
                        styles.availabilityBadge,
                        { backgroundColor: item.is_available ? '#4ECDC4' : '#FF6B6B' },
                    ]}
                >
                    <Icon
                        name={item.is_available ? 'check-circle' : 'cancel'}
                        size={12}
                        color="#FFF"
                    />
                    <Text style={styles.availabilityText}>
                        {item.is_available ? 'Disponible' : 'Agotado'}
                    </Text>
                </View>

                {/* Badge de categoría */}
                {item.categories?.name && (
                    <View style={styles.categoryBadge}>
                        <Text style={styles.categoryBadgeText}>{item.categories.name}</Text>
                    </View>
                )}
            </View>

            {/* Información del producto */}
            <View style={styles.productInfo}>
                <View style={styles.productHeader}>
                    <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
                    <View style={styles.productRating}>
                        <Icon name="star" size={14} color="#FFD700" />
                        <Text style={styles.ratingText}>{item.stars || '0.0'}</Text>
                    </View>
                </View>

                <Text style={styles.productDescription} numberOfLines={2}>
                    {item.description || 'Sin descripción'}
                </Text>

                <View style={styles.productFooter}>
                    <View style={styles.priceContainer}>
                        <Text style={styles.productPrice}>{formatCurrency(item.price)}</Text>
                        {item.discount_percentage > 0 && (
                            <View style={styles.discountBadge}>
                                <Text style={styles.discountText}>-{item.discount_percentage}%</Text>
                            </View>
                        )}
                    </View>

                    {item.preparation_time && (
                        <View style={styles.timeContainer}>
                            <Icon name="schedule" size={14} color={COLORS.textSecondary} />
                            <Text style={styles.timeText}>{item.preparation_time} min</Text>
                        </View>
                    )}
                </View>
            </View>

            {/* Acciones */}
            <View style={styles.productActions}>
                <TouchableOpacity
                    style={[styles.actionButton, styles.toggleButton]}
                    onPress={() => toggleAvailability(item)}
                >
                    <Icon
                        name={item.is_available ? 'visibility' : 'visibility-off'}
                        size={18}
                        color="#FFF"
                    />
                    <Text style={styles.actionButtonText}>
                        {item.is_available ? 'Ocultar' : 'Mostrar'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionButton, styles.editButton]}
                    onPress={() => navigation.navigate('EditProduct', { product: item })}
                >
                    <Icon name="edit" size={18} color="#FFF" />
                    <Text style={styles.actionButtonText}>Editar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => handleDeleteProduct(item.id)}
                >
                    <Icon name="delete" size={18} color="#FFF" />
                    <Text style={styles.actionButtonText}>Eliminar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.container}>
                <View style={styles.searchContainer}>
                    <View style={[styles.searchInputContainer, { opacity: 0.5 }]}>
                        <Icon name="search" size={20} color={COLORS.textSecondary} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Buscar productos..."
                            editable={false}
                        />
                    </View>
                </View>
                <FlatList
                    data={[1, 2, 3, 4, 5, 6]}
                    keyExtractor={(item) => item.toString()}
                    renderItem={() => <ProductCardSkeleton />}
                    contentContainerStyle={styles.listContainer}
                />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Buscador */}
            <View style={styles.searchContainer}>
                <View style={styles.searchInputContainer}>
                    <Icon name="search" size={20} color="#7F8C8D" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Buscar productos..."
                        value={searchQuery}
                        onChangeText={handleSearch}
                        placeholderTextColor="#95A5A6"
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => handleSearch('')}>
                            <Icon name="close" size={20} color="#7F8C8D" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Header con contador */}
            <View style={styles.header}>
                <Text style={styles.headerText}>
                    {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''}
                    {searchQuery ? ` encontrado${filteredProducts.length !== 1 ? 's' : ''}` : ''}
                </Text>
            </View>

            <FlatList
                data={filteredProducts}
                renderItem={renderProduct}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContainer}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <LinearGradient
                            colors={['#667eea', '#764ba2']}
                            style={styles.emptyIconContainer}
                        >
                            <Icon
                                name={searchQuery ? "search-off" : "restaurant-menu"}
                                size={60}
                                color="#FFF"
                            />
                        </LinearGradient>
                        <Text style={styles.emptyText}>
                            {searchQuery ? 'No se encontraron productos' : 'No hay productos'}
                        </Text>
                        <Text style={styles.emptySubtext}>
                            {searchQuery
                                ? `No hay productos que coincidan con "${searchQuery}"`
                                : 'Agrega tu primer producto para comenzar'
                            }
                        </Text>
                        {searchQuery ? (
                            <TouchableOpacity
                                style={styles.emptyButton}
                                onPress={() => handleSearch('')}
                            >
                                <Icon name="clear" size={20} color="#FFF" />
                                <Text style={styles.emptyButtonText}>Limpiar Búsqueda</Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity
                                style={styles.emptyButton}
                                onPress={() => navigation.navigate('AddProduct')}
                            >
                                <Icon name="add" size={20} color="#FFF" />
                                <Text style={styles.emptyButtonText}>Agregar Producto</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                }
            />

            {/* FAB mejorado */}
            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate('AddProduct')}
            >
                <LinearGradient
                    colors={['#667eea', '#764ba2']}
                    style={styles.fabGradient}
                >
                    <Icon name="add" size={28} color="#FFF" />
                </LinearGradient>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F7FA',
    },
    loadingText: {
        marginTop: SPACING.md,
        fontSize: 16,
        color: COLORS.textSecondary,
    },
    searchContainer: {
        backgroundColor: '#FFF',
        padding: SPACING.md,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    searchInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F7FA',
        borderRadius: 25,
        paddingHorizontal: SPACING.md,
        paddingVertical: 10,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    searchIcon: {
        marginRight: SPACING.sm,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#2C3E50',
        padding: 0,
    },
    header: {
        backgroundColor: '#FFF',
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    headerText: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.textSecondary,
    },
    listContainer: {
        padding: SPACING.md,
    },
    productCard: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        marginBottom: SPACING.md,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    productImageContainer: {
        position: 'relative',
        height: 180,
    },
    productImage: {
        width: '100%',
        height: '100%',
    },
    placeholderImage: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 60,
    },
    availabilityBadge: {
        position: 'absolute',
        top: SPACING.sm,
        right: SPACING.sm,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SPACING.sm,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 4,
    },
    availabilityText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#FFF',
        marginLeft: 4,
    },
    categoryBadge: {
        position: 'absolute',
        top: SPACING.sm,
        left: SPACING.sm,
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: SPACING.sm,
        paddingVertical: 4,
        borderRadius: 12,
    },
    categoryBadgeText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#FFF',
    },
    productInfo: {
        padding: SPACING.md,
    },
    productHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    productName: {
        flex: 1,
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2C3E50',
        marginRight: SPACING.sm,
    },
    productRating: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF9E6',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    ratingText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#2C3E50',
        marginLeft: 4,
    },
    productDescription: {
        fontSize: 14,
        color: '#7F8C8D',
        lineHeight: 20,
        marginBottom: SPACING.sm,
    },
    productFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    productPrice: {
        fontSize: 22,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    discountBadge: {
        backgroundColor: '#FF6B6B',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
        marginLeft: 8,
    },
    discountText: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#FFF',
    },
    timeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F7FA',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
    },
    timeText: {
        fontSize: 12,
        color: COLORS.textSecondary,
        marginLeft: 4,
        fontWeight: '600',
    },
    productActions: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        paddingVertical: 14,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 6,
    },
    actionButtonText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#FFF',
        marginLeft: 4,
    },
    toggleButton: {
        backgroundColor: '#667eea',
    },
    editButton: {
        backgroundColor: '#4ECDC4',
    },
    deleteButton: {
        backgroundColor: '#FF6B6B',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: SPACING.xxl * 3,
    },
    emptyIconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.lg,
    },
    emptyText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2C3E50',
        marginTop: SPACING.md,
    },
    emptySubtext: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginTop: SPACING.xs,
        textAlign: 'center',
        paddingHorizontal: SPACING.xl,
    },
    emptyButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.primary,
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
        borderRadius: 25,
        marginTop: SPACING.lg,
    },
    emptyButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFF',
        marginLeft: 8,
    },
    fab: {
        position: 'absolute',
        right: SPACING.lg,
        bottom: SPACING.lg,
        width: 60,
        height: 60,
        borderRadius: 30,
        elevation: 6,
        shadowColor: '#667eea',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
    },
    fabGradient: {
        width: '100%',
        height: '100%',
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default RestaurantProductsScreen;
