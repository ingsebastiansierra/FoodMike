import React, { useContext } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { CartContext } from '../context/CartContext';
import CartItemCard from './CartItemCard';

const ConfirmarOrdenComponente = () => {
  const { cartItems, getTotalPrice } = useContext(CartContext);
  const totalPrice = getTotalPrice();

  const renderItem = ({ item }) => (
    <CartItemCard item={item} />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Confirm Order</Text>
      <FlatList
        data={cartItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total: ${totalPrice.toFixed(2)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
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
    textAlign: 'center',
  },
});

export default ConfirmarOrdenComponente;
