import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../../theme';
import ProductCard from '../../../components/ProductCard';
import { searchService } from '../../../services/searchService';
import { useCart } from '../../../context/CartContext';
import { showAlert } from '../../core/utils/alert';

const { width } = Dimensions.get('window');

const RestaurantDetailScreen = ({ route, navigation }) => {
  const { restaurant } = route.params;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { addToCart, getTotalQuantity } = useCart();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      // Obtener todos los productos y filtrar por restaurante
      const response = await searchService.getAllProducts(1000);
      const allProducts = response.data || [];
      const restaurantProducts = allProducts.filter(
        p => p.restaurant?.id === restaurant.id
      );
      setProducts(restaurantProducts);
      // Extraer categorías únicas de los productos de este restaurante
      const uniqueCategories = [
        ...new Set(restaurantProducts.map(p => p.category).filter(Boolean))
      ];
      setCategories(uniqueCategories);
    } catch (error) {
      setProducts([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar productos por categoría seleccionada
  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.category === selectedCategory);

  // Renderizar categoría en el carrusel
  const renderCategory = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryButton,
        selectedCategory === item && styles.categoryButtonActive
      ]}
      onPress={() => setSelectedCategory(item)}
    >
      <Text style={[
        styles.categoryText,
        selectedCategory === item && styles.categoryTextActive
      ]}>{item}</Text>
    </TouchableOpacity>
  );

  // Renderizar producto
  const renderProduct = ({ item }) => (
    <ProductCard
      product={item}
      onPress={() => navigation.navigate('ProductDetail', { product: item })}
      onAddToCart={() => {
        addToCart(item);
        showAlert('Éxito', `${item.name} agregado al carrito`);
      }}
    />
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Imagen y header */}
        <View style={styles.headerContainer}>
          <Image source={{ uri: restaurant.image }} style={styles.headerImage} />
          <LinearGradient
            colors={["rgba(0,0,0,0.2)", "rgba(0,0,0,0.7)"]}
            style={styles.headerOverlay}
          />
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={28} color={colors.white} />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.restaurantName}>{restaurant.name}</Text>
            <View style={styles.headerRow}>
              <Ionicons name="star" size={18} color={colors.primary} />
              <Text style={styles.starsText}>{restaurant.stars || '4.5'}</Text>
              <Ionicons name="location" size={18} color={colors.primary} style={{ marginLeft: 16 }} />
              <Text style={styles.locationText}>{restaurant.address || 'Ubicación desconocida'}</Text>
            </View>
            <Text style={styles.description} numberOfLines={2}>
              {restaurant.description || 'Deliciosa comida te espera.'}
            </Text>
          </View>
        </View>

        {/* Categorías */}
        <View style={styles.categoriesSection}>
          <FlatList
            horizontal
            data={['all', ...categories]}
            renderItem={renderCategory}
            keyExtractor={item => item}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          />
        </View>

        {/* Productos */}
        <View style={styles.productsSection}>
          {loading ? (
            <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
          ) : filteredProducts.length === 0 ? (
            <Text style={styles.emptyText}>No hay productos en esta categoría.</Text>
          ) : (
            <FlatList
              data={filteredProducts}
              renderItem={renderProduct}
              keyExtractor={item => item.id}
              numColumns={2}
              columnWrapperStyle={styles.productRow}
              contentContainerStyle={styles.productList}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
            />
          )}
        </View>
      </ScrollView>
      {/* Botón flotante de carrito */}
      <TouchableOpacity
        style={styles.cartFloatingBtn}
        onPress={() => navigation.navigate('Carrito')}
        activeOpacity={0.85}
      >
        <Ionicons name="cart" size={28} color={colors.white} />
        {getTotalQuantity() > 0 && (
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>{getTotalQuantity()}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  headerContainer: {
    position: 'relative',
    width: '100%',
    height: 220,
    marginBottom: spacing.lg,
  },
  headerImage: {
    width: '100%',
    height: '100%',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  backButton: {
    position: 'absolute',
    top: 36,
    left: 16,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    padding: 6,
    zIndex: 2,
  },
  headerInfo: {
    position: 'absolute',
    bottom: 16,
    left: 24,
    right: 24,
  },
  restaurantName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 4,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  starsText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 4,
  },
  locationText: {
    color: colors.white,
    fontSize: 15,
    marginLeft: 4,
  },
  description: {
    color: colors.white,
    fontSize: 15,
    marginTop: 6,
    opacity: 0.9,
  },
  categoriesSection: {
    marginTop: spacing.md,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  categoriesList: {
    paddingVertical: 4,
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
  productsSection: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  productList: {
    paddingBottom: spacing.xl,
  },
  productRow: {
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  emptyText: {
    textAlign: 'center',
    color: colors.gray,
    fontSize: 18,
    marginTop: 32,
  },
  cartFloatingBtn: {
    position: 'absolute',
    bottom: 28,
    right: 24,
    backgroundColor: colors.primary,
    borderRadius: 28,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    zIndex: 10,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  cartBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: colors.white,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  cartBadgeText: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 13,
  },
});

export default RestaurantDetailScreen;
