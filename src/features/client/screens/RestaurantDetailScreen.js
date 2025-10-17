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
import LoadingWrapper from '../../../components/LoadingWrapper';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../../theme';
import ProductCard from '../../../components/ProductCard';
import { searchService } from '../../../services/searchService';
import { useCart } from '../../../context/CartContext';
import { showAlert } from '../../core/utils/alert';
import { useFocusEffect } from '@react-navigation/native';
import { useFavorites } from '../../../hooks/useFavorites';

const { width } = Dimensions.get('window');

const RestaurantDetailScreen = ({ route, navigation }) => {
  const { restaurant } = route.params;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { addToCart, totalQuantity } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    loadProducts();
  }, []);



  const loadProducts = async () => {
    setLoading(true);
    try {
      console.log('Cargando productos para el restaurante ID:', restaurant.id);
      console.log('Tipo de restaurant.id:', typeof restaurant.id);
      console.log('Datos completos del restaurante:', JSON.stringify(restaurant, null, 2));

      if (!restaurant.id) {
        console.error('Error: ID de restaurante no válido');
        return;
      }

      // Asegurarse de que el ID sea un string para la comparación en Supabase
      const restaurantId = String(restaurant.id);
      console.log('ID de restaurante convertido a string:', restaurantId);

      const response = await searchService.getByRestaurant(restaurantId);
      console.log('Productos del restaurante response:', response);

      const restaurantProducts = response.data || [];
      console.log('Productos encontrados:', restaurantProducts.length);

      // Verificar la estructura de los productos
      if (restaurantProducts.length > 0) {
        console.log('Ejemplo de producto:', JSON.stringify(restaurantProducts[0], null, 2));
      }

      setProducts(restaurantProducts);

      // Extraer categorías únicas de los productos de este restaurante
      const uniqueCategories = [
        ...new Set(restaurantProducts.map(p => p.category).filter(Boolean))
      ];
      console.log('Categorías únicas encontradas:', uniqueCategories);
      setCategories(uniqueCategories);

      // Si no hay categorías pero hay productos, crear una categoría por defecto
      if (uniqueCategories.length === 0 && restaurantProducts.length > 0) {
        console.log('No se encontraron categorías, creando categoría por defecto');
        setCategories(['Todos los productos']);
        setSelectedCategory('Todos los productos');
      }
    } catch (error) {
      console.error('Error cargando productos del restaurante:', error);
      setProducts([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar productos por categoría seleccionada
  const filteredProducts = selectedCategory === 'all' || selectedCategory === 'Todos los productos'
    ? products
    : products.filter(p => {
      // Comparación más flexible para categorías
      if (!p.category) {
        console.log('Producto sin categoría:', p.id, p.name);
        return false;
      }
      if (typeof p.category !== 'string') return false;
      const matches = p.category.toLowerCase() === selectedCategory.toLowerCase();
      console.log(`Producto ${p.id} (${p.name}) - Categoría: ${p.category} - ¿Coincide con ${selectedCategory}? ${matches}`);
      return matches;
    });

  console.log(`Productos filtrados: ${filteredProducts.length} de ${products.length} totales`);

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
      isFavorite={isFavorite(item.id)}
      onToggleFavorite={async (productId) => {
        const result = await toggleFavorite(productId);
        if (result.success) {
          showAlert('', result.message);
        }
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
          <LoadingWrapper
            isLoading={loading}
            skeletonType="products"
            skeletonCount={6}
          >
            {filteredProducts.length === 0 ? (
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
          </LoadingWrapper>
        </View>
      </ScrollView>

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

});

export default RestaurantDetailScreen;
