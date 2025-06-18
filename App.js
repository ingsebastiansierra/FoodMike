import React from 'react';
import { StatusBar } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { COLORS } from './src/theme/colors';
import { CartProvider } from './src/context/CartContext';

export default function App() {
  return (
    <CartProvider>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor={COLORS.background.primary} 
      />
      <AppNavigator />
    </CartProvider>
  );
}
