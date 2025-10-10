import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, SHADOWS } from '../theme';
import Icon from 'react-native-vector-icons/FontAwesome';

const ModernBadge = ({
  children,
  variant = 'primary',
  size = 'medium',
  icon,
  gradient = false,
  style,
  textStyle,
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return {
          backgroundColor: COLORS.secondary,
          textColor: COLORS.white,
          gradientColors: COLORS.gradients.secondary,
        };
      case 'accent':
        return {
          backgroundColor: COLORS.accent,
          textColor: COLORS.white,
          gradientColors: COLORS.gradients.accent,
        };
      case 'success':
        return {
          backgroundColor: COLORS.success,
          textColor: COLORS.white,
          gradientColors: [COLORS.success, COLORS.accentDark],
        };
      case 'error':
        return {
          backgroundColor: COLORS.error,
          textColor: COLORS.white,
          gradientColors: [COLORS.error, COLORS.primaryDark],
        };
      case 'warning':
        return {
          backgroundColor: COLORS.warning,
          textColor: COLORS.white,
          gradientColors: [COLORS.warning, COLORS.secondaryDark],
        };
      case 'info':
        return {
          backgroundColor: COLORS.info,
          textColor: COLORS.white,
          gradientColors: [COLORS.info, '#5B69FF'],
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          textColor: COLORS.primary,
          borderColor: COLORS.primary,
          gradientColors: ['transparent', 'transparent'],
        };
      case 'light':
        return {
          backgroundColor: COLORS.lightPrimary,
          textColor: COLORS.primary,
          gradientColors: [COLORS.lightPrimary, COLORS.white],
        };
      default: // primary
        return {
          backgroundColor: COLORS.primary,
          textColor: COLORS.white,
          gradientColors: COLORS.gradients.primary,
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          paddingHorizontal: SPACING.sm,
          paddingVertical: SPACING.xs,
          borderRadius: 12,
          fontSize: 12,
          iconSize: 12,
        };
      case 'large':
        return {
          paddingHorizontal: SPACING.lg,
          paddingVertical: SPACING.sm,
          borderRadius: 20,
          fontSize: 16,
          iconSize: 16,
        };
      default: // medium
        return {
          paddingHorizontal: SPACING.md,
          paddingVertical: SPACING.xs,
          borderRadius: 16,
          fontSize: 14,
          iconSize: 14,
        };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  const badgeStyle = {
    paddingHorizontal: sizeStyles.paddingHorizontal,
    paddingVertical: sizeStyles.paddingVertical,
    borderRadius: sizeStyles.borderRadius,
    backgroundColor: variantStyles.backgroundColor,
    ...(variant === 'outline' && {
      borderWidth: 1.5,
      borderColor: variantStyles.borderColor,
    }),
    ...SHADOWS.small,
  };

  const textStyleFinal = {
    color: variantStyles.textColor,
    fontSize: sizeStyles.fontSize,
    fontWeight: '600',
    textAlign: 'center',
  };

  const content = (
    <View style={styles.content}>
      {icon && (
        <Icon
          name={icon}
          size={sizeStyles.iconSize}
          color={variantStyles.textColor}
          style={styles.icon}
        />
      )}
      <Text style={[textStyleFinal, textStyle]}>
        {children}
      </Text>
    </View>
  );

  if (gradient && variant !== 'outline') {
    return (
      <View style={[badgeStyle, { backgroundColor: 'transparent' }, style]} {...props}>
        <LinearGradient
          colors={variantStyles.gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[
            {
              paddingHorizontal: sizeStyles.paddingHorizontal,
              paddingVertical: sizeStyles.paddingVertical,
              borderRadius: sizeStyles.borderRadius,
            },
            styles.gradientContainer,
          ]}
        >
          {content}
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={[badgeStyle, style]} {...props}>
      {content}
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: SPACING.xs,
  },
  gradientContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ModernBadge;