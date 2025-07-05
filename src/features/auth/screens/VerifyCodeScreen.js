import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  Animated
} from 'react-native';
import { COLORS } from '../../../theme/colors';
import { SPACING } from '../../../theme/spacing';
import BotonEstandar from '../../../components/BotonEstandar';
import Icon from 'react-native-vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';
import { showAlert } from '../../core/utils/alert';

const VerifyCodeScreen = ({ navigation }) => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const inputRefs = useRef([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animación de entrada
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Timer para reenvío
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleCodeChange = (text, index) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    // Auto-focus al siguiente input
    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-focus al anterior input si se borra
    if (!text && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyCode = async () => {
    const fullCode = code.join('');
    if (fullCode.length !== 6) {
      setError('Por favor ingresa el código completo de 6 dígitos.');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      // Simular verificación
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Aquí iría la lógica real de verificación
      console.log('Código verificado:', fullCode);
      
      showAlert(
        'Código Verificado',
        'Tu código ha sido verificado exitosamente.'
      );
      
      navigation.navigate('Location');
    } catch (err) {
      setError('Código inválido. Por favor verifica e intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = () => {
    if (resendTimer > 0) return;
    
    setResendTimer(60);
    setError('');
    setCode(['', '', '', '', '', '']);
    
    showAlert(
      'Código Reenviado',
      'Hemos enviado un nuevo código de verificación a tu correo electrónico.'
    );
  };

  const isCodeComplete = code.every(digit => digit !== '');

  return (
    <View style={styles.container}>
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
              <Icon name="shield" size={40} color={COLORS.white} />
            </View>
            <Text style={styles.headerTitle}>Verificar Código</Text>
            <Text style={styles.headerSubtitle}>
              Confirma tu identidad para continuar
            </Text>
          </View>
        </View>

        <KeyboardAvoidingView 
          style={{ flex: 1 }} 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Animated.View style={[styles.mainCard, { opacity: fadeAnim }]}>
              <View style={styles.illustrationContainer}>
                <View style={styles.illustrationCircle}>
                  <Icon name="key" size={50} color={COLORS.primary} />
                </View>
              </View>

              <Text style={styles.title}>Ingresa tu código</Text>
              <Text style={styles.subtitle}>
                Hemos enviado un código de 6 dígitos a tu correo electrónico. Por favor, ingrésalo a continuación.
              </Text>

              {error ? (
                <View style={styles.errorContainer}>
                  <Icon name="exclamation-circle" size={20} color="#FF5722" />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}

              <View style={styles.codeContainer}>
                {code.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={ref => inputRefs.current[index] = ref}
                    style={[styles.codeInput, digit ? styles.codeInputFilled : null]}
                    value={digit}
                    onChangeText={(text) => handleCodeChange(text, index)}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                    keyboardType="number-pad"
                    maxLength={1}
                    selectTextOnFocus
                  />
                ))}
              </View>

              {loading ? (
                <View style={styles.loadingContainer}>
                  <BotonEstandar texto="Verificando..." onPress={() => {}} disabled={true} />
                  <Text style={styles.loadingText}>Un momento por favor</Text>
                </View>
              ) : (
                <BotonEstandar
                  texto="Verificar Código"
                  onPress={handleVerifyCode}
                  style={styles.mainButton}
                  colorFondo={isCodeComplete ? COLORS.primary : COLORS.lightGray}
                  disabled={!isCodeComplete}
                />
              )}

              <TouchableOpacity 
                style={[styles.resendButton, resendTimer > 0 && styles.resendButtonDisabled]}
                onPress={handleResendCode}
                disabled={resendTimer > 0}
              >
                <Icon name="paper-plane" size={16} color={resendTimer > 0 ? COLORS.gray : COLORS.primary} />
                <Text style={[styles.resendText, resendTimer > 0 && styles.resendTextDisabled]}>
                  {resendTimer > 0 ? `Reenviar en ${resendTimer}s` : 'Reenviar código'}
                </Text>
              </TouchableOpacity>
            </Animated.View>

            <View style={styles.infoCard}>
              <View style={styles.infoHeader}>
                <Icon name="info-circle" size={20} color={COLORS.primary} />
                <Text style={styles.infoTitle}>¿No recibiste el código?</Text>
              </View>
              <Text style={styles.infoText}>
                Asegúrate de revisar tu carpeta de spam o correo no deseado. Si aún no lo encuentras, puedes solicitar uno nuevo.
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
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
    marginBottom: SPACING.lg,
    borderLeftWidth: 4,
    borderLeftColor: '#FF5722',
  },
  errorText: {
    color: '#FF5722',
    marginLeft: SPACING.sm,
    fontWeight: '600',
    flex: 1,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xl,
    paddingHorizontal: SPACING.md,
  },
  codeInput: {
    width: 45,
    height: 55,
    borderWidth: 2,
    borderColor: COLORS.lightGray,
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    backgroundColor: COLORS.white,
  },
  codeInputFilled: {
    borderColor: COLORS.primary,
    backgroundColor: '#FFF3E0',
  },
  mainButton: {
    marginBottom: SPACING.lg,
  },
  loadingContainer: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  loadingText: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  resendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
  },
  resendButtonDisabled: {
    opacity: 0.5,
  },
  resendText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    marginLeft: SPACING.xs,
  },
  resendTextDisabled: {
    color: COLORS.gray,
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

export default VerifyCodeScreen;
