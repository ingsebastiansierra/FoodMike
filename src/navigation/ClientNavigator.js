import React, { useEffect } from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import CartHeaderButton from '../components/CartHeaderButton';
import { COLORS } from '../theme/colors';
import { useNavigation } from '@react-navigation/native';
import CartNavigationHandler from '../components/CartNavigationHandler';

// Componente personalizado para el ícono con efecto de mordida
const TabIconWithBite = React.memo(({ iconName, focused, size }) => {
  return (
    <View style={tabIconStyles.container}>
      <View style={[
        tabIconStyles.iconWrapper,
        focused && tabIconStyles.iconWrapperActive
      ]}>
        <Icon
          name={iconName}
          size={size}
          color={focused ? COLORS.primary : COLORS.white}
        />
      </View>
    </View>
  );
});

const tabIconStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
  },
  iconWrapper: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  iconWrapperActive: {
    backgroundColor: COLORS.white,
    shadowColor: COLORS.white,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    transform: [{ translateY: -2 }, { scale: 1.05 }],
  },
});

// Pantallas del Cliente
import ClientHomeScreen from '../features/client/screens/ClientHomeScreen';
import SearchScreen from '../features/client/screens/SearchScreen';
import OrdersScreen from '../features/client/screens/OrdersScreen';
import FavoritesScreen from '../features/client/screens/FavoritesScreen';
import ProfileScreen from '../features/client/screens/ProfileScreen';

// Pantallas de detalle (para el Stack)
import RestaurantDetailScreen from '../features/client/screens/RestaurantDetailScreen';
import ProductDetailScreen from '../features/client/screens/ProductDetailScreen';
import CheckoutScreen from '../features/client/screens/CheckoutScreen';
import OrderDetailScreen from '../features/client/screens/OrderDetailScreen';
import CarritoComponent from '../components/CarritoComponent';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Opciones básicas para los stacks (sin header)
const stackScreenOptions = {
  headerShown: false,
  gestureEnabled: true,
  cardOverlayEnabled: true,
};

// Stacks para cada pestaña
const HomeStack = () => (
  <Stack.Navigator
    screenOptions={stackScreenOptions}
  >
    <Stack.Screen name="HomeInitial" component={ClientHomeScreen} />
    <Stack.Screen name="RestaurantDetail" component={RestaurantDetailScreen} />
    <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
    <Stack.Screen
      name="Carrito"
      component={CarritoComponent}
      options={{
        headerRight: () => null,
        headerTitle: 'Mi Carrito',
        presentation: 'modal',
        gestureEnabled: true,
        animationTypeForReplace: 'push',
      }}
    />
    <Stack.Screen
      name="Checkout"
      component={CheckoutScreen}
      options={{
        headerRight: () => null,
        gestureEnabled: true,
      }}
    />
    <Stack.Screen
      name="OrderDetail"
      component={OrderDetailScreen}
      options={{
        headerRight: () => null,
        gestureEnabled: true,
      }}
    />
  </Stack.Navigator>
);

const SearchStack = () => (
  <Stack.Navigator screenOptions={stackScreenOptions}>
    <Stack.Screen name="SearchInitial" component={SearchScreen} />
    <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
    <Stack.Screen name="RestaurantDetail" component={RestaurantDetailScreen} />
    <Stack.Screen
      name="Carrito"
      component={CarritoComponent}
      options={{
        headerRight: () => null,
        headerTitle: 'Mi Carrito',
        presentation: 'modal',
        gestureEnabled: true,
      }}
    />
    <Stack.Screen
      name="Checkout"
      component={CheckoutScreen}
      options={{ headerRight: () => null }}
    />
  </Stack.Navigator>
);

