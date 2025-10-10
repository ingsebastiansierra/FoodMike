import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../theme/colors';
import { SPACING } from '../theme/spacing';
import Icon from 'react-native-vector-icons/FontAwesome';

const BotonEstandar = ({ 
  title, 
  onPress, 
  style, 
  icon, 
  textColor,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  gradient = true
}) => {
  
  const getButtonColors = () => {
    switch (variant) {
      case 'secondary':
        return {
          colors: COLORS.gradients.secondary,
          backgroundColor: COLORS.secondary,
        };
      case 'accent':
        return {
          colors: COLORS.gradients.accent,
          backgroundColor: COLORS.accent,
        };
      case 'outline':
        return {
          colors: ['transparent', 'transparent'],
          backgroundColor: 'transparent',
        };
      default:
        return {
          colors: COLORS.gradients.primary,
          backgroundColor: COLORS.primary,
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: SPACING.sm,
          paddingHorizontal: SPACING.md,
          minHeight: 44,
        };
      case 'large':
        return {
          paddingVertical: SPACING.lg,
          paddingHorizontal: SPACING.xl,
          minHeight: 64,
        };
      default:
        return {
          paddingVertical: SPACING.md,
          paddingHorizontal: SPACING.lg,
          minHeight: 56,
        };
    }
  };

  const { colors, backgroundColor } = getButtonColors();
  const sizeStyles = getSizeStyles();

  const buttonContent = (
    <View style={styles.buttonContent}>
      {icon && (
        <Icon 
          name={icon} 
          size={size === 'large' ? 24 : size === 'small' ? 16 : 20} 
          color={variant === 'outline' ? COLORS.primary : (textColor || COLORS.white)} 
          style={styles.icon} 
        />
      )}
      <Text style={[
        styles.text,
        { 
          color: variant === 'outline' ? COLORS.primary : (textColor || COLORS.white),
          fontSize: size === 'large' ? 18 : size === 'small' ? 14 : 16,
        }
      ]}>
        {title}
      </Text>
    </View>
  );

  if (variant === 'outline') {
    return (
      <TouchableOpacity 
        style={[
          styles.button, 
          styles.outlineButton,
          sizeStyles,
          disabled && styles.disabledButton,
          style
        ]} 
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.8}
      >
        {buttonContent}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity 
      style={[
        styles.button, 
        sizeStyles,
        !gradient && { backgroundColor },
        disabled && styles.disabledButton,
        style
      ]} 
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {gradient && !disabled ? (
        <LinearGradient
          colors={colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.gradient, sizeStyles]}
        >
          {buttonContent}
        </LinearGradient>
      ) : (
        buttonContent
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 16,
    marginBottom: SPACING.sm,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.shadow.medium,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  gradient: {
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.primary,
    shadowOpacity: 0,
    elevation: 0,
  },
  disabledButton: {
    opacity: 0.6,
    shadowOpacity: 0,
    elevation: 0,
  },
  text: {
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: SPACING.sm,
  },
});

export default BotonEstandar;
