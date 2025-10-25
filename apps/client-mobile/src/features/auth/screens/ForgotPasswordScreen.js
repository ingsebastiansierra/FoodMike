import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { COLORS } from '../../../theme/colors';
import { SPACING } from '../../../theme/spacing';
import BotonEstandar from '../../../components/BotonEstandar';
import Input from '../../../components/Input';
import Icon from 'react-native-vector-icons/FontAwesome';
import { supabase } from '../../../config/supabase';
import { LinearGradient } from 'expo-linear-gradient';
import { showAlert } from '../../core/utils/alert';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleResetPassword = async () => {
    if (!email) {
      setError('Por favor ingresa tu correo electrónico.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: 'foodmike://reset-password',
      });
      
      if (error) throw error;
      
      setSuccess('¡Correo de recuperación enviado! Revisa tu bandeja de entrada.');
      showAlert(
        'Correo Enviado',
        'Hemos enviado un enlace de recuperación a tu correo electrónico. Revisa tu bandeja de entrada y sigue las instrucciones.'
      );
    } catch (err) {
      console.error('Error al enviar correo de recuperación:', err);
      if (err.message.includes('user not found')) {
        setError('No existe una cuenta con este correo electrónico.');
      } else if (err.message.includes('invalid email')) {
        setError('Formato de correo electrónico inválido.');
      } else {
        setError('No se pudo enviar el correo. Verifica el email e intenta de nuevo.');
      }
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
        
        <LinearGradient
          colors={['#FF6B00', '#FF8E53', '#FFB366']}
          style={styles.backgroundGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Icon name="arrow-left" size={24} color={COLORS.white} />
            </TouchableOpacity>
            
            <View style={styles.headerContent}>
              <View style={styles.iconContainer}>
                <Icon name="lock" size={40} color={COLORS.white} />
              </View>
              <Text style={styles.headerTitle}>Recuperar Contraseña</Text>
              <Text style={styles.headerSubtitle}>
                Te ayudaremos a recuperar tu cuenta
              </Text>
            </View>
          </View>

          <ScrollView 
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Card principal */}
            <View style={styles.mainCard}>
              <View style={styles.illustrationContainer}>
                <View style={styles.illustrationCircle}>
                  <Icon name="envelope-open" size={50} color={COLORS.primary} />
                </View>
              </View>

              <Text style={styles.title}>¿Olvidaste tu contraseña?</Text>
              <Text style={styles.subtitle}>
                No te preocupes, es algo que le pasa a todos. Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
              </Text>

              {error ? (
                <View style={styles.errorContainer}>
                  <Icon name="exclamation-circle" size={20} color="#FF5722" />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}

              {success ? (
                <View style={styles.successContainer}>
                  <Icon name="check-circle" size={20} color="#4CAF50" />
                  <Text style={styles.successText}>{success}</Text>
                </View>
              ) : null}

              <View style={styles.inputContainer}>
                <Input
                  icon="envelope"
                  placeholder="Correo Electrónico"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              {loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={COLORS.primary} />
                  <Text style={styles.loadingText}>Enviando correo...</Text>
                </View>
              ) : (
                <BotonEstandar
                  texto="Enviar Enlace de Recuperación"
                  onPress={handleResetPassword}
                  style={styles.mainButton}
                  colorFondo={COLORS.primary}
                />
              )}

              <TouchableOpacity 
                style={styles.backToLoginButton}
                onPress={() => navigation.goBack()}
              >
                <Icon name="arrow-left" size={16} color={COLORS.primary} />
                <Text style={styles.backToLoginText}>Volver a Iniciar Sesión</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.infoCard}>
              <View style={styles.infoHeader}>
                <Icon name="info-circle" size={20} color={COLORS.primary} />
                <Text style={styles.infoTitle}>¿Cómo funciona?</Text>
              </View>
              <Text style={styles.infoText}>
                Recibirás un correo con un enlace seguro. Haz clic en él para crear una nueva contraseña para tu cuenta. Si no lo ves, revisa tu carpeta de spam.
              </Text>
            </View>
          </ScrollView>
        </LinearGradient>
      </KeyboardAvoidingView>
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
    paddingTop: SPACING.xl * 2,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  headerContent: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
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
  illustrationContainer: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  illustrationCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFF3E0',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: 'center',
    marginBottom: SPACING.lg,
    lineHeight: 24,
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
  successContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E8',
    padding: SPACING.md,
    borderRadius: 12,
    marginBottom: SPACING.md,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  successText: {
    color: '#4CAF50',
    marginLeft: SPACING.sm,
    fontWeight: '600',
    flex: 1,
  },
  inputContainer: {
    marginBottom: SPACING.lg,
  },
  mainButton: {
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
  backToLoginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    marginTop: SPACING.sm,
  },
  backToLoginText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    marginLeft: SPACING.xs,
  },
  infoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    padding: SPACING.lg,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginLeft: SPACING.sm,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.gray,
    lineHeight: 20,
  },
});

export default ForgotPasswordScreen;
