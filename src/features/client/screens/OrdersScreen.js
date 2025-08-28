import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../../../context/CartContext';
import { colors, spacing, typography } from '../../../theme';
import { formatPrice } from '../../../utils/formatPrice';
import CartItemCard from '../../../components/CartItemCard';
import { showAlert, showConfirmAlert } from '../../core/utils/alert';

const OrdersScreen = ({ navigation }) => {
    // CORRECCIÓN: Se usa 'totalPrice' para obtener el total del carrito,
    // ya que este es el nombre que se define en tu CartProvider.
    const { cartItems, totalPrice, clearCart } = useCart();
    
    const [isProcessing, setIsProcessing] = useState(false);
    const [address] = useState('Calle Falsa 123, Ciudad Principal');

    // El costo de envío se calcula correctamente
    const shippingCost = totalPrice >= 50 ? 0 : 5;
    const finalTotal = totalPrice + shippingCost;

    const handleConfirmOrder = () => {
        if (cartItems.length === 0) {
            showAlert('Carrito Vacío', 'No hay productos en el carrito para confirmar.');
            return;
        }

        showConfirmAlert(
            'Confirmar Pago',
            // CORRECCIÓN: Se usa formatPrice para que el valor se vea como moneda
            `¿Estás seguro de que quieres procesar el pago por $${formatPrice(finalTotal)}?`,
            () => {
                setIsProcessing(true);
                // Simular el procesamiento del pago
                setTimeout(() => {
                    setIsProcessing(false);
                    showAlert(
                        '¡Pago Exitoso!',
                        'Tu pedido ha sido procesado correctamente. Recibirás una confirmación por email.',
                        () => {
                            clearCart();
                            navigation.navigate('ClientDashboard');
                        }
                    );
                }, 2000);
            }
        );
    };

    const renderProductItem = ({ item }) => <CartItemCard item={item} />;

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <Text style={styles.title}>Confirmar Pedido</Text>

                {/* Resumen de Productos */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Resumen del Pedido</Text>
                    <FlatList
                        data={cartItems}
                        keyExtractor={(item) => item.id}
                        renderItem={renderProductItem}
                        scrollEnabled={false}
                    />
                </View>

                {/* Detalles de Entrega */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Dirección de Entrega</Text>
                    <View style={styles.addressContainer}>
                        <Ionicons name="location-outline" size={24} color={colors.primary} />
                        <Text style={styles.addressText}>{address}</Text>
                        <TouchableOpacity style={styles.changeAddressButton}>
                            <Text style={styles.changeAddressText}>Cambiar</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Desglose de Precios */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Detalle de Precios</Text>
                    <View style={styles.priceRow}>
                        <Text style={styles.priceLabel}>Subtotal</Text>
                        <Text style={styles.priceValue}>{formatPrice(totalPrice)}</Text>
                    </View>
                    <View style={styles.priceRow}>
                        <Text style={styles.priceLabel}>Envío</Text>
                        <Text style={styles.priceValue}>
                            {shippingCost === 0 ? 'Gratis' : formatPrice(shippingCost)}
                        </Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={[styles.priceRow, styles.totalRow]}>
                        <Text style={styles.totalLabel}>Total a Pagar</Text>
                        <Text style={styles.totalValue}>{formatPrice(finalTotal)}</Text>
                    </View>
                </View>
            </ScrollView>

            {/* CORRECCIÓN: Este contenedor es el que le da el estilo y la posición al botón */}
            <View style={styles.bottomContainer}>
                <TouchableOpacity
                    style={[styles.confirmButton, isProcessing && styles.disabledButton]}
                    onPress={handleConfirmOrder}
                    disabled={isProcessing}
                >
                    <Text style={styles.confirmButtonText}>
                        {isProcessing ? 'Procesando...' : 'Confirmar y Pagar'}
                    </Text>
                    {!isProcessing && (
                        <Ionicons
                            name="arrow-forward"
                            size={20}
                            color={colors.white}
                            style={styles.confirmButtonIcon}
                        />
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollViewContent: {
        padding: spacing.lg,
        paddingBottom: 100,
    },
    title: {
        fontSize: typography.sizes.xxl,
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: spacing.lg,
        textAlign: 'center',
    },
    section: {
        backgroundColor: colors.white,
        borderRadius: 16,
        padding: spacing.lg,
        marginBottom: spacing.md,
        elevation: 2,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    sectionTitle: {
        fontSize: typography.sizes.lg,
        fontWeight: '600',
        color: colors.dark,
        marginBottom: spacing.md,
    },
    addressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        backgroundColor: colors.lightGray,
        borderRadius: 12,
    },
    addressText: {
        flex: 1,
        fontSize: typography.sizes.md,
        color: colors.gray,
        marginLeft: spacing.sm,
    },
    changeAddressButton: {
        paddingHorizontal: spacing.sm,
    },
    changeAddressText: {
        fontSize: typography.sizes.sm,
        color: colors.primary,
        fontWeight: 'bold',
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.sm,
    },
    priceLabel: {
        fontSize: typography.sizes.md,
        color: colors.gray,
    },
    priceValue: {
        fontSize: typography.sizes.md,
        fontWeight: '500',
        color: colors.dark,
    },
    divider: {
        borderBottomWidth: 1,
        borderBottomColor: colors.lightGray,
        marginVertical: spacing.sm,
    },
    totalRow: {
        marginTop: spacing.sm,
    },
    totalLabel: {
        fontSize: typography.sizes.lg,
        fontWeight: 'bold',
        color: colors.dark,
    },
    totalValue: {
        fontSize: typography.sizes.lg,
        fontWeight: 'bold',
        color: colors.primary,
    },
    bottomContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: colors.white,
        padding: spacing.lg,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        elevation: 8,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    confirmButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.primary,
        borderRadius: 25,
        paddingVertical: spacing.md,
    },
    disabledButton: {
        backgroundColor: colors.gray,
    },
    confirmButtonText: {
        color: colors.white,
        fontSize: typography.sizes.md,
        fontWeight: 'bold',
        marginRight: spacing.sm,
    },
    confirmButtonIcon: {
        marginLeft: spacing.sm,
    },
});

export default OrdersScreen;