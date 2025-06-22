import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../theme/colors';
import { SPACING } from '../theme/spacing';
import Icon from 'react-native-vector-icons/FontAwesome';
import BotonEstandar from './BotonEstandar';

const ProtectedRoute = ({ 
  children, 
  requiredRole = null, 
  fallbackComponent = null,
  showAccessDenied = true 
}) => {
  const { user, userRole, isAdmin, isClient } = useAuth();

  // Si no hay usuario autenticado
  if (!user) {
    return (
      <View style={styles.container}>
        <Icon name="lock" size={80} color={COLORS.gray} />
        <Text style={styles.title}>Acceso Restringido</Text>
        <Text style={styles.message}>
          Necesitas iniciar sesión para acceder a esta funcionalidad.
        </Text>
        <BotonEstandar
          title="Iniciar Sesión"
          icon="sign-in"
          onPress={() => {
            // Aquí podrías navegar a la pantalla de login
            console.log('Navegar a login');
          }}
        />
      </View>
    );
  }

  // Si se requiere un rol específico y el usuario no lo tiene
  if (requiredRole && userRole !== requiredRole) {
    if (fallbackComponent) {
      return fallbackComponent;
    }

    if (!showAccessDenied) {
      return null;
    }

    return (
      <View style={styles.container}>
        <Icon name="ban" size={80} color={COLORS.error || '#f44336'} />
        <Text style={styles.title}>Acceso Denegado</Text>
        <Text style={styles.message}>
          No tienes permisos para acceder a esta funcionalidad.
        </Text>
        <Text style={styles.roleInfo}>
          Tu rol actual: <Text style={styles.roleText}>{userRole}</Text>
        </Text>
        <Text style={styles.roleInfo}>
          Rol requerido: <Text style={styles.roleText}>{requiredRole}</Text>
        </Text>
      </View>
    );
  }

  // Si todo está bien, mostrar el contenido
  return children;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
    backgroundColor: COLORS.white,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: SPACING.lg,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: 'center',
    marginBottom: SPACING.lg,
    lineHeight: 24,
  },
  roleInfo: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: SPACING.xs,
  },
  roleText: {
    fontWeight: 'bold',
    color: COLORS.primary,
  },
});

export default ProtectedRoute; 