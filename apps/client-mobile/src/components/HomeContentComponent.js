import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useNavigation } from '@react-navigation/native';
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
  TextInput,
} from "react-native";
import {
  SkeletonRestaurantList,
  SkeletonProductList,
  SkeletonBase
} from './skeletons';
import LoadingWrapper from './LoadingWrapper';
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
import restaurantsService from "../services/restaurantsService";
import { search } from "../services/searchService";
import { formatCurrency } from "../shared/utils/format";
import { useFavorites } from "../hooks/useFavorites";
import { showAlert } from "../features/core/utils/alert";
import * as Location from 'expo-location';
import { useCart } from "../context/CartContext";

const { width } = Dimensions.get('window');

const HERO_PROMOS = [
  {
    id: 'hero1',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
    title: '¡Ofertas Increíbles!',
    subtitle: '2x1 en Pizzas',
    description: 'Solo hoy, aprovecha el 2x1 en todas las pizzas grandes',
    gradient: ['#FF6B6B', '#FF8E53'],
    icon: '🍕'
  },
  {
    id: 'hero2',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800',
    title: 'Envío Gratis',
    subtitle: 'En pedidos +$30.000',
    description: 'Disfruta sin costo de envío en tu pedido',
    gradient: ['#4ECDC4', '#44A08D'],
    icon: '🚚'
  },
  {
    id: 'hero3',
    image: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?w=800',
    title: 'Sushi Premium',
    subtitle: '20% OFF',
    description: 'Los mejores rolls con descuento especial',
    gradient: ['#667eea', '#764ba2'],
    icon: '🍣'
  }
];

const QUICK_ACTIONS = [
  { id: 1, title: 'Entrega Rápida', subtitle: '15-30 min', icon: '⚡', color: '#FF6B6B' },
  { id: 2, title: 'Ofertas', subtitle: 'Hasta 50% OFF', icon: '🔥', color: '#4ECDC4' },
  { id: 3, title: 'Favoritos', subtitle: 'Tus preferidos', icon: '❤️', color: '#FFD93D' },
  { id: 4, title: 'Nuevos', subtitle: 'Recién llegados', icon: '✨', color: '#6BCF7F' },
];

const TRENDING_SEARCHES = [
  'Pizza', 'Hamburguesas', 'Sushi', 'Tacos', 'Pollo', 'Ensaladas'
];

const DELIVERY_STATS = [
  { label: 'Tiempo promedio', value: '25 min', icon: '⏱️' },
  { label: 'Restaurantes', value: '500+', icon: '🏪' },
  { label: 'Satisfacción', value: '4.8★', icon: '😊' },
];

const AUTO_CAROUSEL_PROMOS = [
  {
    id: 'auto1',
    title: '🍕 PIZZA MANIA',
    subtitle: '50% OFF',
    description: 'En todas las pizzas familiares',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400',
    gradient: ['#FF6B6B', '#FF8E53'],
    badge: 'HOY SOLO'
  },
  {
    id: 'auto2',
    title: '🍔 BURGER FEST',
    subtitle: '2x1',
    description: 'Hamburguesas premium + papas',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
    gradient: ['#4ECDC4', '#44A08D'],
    badge: 'LIMITADO'
  },
  {
    id: 'auto3',
    title: '🍣 SUSHI NIGHT',
    subtitle: '30% OFF',
    description: 'Rolls premium después de 6PM',
    image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400',
    gradient: ['#667eea', '#764ba2'],
    badge: 'NOCTURNO'
  },
  {
    id: 'auto4',
    title: '🌮 TACO TUESDAY',
    subtitle: '3x2',
    description: 'Tacos mexicanos auténticos',
    image: 'https://images.unsplash.com/photo-1565299585323-38174c4a6471?w=400',
    gradient: ['#f093fb', '#f5576c'],
    badge: 'MARTES'
  },
  {
    id: 'auto5',
    title: '🍗 POLLO LOCO',
    subtitle: '40% OFF',
    description: 'Pollo frito + bebida gratis',
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=400',
    gradient: ['#ffecd2', '#fcb69f'],
    badge: 'COMBO'
  },
  {
    id: 'auto6',
    title: '🥗 HEALTHY WEEK',
    subtitle: 'FRESH',
    description: 'Ensaladas y bowls saludables',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400',
    gradient: ['#a8edea', '#fed6e3'],
    badge: 'SALUDABLE'
  }
];

