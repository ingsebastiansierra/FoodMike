import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ProductInfoRow = ({ icon, text, color = '#FF6B00', style }) => (
  <View style={[styles.row, style]}>
    {icon && <Ionicons name={icon} size={18} color={color} style={{ marginRight: 6 }} />}
    <Text style={styles.text}>{
      typeof text === 'string' || typeof text === 'number'
        ? String(text)
        : ''
    }</Text>
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    marginBottom: 4,
  },
  text: {
    fontSize: 15,
    color: '#222',
  },
});

export default ProductInfoRow; 