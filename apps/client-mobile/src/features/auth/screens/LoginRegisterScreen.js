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
  Animated,
  TextInput,
  ImageBackground,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../../theme/colors';
import { SPACING } from '../../../theme/spacing';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useAuth } from '../../../context/AuthContext';
import { showAlert } from '../../core/utils/alert';

const { width, height } = Dimensions.get('window');

const LoginRegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fadeAnim] = useState(new Animated.Value(0));

  const { login, register } = useAuth();

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Por favor completa todos los campos.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await login(email, password);
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
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Hero Section con Imagen de Fondo */}
          <Animated.View style={[styles.heroSection, { opacity: fadeAnim }]}>
            <ImageBackground
              source={{ uri: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80' }}
              style={styles.heroBackground}
              imageStyle={styles.heroImage}
            >
              <LinearGradient
                colors={['rgba(0, 0, 0, 0.5)', 'rgba(0, 0, 0, 0.7)']}
                style={styles.heroOverlay}
              >
                {/* Logo Badge */}
                <View style={styles.logoBadge}>
                  <LinearGradient
                    colors={['#FF6B35', '#FF8C42']}
                    style={styles.logoBadgeGradient}
                  >
                    <Icon name="cutlery" size={28} color={COLORS.white} />
                  </LinearGradient>
                </View>

                {/* App Name */}
                <Text style={styles.appName}>TOC TOC</Text>

                {/* Hero Text */}
                <Text style={styles.heroTitle}>Comienza ahora</Text>
                <Text style={styles.heroSubtitle}>
                  Crea una cuenta o inicia sesión para explorar
                </Text>
              </LinearGradient>
            </ImageBackground>
          </Animated.View>

          {/* Card Principal */}
          <Animated.View style={[styles.mainCard, { opacity: fadeAnim }]}>
            {/* Tabs de Login/Registro */}
            <View style={styles.tabsContainer}>
              <TouchableOpacity
                style={[styles.tab, isLogin && styles.activeTab]}
                onPress={() => {
                  setIsLogin(true);
                  setError('');
                }}
              >
                <Text style={[styles.tabText, isLogin && styles.activeTabText]}>
                  Iniciar Sesión
                </Text>
                {isLogin && <View style={styles.tabIndicator} />}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.tab, !isLogin && styles.activeTab]}
                onPress={() => {
                  setIsLogin(false);
                  setError('');
                }}
              >
                <Text style={[styles.tabText, !isLogin && styles.activeTabText]}>
                  Registrarse
                </Text>
                {!isLogin && <View style={styles.tabIndicator} />}
              </TouchableOpacity>
            </View>

            <View style={styles.formContainer}>
              <Text style={styles.welcomeText}>
                {isLogin
                  ? 'Ingresa tus credenciales'
                  : 'Crea tu cuenta gratis'
                }
              </Text>

              {error ? (
                <Animated.View style={styles.errorContainer}>
                  <Icon name="exclamation-circle" size={20} color="#D32F2F" />
                  <Text style={styles.errorText}>{error}</Text>
                </Animated.View>
              ) : null}

              <View style={styles.inputContainer}>
                {!isLogin && (
                  <View style={styles.inputWrapper}>
                    <View style={styles.inputIconContainer}>
                      <Icon name="user" size={18} color="#FF6B35" />
                    </View>
                    <TextInput
                      placeholder="Nombre completo"
                      placeholderTextColor="#999"
                      value={name}
                      onChangeText={setName}
                      style={styles.input}
                    />
                  </View>
                )}

                <View style={styles.inputWrapper}>
                  <View style={styles.inputIconContainer}>
                    <Icon name="envelope" size={16} color="#FF6B35" />
                  </View>
                  <TextInput
                    placeholder="Correo electrónico"
                    placeholderTextColor="#999"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={styles.input}
                  />
                </View>

                <View style={styles.inputWrapper}>
                  <View style={styles.inputIconContainer}>
                    <Icon name="lock" size={20} color="#FF6B35" />
                  </View>
                  <TextInput
                    placeholder="Contraseña"
                    placeholderTextColor="#999"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    style={styles.input}
                  />
                </View>

                {!isLogin && (
                  <View style={styles.inputWrapper}>
                    <View style={styles.inputIconContainer}>
                      <Icon name="lock" size={20} color="#FF6B35" />
                    </View>
                    <TextInput
                      placeholder="Confirmar contraseña"
                      placeholderTextColor="#999"
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      secureTextEntry
                      style={styles.input}
                    />
                  </View>
                )}
              </View>

              {isLogin && (
                <TouchableOpacity
                  style={styles.forgotPasswordButton}
                  onPress={() => navigation.navigate('ForgotPassword')}
                >
                  <Text style={styles.forgotPasswordText}>
                    ¿Olvidaste tu contraseña?
                  </Text>
                </TouchableOpacity>
              )}

              {loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#FF6B35" />
                  <Text style={styles.loadingText}>
                    {isLogin ? 'Iniciando sesión...' : 'Creando tu cuenta...'}
                  </Text>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.mainButton}
                  onPress={isLogin ? handleLogin : handleRegister}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#FF6B35', '#FF8C42']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.buttonGradient}
                  >
                    <Text style={styles.mainButtonText}>
                      {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
                    </Text>
                    <Icon name={isLogin ? 'arrow-right' : 'user-plus'} size={18} color={COLORS.white} />
                  </LinearGradient>
                </TouchableOpacity>
              )}
            </View>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>o continúa con</Text>
              <View style={styles.divider} />
            </View>

            {/* Social Buttons */}
            <View style={styles.socialButtonsContainer}>
              <TouchableOpacity style={styles.socialButton} activeOpacity={0.7}>
                <Icon name="google" size={22} color="#EA4335" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton} activeOpacity={0.7}>
                <Icon name="facebook" size={22} color="#1877F2" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton} activeOpacity={0.7}>
                <Icon name="apple" size={22} color="#000000" />
              </TouchableOpacity>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Al continuar, aceptas nuestros{' '}
                <Text style={styles.footerLink}>Términos de Servicio</Text>
                {' '}y{' '}
                <Text style={styles.footerLink}>Política de Privacidad</Text>
              </Text>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  heroSection: {
    width: width,
    height: height * 0.55,
    marginBottom: 0,
  },
  heroBackground: {
    width: '100%',
    height: '100%',
  },
  heroImage: {
    resizeMode: 'cover',
  },
  heroOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 40,
    paddingBottom: SPACING.xl + 30,
  },
  logoBadge: {
    marginTop: SPACING.xl + 40,
    marginBottom: SPACING.lg,
  },
  logoBadgeGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 10,
  },
  appName: {
    fontSize: 48,
    fontWeight: '900',
    color: COLORS.white,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 8,
    letterSpacing: 3,
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.white,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 8,
    letterSpacing: 0.5,
    marginBottom: SPACING.sm,
  },
  heroSubtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.95)',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
    paddingHorizontal: SPACING.xl,
  },
  mainCard: {
    backgroundColor: COLORS.white,
    padding: SPACING.xl,
    paddingTop: SPACING.xl + 10,
    marginHorizontal: 0,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 15,
    padding: 4,
    marginBottom: SPACING.xl,
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    borderRadius: 12,
    position: 'relative',
  },
  activeTab: {
    backgroundColor: COLORS.white,
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#999',
  },
  activeTabText: {
    color: '#FF6B35',
    fontWeight: '700',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 8,
    width: 30,
    height: 3,
    backgroundColor: '#FF6B35',
    borderRadius: 2,
  },
  formContainer: {
    marginBottom: SPACING.lg,
  },
  welcomeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
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
    borderLeftColor: '#D32F2F',
  },
  errorText: {
    color: '#D32F2F',
    marginLeft: SPACING.sm,
    fontWeight: '600',
    flex: 1,
    fontSize: 13,
  },
  inputContainer: {
    marginBottom: SPACING.sm,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 15,
    marginBottom: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderWidth: 2,
    borderColor: '#F0F0F0',
  },
  inputIconContainer: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    paddingVertical: SPACING.md + 2,
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: SPACING.md,
  },
  forgotPasswordText: {
    color: '#FF6B35',
    fontWeight: '600',
    fontSize: 13,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  loadingText: {
    color: '#FF6B35',
    marginTop: SPACING.md,
    fontWeight: '600',
    fontSize: 15,
  },
  mainButton: {
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md + 4,
    gap: SPACING.sm,
  },
  mainButtonText: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.lg,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    color: '#999',
    paddingHorizontal: SPACING.md,
    fontSize: 13,
    fontWeight: '500',
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.md,
  },
  socialButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F8F8F8',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  footer: {
    marginTop: SPACING.xl,
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  footerText: {
    color: '#999',
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 16,
    fontWeight: '500',
  },
  footerLink: {
    color: '#FF6B35',
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});

export default LoginRegisterScreen;
