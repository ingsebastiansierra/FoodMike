import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SHADOWS, SPACING } from '../theme';

const ModernCard = ({
  children,
  style,
  onPress,
  variant = 'default',
  elevation = 'medium',
  gradient = false,
  gradientColors = COLORS.gradients.primary,
  borderRadius = 20,
  padding = SPACING.lg,
  ...props
}) => {
  const getCardStyle = () => {
    const baseStyle = {
      borderRadius,
      padding,
      backgroundColor: COLORS.background.card,
    };

    // Aplicar sombras
    const shadowStyle = SHADOWS[elevation] || SHADOWS.medium;

    // Variantes de estilo
    switch (variant) {
      case 'outlined':
        return {
          ...baseStyle,
          ...shadowStyle,
          borderWidth: 2,
          borderColor: COLORS.background.divider,
        };
      case 'filled':
        return {
          ...baseStyle,
          ...shadowStyle,
          backgroundColor: COLORS.lightGray,
        };
      case 'primary':
        return {
          ...baseStyle,
          ...shadowStyle,
          backgroundColor: COLORS.lightPrimary,
          borderWidth: 1,
          borderColor: COLORS.primaryLight,
        };
      case 'transparent':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          ...SHADOWS.none,
        };
      default:
        return {
          ...baseStyle,
          ...shadowStyle,
        };
    }
  };

  const cardStyle = getCardStyle();

  if (onPress) {
    return (
      <TouchableOpacity
        style={[cardStyle, style]}
        onPress={onPress}
        activeOpacity={0.9}
        {...props}
      >
        {gradient ? (
          <LinearGradient
            colors={gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.gradientContainer, { borderRadius, padding }]}
          >
            {children}
          </LinearGradient>
        ) : (
          children
        )}
      </TouchableOpacity>
    );
  }

  return (
    <View style={[cardStyle, style]} {...props}>
      {gradient ? (
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.gradientContainer, { borderRadius, padding }]}
        >
          {children}
        </LinearGradient>
      ) : (
        children
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    margin: -SPACING.lg, // Compensar el padding del contenedor
  },
});

export default ModernCard;