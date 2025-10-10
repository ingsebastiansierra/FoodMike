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
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../theme/colors';
import { SPACING } from '../theme/spacing';
import restaurantAdminService from '../services/restaurantAdminService';
import { formatCurrency } from '../shared/utils/format';

const RestaurantProductsScreen = ({ navigation }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            setLoading(true);
            const response = await restaurantAdminService.getProducts();
            setProducts(response.data || []);
        } catch (error) {
            console.error('Error loading products:', error);
            Alert.alert('Error', 'No se pudieron cargar los productos');
        } finally {
            setLoading(false);
        }
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
            <View style={styles.productImageContainer}>
                {item.image ? (
                    <Image source={{ uri: item.image }} style={styles.productImage} />
                ) : (
                    <View style={[styles.productImage, styles.placeholderImage]}>
                        <Icon name="restaurant" size={40} color={COLORS.textSecondary} />
                    </View>
                )}
                <View
                    style={[
                        styles.availabilityBadge,
                        { backgroundColor: item.is_available ? '#4ECDC4' : '#FF6B6B' },
                    ]}
                >
                    <Text style={styles.availabilityText}>
                        {item.is_available ? 'Disponible' : 'No disponible'}
                    </Text>
                </View>
            </View>

            <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productDescription} numberOfLines={2}>
                    {item.description || 'Sin descripción'}
                </Text>
                <View style={styles.productMeta}>
                    <Text style={styles.productPrice}>{formatCurrency(item.price)}</Text>
                    <View style={styles.productRating}>
                        <Icon name="star" size={16} color="#FFD700" />
                        <Text style={styles.ratingText}>{item.stars || '0.0'}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.productActions}>
                <TouchableOpacity
                    style={[styles.actionButton, styles.toggleButton]}
                    onPress={() => toggleAvailability(item)}
                >
                    <Icon
                        name={item.is_available ? 'visibility-off' : 'visibility'}
                        size={20}
                        color="#FFF"
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.actionButton, styles.editButton]}
                    onPress={() => navigation.navigate('EditProduct', { product: item })}
                >
                    <Icon name="edit" size={20} color="#FFF" />
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => handleDeleteProduct(item.id)}
                >
                    <Icon name="delete" size={20} color="#FFF" />
                </TouchableOpacity>
            </View>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>Cargando productos...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={products}
                renderItem={renderProduct}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContainer}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Icon name="restaurant-menu" size={80} color={COLORS.textSecondary} />
                        <Text style={styles.emptyText}>No hay productos</Text>
                        <Text style={styles.emptySubtext}>
                            Agrega tu primer producto para comenzar
                        </Text>
                    </View>
                }
            />

            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate('AddProduct')}
            >
                <Icon name="add" size={28} color="#FFF" />
            </TouchableOpacity>
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
    listContainer: {
        padding: SPACING.md,
    },
    productCard: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        marginBottom: SPACING.md,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    productImageContainer: {
        position: 'relative',
    },
    productImage: {
        width: '100%',
        height: 150,
        backgroundColor: COLORS.lightGray,
    },
    placeholderImage: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    availabilityBadge: {
        position: 'absolute',
        top: SPACING.sm,
        right: SPACING.sm,
        paddingHorizontal: SPACING.sm,
        paddingVertical: 4,
        borderRadius: 12,
    },
    availabilityText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#FFF',
    },
    productInfo: {
        padding: SPACING.md,
    },
    productName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 4,
    },
    productDescription: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginBottom: SPACING.sm,
    },
    productMeta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    productPrice: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    productRating: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingText: {
        fontSize: 14,
        color: COLORS.text,
        marginLeft: 4,
    },
    productActions: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: COLORS.lightGray,
    },
    actionButton: {
        flex: 1,
        paddingVertical: SPACING.md,
        justifyContent: 'center',
        alignItems: 'center',
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
        paddingVertical: SPACING.xxl * 2,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
        marginTop: SPACING.md,
    },
    emptySubtext: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginTop: SPACING.xs,
    },
    fab: {
        position: 'absolute',
        right: SPACING.lg,
        bottom: SPACING.lg,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
});

export default RestaurantProductsScreen;
