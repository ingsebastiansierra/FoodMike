import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import ProductImage from '../components/ProductImage';
import ProductInfoRow from '../components/ProductInfoRow';
import ProductQuantitySelector from '../components/ProductQuantitySelector';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, typography } from '../theme';
import { STRINGS, ICONS } from '../constants/strings';
import { useCart } from '../context/CartContext';
import { getRestaurantById } from '../data/restaurantsData';
import { restaurantsService } from '../services/restaurantsService';

const ProductDetailScreen = ({ route, navigation }) => {
  const { product } = route.params;
  // DEBUG: Ver el producto recibido
  console.log('DEBUG ProductDetailScreen product:', product);
  console.log('DEBUG name:', product.name, typeof product.name);
  console.log('DEBUG description:', product.description, typeof product.description);
  console.log('DEBUG stars:', product.stars, typeof product.stars);
  console.log('DEBUG price:', product.price, typeof product.price);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const { addToCart, getTotalQuantity } = useCart();
  const [restaurantName, setRestaurantName] = useState('');
  const [loadingRestaurant, setLoadingRestaurant] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchRestaurant = async () => {
      try {
        const data = await restaurantsService.getById(product.restaurantId);
        if (isMounted) {
          setRestaurantName(data.name || 'Restaurante desconocido');
        }
      } catch (e) {
        if (isMounted) setRestaurantName('Restaurante desconocido');
      } finally {
        if (isMounted) setLoadingRestaurant(false);
      }
    };
    fetchRestaurant();
    return () => { isMounted = false; };
  }, [product.restaurantId]);

  // Simulación de delivery y tiempo
  const deliveryFee = typeof product.deliveryFee === 'number' ? product.deliveryFee : 0;
  const delivery = deliveryFee === 0 ? STRINGS.FREE : `$${deliveryFee.toLocaleString('es-CO')}`;
  const time = typeof product.preparationTime === 'string' ? product.preparationTime : '20 min';
  const restaurant = getRestaurantById(product.restaurantId);

  // Simulación de tamaños e ingredientes
  const sizes = product.sizes || ['10"', '14"', '16"'];
  const [selectedSize, setSelectedSize] = useState(sizes[1] || sizes[0]);
  // Ingredientes de ejemplo para pruebas visuales
  const fallbackIngredients = [
    { icon: ICONS.PIZZA },
    { icon: ICONS.EGG },
    { icon: ICONS.LEAF },
    { icon: ICONS.FISH },
    { icon: ICONS.NUTRITION },
  ];
  const ingredients = product.ingredients && product.ingredients.length > 0
    ? product.ingredients
    : fallbackIngredients;

  const handleAddToCart = () => {
    addToCart({
      ...product,
      quantity,
      size: selectedSize,
    });
    alert(`Agregado ${quantity} x ${product.name} al carrito!`);
    setQuantity(1);
  };

  const handleCartPress = () => {
    navigation.navigate('Carrito');
  };

  // Función para calcular el ancho del badge según el número de dígitos
  const getBadgeWidth = (quantity) => {
    const digits = quantity.toString().length;
    if (digits === 1) return 22;
    if (digits === 2) return 26;
    return 30; // Para 3 o más dígitos
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={20} color="#222" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detalle del Producto</Text>
          <TouchableOpacity 
            style={styles.backBtn} 
            onPress={() => setIsFavorite(!isFavorite)}
          >
            <Ionicons 
              name={isFavorite ? "heart" : "heart-outline"} 
              size={20} 
              color={isFavorite ? "#ff4757" : "#222"} 
            />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <ProductImage uri={product.image} />
          
          <Text style={styles.restaurantText}>
            {loadingRestaurant ? 'Cargando restaurante...' : restaurantName}
          </Text>
          
          <Text style={styles.title}>
            {typeof product.name === 'string' ? product.name : 'Producto'}
          </Text>
          
          <Text style={styles.description}>
            {typeof product.description === 'string' ? product.description : 'Descripción del producto no disponible'}
          </Text>
          
          <View style={styles.infoRow}>
            <ProductInfoRow icon="star" text={`${typeof product.stars === 'number' && !isNaN(product.stars) ? product.stars : 4.5} ⭐`} />
            <ProductInfoRow icon="time" text={time} />
            <ProductInfoRow icon="car" text={delivery} />
          </View>

          {/* Tamaños */}
          <View style={styles.sizesRow}>
            <Text style={styles.sizeTitle}>Tamaño</Text>
            <View style={styles.sizesBtnRow}>
              {sizes.map((size) => (
                <TouchableOpacity
                  key={size}
                  style={[
                    styles.sizeBtn,
                    selectedSize === size && styles.sizeBtnActive
                  ]}
                  onPress={() => setSelectedSize(size)}
                >
                  <Text style={[
                    styles.sizeText,
                    selectedSize === size && styles.sizeTextActive
                  ]}>
                    {size}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Ingredientes */}
          <View style={styles.ingredientsRow}>
            <Text style={styles.ingredientsTitle}>Ingredientes</Text>
            <View style={styles.ingredientsList}>
              {ingredients.map((ingredient, index) => (
                <View key={index} style={styles.ingredientIcon}>
                  <Ionicons name={ingredient.icon} size={24} color="#ff6b35" />
                </View>
              ))}
            </View>
          </View>

          {/* Precio y Cantidad */}
          <View style={styles.priceQtyBox}>
            <View>
              <Text style={styles.priceUnit}>
                ${typeof product.price === 'number' && !isNaN(product.price) 
                  ? product.price.toLocaleString('es-CO') 
                  : '0'} c/u
              </Text>
              <Text style={styles.priceTotal}>
                ${typeof product.price === 'number' && !isNaN(product.price) 
                  ? (product.price * quantity).toLocaleString('es-CO') 
                  : '0'} total
              </Text>
            </View>
            <View style={styles.qtySelectorBox}>
              <ProductQuantitySelector
                quantity={quantity}
                setQuantity={setQuantity}
                min={1}
                max={10}
                dark={true}
              />
            </View>
          </View>
        </ScrollView>

        {/* Botón flotante del carrito */}
        <TouchableOpacity style={styles.cartFloatingBtn} onPress={handleCartPress}>
          <View style={styles.cartBtn}>
            <Ionicons name="cart" size={28} color="#222" />
            {getTotalQuantity() > 0 && (
              <View style={[styles.cartBadge, { minWidth: getBadgeWidth(getTotalQuantity()) }]}>
                <Text style={styles.cartBadgeText}>{getTotalQuantity()}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>

        {/* Botón de agregar al carrito */}
        <View style={styles.addToCartContainer}>
          <TouchableOpacity style={styles.addToCartBtn} onPress={handleAddToCart}>
            <Text style={styles.addToCartText}>
              Agregar al carrito - ${typeof product.price === 'number' && !isNaN(product.price) 
                ? (product.price * quantity).toLocaleString('es-CO') 
                : '0'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    position: 'relative',
  },
  scrollContent: {
    alignItems: 'center',
    padding: SPACING.lg,
    paddingTop: 80,
    paddingBottom: 40,
  },
  addToCartContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.white,
    paddingHorizontal: 20,
    paddingBottom: 16,
    paddingTop: 8,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 8,
    alignItems: 'center',
    zIndex: 10,
  },
  addToCartBtn: {
    width: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  addToCartText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
    paddingTop: 10,
    paddingHorizontal: 20,
    position: 'absolute',
    top: 30,
    left: 0,
    right: 0,
    zIndex: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  restaurantTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 8,
  },
  restaurantText: {
    fontSize: typography.sizes.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: typography.sizes.xl,
    fontWeight: 'bold',
    color: COLORS.darkGray,
    textAlign: 'center',
    marginBottom: 4,
  },
  description: {
    fontSize: typography.sizes.md,
    color: COLORS.mediumGray,
    textAlign: 'center',
    marginBottom: 12,
  },
  price: {
    fontSize: typography.sizes.lg,
    fontWeight: '700',
    color: COLORS.primary,
  },
  priceUnit: {
    fontSize: 14,
    color: COLORS.mediumGray,
    fontWeight: '500',
    marginBottom: 2,
  },
  priceTotal: {
    fontSize: 18,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  stars: {
    fontSize: typography.sizes.md,
    color: COLORS.primary,
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  sizesRow: {
    width: '100%',
    marginBottom: 16,
    alignItems: 'center',
  },
  sizesBtnRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 4,
  },
  sizeTitle: {
    fontSize: 13,
    color: COLORS.mediumGray,
    fontWeight: 'bold',
    marginBottom: 2,
    marginLeft: 8,
    alignSelf: 'flex-start',
  },
  sizeBtn: {
    backgroundColor: '#f3f3f3',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginHorizontal: 4,
  },
  sizeBtnActive: {
    backgroundColor: COLORS.primary,
  },
  sizeText: {
    fontSize: 15,
    color: '#222',
    fontWeight: '600',
  },
  sizeTextActive: {
    color: '#fff',
  },
  ingredientsRow: {
    width: '100%',
    marginBottom: 16,
  },
  ingredientsTitle: {
    fontSize: 13,
    color: COLORS.mediumGray,
    marginBottom: 4,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  ingredientsList: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  ingredientIcon: {
    backgroundColor: '#FFF3ED',
    borderRadius: 32,
    padding: 14,
    margin: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  priceQtyBox: {
    width: '100%',
    backgroundColor: '#f6f8fa',
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 16,
    marginBottom: 70,
    marginTop: 8,
  },
  qtySelectorBox: {
    backgroundColor: '#181A20',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  cartFloatingBtn: {
    position: 'absolute',
    top: 100,
    right: 24,
    zIndex: 20,
  },
  cartBtn: {
    backgroundColor: '#fff',
    borderRadius: 28,
    padding: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: 58,
    height: 58,
  },
  cartBadge: {
    position: 'absolute',
    top: -3,
    right: -2,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderWidth: 1,
    borderColor: '#fff',
  },
  cartBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ProductDetailScreen; 