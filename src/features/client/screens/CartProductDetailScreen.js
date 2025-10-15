import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/FontAwesome';
import { COLORS, SPACING } from '../../../theme';
import { CartContext } from '../../../context/CartContext';
import { formatCurrency } from '../../../shared/utils/format';
import { normalizeImageSource } from '../../../shared/utils/imageUtils';

const CartProductDetailScreen = ({ route, navigation }) => {
    const { product } = route.params;
    const { updateQuantity, removeFromCart, cartItems } = useContext(CartContext);

    const cartItem = cartItems.find(item => item.id === product.id);
    const [quantity, setQuantity] = useState(cartItem?.quantity || 1);

    const imageSource = normalizeImageSource(product.image);
    const itemTotal = parseFloat(product.price) * quantity;

    const handleUpdateQuantity = (newQuantity) => {
        if (newQuantity < 1) return;
        setQuantity(newQuantity);
        updateQuantity(product.id, newQuantity);
    };

    const handleRemove = () => {
        removeFromCart(product.id);
        navigation.goBack();
    };

    const getCategoryName = (category) => {
        switch (category) {
            case '1': return 'Hamburguesas';
            case '2': return 'Pizzas';
            case '3': return 'Alitas';
            case '4': return 'Bebidas';
            default: return 'Otros';
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color={COLORS.white} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Detalle del Producto</Text>
                    <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.navigate('Carrito')}>
                        <Ionicons name="cart" size={24} color={COLORS.white} />
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    {/* Sección superior: Imagen y datos principales */}
                    <View style={styles.topSection}>
                        <View style={styles.imageContainer}>
                            {imageSource ? (
                                <Image source={imageSource} style={styles.productImage} />
                            ) : (
                                <View style={[styles.productImage, styles.imagePlaceholder]}>
                                    <Icon name="image" size={50} color={COLORS.lightGray} />
                                </View>
                            )}
                        </View>

                        <View style={styles.infoSide}>
                            <View style={styles.categoryBadge}>
                                <Text style={styles.categoryBadgeText}>{getCategoryName(product.category)}</Text>
                            </View>

                            <Text style={styles.productName} numberOfLines={2}>{product.name || product.title}</Text>

                            {product.description && (
                                <Text style={styles.description} numberOfLines={3}>{product.description}</Text>
                            )}

                            <View style={styles.priceRow}>
                                <Text style={styles.priceLabel}>Precio:</Text>
                                <Text style={styles.priceValue}>{formatCurrency(parseFloat(product.price))}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Contenido inferior */}
                    <View style={styles.contentContainer}>
                        {/* Control de cantidad */}
                        <View style={styles.quantitySection}>
                            <Text style={styles.sectionTitle}>Cantidad</Text>
                            <View style={styles.quantityCard}>
                                <TouchableOpacity
                                    style={styles.quantityBtn}
                                    onPress={() => handleUpdateQuantity(quantity - 1)}
                                >
                                    <Ionicons name="remove" size={20} color={COLORS.primary} />
                                </TouchableOpacity>

                                <View style={styles.quantityDisplay}>
                                    <Text style={styles.quantityText}>{quantity}</Text>
                                </View>

                                <TouchableOpacity
                                    style={styles.quantityBtn}
                                    onPress={() => handleUpdateQuantity(quantity + 1)}
                                >
                                    <Ionicons name="add" size={20} color={COLORS.primary} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Total */}
                        <View style={styles.totalCard}>
                            <View style={styles.totalRow}>
                                <View>
                                    <Text style={styles.totalLabel}>Total</Text>
                                    {quantity > 1 && (
                                        <Text style={styles.totalNote}>
                                            {quantity} x {formatCurrency(parseFloat(product.price))}
                                        </Text>
                                    )}
                                </View>
                                <Text style={styles.totalValue}>{formatCurrency(itemTotal)}</Text>
                            </View>
                        </View>

                        {/* Botón eliminar */}
                        <TouchableOpacity style={styles.removeBtn} onPress={handleRemove}>
                            <Icon name="trash" size={16} color={COLORS.white} />
                            <Text style={styles.removeBtnText}>Eliminar del Carrito</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>

                {/* Botón volver al carrito */}
                <View style={styles.bottomBar}>
                    <TouchableOpacity style={styles.backToCartBtn} onPress={() => navigation.goBack()}>
                        <Ionicons name="checkmark-circle" size={22} color={COLORS.white} />
                        <Text style={styles.backToCartText}>Guardar Cambios</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.primary,
    },
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: COLORS.primary,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.md,
    },
    headerBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        flex: 1,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.white,
        marginHorizontal: SPACING.md,
    },
    scrollView: {
        flex: 1,
    },
    topSection: {
        flexDirection: 'row',
        backgroundColor: COLORS.white,
        padding: SPACING.md,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    imageContainer: {
        width: 140,
        height: 140,
        borderRadius: 12,
        overflow: 'hidden',
        marginRight: SPACING.md,
    },
    productImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    imagePlaceholder: {
        backgroundColor: COLORS.lightGray,
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoSide: {
        flex: 1,
        justifyContent: 'space-between',
    },
    categoryBadge: {
        alignSelf: 'flex-start',
        backgroundColor: COLORS.primary,
        paddingHorizontal: SPACING.sm,
        paddingVertical: 4,
        borderRadius: 12,
        marginBottom: SPACING.xs,
    },
    categoryBadgeText: {
        color: COLORS.white,
        fontSize: 11,
        fontWeight: 'bold',
    },
    productName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginBottom: SPACING.xs,
        lineHeight: 22,
    },
    description: {
        fontSize: 13,
        color: COLORS.gray,
        lineHeight: 18,
        marginBottom: SPACING.sm,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        justifyContent: 'space-between',
    },
    priceLabel: {
        fontSize: 13,
        color: COLORS.gray,
        fontWeight: '500',
    },
    priceValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    contentContainer: {
        padding: SPACING.md,
        paddingBottom: 100,
    },
    quantitySection: {
        marginBottom: SPACING.md,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.dark,
        marginBottom: SPACING.sm,
    },
    quantityCard: {
        backgroundColor: COLORS.white,
        borderRadius: 12,
        padding: SPACING.md,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    quantityBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: COLORS.lightGray,
        alignItems: 'center',
        justifyContent: 'center',
    },
    quantityDisplay: {
        alignItems: 'center',
        minWidth: 60,
    },
    quantityText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    totalCard: {
        backgroundColor: '#E8F5E9',
        borderRadius: 12,
        padding: SPACING.md,
        marginBottom: SPACING.md,
        borderWidth: 2,
        borderColor: '#4CAF50',
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2E7D32',
        marginBottom: 4,
    },
    totalValue: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#2E7D32',
    },
    totalNote: {
        fontSize: 12,
        color: '#4CAF50',
    },
    removeBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FF6B6B',
        borderRadius: 10,
        padding: SPACING.sm,
    },
    removeBtnText: {
        color: COLORS.white,
        fontSize: 14,
        fontWeight: 'bold',
        marginLeft: SPACING.xs,
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: COLORS.white,
        padding: SPACING.md,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
    },
    backToCartBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.primary,
        borderRadius: 10,
        paddingVertical: SPACING.sm,
    },
    backToCartText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: SPACING.xs,
    },
});

export default CartProductDetailScreen;
