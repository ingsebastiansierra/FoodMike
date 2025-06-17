import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const NotificacionesComponent = () => {
  return (
    <View style={styles.container}>
      <Text>Notificaciones Content</Text>
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

export default NotificacionesComponent;
