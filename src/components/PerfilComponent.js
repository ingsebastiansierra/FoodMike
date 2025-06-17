import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { COLORS } from '../theme/colors';
import BotonEstandar from './BotonEstandar';

const PerfilComponent = () => {
  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <Image
          style={styles.profileImage}
          source={{uri: 'https://plus.unsplash.com/premium_photo-1661627681947-4431c8c97659?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'}}
        />
        <Text style={styles.profileName}>User Name</Text>
        <Text style={styles.profileEmail}>user@example.com</Text>
      </View>

      <BotonEstandar title="Métodos de Pago" onPress={() => {}} />
      <BotonEstandar title="Editar Perfil" onPress={() => {}} />
      <BotonEstandar title="Salir" onPress={() => {}} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: COLORS.background.primary,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    color: COLORS.text.primary,
  },
  profileEmail: {
    fontSize: 16,
    color: COLORS.text.secondary,
  },
});

export default PerfilComponent;
