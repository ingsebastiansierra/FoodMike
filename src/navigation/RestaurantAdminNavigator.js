import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
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
import CreateShortScreen from '../screens/CreateShortScreen';
import ManageShortsScreen from '../screens/ManageShortsScreen';



const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack para Dashboard
const DashboardStack = () => (
    <Stack.Navigator
        screenOptions={{
            headerShown: false, // Ocultar header del stack, usamos el del Tab
        }}
    >
        <Stack.Screen
            name="DashboardMain"
            component={RestaurantAdminDashboardScreen}
            options={{ headerShown: false }}
        />
        <Stack.Screen
            name="CreateShort"
            component={CreateShortScreen}
            options={{
                headerShown: true,
                headerStyle: {
                    backgroundColor: COLORS.primary,
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
                title: 'Crear Short',
            }}
        />
        <Stack.Screen
            name="ManageShorts"
            component={ManageShortsScreen}
            options={{
                headerShown: false,
            }}
        />
        <Stack.Screen
            name="OrderDetail"
            component={OrderDetailScreen}
            options={{
                headerShown: true,
                headerStyle: {
                    backgroundColor: COLORS.primary,
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
                title: 'Detalle del Pedido',
            }}
        />
    </Stack.Navigator>
);

// Stack para Productos
const ProductsStack = () => (
    <Stack.Navigator
        screenOptions={{
            headerShown: false, // Ocultar header del stack por defecto
        }}
    >
        <Stack.Screen
            name="ProductsList"
            component={RestaurantProductsScreen}
            options={{
                headerShown: false
            }}
        />
        <Stack.Screen
            name="AddProduct"
            component={AddProductScreen}
            options={({ navigation }) => ({
                headerShown: true,
                title: 'Nuevo Producto',
                headerStyle: {
                    backgroundColor: COLORS.primary,
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
                headerLeft: () => (
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={{ marginLeft: 10 }}
                    >
                        <Icon name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                ),
            })}
        />
        <Stack.Screen
            name="EditProduct"
            component={EditProductScreen}
            options={({ navigation }) => ({
                headerShown: true,
                title: 'Editar Producto',
                headerStyle: {
                    backgroundColor: COLORS.primary,
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
                headerLeft: () => (
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={{ marginLeft: 10 }}
                    >
                        <Icon name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                ),
            })}
        />
    </Stack.Navigator>
);

// Stack para Pedidos
const OrdersStack = () => (
    <Stack.Navigator
        screenOptions={{
            headerShown: false,
        }}
    >
        <Stack.Screen
            name="OrdersList"
            component={RestaurantOrdersScreen}
            options={{ headerShown: false }}
        />
        <Stack.Screen
            name="OrderDetail"
            component={OrderDetailScreen}
            options={{
                headerShown: true,
                title: 'Detalle del Pedido',
                headerStyle: {
                    backgroundColor: COLORS.primary,
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            }}
        />
    </Stack.Navigator>
);

// Stack para Configuración
const SettingsStack = () => (
    <Stack.Navigator
        screenOptions={{
            headerShown: false,
        }}
    >
        <Stack.Screen
            name="SettingsMain"
            component={RestaurantSettingsScreen}
            options={{ headerShown: false }}
        />
    </Stack.Navigator>
);

// Importar el componente de pedidos pendientes
import PendingOrdersButton from '../components/PendingOrdersButton';

// Componente personalizado para el ícono del tab con animación
const AdminTabIcon = React.memo(({ iconName, focused, size }) => {
    return (
        <View style={adminTabIconStyles.container}>
            <View style={[
                adminTabIconStyles.iconWrapper,
                focused && adminTabIconStyles.iconWrapperActive
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

const adminTabIconStyles = StyleSheet.create({
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

// Navegador principal con tabs
const RestaurantAdminNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: true, // Mostrar header
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
                headerRight: () => <PendingOrdersButton />,
                tabBarHideOnKeyboard: true,
                animationEnabled: true,
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

                    return (
                        <AdminTabIcon
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
            <Tab.Screen
                name="Dashboard"
                component={DashboardStack}
                options={{ title: 'Inicio' }}
            />
            <Tab.Screen
                name="Products"
                component={ProductsStack}
                options={{ title: 'Productos' }}
                listeners={({ navigation }) => ({
                    tabPress: (e) => {
                        // Navegar a la primera pantalla del stack
                        navigation.navigate('Products', { screen: 'ProductsList' });
                    },
                })}
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
