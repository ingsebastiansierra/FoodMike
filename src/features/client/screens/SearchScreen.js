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
import {
  SkeletonProductList,
  SkeletonBase,
  SkeletonSimpleList
} from '../../../components/skeletons';
import LoadingWrapper from '../../../components/LoadingWrapper';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../../theme';
import { searchService } from '../../../services/searchService';
import ProductCard from '../../../components/ProductCard';
import { useCart } from '../../../context/CartContext';
import { showAlert } from '../../core/utils/alert';
import { useAutoCloseCart } from '../../../hooks/useAutoCloseCart';
import ModalWrapper from '../../../components/ModalWrapper';

const { width, height } = Dimensions.get('window');

// Función para formatear el número a pesos colombianos
const formatCOP = (number) => {
  if (number === '' || number === null || isNaN(number)) {
    return '';
  }
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number);
};

// Función para limpiar el formato del texto y obtener un número
const cleanNumber = (text) => {
  const cleanedText = text.replace(/[^0-9]/g, '');
  const number = parseInt(cleanedText, 10);
  return isNaN(number) ? '' : number;
};

const SearchScreen = ({ navigation }) => {
  const [searchResults, setSearchResults] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const searchInputRef = useRef(null);
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [minStars, setMinStars] = useState(0);

  const { addToCart } = useCart();

  // Auto-close cart when this screen gains focus
  useAutoCloseCart();

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [categoriesResponse, productsResponse] = await Promise.all([
        searchService.getCategories(),
        searchService.getAllProducts(1000),
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

  const filterProducts = useCallback(() => {
    let filtered = [...allProducts];

    if (selectedCategory !== 'all') {
      const selectedCat = categories.find((cat) => cat.id === selectedCategory);
      if (selectedCat) {
        filtered = filtered.filter((product) => {
          if (!product.category) {
            return false;
          }

          // Asegurarse de que la categoría sea un string
          if (typeof product.category !== 'string') {
            return false;
          }

          const matches = product.category.toLowerCase().includes(selectedCat.name.toLowerCase());
          return matches;
        });
      }
    }

    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          (product.name && product.name.toLowerCase().includes(searchLower)) ||
          (product.description && product.description.toLowerCase().includes(searchLower)) ||
          (product.category && product.category.toLowerCase().includes(searchLower))
      );
    }

    if (priceRange.min) {
      const minPrice = parseFloat(priceRange.min);
      if (!isNaN(minPrice)) {
        filtered = filtered.filter((product) => product.price >= minPrice);
      }
    }
    if (priceRange.max) {
      const maxPrice = parseFloat(priceRange.max);
      if (!isNaN(maxPrice)) {
        filtered = filtered.filter((product) => product.price <= maxPrice);
      }
    }
    if (minStars > 0) {
      filtered = filtered.filter((product) => product.stars >= minStars);
    }

    setSearchResults(filtered);
  }, [searchTerm, selectedCategory, allProducts, categories, priceRange, minStars]);

  useEffect(() => {
    filterProducts();
  }, [filterProducts]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadInitialData().finally(() => setRefreshing(false));
  }, []);

  const clearFilter = () => {
    setSelectedCategory('all');
    setSearchTerm('');
    setPriceRange({ min: '', max: '' });
    setMinStars(0);
    setShowFilters(false);
    Keyboard.dismiss();
  };

  const handleProductPress = (product) => {
    navigation.navigate('ProductDetail', { product: product });
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    showAlert('Éxito', `${product.name} agregado al carrito`);
  };

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

  const renderProduct = ({ item }) => (
    <ProductCard
      product={item}
      onPress={() => handleProductPress(item)}
      onAddToCart={() => handleAddToCart(item)}
    />
  );

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

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="search-circle-outline" size={80} color={colors.gray} />
      <Text style={styles.emptyTitle}>No se encontraron resultados</Text>
      <Text style={styles.emptySubtitle}>
        Intenta ajustar tu búsqueda o filtros para encontrar lo que buscas.
      </Text>
      <TouchableOpacity
        style={{
          marginTop: spacing.lg,
          padding: spacing.md,
          backgroundColor: colors.primary,
          borderRadius: 20,
        }}
        onPress={clearFilter}
      >
        <Text style={{ color: colors.white, fontWeight: 'bold' }}>Ver todos los productos</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <LoadingWrapper
          isLoading={loading}
          skeletonType="search"
        >
          {/* Contenido vacío, el skeleton se encarga de todo */}
        </LoadingWrapper>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.searchAndFilterContainer}>
        <View style={styles.searchInputWrapper}>
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
        </View>
        <TouchableOpacity style={styles.filterButton} onPress={() => setShowFilters(!showFilters)}>
          <Ionicons name="options-outline" size={20} color={colors.white} />
        </TouchableOpacity>
      </View>

      <View style={styles.categoriesSection}>
        <FlatList
          horizontal
          data={[{ id: 'all', name: 'Todo' }, ...categories]}
          renderItem={renderCategory}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      <FlatList
        data={searchResults}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.productList}
        columnWrapperStyle={styles.productRow}
        ListHeaderComponent={renderResultsHeader}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={colors.primary} />
        }
      />

      {/* Uso correcto del componente ModalWrapper */}
      <ModalWrapper isVisible={showFilters} onClose={() => setShowFilters(false)}>
        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>Rango de Precio</Text>
          <View style={styles.priceInputs}>
            <TextInput
              style={styles.priceInput}
              placeholder="Mín"
              placeholderTextColor={colors.gray}
              keyboardType="numeric"
              value={priceRange.min !== '' ? formatCOP(priceRange.min) : ''}
              onChangeText={(text) => setPriceRange((prev) => ({ ...prev, min: cleanNumber(text) }))}
            />
            <Text style={styles.priceSeparator}>-</Text>
            <TextInput
              style={styles.priceInput}
              placeholder="Máx"
              placeholderTextColor={colors.gray}
              keyboardType="numeric"
              value={priceRange.max !== '' ? formatCOP(priceRange.max) : ''}
              onChangeText={(text) => setPriceRange((prev) => ({ ...prev, max: cleanNumber(text) }))}
            />
          </View>
        </View>

        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>Calificación Mínima</Text>
          <View style={styles.ratingButtons}>
            {[1, 2, 3, 4, 5].map((star) => (
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
      </ModalWrapper>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  searchAndFilterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 25,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
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
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: spacing.sm,
    marginLeft: spacing.sm,
    elevation: 2,
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
    backgroundColor: '#f0f0f0',
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