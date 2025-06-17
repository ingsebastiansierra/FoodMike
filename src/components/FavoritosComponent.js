import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const FavoritosComponent = () => {
  return (
    <View style={styles.container}>
      <Text>Favoritos Content</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FavoritosComponent;
