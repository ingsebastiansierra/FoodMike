import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { COLORS, TYPOGRAPHY } from '../theme';

const ModernText = ({
  children,
  variant = 'body1',
  color = 'primary',
  weight = 'regular',
  align = 'left',
  style,
  numberOfLines,
  ...props
}) => {
  const getTextStyle = () => {
    // Obtener estilo base de tipografía
    const baseStyle = TYPOGRAPHY.TEXT_STYLES[variant] || TYPOGRAPHY.TEXT_STYLES.bodyMedium;
    
    // Obtener color
    const textColor = COLORS.text[color] || COLORS.text.primary;
    
    // Obtener peso de fuente
    const fontWeight = TYPOGRAPHY.FONT_WEIGHTS[weight] || TYPOGRAPHY.FONT_WEIGHTS.regular;
    
    return {
      ...baseStyle,
      color: textColor,
      fontWeight,
      textAlign: align,
    };
  };

  return (
    <Text
      style={[getTextStyle(), style]}
      numberOfLines={numberOfLines}
      {...props}
    >
      {children}
    </Text>
  );
};

// Componentes especializados para uso común
export const Heading1 = (props) => <ModernText variant="h1" weight="bold" {...props} />;
export const Heading2 = (props) => <ModernText variant="h2" weight="bold" {...props} />;
export const Heading3 = (props) => <ModernText variant="h3" weight="semiBold" {...props} />;
export const Heading4 = (props) => <ModernText variant="h4" weight="semiBold" {...props} />;
export const Heading5 = (props) => <ModernText variant="h5" weight="semiBold" {...props} />;
export const Heading6 = (props) => <ModernText variant="h6" weight="medium" {...props} />;

export const BodyLarge = (props) => <ModernText variant="bodyLarge" {...props} />;
export const BodyMedium = (props) => <ModernText variant="bodyMedium" {...props} />;
export const BodySmall = (props) => <ModernText variant="bodySmall" {...props} />;

export const Caption = (props) => <ModernText variant="bodySmall" color="secondary" {...props} />;
export const Label = (props) => <ModernText variant="bodyMedium" weight="medium" {...props} />;

// Componentes temáticos
export const PrimaryText = (props) => <ModernText color="accent" weight="semiBold" {...props} />;
export const SecondaryText = (props) => <ModernText color="secondary" {...props} />;
export const ErrorText = (props) => <ModernText color="primary" weight="medium" {...props} />;
export const SuccessText = (props) => <ModernText style={{ color: COLORS.success }} weight="medium" {...props} />;

export default ModernText;