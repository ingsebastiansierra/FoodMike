import { useEffect } from 'react';
import { useNavigation, useNavigationState, useRoute } from '@react-navigation/native';
import { useCart } from '../context/CartContext';

export const useCartNavigation = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { showCart, hideCart } = useCart();

  const navigateToCart = () => {
    try {
      // Validar que navigation está disponible
      if (!navigation) {
        console.warn('Navigation no está disponible');
        return;
      }

      // Marcar el carrito como visible
      showCart();

      // Navegar al carrito en el stack anidado
      // Primero obtener el estado actual para saber en qué pestaña estamos
      const state = navigation.getState();
      if (!state || !state.routes || !Array.isArray(state.routes) || state.routes.length === 0) {
        console.warn('Estado de navegación no válido');
        return;
      }

      if (typeof state.index !== 'number' || state.index >= state.routes.length) {
        console.warn('Índice de navegación no válido');
        return;
      }

      const currentRoute = state.routes[state.index];
      if (!currentRoute || !currentRoute.name) {
        console.warn('Ruta actual no encontrada');
        return;
      }

      // Navegar al carrito desde la pestaña actual
      navigation.navigate(currentRoute.name, {
        screen: 'Carrito'
      });
    } catch (error) {
      console.error('Error navegando al carrito:', error);
      // Fallback: intentar navegar directamente si es posible
      try {
        if (navigation && navigation.navigate) {
          navigation.navigate('Carrito');
        }
      } catch (fallbackError) {
        console.error('Error en fallback de navegación:', fallbackError);
      }
    }
  };

  const closeCart = () => {
    try {
      // Validar que navigation está disponible
      if (!navigation) {
        console.warn('Navigation no está disponible para cerrar carrito');
        return;
      }

      // Marcar el carrito como no visible
      hideCart();

      const state = navigation.getState();

      // Validar el estado de navegación
      if (!state || !state.routes || !Array.isArray(state.routes) || state.routes.length === 0) {
        console.warn('Estado de navegación no válido para cerrar carrito');
        return;
      }

      if (typeof state.index !== 'number' || state.index >= state.routes.length) {
        console.warn('Índice de navegación no válido para cerrar carrito');
        return;
      }

      // Verificar si estamos en el carrito
      const currentRoute = state.routes[state.index];
      const isInCart = currentRoute?.state?.routes?.some(route => route.name === 'Carrito');

      if (isInCart) {
        // Si estamos en el carrito, ir hacia atrás
        if (navigation.goBack) {
          navigation.goBack();
        }
      }
    } catch (error) {
      console.error('Error cerrando carrito:', error);
      // Fallback: intentar ir hacia atrás
      try {
        if (navigation && navigation.canGoBack && navigation.canGoBack()) {
          navigation.goBack();
        }
      } catch (fallbackError) {
        console.error('Error en fallback de cierre de carrito:', fallbackError);
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
      // Validar que navigation está disponible
      if (!navigation) {
        console.warn('Navigation no está disponible para forzar cierre de carrito');
        return;
      }

      // Marcar el carrito como no visible
      hideCart();

      const state = navigation.getState();

      // Validar el estado de navegación
      if (!state || !state.routes || !Array.isArray(state.routes) || state.routes.length === 0) {
        console.warn('Estado de navegación no válido para forzar cierre de carrito');
        return;
      }

      if (typeof state.index !== 'number' || state.index >= state.routes.length) {
        console.warn('Índice de navegación no válido para forzar cierre de carrito');
        return;
      }

      const currentRoute = state.routes[state.index];

      if (!currentRoute?.state?.routes) {
        console.log('No hay rutas anidadas para procesar');
        return;
      }

      // Buscar si hay una ruta de carrito en el stack actual
      const cartRouteIndex = currentRoute.state.routes.findIndex(route => route.name === 'Carrito');

      if (cartRouteIndex !== -1) {
        // Si encontramos el carrito, removerlo del stack
        const newRoutes = [...currentRoute.state.routes];
        newRoutes.splice(cartRouteIndex, 1);

        if (newRoutes.length > 0) {
          // Si quedan rutas, navegar a la última
          const lastRoute = newRoutes[newRoutes.length - 1];
          if (navigation.navigate && currentRoute.name && lastRoute.name) {
            navigation.navigate(currentRoute.name, {
              screen: lastRoute.name,
              params: lastRoute.params
            });
          }
        } else {
          // Si no quedan rutas, ir a la pantalla inicial de la pestaña
          const initialScreen = getInitialScreenForTab(currentRoute.name);
          if (navigation.navigate && currentRoute.name && initialScreen) {
            navigation.navigate(currentRoute.name, {
              screen: initialScreen
            });
          }
        }
      }
    } catch (error) {
      console.error('Error forzando cierre del carrito:', error);
      // Fallback: intentar ir hacia atrás
      try {
        if (navigation && navigation.canGoBack && navigation.canGoBack()) {
          navigation.goBack();
        }
      } catch (fallbackError) {
        console.error('Error en fallback de forzar cierre de carrito:', fallbackError);
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