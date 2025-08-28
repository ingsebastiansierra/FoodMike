import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Dimensions,
  FlatList,
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  interpolate,
  withSpring,
  runOnJS,
  useAnimatedScrollHandler
} from 'react-native-reanimated';
import { COLORS } from "../theme/colors";
import Icon from "react-native-vector-icons/MaterialIcons";
import CategoryCard from "../components/CategoryCard";
import FoodCard from "../components/FoodCard";
import AutoCarousel from "../components/AutoCarousel";
import { SPACING } from "../theme/spacing";
import RestaurantCard from "../components/RestaurantCard";
import { restaurantsService } from "../services/restaurantsService";
import { searchService } from "../services/searchService";
import { formatPrice } from "../utils/formatPrice";

const { width } = Dimensions.get('window');

const PROMOS = [
  {
    id: 'promo1',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
    title: '2x1 en Pizzas',
    description: 'Solo hoy, aprovecha el 2x1 en todas las pizzas grandes.'
  },
  {
    id: 'promo2',
    image: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?w=800',
    title: '20% OFF Sushi',
    description: 'Descuento en rolls seleccionados.'
  },
  {
    id: 'promo3',
    image: 'https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?w=800',
    title: 'Envío Gratis',
    description: 'En pedidos mayores a $30.000.'
  }
];

const EXPERIENCES = [
  { id: 1, text: '"¡La mejor app para pedir comida en mi ciudad!"' },
  { id: 2, text: '"Rápido, fácil y delicioso. 5 estrellas."' },
  { id: 3, text: '"Variedad, calidad y servicio top."' },
];

