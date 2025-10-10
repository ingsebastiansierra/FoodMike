import { useEffect } from 'react';
import { useNavigation, useNavigationState, useRoute } from '@react-navigation/native';

export const useCartNavigation = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const navigateToCart = () => {
    try {
      // Navegar al carrito en el stack anidado
      // Primero obtener el estado actual para saber en qué pestaña estamos
      const state = navigation.getState();
      if (!state || !state.routes || state.routes.length === 0) {
        console.warn('Estado de navegación no válido');
        return;
      }

      const currentRoute = state.routes[state.index];
      if (!currentRoute) {
        console.warn('Ruta actual no encontrada');
        return;
      }

      // Navegar al carrito desde la pestaña actual
      navigation.navigate(currentRoute.name, {
        screen: 'Carrito'
      });
    } catch (error) {
      console.error('Error navegando al carrito:', error);
      // Fallback: intentar navegar directamente
      navigation.navigate('Carrito');
    }
  };

  const closeCart = () => {
    try {
      const state = navigation.getState();

      // Verificar si estamos en el carrito
      const currentRoute = state.routes[state.index];
      const isInCart = currentRoute?.state?.routes?.some(route => route.name === 'Carrito');

      if (isInCart) {
        // Si estamos en el carrito, ir hacia atrás
        navigation.goBack();
      } else {
        // Si no estamos en el carrito, no hacer nada
        console.log('No estamos en el carrito, no es necesario cerrarlo');
      }
    } catch (error) {
      console.error('Error cerrando carrito:', error);
      // Fallback: intentar ir hacia atrás
      if (navigation.canGoBack()) {
        navigation.goBack();
      }
    }
  };

  const navigateToHome = () => {
    try {
      // Resetear completamente la navegación al inicio
      navigation.reset({
        index: 0,
        routes: [{ name: 'Inicio', params: { screen: 'HomeInitial' } }]
      });
    } catch (error) {
      console.error('Error navegando al inicio:', error);
      navigation.navigate('Inicio', { screen: 'HomeInitial' });
    }
  };

  const navigateToSearch = () => {
    try {
      // Resetear completamente la navegación a búsqueda
      navigation.reset({
        index: 0,
        routes: [{ name: 'Buscar', params: { screen: 'SearchInitial' } }]
      });
    } catch (error) {
      console.error('Error navegando a búsqueda:', error);
      navigation.navigate('Buscar', { screen: 'SearchInitial' });
    }
  };

  const forceCloseCart = () => {
    try {
      // Obtener el estado actual de navegación
      const state = navigation.getState();
      const currentTabRoute = state.routes[state.index];

      if (currentTabRoute?.state?.routes) {
        // Filtrar las rutas para remover el carrito
        const filteredRoutes = currentTabRoute.state.routes.filter(route => route.name !== 'Carrito');

        if (filteredRoutes.length > 0) {
          // Resetear el stack actual sin el carrito
          navigation.reset({
            index: filteredRoutes.length - 1,
            routes: filteredRoutes
          });
        } else {
          // Si no hay otras rutas, ir a la pantalla inicial de la pestaña
          const initialScreen = getInitialScreenForTab(currentTabRoute.name);
          navigation.reset({
            index: 0,
            routes: [{ name: initialScreen }]
          });
        }
      }
    } catch (error) {
      console.error('Error forzando cierre del carrito:', error);
      // Fallback: ir hacia atrás
      if (navigation.canGoBack()) {
        navigation.goBack();
      }
    }
  };

  const getInitialScreenForTab = (tabName) => {
    switch (tabName) {
      case 'Inicio': return 'HomeInitial';
      case 'Buscar': return 'SearchInitial';
      case 'Pedidos': return 'OrdersInitial';
      case 'Favoritos': return 'FavoritesInitial';
      case 'Perfil': return 'ProfileInitial';
      default: return 'HomeInitial';
    }
  };

  return {
    navigateToCart,
    closeCart,
    forceCloseCart,
    navigateToHome,
    navigateToSearch,
  };
};