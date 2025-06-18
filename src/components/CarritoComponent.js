import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { CartContext } from '../context/CartContext';
import CartItemCard from './CartItemCard';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ConfirmarOrdenComponente from './ConfirmarOrdenComponente';

const CarritoComponent = () => {
  const { cartItems, getTotalPrice } = useContext(CartContext);
  const totalPrice = getTotalPrice();
  const [showConfirmarOrden, setShowConfirmarOrden] = useState(false);
  const { navigate } = useNavigation();

  const renderItem = ({ item }) => (
    <CartItemCard item={item} />
  );

  const handleConfirmOrder = () => {
    setShowConfirmarOrden(true);
  };

  return (
    <View style={styles.container}>
      {!showConfirmarOrden ? (
        <>
          <FlatList
            data={cartItems}
            renderItem={renderItem}
            keyExtractor={(item, index) => item.id.toString() + index.toString()}
          />
          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>Total: ${totalPrice.toFixed(2)}</Text>
          </View>
          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmOrder}>
            <Text style={styles.confirmButtonText}>Confirm Order</Text>
          </TouchableOpacity>
        </>
      ) : (
        <ConfirmarOrdenComponente />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    width: '100%',
  
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  totalContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#eee',
    borderRadius: 5,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CarritoComponent;
