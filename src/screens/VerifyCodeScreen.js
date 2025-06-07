import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../theme/colors';
import { SPACING } from '../theme/spacing';
import BotonEstandar from '../components/BotonEstandar';
import Input from '../components/Input';

const VerifyCodeScreen = ({ navigation }) => {
  const [code, setCode] = useState('');

  const handleVerifyCode = () => {
    // Implement verify code logic here
    console.log('Verify code pressed');
    navigation.navigate('Location');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verificar Código</Text>
      <Text style={styles.subtitle}>
        Ingresa el código que te enviamos a tu correo electrónico.
      </Text>
      <Input
        placeholder="Código"
        value={code}
        onChangeText={setCode}
        keyboardType="number-pad"
      />
      <BotonEstandar title="Verificar" onPress={handleVerifyCode} />
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.linkText}>Reenviar Código</Text>
      </TouchableOpacity>
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
  linkText: {
    color: COLORS.primary,
    marginTop: SPACING.sm,
    textAlign: 'center',
  },
});

export default VerifyCodeScreen;
