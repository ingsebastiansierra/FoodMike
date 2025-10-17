import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { COLORS } from "../theme/colors";
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../theme';
import { normalizeImageSource } from '../shared/utils/imageUtils';
import { formatCurrency } from "../shared/utils/format";

const FoodCard = ({ image, name, price, stars, onPress, onAddPress, isFavorite, onToggleFavorite, productId }) => {
  const imageSource = normalizeImageSource(image);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.imageContainer}>
        {imageSource ? (
          <Image source={imageSource} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={[styles.image, styles.placeholderImage]}>
            <Ionicons name="fast-food-outline" size={40} color={colors.mediumGray} />
          </View>
        )}

        {/* Botón de favoritos */}
        {onToggleFavorite && productId && (
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={() => onToggleFavorite(productId)}
            activeOpacity={0.8}
          >
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={18}
              color={isFavorite ? colors.error : colors.white}
            />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {typeof name === 'string' ? name : (name ? String(name) : '')}
        </Text>
        {typeof stars === 'number' && (
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map(i => (
              <Ionicons
                key={i}
                name={i <= Math.round(stars) ? 'star' : 'star-outline'}
                size={16}
                color={colors.primary}
                style={{ marginRight: 2 }}
              />
            ))}
            <Text style={styles.ratingText}>{!isNaN(stars) ? stars.toFixed(1) : ''}</Text>
          </View>
        )}
        <View style={styles.footer}>
          <Text style={styles.price}>
            {typeof price === 'number' && !isNaN(price) ? formatCurrency(price) : ''}
          </Text>
          <TouchableOpacity style={styles.addButton} onPress={onAddPress}>
            <Ionicons name="add" size={20} color={colors.white} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    width: 160,
    elevation: 4,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    marginBottom: spacing.md,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 120,
  },
  image: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  placeholderImage: {
    backgroundColor: colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: typography.sizes.md,
    fontWeight: '600',
    color: colors.darkGray,
    textAlign: 'center',
    width: '100%',
    marginBottom: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  price: {
    fontSize: typography.sizes.md,
    fontWeight: '700',
    color: colors.primary,
  },
  addButton: {
    backgroundColor: colors.primary,
    borderRadius: 50,
    padding: spacing.xs,
    marginLeft: 16,
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 2,
    marginBottom: 6,
  },
  ratingText: {
    fontSize: 12,
    color: colors.primary,
    marginLeft: 4,
    fontWeight: '600',
  },
});

export default FoodCard;
