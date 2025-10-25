export const FONT_SIZES = {
  // Body sizes
  bodySmall: 12,    // Line height: 16px
  bodyMedium: 14,   // Line height: 20px
  bodyLarge: 16,    // Line height: 24px
  
  // Heading sizes
  h6: 18,           // Line height: 26px
  h5: 24,           // Line height: 32px
  h4: 32,           // Line height: 40px
  h3: 40,           // Line height: 48px
  h2: 48,           // Line height: 56px
  h1: 64,           // Line height: 72px
};

// Tamaños adicionales para el sistema de búsqueda
export const TYPOGRAPHY_SIZES = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 24,
};

export const FONT_WEIGHTS = {
  regular: 'normal',
  medium: '500',
  semiBold: '600',
  bold: 'bold',
};

export const LINE_HEIGHTS = {
  // Body line heights
  bodySmall: 16,
  bodyMedium: 20,
  bodyLarge: 24,
  
  // Heading line heights
  h6: 26,
  h5: 32,
  h4: 40,
  h3: 48,
  h2: 56,
  h1: 72,
};

export const TEXT_STYLES = {
  // Headings
  h1: {
    fontSize: FONT_SIZES.h1,
    lineHeight: LINE_HEIGHTS.h1,
  },
  h2: {
    fontSize: FONT_SIZES.h2,
    lineHeight: LINE_HEIGHTS.h2,
  },
  h3: {
    fontSize: FONT_SIZES.h3,
    lineHeight: LINE_HEIGHTS.h3,
  },
  h4: {
    fontSize: FONT_SIZES.h4,
    lineHeight: LINE_HEIGHTS.h4,
  },
  h5: {
    fontSize: FONT_SIZES.h5,
    lineHeight: LINE_HEIGHTS.h5,
  },
  h6: {
    fontSize: FONT_SIZES.h6,
    lineHeight: LINE_HEIGHTS.h6,
  },

  // Body styles
  bodyLarge: {
    fontSize: FONT_SIZES.bodyLarge,
    lineHeight: LINE_HEIGHTS.bodyLarge,
  },
  bodyMedium: {
    fontSize: FONT_SIZES.bodyMedium,
    lineHeight: LINE_HEIGHTS.bodyMedium,
  },
  bodySmall: {
    fontSize: FONT_SIZES.bodySmall,
    lineHeight: LINE_HEIGHTS.bodySmall,
  },
};

// Variants for each text style
export const getTextStyle = (style, weight = 'regular') => ({
  ...TEXT_STYLES[style],
  fontWeight: FONT_WEIGHTS[weight],
  fontFamily: 'Inter',
}); 