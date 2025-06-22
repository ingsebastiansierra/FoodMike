// Sistema de temas centralizado para FoodMike
export { COLORS } from './colors';
export { SPACING } from './spacing';
export { TYPOGRAPHY } from './typography';

// Configuración del tema
export const THEME = {
  colors: {
    primary: '#FF6B35',
    secondary: '#4ECDC4',
    accent: '#45B7D1',
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    info: '#2196F3',
    
    // Colores de fondo
    background: '#F5F5F5',
    surface: '#FFFFFF',
    card: '#FFFFFF',
    
    // Colores de texto
    text: '#212121',
    textSecondary: '#757575',
    textDisabled: '#BDBDBD',
    
    // Colores de borde
    border: '#E0E0E0',
    borderLight: '#F5F5F5',
    
    // Colores de estado
    active: '#FF6B35',
    inactive: '#BDBDBD',
    selected: '#E3F2FD',
    hover: '#F5F5F5',
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  typography: {
    h1: {
      fontSize: 32,
      fontWeight: 'bold',
      lineHeight: 40,
    },
    h2: {
      fontSize: 24,
      fontWeight: 'bold',
      lineHeight: 32,
    },
    h3: {
      fontSize: 20,
      fontWeight: '600',
      lineHeight: 28,
    },
    h4: {
      fontSize: 18,
      fontWeight: '600',
      lineHeight: 24,
    },
    body1: {
      fontSize: 16,
      fontWeight: 'normal',
      lineHeight: 24,
    },
    body2: {
      fontSize: 14,
      fontWeight: 'normal',
      lineHeight: 20,
    },
    caption: {
      fontSize: 12,
      fontWeight: 'normal',
      lineHeight: 16,
    },
    button: {
      fontSize: 14,
      fontWeight: '600',
      lineHeight: 20,
      textTransform: 'uppercase',
    },
  },
  
  borderRadius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    round: 50,
  },
  
  shadows: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 1,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 2,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
    },
  },
  
  animation: {
    duration: {
      fast: 200,
      normal: 300,
      slow: 500,
    },
    easing: {
      ease: 'ease',
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out',
    },
  },
};

// Funciones de utilidad para el tema
export const getThemeColor = (colorKey, variant = 'main') => {
  const color = THEME.colors[colorKey];
  if (typeof color === 'string') return color;
  return color?.[variant] || color?.main || THEME.colors.primary;
};

export const getSpacing = (size) => {
  return THEME.spacing[size] || size;
};

export const getTypography = (variant) => {
  return THEME.typography[variant] || THEME.typography.body1;
};

export const getBorderRadius = (size) => {
  return THEME.borderRadius[size] || size;
};

export const getShadow = (size) => {
  return THEME.shadows[size] || THEME.shadows.medium;
};

// Exportar todos los temas unificados
export { COLORS as colors } from './colors';
export { SPACING as spacing } from './spacing';
export { FONT_SIZES, FONT_WEIGHTS, LINE_HEIGHTS, TEXT_STYLES, getTextStyle } from './typography';

// Tamaños de tipografía adicionales para el sistema de búsqueda
export const typography = {
  sizes: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    xxl: 24,
  },
  weights: {
    regular: 'normal',
    medium: '500',
    semiBold: '600',
    bold: 'bold',
  },
}; 