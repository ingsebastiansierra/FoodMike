import React, { useContext } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Animated } from "react-native";
import { CartContext } from "../context/CartContext";
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { COLORS } from '../theme/colors';
import { SPACING } from '../theme/spacing';
import { showConfirmAlert } from '../features/core/utils/alert';
import { normalizeImageSource } from '../shared/utils/imageUtils';
import { formatCurrency } from "../shared/utils/format";

const CartItemCard = ({ item, index }) => {
    const { increaseQuantity, decreaseQuantity, removeFromCart } = useContext(CartContext);
    const navigation = useNavigation();

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

    const handleCardPress = () => {
        navigation.navigate('CartProductDetail', { product: item });
    };

    return (
        <View style={styles.cardContainer}>
            <TouchableOpacity
                style={styles.cardContent}
                onPress={handleCardPress}
                activeOpacity={0.9}
            >
                <View style={styles.imageContainer}>
                    {imageSource ? (
                        <Image source={imageSource} style={styles.image} />
                    ) : (
                        <View style={[styles.image, styles.imagePlaceholder]}>
                            <Icon name="image" size={28} color={COLORS.lightGray} />
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
                            <Icon name="times" size={12} color={COLORS.gray} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.priceColumn}>
                        <Text style={styles.unitPrice}>
                            {formatCurrency(parseFloat(item.price))} c/u
                        </Text>
                        <Text style={styles.totalPrice}>
                            Total: {formatCurrency(itemTotal)}
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
                                    size={11}
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
                                <Icon name="plus" size={11} color={COLORS.primary} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {item.quantity > 1 && (
                        <View style={styles.savingsNote}>
                            <Icon name="info-circle" size={8} color="#4CAF50" />
                            <Text style={styles.savingsText}>
                                Ahorras {formatCurrency((item.quantity - 1) * parseFloat(item.price))} en este producto
                            </Text>
                        </View>
                    )}
                </View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        width: 260,
        marginRight: SPACING.sm,
        height: 190
    },
    cardContent: {
        flexDirection: "row",
        backgroundColor: COLORS.white,
        borderRadius: 12,
        padding: SPACING.md,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        overflow: 'hidden',
        height: '100%',
    },
    imageContainer: {
        position: 'relative',
        marginRight: SPACING.sm,
        flexShrink: 0,
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 10,
        marginTop: 24
    },
    categoryBadge: {
        position: 'absolute',
        top: -2,
        left: -2,
        backgroundColor: COLORS.primary,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 5,
    },
    categoryText: {
        fontSize: 9,
        color: COLORS.white,
        fontWeight: 'bold',
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'space-between',
        minWidth: 0,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 6,
    },
    title: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.primary,
        flex: 1,
        marginRight: 6,
        lineHeight: 18,
    },
    removeButton: {
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: COLORS.lightGray,
        justifyContent: 'center',
        alignItems: 'center',
        flexShrink: 0,
    },
    priceColumn: {
        flexDirection: 'column',
        marginBottom: 6,
    },
    unitPrice: {
        fontSize: 11,
        color: COLORS.gray,
        fontWeight: '500',
        marginBottom: 2,
    },
    totalPrice: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#4CAF50',
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    quantityLabel: {
        fontSize: 11,
        color: COLORS.gray,
        fontWeight: '500',
    },
    quantityControls: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.lightGray,
        borderRadius: 12,
        padding: 2,
        flexShrink: 0,
    },
    quantityButton: {
        width: 26,
        height: 26,
        borderRadius: 13,
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
        minWidth: 28,
        alignItems: 'center',
        paddingHorizontal: 4,
    },
    quantityText: {
        fontSize: 13,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    savingsNote: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E8F5E8',
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderRadius: 5,
        marginTop: 3,
    },
    savingsText: {
        fontSize: 9,
        color: '#4CAF50',
        marginLeft: 4,
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
