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
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../theme';
import { searchService } from '../../services/searchService';
import ProductCard from '../../components/ProductCard';
import RestaurantCard from '../../components/RestaurantCard';
import { useCart } from '../../context/CartContext';
import { showAlert } from '../../features/core/utils/alert';
import { useFavorites } from '../../hooks/useFavorites';
import AppHeader from '../../components/AppHeader';
import ScrollToTopButton from '../../components/ScrollToTopButton';

const SearchScreen = ({ navigation }) => {
  const [allProducts, setAllProducts] = useState([]);
  const [allRestaurants, setAllRestaurants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeTab, setActiveTab] = useState('dishes'); // 'restaurants' o 'dishes'
  const [selectedFilter, setSelectedFilter] = useState(null);

  const flatListRef = useRef(null);
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();

  const filters = [
    { id: 'nearest', label: 'Más cercano', icon: 'location' },
    { id: 'offers', label: 'Ofertas', icon: 'pricetag' },
    { id: 'rating', label: 'Rating 4.0+', icon: 'star' },
    { id: 'fastest', label: 'Más rápido', icon: 'time' },
  ];

  // Función para obtener emoji según el nombre de la categoría
  const getCategoryEmoji = (categoryName) => {
    const name = categoryName.toLowerCase();
    const emojiMap = {
      'hamburguesa': '🍔',
      'burger': '🍔',
      'pizza': '🍕',
      'pollo': '🍗',
      'chicken': '🍗',
      'sushi': '🍣',
      'taco': '🌮',
      'tacos': '🌮',
      'bebida': '🥤',
      'bebidas': '🥤',
      'postre': '🍰',
      'postres': '🍰',
      'ensalada': '🥗',
      'ensaladas': '🥗',
      'pasta': '🍝',
      'sandwich': '🥪',
      'hot dog': '🌭',
      'helado': '🍦',
      'café': '☕',
      'desayuno': '🍳',
      'carne': '🥩',
      'pescado': '🐟',
      'mariscos': '🦐',
      'vegetariano': '🥬',
      'vegano': '🌱',
      'mexicano': '🌮',
      'italiano': '🍝',
      'japonés': '🍱',
      'chino': '🥡',
      'árabe': '🥙',
      'perro': '🌭',
      'empanada': '🥟',
      'arepa': '🫓',
      'wrap': '🌯',
      'burrito': '🌯',
    };

    for (const [key, emoji] of Object.entries(emojiMap)) {
      if (name.includes(key)) {
        return emoji;
      }
    }

    return '🍽️'; // Emoji por defecto
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const restaurantsService = require('../../services/restaurantsService').default;

      const [categoriesRes, productsRes, restaurantsRes] = await Promise.all([
        searchService.getCategories(),
        searchService.getAllProducts(1000),
        restaurantsService.getOpen(),
      ]);
      const loadedCategories = categoriesRes.data || [];
      console.log('Categorías cargadas:', loadedCategories.length);

      // Si no hay categorías, usar categorías por defecto
      if (loadedCategories.length === 0) {
        const defaultCategories = [
          { id: 'burger', name: 'Hamburguesa' },
          { id: 'pizza', name: 'Pizza' },
          { id: 'chicken', name: 'Pollo' },
          { id: 'sushi', name: 'Sushi' },
          { id: 'tacos', name: 'Tacos' },
          { id: 'bebidas', name: 'Bebidas' },
          { id: 'postres', name: 'Postres' },
          { id: 'ensaladas', name: 'Ensaladas' },
        ];
        setCategories(defaultCategories);
      } else {
        setCategories(loadedCategories);
      }

      setAllProducts(productsRes.data || []);
      setAllRestaurants(restaurantsRes.data || []);
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

  // Filtrar productos usando useMemo sería ideal, pero para evitar problemas usamos una función
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

  // Filtrar restaurantes
  const getFilteredRestaurants = () => {
    let filtered = allRestaurants;

    // Filtrar por búsqueda
    if (searchText.trim()) {
      const search = searchText.toLowerCase();
      filtered = filtered.filter(r =>
        (r.name && r.name.toLowerCase().includes(search)) ||
        (r.description && r.description.toLowerCase().includes(search)) ||
        (r.address && r.address.toLowerCase().includes(search))
      );
    }

    return filtered;
  };

  const filteredRestaurants = getFilteredRestaurants();

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

  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setShowScrollTop(offsetY > 200);
  };

  const scrollToTop = () => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>Cargando...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Contenedor con blur */}
      <BlurView intensity={30} tint="light" style={styles.blurContainer}>
        {/* Input de búsqueda - FUERA del FlatList */}
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

        {/* Tabs: Restaurantes / Platos */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'restaurants' && styles.tabActive]}
            onPress={() => setActiveTab('restaurants')}
          >
            <Text style={[styles.tabText, activeTab === 'restaurants' && styles.tabTextActive]}>
              Restaurantes
            </Text>
            {activeTab === 'restaurants' && <View style={styles.tabIndicator} />}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'dishes' && styles.tabActive]}
            onPress={() => setActiveTab('dishes')}
          >
            <Text style={[styles.tabText, activeTab === 'dishes' && styles.tabTextActive]}>
              Platos
            </Text>
            {activeTab === 'dishes' && <View style={styles.tabIndicator} />}
          </TouchableOpacity>
        </View>

        {/* Filtros horizontales */}
        <View style={styles.filtersContainer}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={filters}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.filterChip,
                  selectedFilter === item.id && styles.filterChipActive
                ]}
                onPress={() => setSelectedFilter(selectedFilter === item.id ? null : item.id)}
              >
                <Ionicons
                  name={item.icon}
                  size={14}
                  color={selectedFilter === item.id ? colors.white : colors.gray}
                />
                <Text style={[
                  styles.filterText,
                  selectedFilter === item.id && styles.filterTextActive
                ]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Categorías con imágenes */}
        <View style={styles.categoriesWithImagesContainer}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: spacing.md }}
            data={[
              { id: 'all', name: 'Todo', emoji: '🍽️' },
              ...categories.map(cat => ({
                id: cat.id,
                name: cat.name,
                emoji: getCategoryEmoji(cat.name)
              }))
            ]}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.categoryImageItem}
                onPress={() => setSelectedCategory(item.id)}
              >
                <View style={[
                  styles.categoryImageCircle,
                  selectedCategory === item.id && styles.categoryImageCircleActive
                ]}>
                  <Text style={styles.categoryEmoji}>{item.emoji}</Text>
                </View>
                <Text style={[
                  styles.categoryImageText,
                  selectedCategory === item.id && styles.categoryImageTextActive
                ]}>
                  {item.name}
                </Text>
                {selectedCategory === item.id && (
                  <View style={styles.categoryImageIndicator} />
                )}
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Texto de resultados */}
        {searchText && (
          <View style={styles.showingResultsContainer}>
            <Text style={styles.showingResultsText}>
              Mostrando resultados para '<Text style={styles.searchTermText}>{searchText}</Text>'
            </Text>
          </View>
        )}

        {/* Resultados - FUERA del FlatList */}
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
      </BlurView>

      {/* Lista de productos o restaurantes según el tab activo */}
      {activeTab === 'dishes' ? (
        <FlatList
          key="products-list"
          ref={flatListRef}
          data={filteredProducts}
          numColumns={2}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.productsList}
          columnWrapperStyle={styles.productsRow}
          onScroll={handleScroll}
          scrollEventThrottle={16}
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
      ) : (
        <FlatList
          key="restaurants-list"
          ref={flatListRef}
          data={filteredRestaurants}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.restaurantsList}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          renderItem={({ item }) => (
            <RestaurantCard
              restaurant={item}
              onPress={() => navigation.navigate('RestaurantDetail', { restaurant: item })}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="restaurant-outline" size={60} color={colors.gray} />
              <Text style={styles.emptyText}>No se encontraron restaurantes</Text>
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
      )}

      {/* Botón flotante Volver arriba - sobre los productos */}
      <View style={styles.floatingButtonContainer}>
        <ScrollToTopButton visible={showScrollTop} onPress={scrollToTop} />
      </View>
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
  blurContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingTop: 40,
    paddingBottom: spacing.xs,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 245, 245, 0.5)',
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 12,
    height: 44,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  input: {
    flex: 1,
    marginLeft: spacing.sm,
    fontSize: 16,
    color: colors.darkGray,
  },

  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
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
    paddingHorizontal: spacing.md,
    paddingBottom: 200,
  },
  restaurantsList: {
    paddingHorizontal: spacing.md,
    paddingBottom: 200,
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
  floatingButtonContainer: {
    position: 'absolute',
    top: 260,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1000,
    pointerEvents: 'box-none',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    marginTop: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.xs,
    alignItems: 'center',
    position: 'relative',
  },
  tabActive: {
    // El indicador se maneja por separado
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.gray,
  },
  tabTextActive: {
    color: colors.primary,
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  filtersContainer: {
    marginTop: spacing.xs,
    marginBottom: spacing.xs,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 5,
    backgroundColor: 'rgba(245, 245, 245, 0.7)',
    borderRadius: 14,
    marginLeft: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.gray,
    marginLeft: 4,
  },
  filterTextActive: {
    color: colors.white,
  },
  showingResultsContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  showingResultsText: {
    fontSize: 14,
    color: colors.darkGray,
  },
  searchTermText: {
    fontWeight: 'bold',
    color: colors.primary,
  },
  categoriesWithImagesContainer: {
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
    minHeight: 90,
    backgroundColor: '#FFF',
    paddingVertical: spacing.xs,
  },
  categoryImageItem: {
    alignItems: 'center',
    marginLeft: spacing.sm,
    position: 'relative',
  },
  categoryImageCircle: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  categoryImageCircleActive: {
    borderColor: colors.primary,
    backgroundColor: '#FFF',
  },
  categoryEmoji: {
    fontSize: 24,
  },
  categoryImageText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.gray,
    textAlign: 'center',
  },
  categoryImageTextActive: {
    color: colors.primary,
  },
  categoryImageIndicator: {
    position: 'absolute',
    bottom: -8,
    left: '50%',
    marginLeft: -15,
    width: 30,
    height: 3,
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
});

export default SearchScreen;
