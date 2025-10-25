import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ProductImage = ({ uri, onFavoritePress, isFavorite }) => (
  <View style={styles.container}>
    <Image source={typeof uri === 'string' ? { uri } : undefined} style={styles.image} resizeMode="cover" />
    {onFavoritePress && (
      <TouchableOpacity style={styles.favoriteBtn} onPress={onFavoritePress}>
        <Ionicons name={isFavorite ? 'heart' : 'heart-outline'} size={24} color={isFavorite ? '#FF6B00' : '#fff'} />
      </TouchableOpacity>
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    aspectRatio: 1.4,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#eaeaea',
    marginBottom: 16,
    position: 'relative',
    marginTop: 20,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
  },
  favoriteBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 20,
    padding: 4,
  },
});

export default ProductImage; 