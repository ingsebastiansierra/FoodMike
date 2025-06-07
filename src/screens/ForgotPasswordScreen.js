import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../theme/colors';
import { SPACING } from '../theme/spacing';
import BotonEstandar from '../components/BotonEstandar';
import Input from '../components/Input';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');

  const handleResetPassword = () => {
    // Implement reset password logic here
    const code = Math.floor(100000 + Math.random() * 900000);
    console.log('Generated code:', code);
    navigation.navigate('VerifyCode');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¿Olvidaste tu Contraseña?</Text>
      <Text style={styles.subtitle}>
        Ingresa tu correo electrónico y te enviaremos un código para verificar tu cuenta.
      </Text>
      <Input
        placeholder="Correo Electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <BotonEstandar title="Enviar Código" onPress={handleResetPassword} />
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.linkText}>Volver al Inicio de Sesión</Text>
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

export default ForgotPasswordScreen;
