import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS } from '../theme/colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CategoryCard from '../components/CategoryCard';
import FoodCard from '../components/FoodCard';
import SearchBar from '../components/SearchBar';
import BottomNavBar from '../components/BottomNavBar';

const CATEGORIES = [
  {
    id: '1',
    icon: { uri: 'https://cdn-icons-png.flaticon.com/512/877/877951.png' },
    title: 'Hamburguesas',
  },
  {
    id: '2',
    icon: { uri: 'https://cdn-icons-png.flaticon.com/512/3132/3132693.png' },
    title: 'Pizza',
  },
  {
    id: '3',
    icon: { uri: 'https://cdn-icons-png.flaticon.com/512/1046/1046784.png' },
    title: 'Pollo',
  },
  {
    id: '4',
    icon: { uri: 'https://cdn-icons-png.flaticon.com/512/2405/2405479.png' },
    title: 'Bebidas',
  },
  {
    id: '5',
    icon: { uri: 'https://cdn-icons-png.flaticon.com/512/8090/8090510.png' },
    title: 'Pollo Broster',
  },
];

const POPULAR_FOODS = [
  {
    id: '1',
    image: { uri: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3' },
    title: 'Hamburguesa Clásica Especial',
    price: '12',
  },
  {
    id: '2',
    image: { uri: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?ixlib=rb-4.0.3' },
    title: 'Pizza Suprema',
    price: '15',
  },
  {
    id: '3',
    image: { uri: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?ixlib=rb-4.0.3' },
    title: 'Pollo Broster Familiar',
    price: '20',
  },
  {
    id: '4',
    image: { uri: 'https://images.unsplash.com/photo-1600935926387-12d9b03066f0?ixlib=rb-4.0.3' },
    title: 'Alitas BBQ x12',
    price: '18',
  },
];

const HomeScreen = () => {
  const [activeCategory, setActiveCategory] = useState('1');
  const [activeTab, setActiveTab] = useState('home');

  return (
    <SafeAreaView style={styles.container}>
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
        <Text style={styles.title}>Comida deliciosa.</Text>
        <Text style={styles.subtitle}>Entrega súper rápida.</Text>

        {/* Search Bar */}
        <SearchBar onSearch={() => {}} />

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
          <Text style={styles.sectionTitle}>Popular ahora</Text>
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
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNavBar
        activeTab={activeTab}
        onTabPress={setActiveTab}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.secondary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  subtitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    paddingHorizontal: 20,
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    marginTop: 30,
  },
  popularSection: {
    paddingHorizontal: 20,
    marginTop: 30,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: 20,
  },
  popularGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
});

export default HomeScreen; 