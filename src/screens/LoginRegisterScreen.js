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
import { COLORS } from '../theme/colors';
import { SPACING } from '../theme/spacing';
import BotonEstandar from '../components/BotonEstandar';
import Icon from 'react-native-vector-icons/FontAwesome';
import Input from '../components/Input';
import { useAuth } from '../context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { showAlert } from '../utils';
import api from '../config/api';
import { firebase } from '../../firebase-config';
import { Picker } from '@react-native-picker/picker';

const { width, height } = Dimensions.get('window');

const LoginRegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('cliente');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState('');
  const [noRestaurants, setNoRestaurants] = useState(false);

  const { registerUser, loginUser } = useAuth();

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        // 1. Obtén todos los usuarios admin y sus restaurantId válidos
        const usersSnapshot = await firebase.firestore()
          .collection('users')
          .where('role', '==', 'administrador')
          .get();
        const takenRestaurantIds = usersSnapshot.docs
          .map(doc => doc.data().restaurantId)
          .filter(id => typeof id === 'string' && id.length > 0);

        // 2. Obtén todos los restaurantes
        const restaurantsSnapshot = await firebase.firestore()
          .collection('restaurants')
          .get();
        const data = restaurantsSnapshot.docs
          .map(doc => ({
            id: doc.id,
            name: doc.data().name,
          }))
          // 3. Filtra los que ya están tomados
          .filter(r => !takenRestaurantIds.includes(r.id));

        setRestaurants(data);
        setNoRestaurants(data.length === 0);
      } catch (err) {
        setRestaurants([]);
        setNoRestaurants(true);
      }
    };
    if (!isLogin && selectedRole === 'administrador') {
      fetchRestaurants();
    }
  }, [isLogin, selectedRole]);

  useEffect(() => {
    if (!isLogin && selectedRole === 'administrador' && noRestaurants) {
      setSelectedRole('cliente');
      setSelectedRestaurant('');
    }
  }, [noRestaurants, isLogin, selectedRole]);

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
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (selectedRole === 'administrador' && !selectedRestaurant) {
      setError('Debes seleccionar un restaurante.');
      return;
    }
    const payload = {
      email,
      password,
      name,
      role: selectedRole,
      restaurantId: selectedRole === 'administrador' ? selectedRestaurant : undefined,
    };
    console.log('Datos enviados al backend:', payload);
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/register', payload);
      await loginUser(email, password);
      showAlert('Registro exitoso', 'Tu cuenta ha sido creada correctamente.');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrar. Intenta de nuevo.');
    }
    setLoading(false);
  };

  const RoleButton = ({ role, title, description, icon, color }) => (
    <TouchableOpacity
      style={[
        styles.roleButton,
        selectedRole === role && styles.roleButtonSelected,
        { borderColor: color }
      ]}
      onPress={() => setSelectedRole(role)}
      activeOpacity={0.8}
    >
      <View style={[
        styles.roleIconContainer,
        { backgroundColor: selectedRole === role ? color : color + '20' }
      ]}>
        <Icon 
          name={icon} 
          size={24} 
          color={selectedRole === role ? COLORS.white : color} 
        />
      </View>
      <Text style={[
        styles.roleButtonTitle,
        selectedRole === role && { color: color }
      ]}>
        {title}
      </Text>
      <Text style={[
        styles.roleButtonDescription,
        selectedRole === role && { color: color + 'CC' }
      ]}>
        {description}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FF6B00', '#FF8E53', '#FFB366']}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Header con logo */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Icon name="cutlery" size={40} color={COLORS.white} />
            <Text style={styles.logoText}>FoodMike</Text>
          </View>
          <Text style={styles.welcomeText}>
            {isLogin ? '¡Bienvenido de vuelta!' : '¡Únete a nosotros!'}
          </Text>
        </View>

        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Card principal */}
          <View style={styles.mainCard}>
            <Text style={styles.title}>
              {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
            </Text>
            
            {error ? (
              <View style={styles.errorContainer}>
                <Icon name="exclamation-triangle" size={16} color="#FF5722" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            {!isLogin && (
              <>
                <Input
                  label="Nombre completo"
                  placeholder="Tu nombre completo"
                  value={name}
                  onChangeText={setName}
                  leftIcon={<Icon name="user" size={20} color={COLORS.primary} />}
                  containerStyle={styles.inputContainer}
                />
                
                <Text style={styles.sectionTitle}>Selecciona tu tipo de cuenta:</Text>
                <View style={styles.roleContainer}>
                  <RoleButton
                    role="cliente"
                    title="Cliente"
                    description="Ordena comida y gestiona tu perfil"
                    icon="user"
                    color="#4CAF50"
                  />
                  {!noRestaurants && (
                    <RoleButton
                      role="administrador"
                      title="Administrador"
                      description="Gestiona restaurantes y usuarios"
                      icon="cog"
                      color="#2196F3"
                    />
                  )}
                </View>

                {noRestaurants && (
                  <Text style={{ color: '#FF5722', marginBottom: 16, textAlign: 'center', fontWeight: 'bold' }}>
                    No hay restaurantes disponibles para asignar. Por favor, contacta al administrador o crea un restaurante primero.
                  </Text>
                )}

                {!isLogin && selectedRole === 'administrador' && (
                  <>
                    <Text style={styles.sectionTitle}>Selecciona el restaurante que administrarás:</Text>
                    {noRestaurants ? (
                      <Text style={{ color: '#FF5722', marginBottom: 16, textAlign: 'center', fontWeight: 'bold' }}>
                        No hay restaurantes disponibles para asignar. Por favor, contacta al administrador o crea un restaurante primero.
                      </Text>
                    ) : (
                      <View style={{ backgroundColor: '#fff', borderRadius: 8, marginBottom: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#eee' }}>
                        <Picker
                          selectedValue={selectedRestaurant}
                          onValueChange={setSelectedRestaurant}
                          style={{ height: 48, width: '100%' }}
                          itemStyle={{ fontSize: 16 }}
                        >
                          <Picker.Item label="Selecciona un restaurante" value="" />
                          {restaurants.map(r => (
                            <Picker.Item key={r.id} label={r.name} value={r.id} />
                          ))}
                        </Picker>
                      </View>
                    )}
                  </>
                )}
              </>
            )}

            <Input
              label="Email"
              placeholder="tu@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon={<Icon name="envelope" size={20} color={COLORS.primary} />}
              containerStyle={styles.inputContainer}
            />

            <Input
              label="Contraseña"
              placeholder="Tu contraseña"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              leftIcon={<Icon name="lock" size={20} color={COLORS.primary} />}
              containerStyle={styles.inputContainer}
            />

            {!isLogin && (
              <Input
                label="Confirmar contraseña"
                placeholder="Confirma tu contraseña"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                leftIcon={<Icon name="lock" size={20} color={COLORS.primary} />}
                containerStyle={styles.inputContainer}
              />
            )}

            <BotonEstandar
              title={isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
              onPress={isLogin ? handleLogin : handleRegister}
              icon={isLogin ? "sign-in" : "user-plus"}
              disabled={loading}
              style={styles.mainButton}
            />

            {loading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>
                  {isLogin ? 'Iniciando sesión...' : 'Creando cuenta...'}
                </Text>
              </View>
            )}

            <TouchableOpacity 
              onPress={() => {
                setIsLogin(!isLogin);
                setError('');
                setEmail('');
                setPassword('');
                setName('');
                setConfirmPassword('');
              }}
              style={styles.switchModeButton}
            >
              <Text style={styles.switchModeText}>
                {isLogin
                  ? "¿No tienes una cuenta? Regístrate"
                  : "¿Ya tienes una cuenta? Inicia Sesión"}
              </Text>
              <Icon 
                name={isLogin ? "arrow-right" : "arrow-left"} 
                size={16} 
                color={COLORS.primary} 
              />
            </TouchableOpacity>

            {isLogin && (
              <TouchableOpacity 
                onPress={() => navigation.navigate('ForgotPassword')}
                style={styles.forgotPasswordButton}
              >
                <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Social login */}
          <View style={styles.socialContainer}>
            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>O continúa con</Text>
              <View style={styles.divider} />
            </View>
            
            <View style={styles.socialButtonsContainer}>
              <TouchableOpacity style={[styles.socialButton, { backgroundColor: '#DB4437' }]}>
                <Icon name="google" size={24} color={COLORS.white} />
                <Text style={styles.socialButtonText}>Google</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.socialButton, { backgroundColor: '#4267B2' }]}>
                <Icon name="facebook" size={24} color={COLORS.white} />
                <Text style={styles.socialButtonText}>Facebook</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingTop: SPACING.xl * 2,
    paddingBottom: SPACING.lg,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.white,
    marginLeft: SPACING.sm,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 2 },
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
