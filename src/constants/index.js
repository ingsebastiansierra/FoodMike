// Constantes de la aplicación TOC TOC

// Roles de usuario
export const USER_ROLES = {
  ADMIN: 'administrador',
  CLIENT: 'cliente',
};

// Estados de autenticación
export const AUTH_STATES = {
  LOADING: 'loading',
  AUTHENTICATED: 'authenticated',
  UNAUTHENTICATED: 'unauthenticated',
};

// Estados de órdenes
export const ORDER_STATUS = {
  PENDING: 'pendiente',
  CONFIRMED: 'confirmada',
  PREPARING: 'preparando',
  READY: 'lista',
  DELIVERED: 'entregada',
  CANCELLED: 'cancelada',
};

// Categorías de comida
export const FOOD_CATEGORIES = {
  PIZZA: 'pizza',
  BURGER: 'hamburguesa',
  SALAD: 'ensalada',
  DRINK: 'bebida',
  DESSERT: 'postre',
  APPETIZER: 'entrada',
  MAIN_COURSE: 'plato_principal',
  SIDE_DISH: 'acompañamiento',
};

// Configuración de la aplicación
export const APP_CONFIG = {
  NAME: 'TOC TOC',
  VERSION: '1.0.0',
  DESCRIPTION: 'Aplicación de delivery de comida',
  SUPPORT_EMAIL: 'support@toctoc.com',
  SUPPORT_PHONE: '+1-800-TOCTOC',
};

// Configuración de Firebase
export const FIREBASE_CONFIG = {
  COLLECTIONS: {
    USERS: 'users',
    ORDERS: 'orders',
    RESTAURANTS: 'restaurants',
    MENU_ITEMS: 'menu_items',
    CATEGORIES: 'categories',
    REVIEWS: 'reviews',
  },
  STORAGE_PATHS: {
    PROFILE_IMAGES: 'profile_images',
    RESTAURANT_IMAGES: 'restaurant_images',
    FOOD_IMAGES: 'food_images',
  },
};

// Configuración de navegación
export const NAVIGATION = {
  SCREENS: {
    // Pantallas de autenticación
    LOGIN: 'LoginRegister',
    FORGOT_PASSWORD: 'ForgotPassword',
    VERIFY_CODE: 'VerifyCode',
    
    // Pantallas principales
    HOME: 'Home',
    ADMIN: 'Admin',
    CLIENT: 'Client',
    
    // Pantallas de onboarding
    ONBOARDING: 'Onboarding',
    WELCOME_CAROUSEL: 'WelcomeCarousel',
    
    // Pantallas adicionales
    LOCATION: 'Location',
  },
  TABS: {
    HOME: 'Home',
    FAVORITES: 'Favoritos',
    CART: 'Carrito',
    PROFILE: 'Perfil',
  },
};

// Configuración de almacenamiento local
export const STORAGE_KEYS = {
  ONBOARDING_COMPLETED: 'onboardingCompleted',
  USER_TOKEN: 'userToken',
  USER_DATA: 'userData',
  CART_ITEMS: 'cartItems',
  FAVORITES: 'favorites',
  LOCATION: 'userLocation',
  THEME: 'appTheme',
  LANGUAGE: 'appLanguage',
};

// Configuración de validación
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 6,
  PHONE_REGEX: /^\+?[\d\s\-\(\)]+$/,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
};

// Mensajes de error
export const ERROR_MESSAGES = {
  // Autenticación
  INVALID_EMAIL: 'Por favor ingresa un email válido',
  INVALID_PASSWORD: 'La contraseña debe tener al menos 6 caracteres',
  EMAIL_REQUIRED: 'El email es requerido',
  PASSWORD_REQUIRED: 'La contraseña es requerida',
  NAME_REQUIRED: 'El nombre es requerido',
  ROLE_REQUIRED: 'El rol es requerido',
  
  // Firebase
  FIREBASE_ERROR: 'Error de conexión. Intenta nuevamente',
  USER_NOT_FOUND: 'Usuario no encontrado',
  WRONG_PASSWORD: 'Contraseña incorrecta',
  EMAIL_ALREADY_IN_USE: 'Este email ya está registrado',
  WEAK_PASSWORD: 'La contraseña es muy débil',
  
  // Carrito
  CART_EMPTY: 'Tu carrito está vacío',
  ITEM_NOT_FOUND: 'Producto no encontrado',
  QUANTITY_ERROR: 'Cantidad inválida',
  
  // Órdenes
  ORDER_FAILED: 'No se pudo procesar la orden',
  PAYMENT_FAILED: 'Error en el pago',
  
  // General
  NETWORK_ERROR: 'Error de conexión a internet',
  UNKNOWN_ERROR: 'Error desconocido',
  PERMISSION_DENIED: 'Permiso denegado',
};

// Mensajes de éxito
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Inicio de sesión exitoso',
  REGISTER_SUCCESS: 'Registro exitoso',
  PASSWORD_RESET: 'Se envió un email para restablecer tu contraseña',
  PROFILE_UPDATED: 'Perfil actualizado correctamente',
  ORDER_PLACED: 'Orden realizada correctamente',
  ITEM_ADDED_TO_CART: 'Producto agregado al carrito',
  ITEM_REMOVED_FROM_CART: 'Producto removido del carrito',
  FAVORITE_ADDED: 'Agregado a favoritos',
  FAVORITE_REMOVED: 'Removido de favoritos',
};

// Configuración de paginación
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 50,
  DEFAULT_PAGE: 1,
};

// Configuración de tiempo
export const TIME_CONFIG = {
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutos
  TOKEN_REFRESH_INTERVAL: 10 * 60 * 1000, // 10 minutos
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutos
};

// Configuración de animaciones
export const ANIMATION_CONFIG = {
  DURATION: {
    FAST: 200,
    NORMAL: 300,
    SLOW: 500,
  },
  EASING: {
    EASE: 'ease',
    EASE_IN: 'ease-in',
    EASE_OUT: 'ease-out',
    EASE_IN_OUT: 'ease-in-out',
  },
};

// Configuración de imágenes
export const IMAGE_CONFIG = {
  QUALITY: 0.8,
  MAX_WIDTH: 1024,
  MAX_HEIGHT: 1024,
  FORMAT: 'JPEG',
  COMPRESSION: 0.8,
};

// Configuración de notificaciones
export const NOTIFICATION_CONFIG = {
  TYPES: {
    ORDER_STATUS: 'order_status',
    PROMOTION: 'promotion',
    SYSTEM: 'system',
  },
  CHANNELS: {
    ORDERS: 'orders',
    PROMOTIONS: 'promotions',
    GENERAL: 'general',
  },
};

// Configuración de mapas
export const MAP_CONFIG = {
  DEFAULT_ZOOM: 15,
  DEFAULT_LATITUDE: 19.4326, // Ciudad de México
  DEFAULT_LONGITUDE: -99.1332,
  SEARCH_RADIUS: 5000, // 5km
};

// Configuración de calificaciones
export const RATING_CONFIG = {
  MIN_RATING: 1,
  MAX_RATING: 5,
  DEFAULT_RATING: 0,
};

// Configuración de moneda
export const CURRENCY_CONFIG = {
  SYMBOL: '$',
  CODE: 'MXN',
  DECIMAL_PLACES: 2,
  THOUSAND_SEPARATOR: ',',
  DECIMAL_SEPARATOR: '.',
}; 