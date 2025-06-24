import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { COLORS } from "../theme/colors";
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../theme';
import { normalizeImageSource } from '../utils/imageUtils';

const FoodCard = ({ image, name, price, stars, onPress, onAddPress }) => {
  const imageSource = normalizeImageSource(image);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {imageSource ? (
        <Image source={imageSource} style={styles.image} resizeMode="cover" />
      ) : (
        <View style={[styles.image, styles.placeholderImage]}>
          <Ionicons name="fast-food-outline" size={40} color={colors.mediumGray} />
        </View>
      )}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {typeof name === 'string' ? name : (name ? String(name) : '')}
        </Text>
        {typeof stars === 'number' && (
          <View style={styles.starsRow}>
            {[1,2,3,4,5].map(i => (
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
            {typeof price === 'number' && !isNaN(price) ? `$${price.toFixed(2)}` : ''}
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
    width: '100%',
    elevation: 4,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    marginBottom: spacing.md,
  },
  image: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
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
