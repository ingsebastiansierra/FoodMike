import React from 'react';
import { TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/FontAwesome';
import CartHeaderButton from '../components/CartHeaderButton';
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
import CarritoComponent from '../components/CarritoComponent';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Opciones comunes para el encabezado de los Stacks
const commonStackScreenOptions = ({ navigation }) => ({
  headerTitle: 'FoodMike',
  headerTitleAlign: 'center',
  headerStyle: {
    backgroundColor: COLORS.white,
    elevation: 1,
    shadowOpacity: 0.1,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  headerTitleStyle: {
    fontWeight: 'bold',
    fontSize: 20,
    color: COLORS.darkGray,
  },
  headerRight: () => <CartHeaderButton />,
});

// Stacks para cada pestaña
const HomeStack = () => (
  <Stack.Navigator screenOptions={commonStackScreenOptions}>
    <Stack.Screen name="HomeInitial" component={ClientHomeScreen} />
    <Stack.Screen name="RestaurantDetail" component={RestaurantDetailScreen} />
    <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
    <Stack.Screen name="Carrito" component={CarritoComponent} />
  </Stack.Navigator>
);

const SearchStack = () => (
  <Stack.Navigator screenOptions={commonStackScreenOptions}>
    <Stack.Screen name="SearchInitial" component={SearchScreen} />
    <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
    <Stack.Screen name="RestaurantDetail" component={RestaurantDetailScreen} />
    <Stack.Screen name="Carrito" component={CarritoComponent} />
  </Stack.Navigator>
);

const OrdersStack = () => (
  <Stack.Navigator screenOptions={commonStackScreenOptions}>
    <Stack.Screen
      name="OrdersInitial"
      component={OrdersScreen}
      options={{ headerRight: () => null }} // No mostrar el carrito en la pantalla del carrito
    />
  </Stack.Navigator>
);

const FavoritesStack = () => (
  <Stack.Navigator screenOptions={commonStackScreenOptions}>
    <Stack.Screen name="FavoritesInitial" component={FavoritesScreen} />
  </Stack.Navigator>
);

const ProfileStack = () => (
  <Stack.Navigator screenOptions={commonStackScreenOptions}>
    <Stack.Screen name="ProfileInitial" component={ProfileScreen} />
    <Stack.Screen name="Carrito" component={CarritoComponent} />
  </Stack.Navigator>
);

const ClientNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false, // Los encabezados son manejados por los Stacks internos
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
      <Tab.Screen name="Buscar" component={SearchStack} />
      <Tab.Screen name="Pedidos" component={OrdersStack} />
      <Tab.Screen name="Favoritos" component={FavoritesStack} />
      <Tab.Screen name="Perfil" component={ProfileStack} />
    </Tab.Navigator>
  );
};

export default ClientNavigator;
