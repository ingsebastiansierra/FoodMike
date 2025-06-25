import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Keyboard,
  Dimensions,
  StatusBar,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../theme';
import { searchService } from '../services/searchService';
import ProductCard from '../components/ProductCard';
import CartHeaderButton from '../components/CartHeaderButton';
import { useCart } from '../context/CartContext';
import { showAlert } from '../utils';

const { width, height } = Dimensions.get('window');

const SearchScreen = ({ navigation }) => {
  // Estados principales
  const [searchResults, setSearchResults] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Estados de filtros
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const searchInputRef = useRef(null);
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [minStars, setMinStars] = useState(0);
  
  const { addToCart } = useCart();

  // Cargar datos iniciales
  useEffect(() => {
    loadInitialData();
  }, []);

  // Cargar todos los datos necesarios
  const loadInitialData = async () => {
    setLoading(true);
    try {
      // Cargar categorías y productos en paralelo
      const [categoriesResponse, productsResponse] = await Promise.all([
        searchService.getCategories(),
        searchService.getAllProducts(1000)
      ]);

      setCategories(categoriesResponse.data || []);
      setAllProducts(productsResponse.data || []);
      setSearchResults(productsResponse.data || []);
    } catch (error) {
      console.error('Error cargando datos iniciales:', error);
      showAlert('Error', 'No se pudieron cargar los datos. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  // Función de filtrado por categoría, búsqueda y filtros avanzados
  const filterProducts = useCallback(() => {
    let filtered = [...allProducts];

    // Filtro por categoría seleccionada
    if (selectedCategory !== 'all') {
      const selectedCat = categories.find(cat => cat.id === selectedCategory);
      if (selectedCat) {
        filtered = filtered.filter(product =>
          product.category?.toLowerCase().includes(selectedCat.name.toLowerCase())
        );
      }
    }

    // Filtro por término de búsqueda (nombre, descripción, categoría)
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(product =>
        (product.name && product.name.toLowerCase().includes(searchLower)) ||
        (product.description && product.description.toLowerCase().includes(searchLower)) ||
        (product.category && product.category.toLowerCase().includes(searchLower))
      );
    }

    // Filtro por precio mínimo
    if (priceRange.min) {
      const minPrice = parseFloat(priceRange.min);
      if (!isNaN(minPrice)) {
        filtered = filtered.filter(product => product.price >= minPrice);
      }
    }
    // Filtro por precio máximo
    if (priceRange.max) {
      const maxPrice = parseFloat(priceRange.max);
      if (!isNaN(maxPrice)) {
        filtered = filtered.filter(product => product.price <= maxPrice);
      }
    }
    // Filtro por estrellas mínimas
    if (minStars > 0) {
      filtered = filtered.filter(product => product.stars >= minStars);
    }

    setSearchResults(filtered);
  }, [searchTerm, selectedCategory, allProducts, categories, priceRange, minStars]);

  // Ejecutar filtrado cuando cambie búsqueda o categoría
  useEffect(() => {
    filterProducts();
  }, [filterProducts]);

  // Función para refrescar
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadInitialData();
    setRefreshing(false);
  };

  // Función para limpiar filtro
  const clearFilter = () => {
    setSelectedCategory('all');
  };

  // Función para navegar al detalle del producto
  const handleProductPress = (product) => {
    navigation.navigate('ProductDetail', { 
      product
    });
  };

  // Función para agregar al carrito
  const handleAddToCart = (product) => {
    addToCart(product);
    showAlert('Éxito', `${product.name} agregado al carrito`);
  };

  // Renderizar categoría
  const renderCategory = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryButton,
        selectedCategory === item.id && styles.categoryButtonActive
      ]}
      onPress={() => setSelectedCategory(item.id)}
    >
      <Text style={[
        styles.categoryText,
        selectedCategory === item.id && styles.categoryTextActive
      ]}>
        {item.icon} {item.name}
      </Text>
    </TouchableOpacity>
  );

  // Renderizar producto
  const renderProduct = ({ item }) => (
    <ProductCard
      product={item}
      onPress={() => handleProductPress(item)}
      onAddToCart={() => handleAddToCart(item)}
    />
  );

  // Renderizar header de resultados
  const renderResultsHeader = () => {
    const hasFilter = selectedCategory !== 'all';
    
    return (
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsCount}>
          {hasFilter 
            ? `${searchResults.length} productos en ${categories.find(cat => cat.id === selectedCategory)?.name || 'categoría'}` 
            : `${searchResults.length} productos disponibles`}
        </Text>
        {hasFilter && (
          <TouchableOpacity onPress={clearFilter} style={styles.clearFiltersButton}>
            <Ionicons name="close-circle" size={20} color={colors.primary} />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  // Renderizar estado vacío
  const renderEmptyState = () => {
    if (loading) return null;

    if (searchResults.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Ionicons 
            name={selectedCategory !== 'all' ? "restaurant-outline" : "restaurant"} 
            size={80} 
            color={colors.lightGray} 
          />
          <Text style={styles.emptyTitle}>
            {selectedCategory !== 'all' 
              ? 'No hay productos en esta categoría' 
              : 'No hay productos disponibles'}
          </Text>
          <Text style={styles.emptySubtitle}>
            {selectedCategory !== 'all'
              ? 'Prueba seleccionando otra categoría'
              : 'Prueba recargando la página'
            }
          </Text>
        </View>
      );
    }

    return null;
  };

  // Renderizar input de búsqueda y botón de filtros
  const renderSearchInput = () => (
    <View style={styles.searchInputRow}>
      <View style={styles.searchInputContainer}>
        <Ionicons name="search" size={20} color={colors.gray} style={styles.searchIcon} />
        <TextInput
          ref={searchInputRef}
          style={styles.searchInput}
          placeholder="Buscar por nombre, descripción o categoría..."
          placeholderTextColor={colors.gray}
          value={searchTerm}
          onChangeText={setSearchTerm}
          returnKeyType="search"
          autoCorrect={false}
          autoCapitalize="none"
        />
        {searchTerm.length > 0 && (
          <TouchableOpacity onPress={() => setSearchTerm('')} style={styles.clearButton}>
            <Ionicons name="close-circle" size={20} color={colors.gray} />
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => setShowFilters(!showFilters)}
        activeOpacity={0.8}
      >
        <Ionicons name="filter" size={20} color={colors.white} />
        <Text style={styles.filterButtonText}>Filtros</Text>
      </TouchableOpacity>
    </View>
  );

  // Renderizar filtros avanzados
  const renderFilters = () => (
    <View style={styles.filtersContainer}>
      <View style={styles.filterSection}>
        <Text style={styles.filterLabel}>Precio</Text>
        <View style={styles.priceInputs}>
          <TextInput
            style={styles.priceInput}
            placeholder="Mínimo"
            keyboardType="numeric"
            value={priceRange.min}
            onChangeText={text => setPriceRange(prev => ({ ...prev, min: text }))}
          />
          <Text style={styles.priceSeparator}>-</Text>
          <TextInput
            style={styles.priceInput}
            placeholder="Máximo"
            keyboardType="numeric"
            value={priceRange.max}
            onChangeText={text => setPriceRange(prev => ({ ...prev, max: text }))}
          />
        </View>
      </View>
      <View style={styles.filterSection}>
        <Text style={styles.filterLabel}>Estrellas mínimas</Text>
        <View style={styles.ratingButtons}>
          {[0, 3, 4, 4.5, 5].map((rating) => (
            <TouchableOpacity
              key={rating}
              style={[styles.ratingButton, minStars === rating && styles.ratingButtonActive]}
              onPress={() => setMinStars(rating)}
            >
              <Text style={[styles.ratingButtonText, minStars === rating && styles.ratingButtonTextActive]}>
                {rating === 0 ? 'Todas' : `${rating}+`}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Cargando productos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      {/* Espacio para el header principal */}
      <View style={{ height: 20 }} />
      {renderSearchInput()}
      {showFilters && renderFilters()}
      {/* Categorías */}
      <View style={styles.categoriesSection}>
        <FlatList
          data={[{ id: 'all', name: 'Todas', icon: '🍽️' }, ...categories]}
          renderItem={renderCategory}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      {/* Lista de productos */}
      <FlatList
        data={searchResults}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.productRow}
        contentContainerStyle={styles.productList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
          />
        }
        ListHeaderComponent={renderResultsHeader}
        ListEmptyComponent={renderEmptyState}
        onScrollBeginDrag={() => Keyboard.dismiss()}
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
    backgroundColor: colors.white,
  },
  loadingText: {
    fontSize: typography.sizes.lg,
    color: colors.gray,
    marginTop: spacing.md,
  },
  header: {
    paddingTop: StatusBar.currentHeight || 44,
    paddingBottom: spacing.lg,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  backButton: {
    padding: spacing.sm,
    marginRight: spacing.sm,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: 'bold',
    color: colors.white,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartButton: {
    marginLeft: spacing.sm,
  },
  categoriesSection: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  categoriesList: {
    paddingHorizontal: spacing.lg,
  },
  categoryButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    marginRight: spacing.md,
    borderRadius: 20,
    backgroundColor: colors.lightGray,
  },
  categoryButtonActive: {
    backgroundColor: colors.primary,
  },
  categoryText: {
    fontSize: typography.sizes.sm,
    color: colors.darkGray,
    fontWeight: '600',
  },
  categoryTextActive: {
    color: colors.white,
  },
  productList: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  productRow: {
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  resultsCount: {
    fontSize: typography.sizes.md,
    fontWeight: '600',
    color: colors.darkGray,
  },
  clearFiltersButton: {
    padding: spacing.sm,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl * 2,
  },
  emptyTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: 'bold',
    color: colors.darkGray,
    marginTop: spacing.lg,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: typography.sizes.md,
    color: colors.gray,
    marginTop: spacing.sm,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 25,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: typography.sizes.md,
    color: colors.darkGray,
  },
  clearButton: {
    marginLeft: 8,
  },
  searchInputRow: {
    flexDirection: 'column',
    alignItems: 'center',
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 20,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    marginLeft: spacing.sm,
    elevation: 2,
  },
  filterButtonText: {
    color: colors.white,
    fontWeight: 'bold',
    marginLeft: 6,
    fontSize: typography.sizes.md,
  },
  filtersContainer: {
    backgroundColor: colors.white,
    borderRadius: 16,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    padding: spacing.lg,
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  filterSection: {
    marginBottom: spacing.lg,
  },
  filterLabel: {
    fontSize: typography.sizes.md,
    fontWeight: '600',
    color: colors.darkGray,
    marginBottom: spacing.sm,
  },
  priceInputs: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: typography.sizes.md,
    color: colors.darkGray,
    backgroundColor: colors.white,
  },
  priceSeparator: {
    marginHorizontal: spacing.md,
    fontSize: typography.sizes.lg,
    color: colors.gray,
  },
  ratingButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  ratingButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 15,
    backgroundColor: colors.lightGray,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  ratingButtonActive: {
    backgroundColor: colors.primary,
  },
  ratingButtonText: {
    fontSize: typography.sizes.sm,
    color: colors.darkGray,
    fontWeight: '600',
  },
  ratingButtonTextActive: {
    color: colors.white,
  },
});

export default SearchScreen; 