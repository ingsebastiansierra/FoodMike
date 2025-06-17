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
import AutoCarousel from "../components/AutoCarousel";
import { SPACING } from "../theme/spacing";
import RestaurantCard from "../components/RestaurantCard";

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

const POPULAR_FOODS = [
  {
    id: "1",
    image: {
      uri: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3",
    },
    title: "Hamburguesa Clásica Especial",
    price: "12",
    category: "1",
  },
  {
    id: "2",
    image: {
      uri: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?ixlib=rb-4.0.3",
    },
    title: "Pizza Suprema",
    price: "15",
    category: "2",
  },
  {
    id: "3",
    image: {
      uri: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?ixlib=rb-4.0.3",
    },
    title: "Pollo Broster Familiar",
    price: "20",
    category: "5",
  },
  {
    id: "4",
    image: {
      uri: "https://images.unsplash.com/photo-1600935926387-12d9b03066f0?ixlib=rb-4.0.3",
    },
    title: "Alitas BBQ x12",
    price: "18",
    category: "3",
  },
  {
    id: "5",
    image: {
      uri: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    title: "Coca-Cola",
    price: "2",
    category: "4",
  },
];

const HomeContentComponent = () => {
  const [activeCategory, setActiveCategory] = useState("0");

  const RESTAURANTS = [
    {
      id: "1",
      name: "El Corral",
      stars: 4.5,
      address: "Calle 123 # 45-67",
      schedule: "10:00 AM - 10:00 PM",
      image: {
        uri: "https://elcorral.com/wp-content/uploads/2023/05/home-el-corral-especial.png",
      },
    },
    {
      id: "2",
      name: "McDonalds",
      stars: 4.0,
      address: "Avenida 456 # 78-90",
      schedule: "6:00 AM - 12:00 AM",
      image: {
        uri: "https://corporate.mcdonalds.com/content/dam/gwscorp/nfl/nfl-navigation/mcdonalds_logo.png",
      },
    },
    {
      id: "3",
      name: "Burger King",
      stars: 3.5,
      address: "Carrera 789 # 01-23",
      schedule: "7:00 AM - 11:00 PM",
      image: {
        uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Burger_King_logo_%281999-2021%29.svg/2024px-Burger_King_logo_%281999-2021%29.svg.png",
      },
    },
    {
      id: "4",
      name: "KFC",
      stars: 4.2,
      address: "Transversal 012 # 34-56",
      schedule: "9:00 AM - 9:00 PM",
      image: {
        uri: "https://upload.wikimedia.org/wikipedia/en/thumb/b/bf/KFC_logo.svg/1200px-KFC_logo.svg.png",
      },
    },
    {
      id: "5",
      name: "Domino's Pizza",
      stars: 4.8,
      address: "Diagonal 345 # 67-89",
      schedule: "11:00 AM - 11:00 PM",
      image: {
        uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Dominos_pizza_logo.svg/2560px-Dominos_pizza_logo.svg.png",
      },
    },
    {
      id: "6",
      name: "Subway",
      stars: 3.9,
      address: "Circular 678 # 90-12",
      schedule: "8:00 AM - 10:00 PM",
      image: {
        uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Subway_logo.svg/2560px-Subway_logo.svg.png",
      },
    },
  ];

  const filteredFoods =
    activeCategory === "0"
      ? POPULAR_FOODS
      : POPULAR_FOODS.filter((food) => food.category === activeCategory);

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      

      <SearchBar onSearch={() => {}} />

      <AutoCarousel items={[]} />

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

      <View style={styles.popularSection}>
        <Text style={styles.sectionTitle}>Populares ahora</Text>
        <View style={styles.popularGrid}>
          {filteredFoods.map((food) => (
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

      <View style={styles.openRestaurantsSection}>
        <Text style={styles.sectionTitle}>Restaurantes Abiertos</Text>
        <View style={styles.openRestaurantsGrid}>
          {RESTAURANTS.map((restaurant) => (
            <RestaurantCard
              key={restaurant.id}
              restaurant={restaurant}
              style={styles.restaurantCard}
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

export default HomeContentComponent;
