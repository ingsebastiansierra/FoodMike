import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { COLORS } from "../theme/colors";
import Icon from "react-native-vector-icons/MaterialIcons";
import CategoryCard from "../components/CategoryCard";
import FoodCard from "../components/FoodCard";
import SearchBar from "../components/SearchBar";
import BottomNavBar from "../components/BottomNavBar";
import AutoCarousel from "../components/AutoCarousel";
import ScreenContainer from "../components/ScreenContainer";
import { SPACING } from "../theme/spacing";
import RestaurantCard from "../components/RestaurantCard";

const OPEN_RESTAURANTS = [
  {
    id: "1",
    name: "La fontana",
    cuisine: "Hamburguesas",
    rating: 4.5,
    image:
      "https://images.unsplash.com/photo-1553979459-d2229ba7433b?ixlib=rb-4.0.3",
  },
  {
    id: "2",
    name: "Punto rico",
    cuisine: "Pollo",
    rating: 4.2,
    image:
      "https://images.unsplash.com/photo-1712579733874-c3a79f0f9d12?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "3",
    name: "La Pizzeria the sanchez",
    cuisine: "Hamburguesas",
    rating: 4.5,
    image:
      "https://images.unsplash.com/photo-1553979459-d2229ba7433b?ixlib=rb-4.0.3",
  },
  {
    id: "5",
    name: "Pake pike",
    cuisine: "Comida mexicana",
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1679605097294-ad339b020c0f?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

const CAROUSEL_ITEMS = [
  {
    id: "1",
    image: {
      uri: "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3",
    },
    title: "Pizzas 2x1",
    description: "Todos los martes y jueves",
    onPress: () => {},
  },
  {
    id: "2",
    image: {
      uri: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3",
    },
    title: "Hamburguesas",
    description: "¡20% de descuento!",
    onPress: () => {},
  },
  {
    id: "3",
    image: {
      uri: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?ixlib=rb-4.0.3",
    },
    title: "Pollo Broster",
    description: "Nuevo combo familiar",
    onPress: () => {},
  },
];

const CATEGORIES = [
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
    icon: { uri: "https://cdn-icons-png.flaticon.com/512/1046/1046784.png" },
    title: "Pollo",
  },
  {
    id: "4",
    icon: { uri: "https://cdn-icons-png.flaticon.com/512/2405/2405479.png" },
    title: "Bebidas",
  },
  {
    id: "5",
    icon: { uri: "https://cdn-icons-png.flaticon.com/512/8090/8090510.png" },
    title: "Pollo Broster",
  },
];

const POPULAR_FOODS = [
  {
    id: "1",
    image: {
      uri: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3",
    },
    title: "Hamburguesa Clásica Especial",
    price: "12",
  },
  {
    id: "2",
    image: {
      uri: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?ixlib=rb-4.0.3",
    },
    title: "Pizza Suprema",
    price: "15",
  },
  {
    id: "3",
    image: {
      uri: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?ixlib=rb-4.0.3",
    },
    title: "Pollo Broster Familiar",
    price: "20",
  },
  {
    id: "4",
    image: {
      uri: "https://images.unsplash.com/photo-1600935926387-12d9b03066f0?ixlib=rb-4.0.3",
    },
    title: "Alitas BBQ x12",
    price: "18",
  },
];

const HomeScreen = () => {
  const [activeCategory, setActiveCategory] = useState("1");
  const [activeTab, setActiveTab] = useState("home");

  return (
    <ScreenContainer>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Icon name="menu" size={30} color={COLORS.black} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon name="shopping-cart" size={30} color={COLORS.black} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Title */}
        <Text style={styles.title}>Comida deliciosa</Text>
        <Text style={styles.subtitle}>Entrega súper rápida</Text>

        {/* Search Bar */}
        <SearchBar onSearch={() => {}} />

        {/* Carousel */}
        <AutoCarousel items={CAROUSEL_ITEMS} />

        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
        >
          {CATEGORIES.map((category) => (
            <CategoryCard
              key={category.id}
              icon={category.icon}
              title={category.title}
              isActive={activeCategory === category.id}
              onPress={() => setActiveCategory(category.id)}
            />
          ))}
        </ScrollView>

        {/* Popular Now */}
        <View style={styles.popularSection}>
          <Text style={styles.sectionTitle}>Populares ahora</Text>
          <View style={styles.popularGrid}>
            {POPULAR_FOODS.map((food) => (
              <FoodCard
                key={food.id}
                image={food.image}
                title={food.title}
                price={food.price}
                onPress={() => {}}
                onAddPress={() => {}}
              />
            ))}
          </View>
        </View>

        {/* Restaurantes Abiertos */}
        <View style={styles.openRestaurantsSection}>
          <Text style={styles.sectionTitle}>Restaurantes Abiertos</Text>
          <View style={styles.openRestaurantsGrid}>
            {OPEN_RESTAURANTS.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                style={styles.restaurantCard}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNavBar activeTab={activeTab} onTabPress={setActiveTab} />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: "center",
  },
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
    marginTop: SPACING.lg,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
  },
  popularGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  openRestaurantsSection: {
    paddingHorizontal: 20,
    marginTop: SPACING.md,
    paddingBottom: 20,
  },
  openRestaurantsGrid: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
  },
  restaurantCard: {
    width: "80%",
  },
});

export default HomeScreen;
