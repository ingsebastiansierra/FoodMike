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
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from "../theme/colors";
import Icon from "react-native-vector-icons/MaterialIcons";
import CategoryCard from "../components/CategoryCard";
import FoodCard from "../components/FoodCard";
import AutoCarousel from "../components/AutoCarousel";
import { SPACING } from "../theme/spacing";
import RestaurantCard from "../components/RestaurantCard";
import { restaurantsService } from "../services/restaurantsService";
import { searchService } from "../services/searchService";

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

const CATEGORIES = [
  { id: "1", icon: "hamburger", emoji: "🍔", title: "Burgers" },
  { id: "2", icon: "pizza", emoji: "🍕", title: "Pizza" },
  { id: "3", icon: "sushi", emoji: "🍣", title: "Sushi" },
  { id: "4", icon: "fries", emoji: "🍟", title: "Snacks" },
  { id: "5", icon: "drink", emoji: "🥤", title: "Bebidas" },
];

const EXPERIENCES = [
  { id: 1, text: '“¡La mejor app para pedir comida en mi ciudad!”' },
  { id: 2, text: '“Rápido, fácil y delicioso. 5 estrellas.”' },
  { id: 3, text: '“Variedad, calidad y servicio top.”' },
];

const HomeContentComponent = ({ onAddToCart, onProductPress }) => {
  const [activeCategory, setActiveCategory] = useState("1");
  const [restaurants, setRestaurants] = useState([]);
  const [popularFoods, setPopularFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingFoods, setLoadingFoods] = useState(true);
  const [userName, setUserName] = useState('Mike'); // Puedes personalizar esto

  useEffect(() => { loadOpenRestaurants(); }, []);
  useEffect(() => { loadPopularFoods(); }, []);

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

  const filteredFoods =
    activeCategory === "all"
      ? popularFoods
      : popularFoods.filter((food) =>
          food.category?.toLowerCase().includes(CATEGORIES.find(c => c.id === activeCategory)?.title.toLowerCase() || '')
        );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Cargando restaurantes...</Text>
      </View>
    );
  }

  return (
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
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat.id}
              style={[styles.categoryButton, activeCategory === cat.id && styles.categoryButtonActive]}
              onPress={() => setActiveCategory(cat.id)}
              activeOpacity={0.8}
            >
              <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
              <Text style={styles.categoryText}>{cat.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* POPULARES AHORA */}
      <View style={styles.popularSection}>
        <Text style={styles.sectionTitle}>Populares Ahora</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.popularList}>
          {filteredFoods.map((food, idx) => (
            <View key={food.id || idx} style={styles.popularCard}>
              <TouchableOpacity onPress={() => onProductPress(food)} activeOpacity={0.9}>
                <Image source={{ uri: food.image }} style={styles.popularImage} />
                <View style={styles.popularInfo}>
                  <Text style={styles.popularName}>{food.name}</Text>
                  <Text style={styles.popularPrice}>${food.price}</Text>
                  <View style={styles.popularRatingRow}>
                    <Icon name="star" size={16} color={COLORS.primary} />
                    <Text style={styles.popularRating}>{food.stars || '4.5'}</Text>
                  </View>
                  <TouchableOpacity style={styles.popularAddBtn} onPress={() => onAddToCart(food)}>
                    <Text style={styles.popularAddBtnText}>Agregar +</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* RESTAURANTES ABIERTOS */}
      <View style={styles.openRestaurantsSection}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleContainer}>
            <Icon name="restaurant" size={24} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Restaurantes Abiertos</Text>
          </View>
          <TouchableOpacity style={styles.seeAllButton}>
            <Text style={styles.seeAllText}>Ver todos</Text>
            <Icon name="chevron-right" size={14} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.restaurantsContainer}>
          {restaurants.filter(r => r !== null).map((restaurant) => (
            <View key={restaurant.id} style={styles.restaurantCardWrapper}>
              <RestaurantCard
                restaurant={restaurant}
                onPress={() => console.log('Restaurant pressed:', restaurant.name)}
              />
            </View>
          ))}
        </ScrollView>
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
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.dark,
    marginBottom: 8,
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
    fontSize: 32,
    marginBottom: 4,
  },
  categoryText: {
    fontSize: 14,
    color: COLORS.dark,
    fontWeight: '600',
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
  },
  popularCard: {
    width: 180,
    marginRight: 16,
    backgroundColor: COLORS.white,
    borderRadius: 18,
    elevation: 2,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    overflow: 'hidden',
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
  restaurantsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 8,
  },
  restaurantCardWrapper: {
    marginRight: 16,
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
});

export default HomeContentComponent;
