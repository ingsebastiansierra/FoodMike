import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import { COLORS } from "../theme/colors";

// Importar el contexto de autenticación
import { AuthProvider, useAuth } from "../context/AuthContext";
import { CartProvider } from "../context/CartContext";

// Pantallas existentes
import WelcomeCarouselScreen from "../screens/WelcomeCarouselScreen";
import LoginRegisterScreen from "../screens/LoginRegisterScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import VerifyCodeScreen from "../screens/VerifyCodeScreen";
import LocationScreen from "../screens/LocationScreen";
import SplashScreen from "../screens/splash/SplashScreen";

// Nuevas pantallas por roles
import AdminDashboardScreen from "../screens/AdminDashboardScreen";
import ClientHomeScreen from "../screens/ClientHomeScreen";
import CarritoComponent from '../components/CarritoComponent';

// Nuevas pantallas de búsqueda
import SearchScreen from "../screens/SearchScreen";
import RestaurantDetailScreen from "../screens/RestaurantDetailScreen";
import ProductDetailScreen from "../screens/ProductDetailScreen";

const Stack = createStackNavigator();

// Componente de carga
const LoadingScreen = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color={COLORS.primary} />
  </View>
);

// Navegador principal con lógica de autenticación
const MainNavigator = () => {
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [forceUpdate, setForceUpdate] = useState(0);
  const { user, userRole, loading } = useAuth();

  // Logs de depuración
  console.log('🔍 AppNavigator - Estado actual:', {
    user: user ? { uid: user.uid, email: user.email, name: user.name } : null,
    userRole,
    loading,
    isOnboardingCompleted,
    isInitializing
  });

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const value = await AsyncStorage.getItem("onboardingCompleted");
        setIsOnboardingCompleted(value === "true");
      } catch (e) {
        console.error("Error al verificar onboarding:", e);
        setIsOnboardingCompleted(false);
      } finally {
        setIsInitializing(false);
      }
    };

    checkOnboardingStatus();
  }, [forceUpdate]);

  // Función para actualizar el estado del onboarding
  const updateOnboardingStatus = () => {
    setForceUpdate(prev => prev + 1);
  };

  // Mostrar pantalla de carga mientras se verifica la autenticación y onboarding
  if (loading || isInitializing) {
    console.log('🔍 AppNavigator - Mostrando pantalla de carga');
    return <LoadingScreen />;
  }

  // Si el usuario está autenticado, NO mostrar onboarding, ir directamente a las pantallas principales
  if (user) {
    console.log('🔍 AppNavigator - Usuario autenticado, rol:', userRole);
    
    if (userRole === 'administrador') {
      console.log('🔍 AppNavigator - Redirigiendo a AdminDashboard');
      return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
        </Stack.Navigator>
      );
    } else {
      console.log('🔍 AppNavigator - Redirigiendo a ClientDashboard');
      return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="ClientDashboard" component={ClientHomeScreen} />
          <Stack.Screen name="Carrito" component={CarritoComponent} />
          <Stack.Screen name="Search" component={SearchScreen} />
          <Stack.Screen name="RestaurantDetail" component={RestaurantDetailScreen} />
          <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
        </Stack.Navigator>
      );
    }
  }

  // Si el usuario NO está autenticado y NO ha completado el onboarding, mostrar onboarding
  if (!isOnboardingCompleted) {
    console.log('🔍 AppNavigator - Mostrando onboarding');
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen 
          name="WelcomeCarousel" 
          component={WelcomeCarouselScreen}
          initialParams={{ onComplete: updateOnboardingStatus }}
        />
      </Stack.Navigator>
    );
  }

  // Si el usuario NO está autenticado pero YA completó el onboarding, mostrar pantallas de autenticación
  console.log('🔍 AppNavigator - Mostrando pantallas de autenticación');
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="LoginRegister"
        component={LoginRegisterScreen}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="VerifyCode" component={VerifyCodeScreen} />
    </Stack.Navigator>
  );
};

// Navegador principal envuelto en los providers
const AppNavigator = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <NavigationContainer>
          <MainNavigator />
        </NavigationContainer>
      </CartProvider>
    </AuthProvider>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
});

export default AppNavigator;
