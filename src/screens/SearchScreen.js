import React, { useState, useCallback } from 'react';
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
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../theme';
import { searchService } from '../services/searchService';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import SearchFilters from '../components/SearchFilters';
import CartHeaderButton from '../components/CartHeaderButton';
import { useCart } from '../context/CartContext';
import { showAlert } from '../utils';

const { width } = Dimensions.get('window');

const SearchScreen = ({ navigation }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: 'all',
    minPrice: undefined,
    maxPrice: undefined,
    minStars: undefined,
  });
  const { addToCart, getTotalQuantity } = useCart();

  // Cargar productos destacados al inicio
  React.useEffect(() => {
    loadTopProducts();
  }, []);

  // Función para cargar los mejores productos por calidad y precio
  const loadTopProducts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await searchService.getFeaturedProducts(20);
      setSearchResults(response.data || []);
    } catch (error) {
      console.error('Error cargando productos:', error);
      showAlert('Error', 'No se pudieron cargar los productos. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Función para realizar búsqueda con filtros
  const performSearch = useCallback(async (term = searchTerm, currentFilters = filters) => {
    if (!term.trim() && currentFilters.category === 'all' && 
        !currentFilters.minPrice && !currentFilters.maxPrice && !currentFilters.minStars) {
      // Si no hay búsqueda ni filtros, mostrar productos destacados
      loadTopProducts();
      return;
    }

    setLoading(true);
    try {
      const response = await searchService.advancedSearch(term, currentFilters);
      setSearchResults(response.data || []);
    } catch (error) {
      console.error('Error en búsqueda:', error);
      showAlert('Error', 'No se pudo realizar la búsqueda. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, filters, loadTopProducts]);

  // Función para manejar la búsqueda
  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
    performSearch(term, filters);
  }, [filters, performSearch]);

  // Función para manejar filtros
  const handleFiltersChange = useCallback((newFilters) => {
    setFilters(newFilters);
    performSearch(searchTerm, newFilters);
  }, [searchTerm, performSearch]);

  // Función para refrescar
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadTopProducts();
    setRefreshing(false);
  }, [loadTopProducts]);

  // Función para navegar al detalle del restaurante
  const handleProductPress = useCallback((product) => {
    if (product.restaurant && product.restaurant.id) {
      navigation.navigate('RestaurantDetail', { 
        restaurantId: product.restaurant.id,
        productId: product.id 
      });
    } else {
      showAlert('Error', 'Este producto no tiene restaurante asociado.');
    }
  }, [navigation]);

  // Función para agregar al carrito
  const handleAddToCart = useCallback((product) => {
    // Aquí puedes implementar la lógica para agregar al carrito
    console.log('Agregando al carrito:', product);
  }, []);

  // Renderizar header de resultados
  const renderResultsHeader = () => {
    const hasSearch = searchTerm.trim();
    const hasFilters = filters.category !== 'all' || filters.minPrice || filters.maxPrice || filters.minStars;
    
    return (
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsCount}>
          {loading ? 'Buscando...' : 
           hasSearch || hasFilters ? `${searchResults.length} resultados encontrados` : 
           'Los mejores productos por calidad y precio'}
        </Text>
        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => handleSearch(searchTerm)}
          disabled={!searchTerm.trim()}
        >
          <LinearGradient
            colors={[colors.primary, colors.primaryDark]}
            style={[styles.searchGradient, !searchTerm.trim() && styles.searchGradientDisabled]}
          >
            <Ionicons name="search" size={16} color={colors.white} />
            <Text style={styles.searchButtonText}>Buscar</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  };

  // Renderizar estado vacío
  const renderEmptyState = () => {
    if (loading) return null;

    if (!searchTerm.trim() && !filters.category !== 'all' && !filters.minPrice && !filters.maxPrice && !filters.minStars) {
      return (
        <View style={styles.emptyState}>
          <Ionicons name="restaurant" size={80} color={colors.lightGray} />
          <Text style={styles.emptyTitle}>Los mejores productos</Text>
          <Text style={styles.emptySubtitle}>
            Aquí encontrarás los productos con mejor calidad y precio
          </Text>
        </View>
      );
    }

    if (searchResults.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Ionicons name="search-outline" size={80} color={colors.lightGray} />
          <Text style={styles.emptyTitle}>No se encontraron resultados</Text>
          <Text style={styles.emptySubtitle}>
            Intenta con otros términos de búsqueda o ajusta los filtros
          </Text>
        </View>
      );
    }

    return null;
  };

  return (
    <View style={styles.container}>
      {/* Header con gradiente */}
      <LinearGradient
        colors={[colors.primary, colors.primaryDark]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Buscador Inteligente</Text>
          <View style={styles.headerActions}>
            <CartHeaderButton
              onPress={() => navigation.navigate('Carrito')}
              style={styles.cartButton}
            />
          </View>
        </View>
      </LinearGradient>

      {/* Barra de búsqueda */}
      <View style={styles.searchContainer}>
        <View style={styles.searchRow}>
          <View style={styles.searchBarContainer}>
            <SearchBar
              value={searchTerm}
              onChangeText={setSearchTerm}
              placeholder="Buscar hamburguesas, pizzas, pollo..."
              onSubmitEditing={() => handleSearch(searchTerm)}
              onSearch={() => handleSearch(searchTerm)}
            />
          </View>
          <TouchableOpacity
            style={styles.filtersButton}
            onPress={() => setShowFilters(!showFilters)}
          >
            <LinearGradient
              colors={[colors.primary, colors.primaryDark]}
              style={styles.filtersGradient}
            >
              <Ionicons name="filter" size={20} color={colors.white} />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>

      {/* Filtros expandibles */}
      {showFilters && (
        <View style={styles.filtersContainer}>
          <SearchFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
          />
        </View>
      )}

      {/* Lista de resultados */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.productList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        onScrollBeginDrag={Keyboard.dismiss}
      >
        {/* Header de resultados */}
        {renderResultsHeader()}
        
        {/* Estado vacío */}
        {renderEmptyState()}
        
        {/* Grid de productos */}
        <View style={{ paddingHorizontal: 10 }}>
          {(() => {
            const rows = [];
            for (let i = 0; i < searchResults.length; i += 2) {
              rows.push(
                <View
                  key={i}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: 16,
                    width: '100%',
                  }}
                >
                  <ProductCard
                    product={searchResults[i]}
                    onPress={() => handleProductPress(searchResults[i])}
                    onAddToCart={() => handleAddToCart(searchResults[i])}
                  />
                  {searchResults[i + 1] ? (
                    <ProductCard
                      product={searchResults[i + 1]}
                      onPress={() => handleProductPress(searchResults[i + 1])}
                      onAddToCart={() => handleAddToCart(searchResults[i + 1])}
                    />
                  ) : (
                    <View style={{ width: '50%' }} />
                  )}
                </View>
              );
            }
            return rows;
          })()}
        </View>
      </ScrollView>

      {/* Indicador de carga */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Buscando...</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    paddingTop: 50,
    paddingBottom: spacing.lg,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
  },
  backButton: {
    padding: spacing.sm,
  },
  headerTitle: {
    color: colors.white,
    fontSize: typography.sizes.xl,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  cartButton: {
    marginLeft: spacing.xs,
  },
  searchContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchBarContainer: {
    flex: 1,
  },
  filtersButton: {
    padding: spacing.sm,
  },
  filtersGradient: {
    padding: spacing.sm,
    borderRadius: 20,
  },
  filtersContainer: {
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
  },
  resultsCount: {
    fontSize: typography.sizes.md,
    fontWeight: '600',
    color: colors.darkGray,
    flex: 1,
  },
  searchButton: {
    marginLeft: spacing.md,
  },
  searchGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    gap: 6,
  },
  searchGradientDisabled: {
    opacity: 0.5,
  },
  searchButtonText: {
    color: colors.white,
    fontSize: typography.sizes.sm,
    fontWeight: '600',
  },
  productList: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  scrollView: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxl,
  },
  emptyTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: '700',
    color: colors.darkGray,
    textAlign: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    fontSize: typography.sizes.md,
    color: colors.gray,
    textAlign: 'center',
    lineHeight: 22,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: typography.sizes.md,
    fontWeight: '600',
    color: colors.darkGray,
    marginTop: spacing.md,
  },
});

export default SearchScreen; 