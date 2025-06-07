import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { COLORS } from '../theme/colors';
import { SPACING } from '../theme/spacing';
import BotonEstandar from '../components/BotonEstandar';
import Icon from 'react-native-vector-icons/FontAwesome';
import Input from '../components/Input';

const LoginRegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const handleLogin = () => {
    // Implement login logic here
    console.log('Login pressed');
    navigation.navigate('Home');
  };

  const handleRegister = () => {
    // Implement register logic here
    console.log('Register pressed');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isLogin ? 'Iniciar Sesión' : 'Registrarse'}</Text>
      {!isLogin && (
        <Input
          placeholder="Nombre Completo"
          value={name}
          onChangeText={setName}
        />
      )}
      <Input
        placeholder="Correo Electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {!isLogin && (
        <TextInput
          style={styles.input}
          placeholder="Confirmar Contraseña"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
      )}
      <BotonEstandar
        title={isLogin ? " Iniciar Sesión" : " Registrarse"}
        onPress={isLogin ? handleLogin : handleRegister}
        icon={isLogin ? "sign-in" : "user-plus"}
      />
      <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
        <Text style={styles.linkText}>
          {isLogin
            ? "¿No tienes una cuenta? Regístrate"
            : "¿Ya tienes una cuenta? Inicia Sesión"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
        <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
      </TouchableOpacity>

      <View style={styles.socialLoginContainer}>
        <TouchableOpacity style={styles.socialLoginButton} >
          <Icon name="google" size={30} color={COLORS.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialLoginButton} >
          <Icon name="facebook" size={30} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
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
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 5,
    padding: SPACING.sm,
    marginBottom: SPACING.md,
  },
  linkText: {
    color: COLORS.primary,
    marginTop: SPACING.sm,
    textAlign: 'center',
  },
  forgotPasswordText: {
    color: COLORS.primary,
    marginTop: SPACING.sm,
    textAlign: 'center',
  },
  socialLoginContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: SPACING.md,
  },
  socialLoginButton: {
    backgroundColor: COLORS.lightGray,
    padding: SPACING.sm,
    borderRadius: 5,
  },
});

export default LoginRegisterScreen;
