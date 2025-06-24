import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { COLORS } from "../theme/colors";
import Icon from "react-native-vector-icons/MaterialIcons";
import CategoryCard from "../components/CategoryCard";
import FoodCard from "../components/FoodCard";
import AutoCarousel from "../components/AutoCarousel";
import { SPACING } from "../theme/spacing";
import RestaurantCard from "../components/RestaurantCard";
import { restaurantsService } from "../services/restaurantsService";
import { searchService } from "../services/searchService";

const CATEGORIES = [
  {
    id: "0",
    icon: { name: "list" },
    title: "Todo",
  },
  {
    id: "1",
    icon: { uri: "https://cdn-icons-png.flaticon.com/512/877/877951.png" },
    title: "Hamburguesas",
  },
  {
    id: "2",
    icon: { uri: "https://cdn-icons-png.flaticon.com/512/3132/3132693.png" },
    title: "Pizza",
  },
  {
    id: "3",
    icon: { uri: "https://cdn-icons-png.flaticon.com/512/6594/6594511.png"},
    title: "Pollo"
  },
  {
    id: "4",
    icon: { uri: "https://cdn-icons-png.flaticon.com/512/2405/2405479.png" },
    title: "Bebidas",
  },
  {
    id: "5",
    icon: { uri: "https://cdn-icons-png.flaticon.com/512/2755/2755254.png" },
    title: "Pollo Broster",
  },
];

const HomeContentComponent = ({ onAddToCart, onProductPress }) => {
  const [activeCategory, setActiveCategory] = useState("0");
  const [restaurants, setRestaurants] = useState([]);
  const [popularFoods, setPopularFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingFoods, setLoadingFoods] = useState(true);

  // Cargar restaurantes abiertos
  useEffect(() => {
    loadOpenRestaurants();
  }, []);

  // Cargar productos populares
  useEffect(() => {
    loadPopularFoods();
  }, []);

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
      console.log('DEBUG: Iniciando fetch de productos populares');
      const response = await searchService.getFeaturedProducts(5);
      console.log('DEBUG: Respuesta de la API', response);
      // Asegura que popularFoods sea un array de productos
      const products = Array.isArray(response.data?.data)
        ? response.data.data
        : Array.isArray(response.data)
          ? response.data
          : [];
      console.log('DEBUG: Productos extraídos', products);
      setPopularFoods(products);
    } catch (error) {
      console.error('Error cargando productos populares:', error);
    } finally {
      setLoadingFoods(false);
    }
  };

  const filteredFoods =
    activeCategory === "0"
      ? popularFoods
      : popularFoods.filter((food) => food.category === activeCategory);

  // DEBUG: Ver los datos que llegan de la API
  console.log('DEBUG popularFoods:', popularFoods);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Cargando restaurantes...</Text>
      </View>
    );
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      

      <AutoCarousel items={[]} />

      <View style={styles.popularSection}>
        <Text style={[styles.sectionTitle, {textAlign: 'center'}]}>Populares ahora</Text>
        <Text style={[styles.sectionSubtitle, {textAlign: 'center'}]}>¡Descubre los favoritos de nuestros usuarios!</Text>
        <View style={{alignItems: 'center'}}>
          {(() => {
            const rows = [];
            for (let i = 0; i < filteredFoods.length; i += 2) {
              rows.push(
                <View key={i} style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 10 }}>
                  <View style={{ width: '50%', marginRight: 8 }}>
                    <FoodCard
                      key={filteredFoods[i]?.id}
                      image={filteredFoods[i]?.image}
                      name={filteredFoods[i]?.name}
                      price={filteredFoods[i]?.price}
                      stars={filteredFoods[i]?.stars}
                      onPress={() => onProductPress(filteredFoods[i])}
                      onAddPress={() => onAddToCart(filteredFoods[i])}
                    />
                  </View>
                  {filteredFoods[i + 1] && (
                    <View style={{ width: '48%', marginLeft: 8 }}>
                      <FoodCard
                        key={filteredFoods[i + 1]?.id}
                        image={filteredFoods[i + 1]?.image}
                        name={filteredFoods[i + 1]?.name}
                        price={filteredFoods[i + 1]?.price}
                        stars={filteredFoods[i + 1]?.stars}
                        onPress={() => onProductPress(filteredFoods[i + 1])}
                        onAddPress={() => onAddToCart(filteredFoods[i + 1])}
                      />
                    </View>
                  )}
                </View>
              );
            }
            return rows;
          })()}
        </View>
      </View>

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
        
        <View style={styles.restaurantsContainer}>
          {restaurants
            .filter(restaurant => restaurant !== null)
            .map((restaurant) => (
            <RestaurantCard
              key={restaurant.id}
              restaurant={restaurant}
              onPress={() => console.log('Restaurant pressed:', restaurant.name)}
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: COLORS.text.primary,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  subtitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: COLORS.text.primary,
    paddingHorizontal: 20,
    marginBottom: SPACING.sm,
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    marginTop: SPACING.md,
  },
  popularSection: {
    paddingHorizontal: 20,
    marginTop: SPACING.sm,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: COLORS.text.secondary,
    marginBottom: 12,
    textAlign: 'center',
  },
  popularGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  openRestaurantsSection: {
    paddingHorizontal: SPACING.md,
    marginTop: SPACING.xl,
    paddingBottom: 40,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.lg,
  },
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.text.primary,
    marginLeft: SPACING.sm,
  },
  seeAllButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.lightGray,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.primary,
    marginRight: SPACING.xs,
  },
  restaurantsContainer: {
    flexDirection: "column",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.primary,
    marginTop: SPACING.md,
  },
});

export default HomeContentComponent;
