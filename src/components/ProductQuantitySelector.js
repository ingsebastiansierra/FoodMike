import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ProductQuantitySelector = ({ quantity, setQuantity, min = 1, max = 20, dark = false }) => {
  const decrease = () => setQuantity(Math.max(min, quantity - 1));
  const increase = () => setQuantity(Math.min(max, quantity + 1));

  return (
    <View style={[styles.container, dark && styles.containerDark]}>
      <TouchableOpacity onPress={decrease} style={styles.btn}>
        <Ionicons name="remove" size={20} color={dark ? '#fff' : '#FF6B00'} />
      </TouchableOpacity>
      <Text style={[styles.qty, dark && styles.qtyDark]}>{quantity}</Text>
      <TouchableOpacity onPress={increase} style={styles.btn}>
        <Ionicons name="add" size={20} color={dark ? '#fff' : '#FF6B00'} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f3f3',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  containerDark: {
    backgroundColor: 'transparent',
  },
  btn: {
    padding: 6,
  },
  qty: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 8,
    color: '#222',
  },
  qtyDark: {
    color: '#fff',
  },
});

export default ProductQuantitySelector; 