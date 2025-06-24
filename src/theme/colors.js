export const COLORS = {
  // Brand colors
  primary: '#FF6B00',
  primaryDark: '#E55A00',
  accent: '#FF6B00',
  
  // Base colors
  white: '#FFFFFF',
  black: '#000000',
  gray: '#878787',
  darkGray: '#333333',
  mediumGray: '#666666',
  lightGray: '#F5F5F5',
  lightPrimary: '#FFF3E0',
  
  // Text colors
  text: {
    primary: '#0F0F0F',
    secondary: '#878787',
    disabled: '#A5A5A5',
  },
  
  // Background colors
  background: {
    primary: '#FFFFFF',
    secondary: '#FAFAFA',
    divider: '#D6D6D6',
  },

  // Shadow colors
  shadow: {
    light: '#0000000D',
  },
  onboardingBackground: '#FF6B00',
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
