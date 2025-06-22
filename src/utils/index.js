// Utilidades centralizadas para FoodMike

import { Alert } from 'react-native';
import { ERROR_MESSAGES, SUCCESS_MESSAGES, CURRENCY_CONFIG } from '../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Utilidades de validación
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const validateName = (name) => {
  return name && name.trim().length >= 2;
};

export const validatePhone = (phone) => {
  const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
  return phoneRegex.test(phone);
};

// Utilidades de formato
export const formatCurrency = (amount, currency = CURRENCY_CONFIG.CODE) => {
  if (typeof amount !== 'number') return '0.00';
  
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: CURRENCY_CONFIG.DECIMAL_PLACES,
    maximumFractionDigits: CURRENCY_CONFIG.DECIMAL_PLACES,
  }).format(amount);
};

export const formatDate = (date, options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  };
  
  return new Date(date).toLocaleDateString('es-MX', defaultOptions);
};

export const formatTime = (date) => {
  return new Date(date).toLocaleTimeString('es-MX', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatDateTime = (date) => {
  return `${formatDate(date)} ${formatTime(date)}`;
};

export const formatPhoneNumber = (phone) => {
  // Eliminar todos los caracteres no numéricos
  const cleaned = phone.replace(/\D/g, '');
  
  // Formatear según la longitud
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  
  return phone;
};

// Utilidades de almacenamiento
export const storageUtils = {
  async getItem(key) {
    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Error getting item from storage:', error);
      return null;
    }
  },

  async setItem(key, value) {
    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      await AsyncStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Error setting item in storage:', error);
      return false;
    }
  },

  async removeItem(key) {
    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing item from storage:', error);
      return false;
    }
  },

  async clear() {
    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      await AsyncStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing storage:', error);
      return false;
    }
  },
};

// Utilidades de alertas
export const showAlert = (title, message) => {
  Alert.alert(title, message, [{ text: 'OK' }]);
};

export const showErrorAlert = (message, title = 'Error') => {
  showAlert(title, message);
};

export const showSuccessAlert = (message, title = 'Éxito') => {
  showAlert(title, message);
};

export const showConfirmAlert = (title, message, onConfirm, onCancel) => {
  Alert.alert(
    title,
    message,
    [
      {
        text: 'Cancelar',
        style: 'cancel',
        onPress: onCancel,
      },
      {
        text: 'Confirmar',
        onPress: onConfirm,
      },
    ]
  );
};

// Utilidades de arrays
export const groupBy = (array, key) => {
  return array.reduce((groups, item) => {
    const group = item[key];
    groups[group] = groups[group] || [];
    groups[group].push(item);
    return groups;
  }, {});
};

export const sortBy = (array, key, order = 'asc') => {
  return [...array].sort((a, b) => {
    let aValue = a[key];
    let bValue = b[key];
    
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    
    if (order === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
};

export const filterBy = (array, filters) => {
  return array.filter(item => {
    return Object.keys(filters).every(key => {
      const filterValue = filters[key];
      const itemValue = item[key];
      
      if (typeof filterValue === 'string') {
        return itemValue.toLowerCase().includes(filterValue.toLowerCase());
      }
      
      return itemValue === filterValue;
    });
  });
};

// Utilidades de objetos
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (typeof obj === 'object') {
    const clonedObj = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
};

export const pick = (obj, keys) => {
  return keys.reduce((result, key) => {
    if (obj.hasOwnProperty(key)) {
      result[key] = obj[key];
    }
    return result;
  }, {});
};

export const omit = (obj, keys) => {
  return Object.keys(obj).reduce((result, key) => {
    if (!keys.includes(key)) {
      result[key] = obj[key];
    }
    return result;
  }, {});
};

// Utilidades de strings
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const truncate = (str, length = 50, suffix = '...') => {
  if (!str || str.length <= length) return str;
  return str.substring(0, length) + suffix;
};

export const slugify = (str) => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Utilidades de números
export const clamp = (value, min, max) => {
  return Math.min(Math.max(value, min), max);
};

export const roundTo = (value, decimals = 2) => {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
};

export const randomBetween = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Utilidades de tiempo
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Utilidades de navegación
export const navigationUtils = {
  resetToScreen: (navigation, screenName, params = {}) => {
    navigation.reset({
      index: 0,
      routes: [{ name: screenName, params }],
    });
  },

  goBack: (navigation, fallbackScreen) => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else if (fallbackScreen) {
      navigation.navigate(fallbackScreen);
    }
  },
};

// Utilidades de permisos
export const permissionUtils = {
  async requestCameraPermission() {
    try {
      const { Camera } = require('expo-camera');
      const { status } = await Camera.requestCameraPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting camera permission:', error);
      return false;
    }
  },

  async requestLocationPermission() {
    try {
      const { Location } = require('expo-location');
      const { status } = await Location.requestForegroundPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting location permission:', error);
      return false;
    }
  },
};

// Utilidades de red
export const networkUtils = {
  isConnected: async () => {
    try {
      const NetInfo = require('@react-native-community/netinfo');
      const state = await NetInfo.fetch();
      return state.isConnected;
    } catch (error) {
      console.error('Error checking network connection:', error);
      return true; // Asumir conectado por defecto
    }
  },

  getConnectionType: async () => {
    try {
      const NetInfo = require('@react-native-community/netinfo');
      const state = await NetInfo.fetch();
      return state.type;
    } catch (error) {
      console.error('Error getting connection type:', error);
      return 'unknown';
    }
  },
};

// Función para resetear el onboarding
export const resetOnboarding = async (onSuccess, onError) => {
  try {
    await AsyncStorage.removeItem('onboardingCompleted');
    if (onSuccess) {
      onSuccess();
    } else {
      showAlert(
        'Onboarding Reseteado', 
        'El onboarding ha sido reseteado exitosamente. Reinicia la aplicación para ver los cambios.'
      );
    }
  } catch (error) {
    console.error('Error al resetear onboarding:', error);
    if (onError) {
      onError(error);
    } else {
      showAlert('Error', 'No se pudo resetear el onboarding');
    }
  }
};

// Función para verificar si el onboarding está completado
export const isOnboardingCompleted = async () => {
  try {
    const value = await AsyncStorage.getItem('onboardingCompleted');
    return value === 'true';
  } catch (error) {
    console.error('Error al verificar onboarding:', error);
    return false;
  }
};

// Función para marcar el onboarding como completado
export const completeOnboarding = async () => {
  try {
    await AsyncStorage.setItem('onboardingCompleted', 'true');
  } catch (error) {
    console.error('Error al completar onboarding:', error);
  }
}; 