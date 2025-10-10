import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator, 
  ScrollView, 
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

const { width } = Dimensions.get('window');

const LoginRegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 👇 Traemos los métodos del AuthContext que usan Supabase
  const { login, register } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Por favor completa todos los campos.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await login(email, password);
      // La navegación la maneja AuthContext al detectar sesión
    } catch (err) {
      console.error('Error de login:', err.message);
      if (err.message.includes('Invalid login credentials')) {
        setError('Correo o contraseña incorrectos.');
      } else if (err.message.includes('Email not confirmed')) {
        setError('Por favor verifica tu correo electrónico para activar tu cuenta.');
      } else {
        setError('Error al iniciar sesión. Intenta de nuevo.');
      }
    } finally {
      setLoading(false);
    }
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
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await register(email, password, { fullName: name });
      showAlert(
        '¡Registro exitoso!',
        'Por favor revisa tu correo electrónico para verificar tu cuenta.'
      );
      setIsLogin(true);
    } catch (err) {
      console.error('Error de registro:', err.message);
      if (err.message.includes('already registered')) {
        setError('Este correo ya está en uso.');
      } else if (err.message.includes('invalid format')) {
        setError('Formato de correo inválido.');
      } else {
        setError('Error al registrarse. Intenta de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <GradientBackground variant="primary">
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        style={{ flex: 1 }}
      >
        <StatusBar barStyle="light-content" />
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Icon name="cutlery" size={24} color={COLORS.white} />
            </View>
            <Text style={styles.headerTitle}>TOC TOC</Text>
          </View>
        </View>
        
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.mainCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.title}>
                {isLogin ? 'Entrar' : 'Crear Cuenta'}
              </Text>
              <Text style={styles.subtitle}>
                {isLogin 
                  ? 'Ingresa tus datos para continuar' 
                  : 'Completa tus datos para empezar'
                }
              </Text>
            </View>

            {error ? (
              <View style={styles.errorContainer}>
                <Icon name="exclamation-triangle" size={18} color={COLORS.error} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <View style={styles.inputContainer}>
              {!isLogin && (
                <Input
                  icon="user"
                  placeholder="Tu nombre completo"
                  value={name}
                  onChangeText={setName}
                  label="Nombre"
                />
              )}
              <Input
                icon="envelope"
                placeholder="tu@email.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                label="Correo electrónico"
              />
              <Input
                icon="lock"
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                label="Contraseña"
              />
              {!isLogin && (
                <Input
                  icon="lock"
                  placeholder="Repite tu contraseña"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  label="Confirmar contraseña"
                />
              )}
            </View>

            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>
                  {isLogin ? 'Iniciando sesión...' : 'Creando tu cuenta...'}
                </Text>
              </View>
            ) : (
              <BotonEstandar
                title={isLogin ? 'Entrar' : 'Crear Cuenta'}
                onPress={isLogin ? handleLogin : handleRegister}
                style={styles.mainButton}
                size="medium"
                icon={isLogin ? 'sign-in' : 'user-plus'}
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
                {isLogin ? '¿Nuevo en TOC TOC?' : '¿Ya tienes cuenta?'}
              </Text>
              <Text style={styles.switchModeAction}>
                {isLogin ? 'Crear cuenta' : 'Iniciar sesión'}
              </Text>
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

          {/* SOCIALS */}
          <View style={styles.socialContainer}>
            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>O continúa con</Text>
              <View style={styles.divider} />
            </View>
            <View style={styles.socialButtonsContainer}>
              <TouchableOpacity style={[styles.socialButton, styles.googleButton]}>
                <Icon name="google" size={20} color={COLORS.white} />
                <Text style={styles.socialButtonText}>Google</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.socialButton, styles.facebookButton]}>
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
  header: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 20 : 50,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.white,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
    letterSpacing: 0.5,
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
    shadowColor: COLORS.shadow?.dark || '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  cardHeader: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.text.secondary,
    textAlign: 'center',
    fontWeight: '500',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightPrimary,
    padding: SPACING.md,
    borderRadius: 16,
    marginBottom: SPACING.lg,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.error,
  },
  errorText: {
    color: COLORS.error,
    marginLeft: SPACING.sm,
    fontWeight: '600',
    flex: 1,
    fontSize: 14,
  },
  inputContainer: {
    marginBottom: SPACING.sm,
  },
  mainButton: {
    marginTop: SPACING.xs,
    marginBottom: SPACING.sm,
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: SPACING.lg,
    paddingVertical: SPACING.xl,
  },
  loadingText: {
    color: COLORS.primary,
    marginTop: SPACING.md,
    fontWeight: '600',
    fontSize: 16,
  },
  switchModeButton: {
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    marginTop: SPACING.xs,
  },
  switchModeText: {
    color: COLORS.text.secondary,
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  switchModeAction: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  forgotPasswordButton: {
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    marginTop: SPACING.xs,
  },
  forgotPasswordText: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  socialContainer: {
    marginTop: SPACING.md,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  divider: {
    flex: 1,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 1,
  },
  dividerText: {
    color: COLORS.white,
    paddingHorizontal: SPACING.lg,
    fontSize: 14,
    fontWeight: '600',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: SPACING.sm,
    borderRadius: 20,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.md,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  googleButton: {
    backgroundColor: '#EA4335',
  },
  facebookButton: {
    backgroundColor: '#1877F2',
  },
  socialButtonText: {
    color: COLORS.white,
    fontWeight: '700',
    marginLeft: SPACING.sm,
    fontSize: 14,
  },
});

export default LoginRegisterScreen;
