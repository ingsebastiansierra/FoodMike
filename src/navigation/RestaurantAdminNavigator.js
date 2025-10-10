import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../theme/colors';

// Screens
import RestaurantAdminDashboardScreen from '../screens/RestaurantAdminDashboardScreen';
import RestaurantProductsScreen from '../screens/RestaurantProductsScreen';
import RestaurantOrdersScreen from '../screens/RestaurantOrdersScreen';
import RestaurantSettingsScreen from '../screens/RestaurantSettingsScreen';
import AddProductScreen from '../screens/AddProductScreen';
import EditProductScreen from '../screens/EditProductScreen';
import OrderDetailScreen from '../screens/OrderDetailScreen';

// Verificar que todos los componentes estén definidos
console.log('RestaurantAdminDashboardScreen:', typeof RestaurantAdminDashboardScreen);
console.log('RestaurantProductsScreen:', typeof RestaurantProductsScreen);
console.log('RestaurantOrdersScreen:', typeof RestaurantOrdersScreen);
console.log('RestaurantSettingsScreen:', typeof RestaurantSettingsScreen);
console.log('AddProductScreen:', typeof AddProductScreen);
console.log('EditProductScreen:', typeof EditProductScreen);
console.log('OrderDetailScreen:', typeof OrderDetailScreen);

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack para Dashboard
const DashboardStack = () => (
    <Stack.Navigator
        screenOptions={{
            headerStyle: {
                backgroundColor: COLORS.primary,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
        }}
    >
        <Stack.Screen
            name="DashboardMain"
            component={RestaurantAdminDashboardScreen}
            options={{ title: 'Dashboard' }}
        />
    </Stack.Navigator>
);

// Stack para Productos
const ProductsStack = () => (
    <Stack.Navigator
        screenOptions={{
            headerStyle: {
                backgroundColor: COLORS.primary,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
        }}
    >
        <Stack.Screen
            name="ProductsList"
            component={RestaurantProductsScreen}
            options={{ title: 'Productos' }}
        />
        <Stack.Screen
            name="AddProduct"
            component={AddProductScreen}
            options={{ title: 'Nuevo Producto' }}
        />
        <Stack.Screen
            name="EditProduct"
            component={EditProductScreen}
            options={{ title: 'Editar Producto' }}
        />
    </Stack.Navigator>
);

// Stack para Pedidos
const OrdersStack = () => (
    <Stack.Navigator
        screenOptions={{
            headerStyle: {
                backgroundColor: COLORS.primary,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
        }}
    >
        <Stack.Screen
            name="OrdersList"
            component={RestaurantOrdersScreen}
            options={{ title: 'Pedidos' }}
        />
        <Stack.Screen
            name="OrderDetail"
            component={OrderDetailScreen}
            options={{ title: 'Detalle del Pedido' }}
        />
    </Stack.Navigator>
);

// Stack para Configuración
const SettingsStack = () => (
    <Stack.Navigator
        screenOptions={{
            headerStyle: {
                backgroundColor: COLORS.primary,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
        }}
    >
        <Stack.Screen
            name="SettingsMain"
            component={RestaurantSettingsScreen}
            options={{ title: 'Configuración' }}
        />
    </Stack.Navigator>
);

// Navegador principal con tabs
const RestaurantAdminNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    switch (route.name) {
                        case 'Dashboard':
                            iconName = 'dashboard';
                            break;
                        case 'Products':
                            iconName = 'restaurant-menu';
                            break;
                        case 'Orders':
                            iconName = 'receipt-long';
                            break;
                        case 'Settings':
                            iconName = 'settings';
                            break;
                        default:
                            iconName = 'circle';
                    }

                    return <Icon name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: COLORS.primary,
                tabBarInactiveTintColor: COLORS.textSecondary,
                tabBarStyle: {
                    backgroundColor: '#fff',
                    borderTopWidth: 1,
                    borderTopColor: '#e0e0e0',
                    paddingBottom: 5,
                    paddingTop: 5,
                    height: 60,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '600',
                },
            })}
        >
            <Tab.Screen
                name="Dashboard"
                component={DashboardStack}
                options={{ title: 'Inicio' }}
            />
            <Tab.Screen
                name="Products"
                component={ProductsStack}
                options={{ title: 'Productos' }}
            />
            <Tab.Screen
                name="Orders"
                component={OrdersStack}
                options={{ title: 'Pedidos' }}
            />
            <Tab.Screen
                name="Settings"
                component={SettingsStack}
                options={{ title: 'Ajustes' }}
            />
        </Tab.Navigator>
    );
};

export default RestaurantAdminNavigator;
