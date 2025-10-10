import { COLORS } from './colors';

// Sistema de gradientes para TOC TOC
export const GRADIENTS = {
  // Gradientes principales de marca
  primary: {
    colors: COLORS.gradients.primary,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 0 },
  },
  
  secondary: {
    colors: COLORS.gradients.secondary,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 0 },
  },
  
  accent: {
    colors: COLORS.gradients.accent,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 0 },
  },
  
  // Gradientes temáticos
  sunset: {
    colors: COLORS.gradients.sunset,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  
  ocean: {
    colors: COLORS.gradients.ocean,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  
  fire: {
    colors: COLORS.gradients.fire,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 0 },
  },
  
  warm: {
    colors: COLORS.gradients.warm,
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
  },
  
  // Gradientes para categorías de comida
  food: {
    pizza: {
      colors: [COLORS.categories.pizza, COLORS.primaryDark],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 0 },
    },
    burger: {
      colors: [COLORS.categories.burger, COLORS.secondaryDark],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 0 },
    },
    sushi: {
      colors: [COLORS.categories.sushi, COLORS.accentDark],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 0 },
    },
    dessert: {
      colors: [COLORS.categories.dessert, '#FF8A95'],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 1 },
    },
    drinks: {
      colors: [COLORS.categories.drinks, '#5B69FF'],
      start: { x: 0, y: 0 },
      end: { x: 0, y: 1 },
    },
    healthy: {
      colors: [COLORS.categories.healthy, COLORS.accent],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 0 },
    },
  },
  
  // Gradientes para estados
  success: {
    colors: [COLORS.success, COLORS.accentDark],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 0 },
  },
  
  error: {
    colors: [COLORS.error, COLORS.primaryDark],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 0 },
  },
  
  warning: {
    colors: [COLORS.warning, COLORS.secondaryDark],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 0 },
  },
  
  // Gradientes sutiles para fondos
  subtle: {
    light: {
      colors: [COLORS.white, COLORS.lightGray],
      start: { x: 0, y: 0 },
      end: { x: 0, y: 1 },
    },
    primary: {
      colors: [COLORS.lightPrimary, COLORS.white],
      start: { x: 0, y: 0 },
      end: { x: 0, y: 1 },
    },
    secondary: {
      colors: [COLORS.lightSecondary, COLORS.white],
      start: { x: 0, y: 0 },
      end: { x: 0, y: 1 },
    },
    accent: {
      colors: [COLORS.lightAccent, COLORS.white],
      start: { x: 0, y: 0 },
      end: { x: 0, y: 1 },
    },
  },
  
  // Gradientes para overlays
  overlay: {
    dark: {
      colors: ['transparent', 'rgba(44, 44, 84, 0.8)'],
      start: { x: 0, y: 0 },
      end: { x: 0, y: 1 },
    },
    light: {
      colors: ['transparent', 'rgba(255, 255, 255, 0.9)'],
      start: { x: 0, y: 0 },
      end: { x: 0, y: 1 },
    },
    primary: {
      colors: ['transparent', 'rgba(255, 71, 87, 0.8)'],
      start: { x: 0, y: 0 },
      end: { x: 0, y: 1 },
    },
  },
};

// Función utilitaria para obtener gradientes
export const getGradient = (type = 'primary', category = null) => {
  if (category && GRADIENTS[type] && GRADIENTS[type][category]) {
    return GRADIENTS[type][category];
  }
  
  if (GRADIENTS[type]) {
    return GRADIENTS[type];
  }
  
  return GRADIENTS.primary;
};

// Función para crear gradientes personalizados
export const createGradient = (
  colors = COLORS.gradients.primary,
  start = { x: 0, y: 0 },
  end = { x: 1, y: 0 }
) => ({
  colors,
  start,
  end,
});

export default GRADIENTS;