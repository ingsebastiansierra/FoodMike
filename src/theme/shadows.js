import { COLORS } from './colors';

// Sistema de sombras moderno para TOC TOC
export const SHADOWS = {
  // Sombras básicas
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  
  // Sombras pequeñas
  small: {
    shadowColor: COLORS.shadow.light,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  
  // Sombras medianas
  medium: {
    shadowColor: COLORS.shadow.medium,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  
  // Sombras grandes
  large: {
    shadowColor: COLORS.shadow.dark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  
  // Sombras extra grandes
  xlarge: {
    shadowColor: COLORS.shadow.dark,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 12,
  },
  
  // Sombras coloreadas para elementos especiales
  colored: {
    primary: {
      shadowColor: COLORS.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 6,
    },
    secondary: {
      shadowColor: COLORS.secondary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 6,
    },
    accent: {
      shadowColor: COLORS.accent,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 6,
    },
  },
  
  // Sombras para botones
  button: {
    default: {
      shadowColor: COLORS.shadow.medium,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    pressed: {
      shadowColor: COLORS.shadow.light,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    floating: {
      shadowColor: COLORS.shadow.dark,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.2,
      shadowRadius: 12,
      elevation: 8,
    },
  },
  
  // Sombras para tarjetas
  card: {
    flat: {
      shadowColor: COLORS.shadow.light,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    elevated: {
      shadowColor: COLORS.shadow.medium,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    floating: {
      shadowColor: COLORS.shadow.dark,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 16,
      elevation: 8,
    },
  },
  
  // Sombras para inputs
  input: {
    default: {
      shadowColor: COLORS.shadow.light,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 1,
    },
    focused: {
      shadowColor: COLORS.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
    },
  },
};

// Función utilitaria para obtener sombras
export const getShadow = (type = 'medium', variant = 'default') => {
  if (typeof type === 'string' && SHADOWS[type]) {
    if (typeof SHADOWS[type] === 'object' && SHADOWS[type][variant]) {
      return SHADOWS[type][variant];
    }
    return SHADOWS[type];
  }
  return SHADOWS.medium;
};

// Función para crear sombras personalizadas
export const createShadow = (
  color = COLORS.shadow.medium,
  offset = { width: 0, height: 4 },
  opacity = 0.15,
  radius = 8,
  elevation = 4
) => ({
  shadowColor: color,
  shadowOffset: offset,
  shadowOpacity: opacity,
  shadowRadius: radius,
  elevation,
});

export default SHADOWS;