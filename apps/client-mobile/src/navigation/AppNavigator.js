import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import { COLORS } from "../theme/colors";
import { useAuth } from "../context/AuthContext";

// Navigators
import AuthNavigator from './AuthNavigator';
import ClientNavigator from './ClientNavigator';
import OnboardingNavigator from './OnboardingNavigator';

const LoadingScreen = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color={COLORS.primary} />
  </View>
);

// --- Director de Orquesta (Root Navigator) ---

const AppNavigator = () => {
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const { user, userRole, loading } = useAuth();

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const value = await AsyncStorage.getItem("onboardingCompleted");
        setIsOnboardingCompleted(value === "true");
      } catch (e) {
        console.error("Error al verificar onboarding:", e);
        setIsOnboardingCompleted(false); // Asumir que no se completó si hay error
      } finally {
        setIsInitializing(false);
      }
    };
    checkOnboardingStatus();
  }, []);

  const handleOnboardingComplete = async () => {
    try {
      await AsyncStorage.setItem("onboardingCompleted", "true");
      setIsOnboardingCompleted(true);
    } catch (e) {
      console.error("Error al guardar estado de onboarding:", e);
    }
  };

  if (loading || isInitializing) {
    return <LoadingScreen />;
  }

  if (user) {
    // Log para depuración
    console.log('Usuario autenticado:', user.email);
    console.log('Navegando a ClientNavigator');
    return <ClientNavigator />;
  }

  if (!isOnboardingCompleted) {
    return <OnboardingNavigator onComplete={handleOnboardingComplete} />;
  }

  return <AuthNavigator />;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
});

export default AppNavigator;
