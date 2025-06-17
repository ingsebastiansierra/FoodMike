import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const RestaurantCard = ({ restaurant }) => {
  return (
    <View style={styles.card}>
      <Image source={{ uri: restaurant.image.uri }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name}>{restaurant.name}</Text>
        <Text style={styles.address}>{restaurant.address}</Text>
        <Text style={styles.schedule}>{restaurant.schedule}</Text>
        <View style={styles.ratingContainer}>
          <Text style={styles.rating}>{restaurant.stars}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    margin: 0,
    width: '100%',
    height: 250,
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  info: {
    padding: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  address: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 5,
  },
  schedule: {
    fontSize: 12,
    color: 'gray',
    marginBottom: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f00',
  },
});

export default RestaurantCard;
