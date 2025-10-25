export const COLORS = {
  // 🔥 Brand Colors - Inspirados en comida y apetito
  primary: '#F2A233',        // Naranja vibrante
  primaryDark: '#E89420',    // Naranja más intenso
  primaryLight: '#F5B555',   // Naranja suave
  secondary: '#FFFFFF',      // Blanco
  secondaryDark: '#F5F5F5',  // Blanco grisáceo
  secondaryLight: '#FFFFFF', // Blanco puro
  accent: '#2ED573',         // Verde fresco (lechuga/hierbas)
  accentDark: '#26C65B',     // Verde más intenso
  accentLight: '#4FE085',    // Verde suave

  // 🎨 Colores de apoyo
  tertiary: '#5352ED',       // Púrpura moderno
  quaternary: '#FF6348',     // Coral vibrante

  // 🌈 Paleta extendida para categorías
  categories: {
    pizza: '#F2A233',        // Naranja
    burger: '#F2A233',       // Naranja
    sushi: '#2ED573',        // Verde wasabi
    dessert: '#FF6B9D',      // Rosa fresa
    drinks: '#3742FA',       // Azul refrescante
    healthy: '#26C65B',      // Verde saludable
    mexican: '#F2A233',      // Naranja
    asian: '#FDCB6E',        // Amarillo curry
  },

  // 🎯 Base colors mejorados
  white: '#FFFFFF',
  black: '#2C2C54',          // Negro más suave
  gray: '#747D8C',           // Gris balanceado
  darkGray: '#2F3542',       // Gris oscuro moderno
  mediumGray: '#57606F',     // Gris medio
  lightGray: '#F1F2F6',     // Gris muy claro
  lightPrimary: '#FFF5F5',   // Fondo suave rojo
  lightSecondary: '#FFF8E1', // Fondo suave naranja
  lightAccent: '#F0FFF4',    // Fondo suave verde

  // 📝 Text colors mejorados
  text: '#2C2C54',           // Texto principal
  textSecondary: '#747D8C',  // Texto secundario
  textDisabled: '#A4B0BE',   // Texto deshabilitado
  textInverse: '#FFFFFF',    // Texto sobre fondos oscuros
  textAccent: '#F2A233',     // Texto de acento
  border: '#E1E8ED',         // Color de bordes

  // 🏠 Background colors renovados
  background: {
    primary: '#FFFFFF',       // Fondo principal
    secondary: '#F8F9FA',     // Fondo secundario
    tertiary: '#F1F2F6',      // Fondo terciario
    card: '#FFFFFF',          // Fondo de tarjetas
    modal: 'rgba(44, 44, 84, 0.8)', // Fondo de modales
    divider: '#DDD6FE',       // Divisores
    overlay: 'rgba(0, 0, 0, 0.5)', // Overlay
  },

  // 🌟 Shadow colors mejorados
  shadow: {
    light: 'rgba(242, 162, 51, 0.1)',    // Sombra suave naranja
    medium: 'rgba(242, 162, 51, 0.15)',   // Sombra media naranja
    dark: 'rgba(44, 44, 84, 0.2)',       // Sombra oscura
    colored: 'rgba(242, 162, 51, 0.3)',   // Sombra naranja
  },

  // 🎪 Gradients para fondos atractivos
  gradients: {
    primary: ['#F2A233', '#E89420'],
    secondary: ['#FFFFFF', '#F5F5F5'],
    accent: ['#2ED573', '#26C65B'],
    sunset: ['#F5B555', '#F2A233'],
    ocean: ['#3742FA', '#2ED573'],
    fire: ['#F2A233', '#E89420'],
    warm: ['#F2A233', '#FF6B9D'],
  },

  onboardingBackground: '#F2A233',

  // ✅ Status colors más vibrantes
  success: '#2ED573',        // Verde éxito
  error: '#F2A233',          // Naranja error
  warning: '#F2A233',        // Naranja advertencia
  info: '#3742FA',           // Azul información

  // 🏷️ Estados interactivos
  states: {
    active: '#F2A233',
    inactive: '#A4B0BE',
    hover: '#F5B555',
    pressed: '#E89420',
    selected: '#FFF8F0',
    disabled: '#F1F2F6',
  },

  // 🛍️ E-commerce específicos
  ecommerce: {
    price: '#2ED573',         // Verde para precios
    discount: '#F2A233',      // Naranja para descuentos
    outOfStock: '#A4B0BE',    // Gris para sin stock
    inStock: '#2ED573',       // Verde para en stock
    rating: '#F2A233',        // Naranja para calificaciones
    delivery: '#3742FA',      // Azul para delivery
  },

  // 🎨 Alias para compatibilidad
  dark: '#2F3542',
  background: '#F8F9FA',
};

// Utility function to get shadow style
export const getShadowStyle = (elevation = 20) => ({
  shadowColor: COLORS.shadow.light,
  shadowOpacity: 0.1,
  shadowOffset: {
    width: 0,
    height: 4,
  },
  shadowRadius: elevation,
  elevation: elevation,
});

export default COLORS;
