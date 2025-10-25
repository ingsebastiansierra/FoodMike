import AsyncStorage from '@react-native-async-storage/async-storage';
import { showAlert } from './alert';

// Función para resetear el onboarding
export const resetOnboarding = async (onSuccess, onError) => {
  try {
    await AsyncStorage.removeItem('onboardingCompleted');
    if (onSuccess) {
      onSuccess();
    } else {
      showAlert(
        'Onboarding Reseteado',
        'El onboarding ha sido reseteado exitosamente. Reinicia la aplicación para ver los cambios.'
      );
    }
  } catch (error) {
    console.error('Error al resetear onboarding:', error);
    if (onError) {
      onError(error);
    } else {
      showAlert('Error', 'No se pudo resetear el onboarding');
    }
  }
};

// Función para verificar si el onboarding está completado
export const isOnboardingCompleted = async () => {
  try {
    const value = await AsyncStorage.getItem('onboardingCompleted');
    return value === 'true';
  } catch (error) {
    console.error('Error al verificar onboarding:', error);
    return false;
  }
};

// Función para marcar el onboarding como completado
export const completeOnboarding = async () => {
  try {
    await AsyncStorage.setItem('onboardingCompleted', 'true');
  } catch (error) {
    console.error('Error al completar onboarding:', error);
  }
};
