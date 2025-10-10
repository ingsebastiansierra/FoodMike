import React, { useContext } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Animated } from "react-native";
import { CartContext } from "../context/CartContext";
import Icon from 'react-native-vector-icons/FontAwesome';
import { COLORS } from '../theme/colors';
import { SPACING } from '../theme/spacing';
import { showConfirmAlert } from '../features/core/utils/alert';
import { normalizeImageSource } from '../shared/utils/imageUtils';
import { formatCurrency } from "../shared/utils/format";

const CartItemCard = ({ item, index }) => {
  const { increaseQuantity, decreaseQuantity, removeFromCart } = useContext(CartContext);

  const handleRemoveItem = () => {
    showConfirmAlert(
      'Eliminar Producto',
      `¿Estás seguro de que quieres eliminar "${item.name || item.title}" del carrito?`,
      () => removeFromCart(item.id)
    );
  };

  const handleDecreaseQuantity = () => {
    if (item.quantity === 1) {
      handleRemoveItem();
    } else {
      decreaseQuantity(item.id);
    }
  };

  const itemTotal = parseFloat(item.price) * item.quantity;

  // Normalizar la imagen para manejar múltiples formatos
  const imageSource = normalizeImageSource(item.image);

  return (
    <View style={styles.cardContainer}>
      <View style={styles.imageContainer}>
        {imageSource ? (
          <Image source={imageSource} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.imagePlaceholder]}>
            <Icon name="image" size={30} color={COLORS.lightGray} />
          </View>
        )}
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>
            {item.category === '1' ? 'Hamburguesas' :
              item.category === '2' ? 'Pizzas' :
                item.category === '3' ? 'Alitas' :
                  item.category === '4' ? 'Bebidas' : 'Otros'}
          </Text>
        </View>
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.title} numberOfLines={2}>
            {item.name || item.title}
          </Text>
          <TouchableOpacity
            onPress={handleRemoveItem}
            style={styles.removeButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Icon name="times" size={14} color={COLORS.gray} />
          </TouchableOpacity>
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.unitPrice}>
            {formatCurrency(parseFloat(item.price))} c/u
          </Text>
          <Text style={styles.totalPrice}>
            {formatCurrency(itemTotal)}
          </Text>
        </View>

        <View style={styles.quantityContainer}>
          <Text style={styles.quantityLabel}>Cantidad:</Text>

          <View style={styles.quantityControls}>
            <TouchableOpacity
              onPress={handleDecreaseQuantity}
              style={[
                styles.quantityButton,
                item.quantity === 1 && styles.quantityButtonDanger
              ]}
              activeOpacity={0.7}
            >
              <Icon
                name={item.quantity === 1 ? "trash" : "minus"}
                size={12}
                color={item.quantity === 1 ? COLORS.white : COLORS.primary}
              />
            </TouchableOpacity>

            <View style={styles.quantityDisplay}>
              <Text style={styles.quantityText}>{item.quantity}</Text>
            </View>

            <TouchableOpacity
              onPress={() => increaseQuantity(item.id)}
              style={styles.quantityButton}
              activeOpacity={0.7}
            >
              <Icon name="plus" size={12} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {item.quantity > 1 && (
          <View style={styles.savingsNote}>
            <Icon name="info-circle" size={10} color="#4CAF50" />
            <Text style={styles.savingsText}>
              Ahorras {formatCurrency((item.quantity - 1) * parseFloat(item.price))} en este producto
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    borderRadius: 16,
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    padding: SPACING.lg,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    marginRight: SPACING.md,
    flexShrink: 0,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  categoryBadge: {
    position: 'absolute',
    top: -4,
    left: -4,
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xs,
    paddingVertical: 2,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 10,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
    minWidth: 0, // Importante para que el flex funcione correctamente
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    flex: 1,
    marginRight: SPACING.sm,
    lineHeight: 20,
  },
  removeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  unitPrice: {
    fontSize: 14,
    color: COLORS.gray,
    fontWeight: '500',
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  quantityLabel: {
    fontSize: 14,
    color: COLORS.gray,
    fontWeight: '500',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    borderRadius: 18,
    padding: 2,
    flexShrink: 0,
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  quantityButtonDanger: {
    backgroundColor: '#FF6B6B',
  },
  quantityDisplay: {
    minWidth: 36,
    alignItems: 'center',
    paddingHorizontal: SPACING.xs,
  },
  quantityText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  savingsNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E8',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: SPACING.xs,
  },
  savingsText: {
    fontSize: 11,
    color: '#4CAF50',
    marginLeft: SPACING.xs,
    fontWeight: '500',
    flex: 1,
  },
  imagePlaceholder: {
    backgroundColor: COLORS.background.divider,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CartItemCard;

