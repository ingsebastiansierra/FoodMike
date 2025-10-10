import { useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useCart } from '../context/CartContext';

/**
 * Hook personalizado para cerrar automáticamente el carrito cuando:
 * 1. La pantalla recibe foco (se navega a ella)
 * 2. Se cambia de pestaña
 * 
 * Usar este hook en las pantallas principales de cada pestaña
 */
export const useAutoCloseCart = () => {
  const { hideCart } = useCart();

  useFocusEffect(() => {
    // Cerrar el carrito cuando la pantalla recibe foco
    hideCart();
  });
};

export default useAutoCloseCart;