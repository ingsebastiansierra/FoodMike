import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../theme/colors';

const FoodCard = ({ image, title, price, onPress, onAddPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <Image source={image} style={styles.image} />
    <View style={styles.content}>
      <Text style={styles.title} numberOfLines={2}>{title}</Text>
      <View style={styles.footer}>
        <Text style={styles.price}>${price}</Text>
        <TouchableOpacity style={styles.addButton} onPress={onAddPress}>
          <Icon name="add" size={20} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    width: '48%',
    backgroundColor: COLORS.white,
    borderRadius: 25,
    marginBottom: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 141,
  },
  content: {
    padding: 15,
  },
  title: {
    fontSize: 16,
    color: COLORS.text.secondary,
    marginBottom: 10,
    height: 50,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text.primary,
  },
  addButton: {
    width: 27,
    height: 27,
    backgroundColor: COLORS.accent,
    borderRadius: 13.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FoodCard; 