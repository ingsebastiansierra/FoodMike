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
import { colors, spacing, typography } from '../../../theme';
import { searchService } from '../../../services/searchService';
import ProductCard from '../../../components/ProductCard';
import CartHeaderButton from '../../../components/CartHeaderButton';
import { useCart } from '../../../context/CartContext';
import { showAlert } from '../../core/utils/alert';

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

  // Aplicar filtros cuando cambien las dependencias
  useEffect(() => {
    filterProducts();
  }, [filterProducts]);

  // Función para refrescar
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadInitialData().finally(() => setRefreshing(false));
  }, []);

  // Función para limpiar filtro
  const clearFilter = () => {
    setSelectedCategory('all');
    setSearchTerm('');
    setPriceRange({ min: '', max: '' });
    setMinStars(0);
    setShowFilters(false);
    Keyboard.dismiss();
  };

  // Función para navegar al detalle del producto
  const handleProductPress = (product) => {
    navigation.navigate('ProductDetail', {
      product: product,
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
        selectedCategory === item.id && styles.categoryButtonActive,
      ]}
      onPress={() => {
        setSelectedCategory(item.id);
        Keyboard.dismiss();
      }}
    >
      <Text style={[styles.categoryText, selectedCategory === item.id && styles.categoryTextActive]}>
        {item.name}
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
  const renderResultsHeader = () => (
    <View style={styles.resultsHeader}>
      <Text style={styles.resultsCount}>
        {searchResults.length} {searchResults.length === 1 ? 'resultado' : 'resultados'}
      </Text>
      {(selectedCategory !== 'all' || searchTerm || priceRange.min || priceRange.max || minStars > 0) && (
        <TouchableOpacity style={styles.clearFiltersButton} onPress={clearFilter}>
          <Text style={{ color: colors.primary, fontWeight: '600' }}>Limpiar filtros</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  // Renderizar estado vacío
  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="search-circle-outline" size={80} color={colors.gray} />
      <Text style={styles.emptyTitle}>No se encontraron resultados</Text>
      <Text style={styles.emptySubtitle}>
        Intenta ajustar tu búsqueda o filtros para encontrar lo que buscas.
      </Text>
      <TouchableOpacity 
        style={{marginTop: spacing.lg, padding: spacing.md, backgroundColor: colors.primary, borderRadius: 20}}
        onPress={clearFilter}
      >
        <Text style={{color: colors.white, fontWeight: 'bold'}}>Ver todos los productos</Text>
      </TouchableOpacity>
    </View>
  );

  // Renderizar input de búsqueda y botón de filtros
  const renderSearchInput = () => (
    <View style={styles.searchInputRow}>
      <View style={styles.searchInputContainer}>
        <Ionicons name="search" size={20} color={colors.gray} style={styles.searchIcon} />
        <TextInput
          ref={searchInputRef}
          style={styles.searchInput}
          placeholder="Buscar comida, bebida..."
          placeholderTextColor={colors.gray}
          value={searchTerm}
          onChangeText={setSearchTerm}
          returnKeyType="search"
          onSubmitEditing={() => Keyboard.dismiss()}
        />
        {searchTerm ? (
          <TouchableOpacity onPress={() => setSearchTerm('')} style={styles.clearButton}>
            <Ionicons name="close-circle" size={20} color={colors.gray} />
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity style={styles.filterButton} onPress={() => setShowFilters(!showFilters)}>
          <Ionicons name="options-outline" size={20} color={colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );

  // Renderizar filtros avanzados
  const renderFilters = () => (
    showFilters && (
      <View style={styles.filtersContainer}>
        {/* Filtro por precio */}
        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>Rango de Precio</Text>
          <View style={styles.priceInputs}>
            <TextInput
              style={styles.priceInput}
              placeholder="Mín"
              placeholderTextColor={colors.gray}
              keyboardType="numeric"
              value={priceRange.min}
              onChangeText={(text) => setPriceRange(prev => ({ ...prev, min: text }))}
            />
            <Text style={styles.priceSeparator}>-</Text>
            <TextInput
              style={styles.priceInput}
              placeholder="Máx"
              placeholderTextColor={colors.gray}
              keyboardType="numeric"
              value={priceRange.max}
              onChangeText={(text) => setPriceRange(prev => ({ ...prev, max: text }))}
            />
          </View>
        </View>

        {/* Filtro por calificación */}
        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>Calificación Mínima</Text>
          <View style={styles.ratingButtons}>
            {[1, 2, 3, 4, 5].map(star => (
              <TouchableOpacity
                key={star}
                style={[styles.ratingButton, minStars === star && styles.ratingButtonActive]}
                onPress={() => setMinStars(star === minStars ? 0 : star)}
              >
                <Text style={[styles.ratingButtonText, minStars === star && styles.ratingButtonTextActive]}>
                  {star}★+
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    )
  );

  return (
    <LinearGradient colors={[colors.primary, colors.secondary]} style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Descubrir</Text>
        <CartHeaderButton navigation={navigation} />
      </View>

      {renderSearchInput()}
      {renderFilters()}

      {/* Categorías */}
      <View style={styles.categoriesSection}>
        <FlatList
          horizontal
          data={[{ id: 'all', name: 'Todo' }, ...categories]}
          renderItem={renderCategory}
          keyExtractor={item => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      {/* Resultados */}
      {loading ? (
        <ActivityIndicator size="large" color={colors.white} style={{ flex: 1 }} />
      ) : (
        <FlatList
          data={searchResults}
          renderItem={renderProduct}
          keyExtractor={item => item.id}
          numColumns={2}
          contentContainerStyle={styles.productList}
          columnWrapperStyle={styles.productRow}
          ListHeaderComponent={renderResultsHeader}
          ListEmptyComponent={renderEmptyState}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={colors.white}
            />
          }
        />
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: StatusBar.currentHeight || 40,
    paddingBottom: spacing.md,
  },
  headerTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: 'bold',
    color: colors.white,
  },
  categoriesSection: {
    marginBottom: spacing.md,
  },
  categoriesList: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  categoryButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    marginRight: spacing.md,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
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
