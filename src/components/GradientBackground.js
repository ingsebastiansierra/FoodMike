import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../theme/colors';

const GradientBackground = ({ children, variant = 'primary' }) => {
  
  const getGradientColors = () => {
    // Usar colores directos para evitar problemas con gradients undefined
    switch (variant) {
      case 'sunset':
        return [COLORS.primary, COLORS.secondary];
      case 'ocean':
        return [COLORS.accent, COLORS.info];
      case 'fire':
        return [COLORS.primary, COLORS.quaternary || COLORS.primaryDark];
      case 'warm':
        return [COLORS.secondary, COLORS.primaryLight];
      default:
        return [COLORS.primary, COLORS.primaryDark];
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Gradiente principal */}
      <LinearGradient
        colors={getGradientColors()}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      />
      
      {/* Contenido */}
      <View style={styles.contentContainer}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  contentContainer: {
    flex: 1,
    position: 'relative',
    zIndex: 1,
  },
});

export default GradientBackground;
