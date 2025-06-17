import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PerfilComponent = () => {
  return (
    <View style={styles.container}>
      <Text>Perfil Content</Text>
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

export default PerfilComponent;
