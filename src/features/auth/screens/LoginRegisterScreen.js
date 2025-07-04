import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator, 
  ScrollView, 
  Alert,
  Dimensions,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { COLORS } from '../../../theme/colors';
import { SPACING } from '../../../theme/spacing';
import BotonEstandar from '../../../components/BotonEstandar';
import Icon from 'react-native-vector-icons/FontAwesome';
import Input from '../../../components/Input';
import { useAuth } from '../../../context/AuthContext';
import GradientBackground from '../../../components/GradientBackground';
import { showAlert } from '../../core/utils/alert';
import api from '../../../config/api';
import { firebase } from '../../../../firebase-config';
import { Picker } from '@react-native-picker/picker';

const { width, height } = Dimensions.get('window');

const LoginRegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { registerUser, loginUser } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Por favor completa todos los campos.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await loginUser(email, password);
      // La navegación se manejará automáticamente en el AuthContext
    } catch (err) {
      console.error('Error de login:', err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Correo o contraseña incorrectos.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Formato de correo inválido.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Demasiados intentos fallidos. Intenta más tarde.');
      } else {
        setError('Error al iniciar sesión. Intenta de nuevo.');
      }
    }
    setLoading(false);
  };

  const handleRegister = async () => {
    if (!email || !password || !name || !confirmPassword) {
      setError('Por favor completa todos los campos.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await registerUser(email, password, name);
      // La navegación se manejará automáticamente
    } catch (err) {
      console.error('Error de registro:', err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Este correo ya está en uso.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Formato de correo inválido.');
      } else if (err.code === 'auth/weak-password') {
        setError('La contraseña debe tener al menos 6 caracteres.');
      } else {
        setError('Error al registrarse. Intenta de nuevo.');
      }
    }
    setLoading(false);
  };

  return (
    <GradientBackground>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        style={{ flex: 1 }}
      >
        <StatusBar barStyle="light-content" />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>FoodMike</Text>
          <Text style={styles.welcomeText}>
            {isLogin ? 'Bienvenido de nuevo' : 'Crea tu cuenta'}
          </Text>
        </View>
        
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.mainCard}>
            <Text style={styles.title}>{isLogin ? 'Iniciar Sesión' : 'Registro'}</Text>

            {error ? (
              <View style={styles.errorContainer}>
                <Icon name="exclamation-circle" size={20} color="#FF5722" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <View style={styles.inputContainer}>
              {!isLogin && (
                <Input
                  icon="user"
                  placeholder="Nombre Completo"
                  value={name}
                  onChangeText={setName}
                />
              )}
              <Input
                icon="envelope"
                placeholder="Correo Electrónico"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <Input
                icon="lock"
                placeholder="Contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              {!isLogin && (
                <Input
                  icon="lock"
                  placeholder="Confirmar Contraseña"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                />
              )}
            </View>

            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>{isLogin ? 'Iniciando sesión...' : 'Registrando...'}</Text>
              </View>
            ) : (
              <BotonEstandar
                texto={isLogin ? 'Iniciar Sesión' : 'Registrarse'}
                onPress={isLogin ? handleLogin : handleRegister}
                style={styles.mainButton}
                colorFondo={COLORS.primary}
              />
            )}

            <TouchableOpacity 
              style={styles.switchModeButton}
              onPress={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
            >
              <Text style={styles.switchModeText}>
                {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
              </Text>
              <Icon name={isLogin ? "arrow-right" : "arrow-left"} size={16} color={COLORS.primary} />
            </TouchableOpacity>

            {isLogin && (
              <TouchableOpacity 
                style={styles.forgotPasswordButton}
                onPress={() => navigation.navigate('ForgotPassword')}
              >
                <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.socialContainer}>
            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>O continúa con</Text>
              <View style={styles.divider} />
            </View>
            <View style={styles.socialButtonsContainer}>
              <TouchableOpacity style={[styles.socialButton, { backgroundColor: '#4285F4' }]}>
                <Icon name="google" size={20} color={COLORS.white} />
                <Text style={styles.socialButtonText}>Google</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.socialButton, { backgroundColor: '#1877F2' }]}>
                <Icon name="facebook" size={20} color={COLORS.white} />
                <Text style={styles.socialButtonText}>Facebook</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 20 : 60,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl * 2,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.white,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  welcomeText: {
    fontSize: 18,
    color: COLORS.white,
    opacity: 0.9,
    textAlign: 'center',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  mainCard: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: SPACING.xl,
    marginBottom: SPACING.lg,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    padding: SPACING.md,
    borderRadius: 12,
    marginBottom: SPACING.md,
    borderLeftWidth: 4,
    borderLeftColor: '#FF5722',
  },
  errorText: {
    color: '#FF5722',
    marginLeft: SPACING.sm,
    fontWeight: '600',
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
    marginTop: SPACING.md,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  roleButton: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: SPACING.lg,
    borderRadius: 16,
    marginHorizontal: SPACING.xs,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.lightGray,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  roleButtonSelected: {
    backgroundColor: COLORS.white,
    borderWidth: 3,
    elevation: 4,
    shadowOpacity: 0.15,
  },
  roleIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  roleButtonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  roleButtonDescription: {
    fontSize: 12,
    color: COLORS.gray,
    textAlign: 'center',
    lineHeight: 16,
  },
  inputContainer: {
    marginBottom: SPACING.md,
  },
  mainButton: {
    marginTop: SPACING.lg,
    marginBottom: SPACING.md,
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  loadingText: {
    color: COLORS.primary,
    marginTop: SPACING.sm,
    fontWeight: '600',
  },
  switchModeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    marginTop: SPACING.sm,
  },
  switchModeText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    marginRight: SPACING.xs,
  },
  forgotPasswordButton: {
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  forgotPasswordText: {
    color: COLORS.primary,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  socialContainer: {
    marginTop: SPACING.lg,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  dividerText: {
    color: COLORS.white,
    paddingHorizontal: SPACING.md,
    fontSize: 14,
    fontWeight: '600',
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: 25,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  socialButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    marginLeft: SPACING.sm,
  },
});

export default LoginRegisterScreen;