const OrdersStack = () => (
  <Stack.Navigator screenOptions={stackScreenOptions}>
    <Stack.Screen name="OrdersInitial" component={OrdersScreen} />
    <Stack.Screen
      name="Carrito"
      component={CarritoComponent}
      options={{
        headerRight: () => null,
        headerTitle: 'Mi Carrito',
        presentation: 'modal',
        gestureEnabled: true,
        animationTypeForReplace: 'push',
      }}
    />
    <Stack.Screen
      name="Checkout"
      component={CheckoutScreen}
      options={{
        headerRight: () => null,
        gestureEnabled: true,
      }}
    />
    <Stack.Screen
      name="OrderDetail"
      component={OrderDetailScreen}
      options={{
        headerShown: true,
        headerTitle: 'Detalle del Pedido',
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: COLORS.primary,
          elevation: 1,
          shadowOpacity: 0.1,
          borderBottomWidth: 0,
        },
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 20,
          color: COLORS.white,
        },
        gestureEnabled: true,
      }}
    />
  </Stack.Navigator>
);

const FavoritesStack = () => (
  <Stack.Navigator screenOptions={stackScreenOptions}>
    <Stack.Screen name="FavoritesInitial" component={FavoritesScreen} />
    <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
    <Stack.Screen name="RestaurantDetail" component={RestaurantDetailScreen} />
    <Stack.Screen
      name="Carrito"
      component={CarritoComponent}
      options={{
        headerRight: () => null,
        headerTitle: 'Mi Carrito',
        presentation: 'modal',
        gestureEnabled: true,
        animationTypeForReplace: 'push',
      }}
    />
    <Stack.Screen
      name="Checkout"
      component={CheckoutScreen}
      options={{
        headerRight: () => null,
        gestureEnabled: true,
      }}
    />
  </Stack.Navigator>
);

const ProfileStack = () => (
  <Stack.Navigator screenOptions={stackScreenOptions}>
    <Stack.Screen name="ProfileInitial" component={ProfileScreen} />
    <Stack.Screen
      name="Carrito"
      component={CarritoComponent}
      options={{
        headerRight: () => null,
        headerTitle: 'Mi Carrito',
        presentation: 'modal',
        gestureEnabled: true,
        animationTypeForReplace: 'push',
      }}
    />
    <Stack.Screen
      name="Checkout"
      component={CheckoutScreen}
      options={{
        headerRight: () => null,
        gestureEnabled: true,
      }}
    />
  </Stack.Navigator>
);

const ClientNavigator = () => {
  return (
    <CartNavigationHandler>
      <Tab.Navigator

        screenOptions={({ route }) => ({
          headerShown: true, // Mostrar header a nivel de Tab
          headerTitle: 'TOC TOC',
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: COLORS.primary,
            elevation: 1,
            shadowOpacity: 0.1,
            borderBottomWidth: 0,
          },
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 20,
            color: COLORS.white,
          },
          headerRight: () => <CartHeaderButton />,
          lazy: false, // Cargar todas las pantallas inmediatamente
          tabBarHideOnKeyboard: true,
          animationEnabled: true,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Inicio') iconName = 'home';
            else if (route.name === 'Buscar') iconName = 'search';
            else if (route.name === 'Pedidos') iconName = 'file-text';
            else if (route.name === 'Favoritos') iconName = 'heart';
            else if (route.name === 'Perfil') iconName = 'user';

            return (
              <TabIconWithBite
                iconName={iconName}
                focused={focused}
                size={focused ? 24 : 20}
              />
            );
          },
          tabBarActiveTintColor: COLORS.white,
          tabBarInactiveTintColor: COLORS.white,
          tabBarStyle: {
            backgroundColor: COLORS.primary,
            borderTopWidth: 0,
            elevation: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -1 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            height: 85,
            paddingBottom: 20,
            paddingTop: 10,
          },
          tabBarItemStyle: {
            paddingVertical: 5,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
            letterSpacing: 0.3,
            marginTop: 4,
          },
          tabBarIconStyle: {
            marginTop: 5,
          },
        })}
      >
        <Tab.Screen name="Inicio" component={HomeStack} />
        <Tab.Screen name="Buscar" component={SearchStack} />
        <Tab.Screen name="Pedidos" component={OrdersStack} />
        <Tab.Screen name="Favoritos" component={FavoritesStack} />
        <Tab.Screen name="Perfil" component={ProfileStack} />
      </Tab.Navigator>
    </CartNavigationHandler>
  );
};

export default ClientNavigator;
