import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Pantallas
import ClientHomeScreen from '../features/client/screens/ClientHomeScreen';
import CarritoComponent from '../components/CarritoComponent';
import SearchScreen from '../features/client/screens/SearchScreen';
import RestaurantDetailScreen from '../features/client/screens/RestaurantDetailScreen';
import ProductDetailScreen from '../features/client/screens/ProductDetailScreen';

const Stack = createStackNavigator();

const ClientNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ClientDashboard" component={ClientHomeScreen} />
    <Stack.Screen name="Carrito" component={CarritoComponent} />
    <Stack.Screen name="Search" component={SearchScreen} />
    <Stack.Screen name="RestaurantDetail" component={RestaurantDetailScreen} />
    <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
  </Stack.Navigator>
);

export default ClientNavigator;
