import React, { useState } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';

const SafeImage = ({ 
  source, 
  style, 
  placeholderIcon = "image-outline", 
  placeholderSize = 40,
  resizeMode = "cover",
  ...props 
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Normalizar la fuente de imagen
  const normalizeSource = (src) => {
    if (typeof src === 'string' && src.trim() !== '') {
      return { uri: src };
    }
    if (src && typeof src === 'object' && src.uri && typeof src.uri === 'string' && src.uri.trim() !== '') {
      return src;
    }
    return null;
  };

  const normalizedSource = normalizeSource(source);

  // Si no hay fuente válida o hubo error, mostrar placeholder
  if (!normalizedSource || hasError) {
    return (
      <View style={[style, styles.placeholder]}>
        <Ionicons 
          name={placeholderIcon} 
          size={placeholderSize} 
          color={colors.mediumGray} 
        />
      </View>
    );
  }

  return (
    <Image
      source={normalizedSource}
      style={style}
      resizeMode={resizeMode}
      onLoadStart={() => setIsLoading(true)}
      onLoadEnd={() => setIsLoading(false)}
      onError={() => setHasError(true)}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  placeholder: {
    backgroundColor: colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SafeImage; 