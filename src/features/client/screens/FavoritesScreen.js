import React from 'react';
import FavoritosComponent from '../../../components/FavoritosComponent';
import { useAutoCloseCart } from '../../../hooks/useAutoCloseCart';

const FavoritesScreen = ({ navigation }) => {
  // Auto-close cart when this screen gains focus
  useAutoCloseCart();
  
  return <FavoritosComponent navigation={navigation} />;
};

export default FavoritesScreen;
