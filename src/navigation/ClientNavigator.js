import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/FontAwesome';
import { COLORS } from '../theme/colors';

// Pantallas del Cliente
import ClientHomeScreen from '../features/client/screens/ClientHomeScreen';
import SearchScreen from '../features/client/screens/SearchScreen';
import OrdersScreen from '../features/client/screens/OrdersScreen';
import FavoritesScreen from '../features/client/screens/FavoritesScreen';
import ProfileScreen from '../features/client/screens/ProfileScreen';

// Pantallas de detalle (para el Stack)
import RestaurantDetailScreen from '../features/client/screens/RestaurantDetailScreen';
import ProductDetailScreen from '../features/client/screens/ProductDetailScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Creamos un Stack para el flujo principal que inicia en Home
// Esto permite navegar a detalles (Producto, Restaurante) desde la pestaña Inicio
const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeInitial" component={ClientHomeScreen} />
    <Stack.Screen name="RestaurantDetail" component={RestaurantDetailScreen} />
    <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
  </Stack.Navigator>
);

const ClientNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Inicio') iconName = 'home';
          else if (route.name === 'Buscar') iconName = 'search';
          else if (route.name === 'Pedidos') iconName = 'file-text';
          else if (route.name === 'Favoritos') iconName = 'heart';
          else if (route.name === 'Perfil') iconName = 'user';
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.gray,
        tabBarStyle: { backgroundColor: COLORS.white, borderTopWidth: 0, elevation: 10 },
      })}
    >
      <Tab.Screen name="Inicio" component={HomeStack} />
      <Tab.Screen name="Buscar" component={SearchScreen} />
      <Tab.Screen name="Pedidos" component={OrdersScreen} />
      <Tab.Screen name="Favoritos" component={FavoritesScreen} />
      <Tab.Screen name="Perfil" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default ClientNavigator;