const HomeContentComponent = ({ onAddToCart, onProductPress, onRestaurantPress }) => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [categories, setCategories] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [popularFoods, setPopularFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingFoods, setLoadingFoods] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [userName, setUserName] = useState('Mike'); // Puedes personalizar esto

  useEffect(() => { 
    loadOpenRestaurants(); 
    loadCategories();
  }, []);
  
  useEffect(() => { 
    loadPopularFoods(); 
  }, []);

  const loadCategories = async () => {
    try {
      const response = await searchService.getCategories();
      setCategories(response.data || []);
    } catch (error) {
      console.error('Error cargando categorías:', error);
    } finally {
      setLoadingCategories(false);
    }
  };

  const loadOpenRestaurants = async () => {
    try {
      const response = await restaurantsService.getOpen();
      setRestaurants(response.data || []);
    } catch (error) {
      console.error('Error cargando restaurantes:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPopularFoods = async () => {
    try {
      const response = await searchService.getFeaturedProducts(8);
      const products = Array.isArray(response.data?.data)
        ? response.data.data
        : Array.isArray(response.data)
          ? response.data
          : [];
      setPopularFoods(products);
    } catch (error) {
      console.error('Error cargando productos populares:', error);
    } finally {
      setLoadingFoods(false);
    }
  };

  // Filtrado de productos populares: siempre mostrar los más populares, 
  // solo filtrar por categoría si se selecciona una específica (no "all")
  const filteredPopularProducts = activeCategory === 'all'
    ? popularFoods // Mostrar todos los populares sin filtrar
    : popularFoods.filter(prod => {
        // Buscar la categoría seleccionada
        const selectedCategory = categories.find(c => c.id === activeCategory);
        if (!selectedCategory) return true; // Si no encuentra la categoría, mostrar todos
        
        // Filtrar por nombre de categoría
        return prod.category?.toLowerCase().includes(selectedCategory.name.toLowerCase()) ||
               prod.categoryId === activeCategory;
      });

  // Ordenar categorías: primero Hamburguesa, Pizza, Pollo, luego el resto alfabéticamente
  const mainCategoriesOrder = ['Hamburguesa', 'Pizza', 'Pollo'];
  const orderedCategories = [
    ...mainCategoriesOrder
      .map(name => categories.find(cat => cat.name.toLowerCase().includes(name.toLowerCase())))
      .filter(Boolean),
    ...categories
      .filter(cat => !mainCategoriesOrder.some(main => cat.name.toLowerCase().includes(main.toLowerCase())))
      .sort((a, b) => a.name.localeCompare(b.name))
  ];

  // Mapeo de emojis para categorías principales
  const categoryEmojis = {
    'Hamburguesa': '🍔',
    'Pizza': '🍕',
    'Pollo': '🍗',
    'Bebidas': '🥤',
    'Sushi': '🍣',
    'Tacos': '🌮',
    'Ensaladas': '🥗',
    'Sandwiches': '🥪',
    'Tortas': '🍰',
    'Helados': '🍦',
    'Ramen': '🍜',
    'Burritos': '🌯',
    'Wraps': '🌯',
    'Entradas': '🥟',
    'Platos Típicos': '🍲',
    'Acompañamientos': '🍟',
    'Platos Calientes': '🍲',
    'Sushi Rolls': '🍣',
  };

  // Componente de carrusel 3D para productos populares
  const AnimatedFoodCard = ({ product, index, scrollX, onPress, onAddPress }) => {
    const inputRange = [
      (index - 1) * 180, // Card anterior
      index * 180,       // Card actual
      (index + 1) * 180, // Card siguiente
    ];

    // Valor para la rotación del borde
    const rotationValue = useSharedValue(0);

    // Animar la rotación continuamente
    useEffect(() => {
      const interval = setInterval(() => {
        rotationValue.value = withSpring(rotationValue.value + 360, { 
          damping: 15, 
          stiffness: 100 
        });
      }, 3000); // Rotar cada 3 segundos

      return () => clearInterval(interval);
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
      const scale = interpolate(
        scrollX.value,
        inputRange,
        [0.8, 1.0, 0.8],
        'clamp'
      );

      const translateY = interpolate(
        scrollX.value,
        inputRange,
        [20, 0, 20],
        'clamp'
      );

      const opacity = interpolate(
        scrollX.value,
        inputRange,
        [0.6, 1.0, 0.6],
        'clamp'
      );

      return {
        transform: [
          { scale: withSpring(scale, { damping: 15, stiffness: 150 }) },
          { translateY: withSpring(translateY, { damping: 15, stiffness: 150 }) }
        ],
        opacity: withSpring(opacity, { damping: 15, stiffness: 150 }),
      };
    });

    // Borde animado para la card activa
    const borderAnimatedStyle = useAnimatedStyle(() => {
      const isActive = scrollX.value >= index * 180 - 90 && scrollX.value <= index * 180 + 90;
      
      const borderOpacity = interpolate(
        scrollX.value,
        inputRange,
        [0, 1, 0],
        'clamp'
      );

      return {
        opacity: withSpring(isActive ? 1 : 0, { damping: 15, stiffness: 150 }),
        transform: [
          { scale: withSpring(isActive ? 1.05 : 1, { damping: 15, stiffness: 150 }) },
          { rotate: `${rotationValue.value}deg` }
        ],
      };
    });

    return (
      <Animated.View style={[styles.animatedCardWrapper, animatedStyle]}>
        {/* Borde animado */}
        <Animated.View style={[styles.animatedBorder, borderAnimatedStyle]}>
          <LinearGradient
            colors={[COLORS.primary, COLORS.primaryDark, COLORS.accent, COLORS.primary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.borderGradient}
          />
        </Animated.View>
        
        {/* Card principal */}
        <View style={styles.cardContainer}>
          <FoodCard
            image={product.image}
            name={product.name}
            price={product.price}
            stars={product.stars}
            onPress={onPress}
            onAddPress={onAddPress}
          />
        </View>
      </Animated.View>
    );
  };

  // Valor compartido para el scroll horizontal
  const scrollX = useSharedValue(0);

  const handleScroll = (event) => {
    scrollX.value = event.nativeEvent.contentOffset.x;
  };

  // --- ANIMACIÓN VERTICAL PARA RESTAURANTES ---
  const ITEM_HEIGHT = 228;
  const windowHeight = Dimensions.get('window').height;
  const verticalScrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      verticalScrollY.value = event.contentOffset.y;
    },
  });

  const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

  const AnimatedRestaurantCardVertical = ({ restaurant, index, onPress }) => {
    const animatedStyle = useAnimatedStyle(() => {
      // Centro de la pantalla
      const centerY = verticalScrollY.value + windowHeight / 2 - ITEM_HEIGHT / 2;
      // Centro de la card
      const cardCenterY = index * ITEM_HEIGHT + ITEM_HEIGHT / 2;
      // Distancia al centro
      const distance = Math.abs(centerY - cardCenterY);
      // Si es la más cercana al centro, animar
      const isActive = distance < ITEM_HEIGHT / 2;
      return {
        transform: [
          { scale: withSpring(isActive ? 1.15 : 1, { damping: 15, stiffness: 150 }) },
          { translateY: withSpring(isActive ? -20 : 0, { damping: 15, stiffness: 150 }) }
        ],
        zIndex: isActive ? 10 : 1,
      };
    });
    // Borde animado solo para la activa
    const borderAnimatedStyle = useAnimatedStyle(() => {
      // Centro de la pantalla
      const centerY = verticalScrollY.value + windowHeight / 2 - ITEM_HEIGHT / 2;
      const cardCenterY = index * ITEM_HEIGHT + ITEM_HEIGHT / 2;
      const distance = Math.abs(centerY - cardCenterY);
      const isActive = distance < ITEM_HEIGHT / 2;
      return {
        opacity: withSpring(isActive ? 1 : 0, { damping: 15, stiffness: 150 }),
        borderWidth: isActive ? 5 : 0,
        borderColor: 'transparent',
        borderRadius: 22,
        position: 'absolute',
        top: -5,
        left: -5,
        right: -5,
        bottom: -5,
        overflow: 'hidden',
      };
    });
    // Gradiente animado para el borde
    return (
      <Animated.View style={[styles.animatedRestaurantWrapper, animatedStyle]}> 
        <Animated.View style={borderAnimatedStyle}>
          <LinearGradient
            colors={[COLORS.primary, COLORS.primaryDark, COLORS.accent, COLORS.primary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ flex: 1, borderRadius: 22 }}
          />
        </Animated.View>
        <RestaurantCard
          restaurant={restaurant}
          onPress={onPress}
        />
      </Animated.View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Cargando restaurantes...</Text>
      </View>
    );
  }

  return (
    <>
      <ScrollView showsVerticalScrollIndicator={false} style={{ backgroundColor: COLORS.background }}>
        {/* HERO SECTION */}
        <LinearGradient colors={[COLORS.primary, COLORS.secondary]} style={styles.heroSection}>
          <Text style={styles.heroHello}>👋 ¡Hola, {userName}!</Text>
          <Text style={styles.heroTitle}>¿Qué se te antoja hoy?</Text>
          <Text style={styles.heroSubtitle}>Descubre los mejores sabores cerca de ti</Text>
        </LinearGradient>

        {/* PROMO CAROUSEL */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.promoCarousel}>
          {PROMOS.map(promo => (
            <View key={promo.id} style={styles.promoCard}>
              <Image source={{ uri: promo.image }} style={styles.promoImage} />
              <View style={styles.promoOverlay} />
              <View style={styles.promoTextContainer}>
                <Text style={styles.promoTitle}>{promo.title}</Text>
                <Text style={styles.promoDesc}>{promo.description}</Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* CATEGORÍAS */}
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Categorías Populares</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesList}>
            {/* Botón "Todas" */}
            <TouchableOpacity
              style={[styles.categoryButton, activeCategory === "all" && styles.categoryButtonActive]}
              onPress={() => setActiveCategory("all")}
              activeOpacity={0.8}
            >
              <Text style={styles.categoryEmoji}>🍽️</Text>
              <Text style={styles.categoryText}>Todas</Text>
            </TouchableOpacity>
            {/* Categorías ordenadas */}
            {orderedCategories.map(cat => (
              <TouchableOpacity
                key={cat.id}
                style={[styles.categoryButton, activeCategory === cat.id && styles.categoryButtonActive]}
                onPress={() => setActiveCategory(cat.id)}
                activeOpacity={0.8}
              >
                <Text style={styles.categoryEmoji}>
                  {categoryEmojis[cat.name] || cat.icon || '🍽️'}
                </Text>
                <Text style={styles.categoryText}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* POPULARES AHORA */}
        <View style={styles.popularSection}>
          <Text style={styles.sectionTitle}>Populares Ahora</Text>
          <Animated.ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.popularList}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            decelerationRate="fast"
            snapToInterval={180}
            snapToAlignment="center"
          >
            {filteredPopularProducts.map((product, index) => (
              <AnimatedFoodCard
                key={product.id}
                product={product}
                index={index}
                scrollX={scrollX}
                onPress={() => onProductPress(product)}
                onAddPress={() => onAddToCart(product)}
              />
            ))}
          </Animated.ScrollView>
        </View>

        {/* EXPERIENCIAS DE USUARIOS */}
        <View style={styles.experiencesSection}>
          <Text style={styles.sectionTitle}>Experiencias de Usuarios</Text>
          <View style={styles.experiencesList}>
            {EXPERIENCES.map(exp => (
              <View key={exp.id} style={styles.experienceCard}>
                <Text style={styles.experienceText}>{exp.text}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* RESTAURANTES ABIERTOS */}
      <View style={styles.openRestaurantsSection}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleContainer}>
            <Icon name="restaurant" size={24} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Restaurantes Abiertos</Text>
          </View>
        </View>
        <View style={styles.restaurantsList}>
          {restaurants.filter(r => r !== null).map((restaurant) => (
            <View key={restaurant.id} style={styles.animatedRestaurantWrapper}>
              <RestaurantCard
                restaurant={restaurant}
                onPress={() => onRestaurantPress(restaurant)}
              />
            </View>
          ))}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    fontSize: 18,
    color: COLORS.gray,
    marginTop: 10,
  },
  heroSection: {
    paddingTop: 40,
    paddingBottom: 32,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    marginBottom: 16,
  },
  heroHello: {
    fontSize: 22,
    color: COLORS.white,
    fontWeight: '600',
    marginBottom: 4,
  },
  heroTitle: {
    fontSize: 32,
    color: COLORS.white,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  heroSubtitle: {
    fontSize: 16,
    color: COLORS.white,
    opacity: 0.85,
    marginBottom: 0,
  },
  promoCarousel: {
    marginTop: 8,
    marginBottom: 16,
    paddingLeft: 16,
  },
  promoCard: {
    width: width * 0.7,
    height: 140,
    borderRadius: 20,
    marginRight: 16,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: COLORS.lightGray,
    elevation: 2,
  },
  promoImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  promoOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  promoTextContainer: {
    position: 'absolute',
    bottom: 12,
    left: 16,
    right: 16,
  },
  promoTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  promoDesc: {
    color: COLORS.white,
    fontSize: 14,
    opacity: 0.9,
  },
  categoriesSection: {
    marginTop: 8,
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.dark,
    marginBottom: 8,
    marginRight:20
  },
  categoriesList: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 8,
  },
  categoryButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    backgroundColor: COLORS.lightGray,
    borderRadius: 16,
    padding: 12,
    width: 72,
    height: 90,
    elevation: 1,
  },
  categoryButtonActive: {
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  categoryEmoji: {
    fontSize: 24,
    marginBottom: 2,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.dark,
    textAlign: 'center',
  },
  popularSection: {
    marginTop: 8,
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  popularList: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 8,
    paddingHorizontal: 40,
  },
  animatedCardWrapper: {
    width: 160,
    marginRight: 20,
    alignItems: 'center',
    position: 'relative',
  },
  animatedBorder: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 18,
    zIndex: 1,
  },
  borderGradient: {
    flex: 1,
    borderRadius: 18,
  },
  cardContainer: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: COLORS.white,
    zIndex: 2,
  },
  popularImage: {
    width: '100%',
    height: 100,
    resizeMode: 'cover',
  },
  popularInfo: {
    padding: 12,
  },
  popularName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.dark,
    marginBottom: 2,
  },
  popularPrice: {
    fontSize: 15,
    color: COLORS.primary,
    fontWeight: '600',
    marginBottom: 2,
  },
  popularRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  popularRating: {
    fontSize: 14,
    color: COLORS.gray,
    marginLeft: 4,
  },
  popularAddBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 6,
    alignItems: 'center',
    marginTop: 4,
  },
  popularAddBtnText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 14,
  },
  openRestaurantsSection: {
    marginTop: 8,
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: COLORS.lightPrimary,
  },
  seeAllText: {
    color: COLORS.primary,
    fontWeight: '600',
    marginRight: 4,
  },
  restaurantsList: {
    flexDirection: 'column',
    alignItems: 'stretch',
    paddingBottom: 8,
    paddingHorizontal: 0,
  },
  animatedRestaurantWrapper: {
    marginBottom: 8,
  },
  experiencesSection: {
    marginTop: 16,
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  experiencesList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  experienceCard: {
    backgroundColor: COLORS.lightPrimary,
    borderRadius: 16,
    padding: 16,
    flex: 1,
    marginRight: 8,
    marginLeft: 0,
    elevation: 1,
  },
  experienceText: {
    color: COLORS.primary,
    fontSize: 15,
    fontStyle: 'italic',
    fontWeight: '600',
  },
  loadingFoodsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  loadingFoodsText: {
    fontSize: 16,
    color: COLORS.gray,
    marginTop: 8,
  },
  noProductsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  noProductsText: {
    fontSize: 16,
    color: COLORS.gray,
    fontStyle: 'italic',
  },
});

export default HomeContentComponent;
