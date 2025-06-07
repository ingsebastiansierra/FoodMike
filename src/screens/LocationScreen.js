import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { COLORS } from '../theme/colors';
import { SPACING } from '../theme/spacing';
import BotonEstandar from '../components/BotonEstandar';
import * as Location from 'expo-location';

const LocationScreen = ({ navigation }) => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Se denegó el permiso para acceder a la ubicación');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  let text = 'Esperando la ubicación...';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  const handleAllowLocation = () => {
    // Implement location check logic here
    console.log('Allow location pressed');
    // Simulate municipality check
    const isInAllowedMunicipality = Math.random() < 0.5; // 50% chance of being in the allowed municipality

    if (isInAllowedMunicipality) {
      alert('¡Bienvenido! Este servicio está disponible en tu municipio.');
      navigation.navigate('Home');
    } else {
      alert('Lo sentimos, este servicio no está disponible en tu municipio.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Acceso a tu Ubicación</Text>
      <Text style={styles.subtitle}>
        Para continuar, necesitamos acceder a tu ubicación para verificar si este servicio está disponible en tu municipio.
      </Text>
      <Text>{text}</Text>
      <BotonEstandar title="Permitir Ubicación" onPress={handleAllowLocation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
});

export default LocationScreen;
