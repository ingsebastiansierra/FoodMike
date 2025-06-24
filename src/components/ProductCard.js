import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../theme';
import { normalizeImageSource } from '../utils/imageUtils';

const { width } = Dimensions.get('window');

const ProductCard = ({ product, onPress, onAddToCart }) => {
  // Normalizar la imagen para manejar tanto strings como objetos
  const normalizedImage = normalizeImageSource(product.image);
  
  const renderStars = (stars) => {
    const fullStars = Math.floor(stars);
    const hasHalfStar = stars % 1 !== 0;
    
    return (
      <View style={styles.starsContainer}>
        {[...Array(5)].map((_, index) => (
          <Ionicons
            key={index}
            name={index < fullStars ? "star" : index === fullStars && hasHalfStar ? "star-half" : "star-outline"}
            size={12}
            color={colors.primary}
          />
        ))}
        <Text style={styles.starsText}>{stars}</Text>
      </View>
    );
  };

  const renderTags = () => {
    if (!product.tags || product.tags.length === 0) return null;
    
    return (
      <View style={styles.tagsContainer}>
        {product.tags.slice(0, 2).map((tag, index) => (
          <View key={index} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.9}>
      <LinearGradient
        colors={[colors.white, colors.lightGray]}
        style={styles.card}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Imagen del producto */}
        <View style={styles.imageContainer}>
          <Image source={normalizedImage} style={styles.image} resizeMode="cover" />
          {renderTags()}
          
          {/* Botón de agregar al carrito */}
          <TouchableOpacity 
            style={styles.addButton}
            onPress={onAddToCart}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={20} color={colors.white} />
          </TouchableOpacity>
        </View>

        {/* Información del producto */}
        <View style={styles.content}>
          <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
            {product.name}
          </Text>
          
          <Text style={styles.description} numberOfLines={2} ellipsizeMode="tail">
            {product.description}
          </Text>

          {/* Información del restaurante */}
          <View style={styles.restaurantInfo}>
            <Ionicons name="business" size={12} color={colors.gray} />
            <Text style={styles.restaurantName} numberOfLines={1}>
              {product.restaurant?.name}
            </Text>
          </View>

          {/* Calificación y reviews */}
          <View style={styles.ratingContainer}>
            {renderStars(product.stars)}
          </View>

          {/* Precio */}
          <View style={styles.priceContainer}>
            <Text style={styles.price}>${product.price.toFixed(2)}</Text>
            <View style={styles.deliveryInfo}>
              <Ionicons name="time-outline" size={12} color={colors.gray} />
              <Text style={styles.deliveryText}>
                {product.restaurant?.deliveryTime}
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '50%',
    marginBottom: spacing.md,
    marginHorizontal: 0,
    paddingLeft: 8,
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    minHeight: 240,
  },
  imageContainer: {
    position: 'relative',
    height: 120,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  tagsContainer: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    gap: 1,
  },
  tag: {
    backgroundColor: colors.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  tagText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '600',
  },
  addButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: colors.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  content: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    minHeight: 90,
    justifyContent: 'space-between',
    flex: 1,
  },
  name: {
    fontSize: typography.sizes.md,
    fontWeight: '700',
    color: colors.darkGray,
    marginBottom: 4,
    lineHeight: 18,
  },
  description: {
    fontSize: typography.sizes.xs,
    color: colors.gray,
    marginBottom: 8,
    lineHeight: 14,
  },
  restaurantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 4,
  },
  restaurantName: {
    fontSize: typography.sizes.xs,
    color: colors.gray,
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 1,
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 1,
  },
  starsText: {
    fontSize: typography.sizes.xs,
    fontWeight: '600',
    color: colors.darkGray,
    marginLeft: 2,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: typography.sizes.md,
    fontWeight: '700',
    color: colors.primary,
  },
  deliveryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  deliveryText: {
    fontSize: typography.sizes.xs,
    color: colors.gray,
  },
});

export default ProductCard; 