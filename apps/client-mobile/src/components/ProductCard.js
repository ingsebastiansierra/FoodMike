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
import { normalizeImageSource } from '../shared/utils/imageUtils';
import { formatCurrency } from '../shared/utils/format';

const { width } = Dimensions.get('window');

const ProductCard = ({ product, onPress, onAddToCart, isFavorite, onToggleFavorite }) => {
  // Normalizar la imagen para manejar tanto strings como objetos
  const normalizedImage = normalizeImageSource(product.image);

  const renderStars = (stars) => {
    // Asegurarse de que stars sea un número
    const starsValue = typeof stars === 'number' ? stars : 0;
    const fullStars = Math.floor(starsValue);
    const hasHalfStar = starsValue % 1 !== 0;

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
        <Text style={styles.starsText}>{starsValue.toFixed(1)}</Text>
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

          {/* Botón de favoritos */}
          {onToggleFavorite && (
            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={() => onToggleFavorite(product.id)}
              activeOpacity={0.8}
            >
              <Ionicons
                name={isFavorite ? "heart" : "heart-outline"}
                size={20}
                color={isFavorite ? colors.error : colors.white}
              />
            </TouchableOpacity>
          )}

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
              {product.restaurant || 'Restaurante'}
            </Text>
          </View>

          {/* Calificación y reviews */}
          <View style={styles.ratingContainer}>
            {renderStars(product.stars)}
          </View>

          {/* Precio */}
          <View style={styles.priceContainer}>
            <Text style={styles.price}>{formatCurrency(product.price)}</Text>
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
    width: '100%',
    marginBottom: 0,
  },
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: colors.white,
    elevation: 3,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  imageContainer: {
    position: 'relative',
    height: 110,
    backgroundColor: '#F5F5F5',
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
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
  addButton: {
    position: 'absolute',
    bottom: -16,
    right: 12,
    backgroundColor: colors.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  content: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    minHeight: 85,
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.darkGray,
    marginBottom: 4,
    lineHeight: 18,
  },
  description: {
    fontSize: 11,
    color: colors.gray,
    marginBottom: 6,
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
    marginBottom: 6,
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
    marginTop: 4,
  },
  price: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.darkGray,
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