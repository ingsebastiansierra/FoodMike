import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    RefreshControl,
    Keyboard,
    TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../../theme';
import { searchService } from '../../../services/searchService';
import ProductCard from '../../../components/ProductCard';
import { useCart } from '../../../context/CartContext';
import { showAlert } from '../../core/utils/alert';
import { useFavorites } from '../../../hooks/useFavorites';
import AppHeader from '../../../components/AppHeader';

const SearchScreenNew = ({ navigation }) => {
    const [allProducts, setAllProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchText, setSearchText] = useState('');

    const { addToCart } = useCart();
    const { isFavorite, toggleFavorite } = useFavorites();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [categoriesRes, productsRes] = await Promise.all([
                searchService.getCategories(),
                searchService.getAllProducts(1000),
            ]);
            setCategories(categoriesRes.data || []);
            setAllProducts(productsRes.data || []);
        } catch (error) {
            console.error('Error:', error);
            showAlert('Error', 'No se pudieron cargar los datos');
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await loadData();
        setRefreshing(false);
    };

    // Filtrar productos
    const getFilteredProducts = () => {
        let filtered = allProducts;

        // Filtrar por categoría
        if (selectedCategory !== 'all') {
            const cat = categories.find(c => c.id === selectedCategory);
            if (cat) {
                filtered = filtered.filter(p =>
                    p.category &&
                    typeof p.category === 'string' &&
                    p.category.toLowerCase().includes(cat.name.toLowerCase())
                );
            }
        }

        // Filtrar por búsqueda
        if (searchText.trim()) {
            const search = searchText.toLowerCase();
            filtered = filtered.filter(p =>
                (p.name && p.name.toLowerCase().includes(search)) ||
                (p.description && p.description.toLowerCase().includes(search)) ||
                (p.category && p.category.toLowerCase().includes(search))
            );
        }

        return filtered;
    };

    const filteredProducts = getFilteredProducts();

    const handleProductPress = (product) => {
        navigation.navigate('ProductDetail', { product });
    };

    const handleAddToCart = (product) => {
        addToCart(product);
        showAlert('Éxito', `${product.name} agregado al carrito`);
    };

    const clearFilters = () => {
        setSelectedCategory('all');
        setSearchText('');
        Keyboard.dismiss();
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <AppHeader screenName="SEARCH" navigation={navigation} showCart={false} />
                <View style={styles.loadingContainer}>
                    <Text>Cargando...</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <AppHeader screenName="SEARCH" navigation={navigation} showCart={false} />

            {/* Input de búsqueda */}
            <View style={styles.searchBox}>
                <Ionicons name="search" size={20} color={colors.gray} />
                <TextInput
                    style={styles.input}
                    placeholder="Buscar comida..."
                    placeholderTextColor={colors.gray}
                    value={searchText}
                    onChangeText={(text) => setSearchText(text)}
                    returnKeyType="search"
                    onSubmitEditing={() => Keyboard.dismiss()}
                    autoCorrect={false}
                    autoCapitalize="none"
                />
                {searchText.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchText('')}>
                        <Ionicons name="close-circle" size={20} color={colors.gray} />
                    </TouchableOpacity>
                )}
            </View>

            {/* Categorías */}
            <View style={styles.categoriesContainer}>
                <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={[{ id: 'all', name: 'Todo' }, ...categories]}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[
                                styles.categoryChip,
                                selectedCategory === item.id && styles.categoryChipActive
                            ]}
                            onPress={() => setSelectedCategory(item.id)}
                        >
                            <Text style={[
                                styles.categoryText,
                                selectedCategory === item.id && styles.categoryTextActive
                            ]}>
                                {item.name}
                            </Text>
                        </TouchableOpacity>
                    )}
                />
            </View>

            {/* Resultados */}
            <View style={styles.resultsHeader}>
                <Text style={styles.resultsText}>
                    {filteredProducts.length} resultado{filteredProducts.length !== 1 ? 's' : ''}
                </Text>
                {(selectedCategory !== 'all' || searchText) && (
                    <TouchableOpacity onPress={clearFilters}>
                        <Text style={styles.clearText}>Limpiar</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Lista de productos */}
            <FlatList
                data={filteredProducts}
                numColumns={2}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.productsList}
                columnWrapperStyle={styles.productsRow}
                renderItem={({ item }) => (
                    <View style={styles.productWrapper}>
                        <ProductCard
                            product={item}
                            onPress={() => handleProductPress(item)}
                            onAddToCart={() => handleAddToCart(item)}
                            isFavorite={isFavorite(item.id)}
                            onToggleFavorite={async (productId) => {
                                const result = await toggleFavorite(productId);
                                if (result.success) {
                                    showAlert('', result.message);
                                }
                            }}
                        />
                    </View>
                )}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="search-outline" size={60} color={colors.gray} />
                        <Text style={styles.emptyText}>No se encontraron productos</Text>
                        <TouchableOpacity style={styles.emptyButton} onPress={clearFilters}>
                            <Text style={styles.emptyButtonText}>Ver todos</Text>
                        </TouchableOpacity>
                    </View>
                }
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        tintColor={colors.primary}
                    />
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        marginHorizontal: spacing.lg,
        marginVertical: spacing.md,
        paddingHorizontal: spacing.md,
        borderRadius: 12,
        height: 50,
    },
    input: {
        flex: 1,
        marginLeft: spacing.sm,
        fontSize: 16,
        color: colors.darkGray,
    },
    categoriesContainer: {
        marginBottom: spacing.md,
    },
    categoryChip: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#F5F5F5',
        borderRadius: 20,
        marginLeft: spacing.lg,
    },
    categoryChipActive: {
        backgroundColor: colors.primary,
    },
    categoryText: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.gray,
    },
    categoryTextActive: {
        color: colors.white,
    },
    resultsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    resultsText: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.darkGray,
    },
    clearText: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.primary,
    },
    productsList: {
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.xl,
    },
    productsRow: {
        justifyContent: 'space-between',
    },
    productWrapper: {
        width: '47%',
        marginTop: spacing.md,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing.xl * 2,
    },
    emptyText: {
        fontSize: 16,
        color: colors.gray,
        marginTop: spacing.md,
        marginBottom: spacing.lg,
    },
    emptyButton: {
        backgroundColor: colors.primary,
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.md,
        borderRadius: 20,
    },
    emptyButtonText: {
        color: colors.white,
        fontWeight: '600',
    },
});

export default SearchScreenNew;
