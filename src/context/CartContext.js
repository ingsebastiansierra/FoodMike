import React, { createContext, useState, useContext, useMemo, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ordersService from '../services/ordersService';
import { useAuth } from './AuthContext';

export const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
};

const CART_STORAGE_KEY = '@foodmike_cart';

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [orderNotes, setOrderNotes] = useState('');
  const { user } = useAuth();

  // Cargar carrito desde AsyncStorage al iniciar
  useEffect(() => {
    loadCartFromStorage();
  }, []);

  // Guardar carrito en AsyncStorage cuando cambie
  useEffect(() => {
    saveCartToStorage();
  }, [cartItems]);

  const loadCartFromStorage = async () => {
    try {
      const savedCart = await AsyncStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error('Error cargando carrito:', error);
    }
  };

  const saveCartToStorage = async () => {
    try {
      await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (error) {
      console.error('Error guardando carrito:', error);
    }
  };

  const addToCart = useCallback((item) => {
    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(cartItem => cartItem.id === item.id);
      if (existingItemIndex > -1) {
        const updatedCartItems = [...prevItems];
        updatedCartItems[existingItemIndex] = {
          ...updatedCartItems[existingItemIndex],
          quantity: updatedCartItems[existingItemIndex].quantity + (item.quantity || 1),
        };
        return updatedCartItems;
      } else {
        return [...prevItems, { 
          ...item, 
          quantity: item.quantity || 1,
          addedAt: new Date().toISOString()
        }];
      }
    });
  }, []);

  const removeFromCart = useCallback((itemId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  }, []);

  const increaseQuantity = useCallback((itemId) => {
    setCartItems(prevItems => prevItems.map(item => {
      if (item.id === itemId) {
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    }));
  }, []);

  const decreaseQuantity = useCallback((itemId) => {
    setCartItems(prevItems => prevItems.map(item => {
      if (item.id === itemId && item.quantity > 1) {
        return { ...item, quantity: item.quantity - 1 };
      }
      return item;
    }));
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
    AsyncStorage.removeItem(CART_STORAGE_KEY);
  }, []);

  const updateQuantity = useCallback((itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    
    setCartItems(prevItems => prevItems.map(item => {
      if (item.id === itemId) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  }, [removeFromCart]);

  // Crear pedido
  const createOrder = useCallback(async () => {
    if (!user || cartItems.length === 0) {
      throw new Error('Usuario no autenticado o carrito vacío');
    }

    setIsLoading(true);
    try {
      // Obtener el restaurante del primer item (asumiendo que todos son del mismo restaurante)
      const firstItem = cartItems[0];
      const restaurantId = firstItem.restaurantid || firstItem.restaurant_id;
      
      if (!restaurantId) {
        throw new Error('No se pudo identificar el restaurante');
      }

      // Calcular totales
      const subtotal = totalPrice;
      const deliveryFee = calculateDeliveryFee();
      const total = subtotal + deliveryFee;

      // Preparar datos del pedido
      const orderData = {
        userId: user.id,
        restaurantId: restaurantId,
        subtotal: subtotal,
        deliveryFee: deliveryFee,
        total: total,
        deliveryAddress: deliveryAddress,
        deliveryCoordinates: deliveryAddress?.coordinates || null,
        paymentMethod: paymentMethod,
        notes: orderNotes,
        estimatedDeliveryTime: calculateEstimatedDelivery(),
        items: cartItems.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          unitPrice: parseFloat(item.price),
          totalPrice: parseFloat(item.price) * item.quantity,
          extras: item.extras || null,
          notes: item.notes || null
        }))
      };

      // Crear el pedido
      const result = await ordersService.createOrder(orderData);
      
      // Limpiar carrito después de crear el pedido
      clearCart();
      
      return result;
    } catch (error) {
      console.error('Error creando pedido:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [user, cartItems, totalPrice, deliveryAddress, paymentMethod, orderNotes, clearCart]);

  // Calcular tarifa de envío
  const calculateDeliveryFee = useCallback(() => {
    // Lógica para calcular tarifa de envío
    // Por ahora, tarifa fija de $3000 COP
    return totalPrice >= 30000 ? 0 : 3000;
  }, [totalPrice]);

  // Calcular tiempo estimado de entrega
  const calculateEstimatedDelivery = useCallback(() => {
    const now = new Date();
    // Agregar 30-45 minutos al tiempo actual
    const deliveryTime = new Date(now.getTime() + (35 * 60 * 1000)); // 35 minutos
    return deliveryTime.toISOString();
  }, []);

  // Validar si el carrito está listo para checkout
  const canCheckout = useMemo(() => {
    return cartItems.length > 0 && 
           user && 
           deliveryAddress && 
           paymentMethod;
  }, [cartItems.length, user, deliveryAddress, paymentMethod]);

  // Obtener restaurante del carrito (todos los items deben ser del mismo restaurante)
  const cartRestaurant = useMemo(() => {
    if (cartItems.length === 0) return null;
    return cartItems[0].restaurant || null;
  }, [cartItems]);

  const totalQuantity = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  const totalPrice = useMemo(() => {
    return cartItems.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0);
  }, [cartItems]);

  const deliveryFee = useMemo(() => {
    return calculateDeliveryFee();
  }, [calculateDeliveryFee]);

  const finalTotal = useMemo(() => {
    return totalPrice + deliveryFee;
  }, [totalPrice, deliveryFee]);

  const value = useMemo(() => ({
    // Estado del carrito
    cartItems,
    isLoading,
    
    // Información de entrega y pago
    deliveryAddress,
    setDeliveryAddress,
    paymentMethod,
    setPaymentMethod,
    orderNotes,
    setOrderNotes,
    
    // Acciones del carrito
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    updateQuantity,
    clearCart,
    
    // Checkout
    createOrder,
    canCheckout,
    
    // Cálculos
    totalQuantity,
    totalPrice,
    deliveryFee,
    finalTotal,
    cartRestaurant,
  }), [
    cartItems, isLoading, deliveryAddress, paymentMethod, orderNotes,
    addToCart, removeFromCart, increaseQuantity, decreaseQuantity, updateQuantity, clearCart,
    createOrder, canCheckout, totalQuantity, totalPrice, deliveryFee, finalTotal, cartRestaurant
  ]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};