const HomeContentComponent = ({ user, onAddToCart, onProductPress, onRestaurantPress }) => {
  const navigation = useNavigation();
  const [activeCategory, setActiveCategory] = useState("all");
  const [categories, setCategories] = useState([]);
  const [restaurantsList, setRestaurantsList] = useState([]);
  const [popularFoods, setPopularFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingFoods, setLoadingFoods] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [userName, setUserName] = useState(''); // Inicializado vacío
  const [currentAutoPromo, setCurrentAutoPromo] = useState(0);
  const [selectedTab, setSelectedTab] = useState('recommended');
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState('Obteniendo ubicación...');
  const carouselRef = useRef(null);
  const { favorites, isFavorite, toggleFavorite } = useFavorites();
  const { cartItems, totalQuantity } = useCart();

  useEffect(() => {
    loadOpenRestaurants();
    loadCategories();
    getCurrentLocation();
  }, []);

  useEffect(() => {
    loadPopularFoods();
  }, []);

  // Carrusel automático infinito
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAutoPromo(prev => {
        const nextIndex = (prev + 1) % AUTO_CAROUSEL_PROMOS.length;

        // Mover el ScrollView automáticamente
        if (carouselRef.current) {
          carouselRef.current.scrollTo({
            x: nextIndex * (width - 60),
            animated: true
          });
        }

        return nextIndex;
      });
    }, 3000); // Cambia cada 3 segundos

    return () => clearInterval(interval);
  }, []);

  const loadCategories = useCallback(async () => {
    try {
      const response = await search.getCategories();
      setCategories(response.data || []);
    } catch (error) {
      console.error('Error cargando categorías:', error);
    } finally {
      setLoadingCategories(false);
    }
  }, []);

  const loadOpenRestaurants = useCallback(async () => {
    try {
      const response = await restaurantsService.getOpen();
      setRestaurantsList(response.data || []);
    } catch (error) {
      console.error('Error cargando restaurantes:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadPopularFoods = useCallback(async () => {
    try {
      const response = await search.getFeaturedProducts(8);
      const products = Array.isArray(response.data)
        ? response.data
        : [];
      setPopularFoods(products);
    } catch (error) {
      console.error('Error cargando productos populares:', error);
    } finally {
      setLoadingFoods(false);
    }
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setAddress('Ubicación no disponible');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);

      // Obtener dirección desde coordenadas
      const addressResponse = await Location.reverseGeocodeAsync({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });

      if (addressResponse && addressResponse.length > 0) {
        const addr = addressResponse[0];
        const formattedAddress = `${addr.street || ''} ${addr.name || ''}, ${addr.city || ''}`.trim();
        setAddress(formattedAddress || 'Ubicación actual');
      }
    } catch (error) {
      console.error('Error obteniendo ubicación:', error);
      setAddress('Ubicación no disponible');
    }
  };

  // Filtrado de productos populares: siempre mostrar los más populares, 
  // Filtrado de productos populares optimizado con useMemo
  const filteredPopularProducts = useMemo(() => {
    if (activeCategory === 'all') {
      return popularFoods;
    }

    return popularFoods.filter(prod => {
      const selectedCategory = categories.find(c => c.id === activeCategory);
      if (!selectedCategory) return true;

      return prod.category?.toLowerCase().includes(selectedCategory.name.toLowerCase()) ||
        prod.categoryId === activeCategory;
    });
  }, [activeCategory, popularFoods, categories]);

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
            productId={product.id}
            isFavorite={isFavorite(product.id)}
            onToggleFavorite={async (productId) => {
              const result = await toggleFavorite(productId);
              if (result.success) {
                showAlert('', result.message);
              }
            }}
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
      <ScrollView style={{ backgroundColor: COLORS.background }} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Hero Section Skeleton */}
        <View style={{ padding: 16, marginBottom: 16 }}>
          <SkeletonBase width="60%" height={24} borderRadius={4} style={{ marginBottom: 8 }} />
          <SkeletonBase width="80%" height={32} borderRadius={4} style={{ marginBottom: 8 }} />
          <SkeletonBase width="70%" height={16} borderRadius={4} />
        </View>

        {/* Promo Carousel Skeleton */}
        <View style={{ marginBottom: 20 }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
            {[1, 2, 3].map(item => (
              <SkeletonBase
                key={item}
                width={width * 0.7}
                height={140}
                borderRadius={20}
                style={{ marginRight: 16 }}
              />
            ))}
          </ScrollView>
        </View>

        {/* Categories Skeleton */}
        <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
          <SkeletonBase width="50%" height={20} borderRadius={4} style={{ marginBottom: 12 }} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {[1, 2, 3, 4, 5].map(item => (
              <SkeletonBase
                key={item}
                width={72}
                height={90}
                borderRadius={16}
                style={{ marginRight: 16 }}
              />
            ))}
          </ScrollView>
        </View>

        {/* Popular Products Skeleton */}
        <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
          <SkeletonBase width="40%" height={20} borderRadius={4} style={{ marginBottom: 12 }} />
          <SkeletonProductList itemCount={4} />
        </View>

        {/* Restaurants Skeleton */}
        <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
          <SkeletonBase width="60%" height={20} borderRadius={4} style={{ marginBottom: 12 }} />
          <SkeletonRestaurantList itemCount={3} />
        </View>
      </ScrollView>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <ScrollView showsVerticalScrollIndicator={false} style={{ backgroundColor: COLORS.background }} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* HEADER NARANJA CON UBICACIÓN, TOC TOC Y CARRITO */}
        <View style={styles.locationHeader}>
          <View style={styles.locationMainContent}>
            <View style={styles.locationInfoVertical}>
              <TouchableOpacity style={styles.locationRow} onPress={getCurrentLocation}>
                <Icon name="location-on" size={18} color="#FF6B35" />
                <Text style={styles.locationSubtitle} numberOfLines={1}>{address}</Text>
              </TouchableOpacity>
              <Text style={styles.appName}>Toc Toc</Text>
            </View>
            <View style={styles.headerButtons}>
              <TouchableOpacity
                style={styles.cartButton}
                onPress={() => navigation.navigate('Carrito')}
              >
                <Icon name="shopping-cart" size={24} color="#333" />
                {totalQuantity > 0 && (
                  <View style={styles.cartBadge}>
                    <Text style={styles.cartBadgeText}>{totalQuantity}</Text>
                  </View>
                )}
              </TouchableOpacity>
              <TouchableOpacity style={styles.plusButton}>
                <Text style={styles.plusButtonText}>Plus</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.profileButton}
                onPress={() => navigation.navigate('Perfil')}
              >
                <Icon name="account-circle" size={40} color="#333" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* BARRA DE BÚSQUEDA */}
        <TouchableOpacity
          style={styles.searchBarContainer}
          onPress={() => navigation.navigate('Buscar')}
          activeOpacity={0.7}
        >
          <View style={styles.searchBar}>
            <Text style={styles.searchBarPlaceholder}>Buscar 'Pizza'</Text>
            <Icon name="search" size={24} color="#999" style={styles.searchBarIcon} />
            <View style={styles.divider} />
            <Icon name="mic" size={24} color="#FF6B35" style={styles.micIcon} />
          </View>
        </TouchableOpacity>

        {/* EXPLOSIVE OFFERS */}
        <View style={styles.offersSection}>
          <View style={styles.offersContent}>
            <Text style={styles.offersTitle}>Ofertas Explosivas</Text>
            <Text style={styles.offersTitle}>Para ti</Text>
            <TouchableOpacity style={styles.offersButton}>
              <Text style={styles.offersButtonText}>MIN. 20% OFF</Text>
              <Icon name="chevron-right" size={16} color="#FFF" />
            </TouchableOpacity>
          </View>
          <View style={styles.offersCircle} />
        </View>

        {/* SEPARADOR OFERTAS */}
        <View style={styles.sectionSeparator}>
          <View style={styles.separatorLine} />
          <Text style={styles.separatorText}>OFERTAS</Text>
          <View style={styles.separatorLine} />
        </View>

        {/* CARRUSEL INTERACTIVO DE OFERTAS DEL MOMENTO */}
        <View style={styles.autoCarouselSection}>
          <View style={styles.autoCarouselContainer}>
            <ScrollView
              ref={carouselRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              pagingEnabled
              decelerationRate="fast"
              snapToInterval={width - 60}
              snapToAlignment="center"
              contentContainerStyle={styles.autoCarouselScrollContent}
              onMomentumScrollEnd={(event) => {
                const newIndex = Math.round(event.nativeEvent.contentOffset.x / (width - 60));
                setCurrentAutoPromo(newIndex % AUTO_CAROUSEL_PROMOS.length);
              }}
            >
              {AUTO_CAROUSEL_PROMOS.map((promo, index) => (
                <View key={promo.id} style={styles.autoCarouselCardContainer}>
                  <TouchableOpacity style={styles.autoCarouselCard} activeOpacity={0.9}>
                    <LinearGradient colors={promo.gradient} style={styles.autoCarouselGradient}>
                      <View style={styles.autoCarouselBadge}>
                        <Text style={styles.autoCarouselBadgeText}>{promo.badge}</Text>
                      </View>
                      <View style={styles.autoCarouselContent}>
                        <View style={styles.autoCarouselTextSection}>
                          <Text style={styles.autoCarouselPromoTitle}>{promo.title}</Text>
                          <Text style={styles.autoCarouselSubtitle}>{promo.subtitle}</Text>
                          <Text style={styles.autoCarouselDescription}>{promo.description}</Text>
                          <TouchableOpacity style={styles.autoCarouselButton}>
                            <Text style={styles.autoCarouselButtonText}>¡Pedir Ahora!</Text>
                          </TouchableOpacity>
                        </View>
                        <View style={styles.autoCarouselImageSection}>
                          <Image source={{ uri: promo.image }} style={styles.autoCarouselImage} />
                        </View>
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>

            {/* Indicadores */}
            <View style={styles.autoCarouselIndicators}>
              {AUTO_CAROUSEL_PROMOS.map((_, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.autoCarouselIndicator,
                    { backgroundColor: index === currentAutoPromo ? COLORS.primary : 'rgba(0,0,0,0.2)' }
                  ]}
                  onPress={() => {
                    setCurrentAutoPromo(index);
                    if (carouselRef.current) {
                      carouselRef.current.scrollTo({
                        x: index * (width - 60),
                        animated: true
                      });
                    }
                  }}
                />
              ))}
            </View>
          </View>
        </View>

        {/* SEPARADOR PARA TI */}
        <View style={styles.sectionSeparator}>
          <View style={styles.separatorLine} />
          <Text style={styles.separatorText}>PARA TI</Text>
          <View style={styles.separatorLine} />
        </View>

        {/* TABS RECOMMENDED / FAVOURITES */}
        <View style={styles.tabsContainer}>
          <View style={styles.tabsWrapper}>
            <TouchableOpacity
              style={[styles.tab, selectedTab === 'recommended' && styles.tabActive]}
              onPress={() => setSelectedTab('recommended')}
            >
              <Text style={[styles.tabText, selectedTab === 'recommended' && styles.tabTextActive]}>
                Recomendaciones
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, selectedTab === 'favourites' && styles.tabActive]}
              onPress={() => setSelectedTab('favourites')}
            >
              <Icon name="favorite-border" size={20} color={selectedTab === 'favourites' ? '#FF6B35' : '#666'} />
              <Text style={[styles.tabText, selectedTab === 'favourites' && styles.tabTextActive]}>
                Favoritos
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* PRODUCTOS CON DESCUENTOS - GRID 2 COLUMNAS */}
        <View style={styles.discountRestaurantsSection}>
          <View style={styles.discountRestaurantsGrid}>
            {selectedTab === 'recommended' ? (
              // Mostrar productos recomendados
              popularFoods.slice(0, 6).map((product, index) => (
                <TouchableOpacity
                  key={product.id}
                  style={styles.discountRestaurantCard}
                  onPress={() => onProductPress(product)}
                >
                  <Image source={{ uri: product.image }} style={styles.discountRestaurantImage} />
                  <TouchableOpacity
                    style={styles.favoriteIconDiscount}
                    onPress={async () => {
                      const result = await toggleFavorite(product.id);
                      if (result.success) {
                        showAlert('', result.message);
                      }
                    }}
                  >
                    <Icon
                      name={isFavorite(product.id) ? "favorite" : "favorite-border"}
                      size={24}
                      color="#FFF"
                    />
                  </TouchableOpacity>
                  <View style={styles.discountBadge}>
                    <Text style={styles.discountBadgeText}>40% OFF</Text>
                    <Text style={styles.discountBadgeSubtext}>up to ₹80</Text>
                  </View>
                  <View style={styles.discountRestaurantInfo}>
                    <Text style={styles.discountRestaurantName} numberOfLines={1}>
                      {product.name}
                    </Text>
                    <Text style={styles.discountRestaurantCuisine} numberOfLines={1}>
                      {product.category || 'Delicious Food'}
                    </Text>
                    <View style={styles.discountRestaurantMeta}>
                      <Icon name="circle" size={8} color="#4ECDC4" />
                      <Text style={styles.discountRestaurantTime}>25-30 min</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              // Mostrar productos favoritos desde la base de datos
              favorites.length > 0 ? (
                favorites.slice(0, 6).map((favorite, index) => {
                  // Los datos vienen en favorite.products (plural) según el servicio
                  const product = favorite.products;
                  if (!product) return null;

                  return (
                    <TouchableOpacity
                      key={favorite.id}
                      style={styles.discountRestaurantCard}
                      onPress={() => onProductPress(product)}
                    >
                      <Image source={{ uri: product.image }} style={styles.discountRestaurantImage} />
                      <TouchableOpacity
                        style={styles.favoriteIconDiscount}
                        onPress={async () => {
                          const result = await toggleFavorite(favorite.product_id);
                          if (result.success) {
                            showAlert('', result.message);
                          }
                        }}
                      >
                        <Icon name="favorite" size={24} color="#FF6B35" />
                      </TouchableOpacity>
                      <View style={styles.discountBadge}>
                        <Text style={styles.discountBadgeText}>40% OFF</Text>
                        <Text style={styles.discountBadgeSubtext}>up to ₹80</Text>
                      </View>
                      <View style={styles.discountRestaurantInfo}>
                        <Text style={styles.discountRestaurantName} numberOfLines={1}>
                          {product.name}
                        </Text>
                        <Text style={styles.discountRestaurantCuisine} numberOfLines={1}>
                          {product.category || 'Delicious Food'}
                        </Text>
                        <View style={styles.discountRestaurantMeta}>
                          <Icon name="circle" size={8} color="#4ECDC4" />
                          <Text style={styles.discountRestaurantTime}>25-30 min</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })
              ) : (
                <View style={styles.emptyFavorites}>
                  <Icon name="favorite-border" size={60} color="#CCC" />
                  <Text style={styles.emptyFavoritesText}>No tienes favoritos aún</Text>
                  <Text style={styles.emptyFavoritesSubtext}>Toca el corazón en tus productos favoritos</Text>
                </View>
              )
            )}
          </View>
        </View>

        {/* SEPARADOR LOCALES */}
        <View style={styles.sectionSeparator}>
          <View style={styles.separatorLine} />
          <Text style={styles.separatorText}>LOCALES</Text>
          <View style={styles.separatorLine} />
        </View>

        {/* RESTAURANTES DESTACADOS */}
        <View style={styles.restaurantsSectionModern}>

          <View style={styles.restaurantsGridModern}>
            {restaurantsList.slice(0, 4).map((restaurant, index) => (
              <TouchableOpacity
                key={restaurant.id}
                style={styles.restaurantCardModern}
                onPress={() => onRestaurantPress(restaurant)}
              >
                <View style={styles.restaurantImageContainer}>
                  <Image source={{ uri: restaurant.image }} style={styles.restaurantImageModern} />
                  <View style={styles.restaurantBadge}>
                    <Text style={styles.restaurantBadgeText}>⚡ Rápido</Text>
                  </View>
                </View>
                <View style={styles.restaurantInfoModern}>
                  <Text style={styles.restaurantNameModern} numberOfLines={1}>{restaurant.name}</Text>
                  <View style={styles.restaurantMetaModern}>
                    <View style={styles.restaurantRatingModern}>
                      <Icon name="star" size={12} color="#FFD700" />
                      <Text style={styles.restaurantRatingText}>{restaurant.stars || '4.5'}</Text>
                    </View>
                    <Text style={styles.restaurantTimeModern}>25-35 min</Text>
                  </View>
                  <Text style={styles.restaurantCuisineModern} numberOfLines={1}>
                    {restaurant.description || 'Comida deliciosa'}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Botón Ver Todos centrado */}
          <TouchableOpacity
            style={styles.viewAllButtonCentered}
            onPress={() => navigation.navigate('RestaurantsList')}
          >
            <Text style={styles.viewAllTextCentered}>Ver Todos los Restaurantes</Text>
            <Icon name="arrow-forward" size={18} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* SECCIÓN DE TESTIMONIOS MODERNA */}
        <View style={styles.testimonialsSection}>
          <Text style={styles.sectionTitleModern}>💬 Lo que dicen nuestros usuarios</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {[
              { name: 'María G.', rating: 5, text: 'La mejor app para pedir comida. Rápida y confiable.' },
              { name: 'Carlos R.', rating: 5, text: 'Excelente variedad y los tiempos de entrega son perfectos.' },
              { name: 'Ana L.', rating: 5, text: 'Me encanta la interfaz y la facilidad para ordenar.' }
            ].map((testimonial, index) => (
              <View key={index} style={styles.testimonialCard}>
                <View style={styles.testimonialHeader}>
                  <View style={styles.testimonialAvatar}>
                    <Text style={styles.testimonialAvatarText}>{testimonial.name[0]}</Text>
                  </View>
                  <View>
                    <Text style={styles.testimonialName}>{testimonial.name}</Text>
                    <View style={styles.testimonialStars}>
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Icon key={i} name="star" size={12} color="#FFD700" />
                      ))}
                    </View>
                  </View>
                </View>
                <Text style={styles.testimonialText}>{testimonial.text}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* ESPACIADO FINAL */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  // HEADER BLANCO CON UBICACIÓN Y TOC TOC
  locationHeader: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  locationMainContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationInfoVertical: {
    flex: 1,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  locationSubtitle: {
    color: '#333',
    fontSize: 11,
    marginLeft: 4,
    flex: 1,
  },
  appName: {
    color: '#000',
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cartButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#FF6B35',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  cartBadgeText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  plusButton: {
    backgroundColor: '#FF8C42',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  plusButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  profileButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // BARRA DE BÚSQUEDA
  searchBarContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  searchBar: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchBarInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  searchBarPlaceholder: {
    flex: 1,
    fontSize: 16,
    color: '#999',
  },
  searchBarIcon: {
    marginLeft: 8,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: '#DDD',
    marginHorizontal: 12,
  },
  micIcon: {
    marginLeft: 4,
  },

  // EXPLOSIVE OFFERS
  offersSection: {
    backgroundColor: '#FF8C42',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden',
  },
  offersContent: {
    flex: 1,
  },
  offersTitle: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 30,
  },
  offersButton: {
    backgroundColor: '#D32F2F',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  offersButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 12,
    marginRight: 4,
  },
  offersCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    position: 'absolute',
    right: -20,
    top: -10,
  },

  // CARRUSEL DE PROMOCIONES
  promotionCarouselSection: {
    marginTop: 16,
  },
  promotionCarouselContainer: {
    marginBottom: 16,
  },
  promotionCarouselContent: {
    paddingHorizontal: 16,
  },
  promotionCard: {
    backgroundColor: '#E8DCC4',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    width: width - 32,
    marginRight: 16,
  },
  promotionTextContainer: {
    flex: 1,
  },
  promotionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#5D4E37',
    marginBottom: 8,
  },
  promotionSubtitle: {
    fontSize: 14,
    color: '#5D4E37',
    marginBottom: 2,
  },
  orderNowButton: {
    backgroundColor: '#8B6914',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginTop: 12,
  },
  orderNowText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  promotionImagePlaceholder: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // SEPARADOR DE SECCIONES
  sectionSeparator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
    paddingHorizontal: 16,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#CCCCCC',
  },
  separatorText: {
    marginHorizontal: 20,
    fontSize: 12,
    fontWeight: '600',
    color: '#999999',
  },

  // TABS RECOMMENDED / FAVOURITES
  tabsContainer: {
    marginTop: 0,
    marginBottom: 16,
    alignItems: 'center',
  },
  tabsWrapper: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
  },
  tabActive: {
    backgroundColor: '#FFF5E6',
    borderWidth: 2,
    borderColor: '#FF8C42',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#FF6B35',
    fontWeight: 'bold',
  },

  // RESTAURANTES CON DESCUENTOS - GRID
  discountRestaurantsSection: {
    paddingHorizontal: 16,
    marginTop: 10,
    marginBottom: 20,
  },
  discountRestaurantsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  discountRestaurantCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    marginBottom: 16,
    width: (width - 48) / 2,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  discountRestaurantImage: {
    width: '100%',
    height: 140,
    resizeMode: 'cover',
  },
  favoriteIconDiscount: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    padding: 6,
    zIndex: 10,
  },
  discountBadge: {
    position: 'absolute',
    bottom: 90,
    left: 0,
    backgroundColor: '#FF6B35',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  discountBadgeText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  discountBadgeSubtext: {
    color: '#FFF',
    fontSize: 10,
  },
  discountRestaurantInfo: {
    padding: 12,
  },
  discountRestaurantName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  discountRestaurantCuisine: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  discountRestaurantMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  discountRestaurantTime: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  emptyFavorites: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyFavoritesText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
    marginTop: 16,
  },
  emptyFavoritesSubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },

  // ACCIONES RÁPIDAS
  quickActionsSection: {
    marginVertical: 20,
  },
  quickActionsList: {
    paddingHorizontal: 20,
  },
  quickActionCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    minWidth: 120,
    alignItems: 'center',
    borderLeftWidth: 4,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  quickActionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.dark,
    textAlign: 'center',
    marginBottom: 4,
  },
  quickActionSubtitle: {
    fontSize: 12,
    color: COLORS.gray,
    textAlign: 'center',
  },

  // CARRUSEL INTERACTIVO
  autoCarouselSection: {
    marginVertical: 20,
  },
  autoCarouselTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  autoCarouselContainer: {
    height: 270,
  },
  autoCarouselScrollContent: {
    paddingHorizontal: 30,
  },
  autoCarouselCardContainer: {
    width: width - 60,
    paddingHorizontal: 10,
  },
  autoCarouselCard: {
    width: '100%',
    height: 230,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  autoCarouselGradient: {
    flex: 1,
    padding: 24,
  },
  autoCarouselBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    elevation: 2,
  },
  autoCarouselBadgeText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  autoCarouselContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingTop: 5,
  },
  autoCarouselTextSection: {
    flex: 1,
    paddingRight: 16,
    justifyContent: 'flex-start',
  },
  autoCarouselPromoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 3,
    lineHeight: 18,
  },
  autoCarouselSubtitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 4,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    lineHeight: 24,
  },
  autoCarouselDescription: {
    fontSize: 13,
    color: COLORS.white,
    opacity: 0.95,
    marginBottom: 8,
    lineHeight: 16,
  },
  autoCarouselButton: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: 'flex-start',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.4)',
    marginTop: 8,
  },
  autoCarouselButtonText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  autoCarouselImageSection: {
    width: 85,
    height: 85,
    alignSelf: 'center',
  },
  autoCarouselImage: {
    width: '100%',
    height: '100%',
    borderRadius: 42.5,
    borderWidth: 2.5,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  autoCarouselIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  autoCarouselIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },



  // ESTADÍSTICAS
  statsSection: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  statCard: {
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.gray,
    textAlign: 'center',
  },
  // SECCIONES MODERNAS
  categoriesSection: {
    marginBottom: 25,
    paddingHorizontal: 20,
  },
  sectionHeaderModern: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitleModern: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  viewAllButtonCentered: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 25,
    backgroundColor: COLORS.primary,
    marginTop: 20,
    marginBottom: 10,
    elevation: 3,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  viewAllTextCentered: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
    marginRight: 8,
  },


  // CATEGORÍAS MODERNAS
  categoriesListModern: {
    paddingBottom: 10,
  },
  categoryCardModern: {
    marginRight: 12,
    borderRadius: 20,
    overflow: 'hidden',
  },
  categoryGradient: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignItems: 'center',
    minWidth: 100,
  },
  categoryCardActive: {
    transform: [{ scale: 1.05 }],
  },
  categoryEmojiModern: {
    fontSize: 28,
    marginBottom: 8,
  },
  categoryTextModern: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.dark,
    textAlign: 'center',
  },
  categoryTextActive: {
    color: COLORS.white,
  },

  // PRODUCTOS POPULARES MODERNOS
  popularSectionModern: {
    marginBottom: 25,
    paddingHorizontal: 20,
  },
  popularListModern: {
    paddingBottom: 10,
  },
  productCardModern: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    marginRight: 16,
    width: 180,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    overflow: 'hidden',
  },
  productImageContainer: {
    position: 'relative',
  },
  productImageModern: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  productImageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
  },
  productAddButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productInfoModern: {
    padding: 12,
  },
  productNameModern: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: 8,
  },
  productMetaModern: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productRatingModern: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productRatingText: {
    fontSize: 12,
    color: COLORS.gray,
    marginLeft: 4,
  },
  productPriceModern: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  // RESTAURANTES MODERNOS
  restaurantsSectionModern: {
    marginBottom: 25,
    paddingHorizontal: 20,
  },
  restaurantsGridModern: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  restaurantCardModern: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    width: (width - 70) / 2,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    overflow: 'hidden',
  },
  restaurantImageContainer: {
    position: 'relative',
  },
  restaurantImageModern: {
    width: '100%',
    height: 100,
    resizeMode: 'cover',
  },
  restaurantBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#4ECDC4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  restaurantBadgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  restaurantInfoModern: {
    padding: 12,
  },
  restaurantNameModern: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: 6,
  },
  restaurantMetaModern: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  restaurantRatingModern: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  restaurantRatingText: {
    fontSize: 11,
    color: COLORS.gray,
    marginLeft: 2,
  },
  restaurantTimeModern: {
    fontSize: 11,
    color: COLORS.gray,
  },
  restaurantCuisineModern: {
    fontSize: 12,
    color: COLORS.gray,
  },

  // TESTIMONIOS MODERNOS
  testimonialsSection: {
    marginBottom: 25,
    paddingHorizontal: 20,
  },
  testimonialCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginRight: 16,
    width: 280,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  testimonialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  testimonialAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  testimonialAvatarText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  testimonialName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: 2,
  },
  testimonialStars: {
    flexDirection: 'row',
  },
  testimonialText: {
    fontSize: 13,
    color: COLORS.gray,
    lineHeight: 18,
    fontStyle: 'italic',
  },

  // ANIMACIONES Y EFECTOS
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
});

export default HomeContentComponent;
