import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../../theme/colors';
import { SPACING } from '../../theme/spacing';
import { formatCurrency } from '../../shared/utils/format';

const ConfirmSection = ({
    cartItems,
    totalPrice,
    deliveryFee,
    finalTotal,
    address,
    phone,
    paymentMethod,
    orderNotes
}) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>✅ Confirmar Pedido</Text>

            {/* Resumen del pedido */}
            <View style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>📋 Resumen</Text>

                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>🍽️ Productos ({cartItems.length})</Text>
                    <Text style={styles.summaryValue}>{formatCurrency(totalPrice)}</Text>
                </View>

                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>🚚 Envío</Text>
                    <Text style={[styles.summaryValue, deliveryFee === 0 && styles.freeShipping]}>
                        {deliveryFee === 0 ? '¡Gratis!' : formatCurrency(deliveryFee)}
                    </Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.summaryRow}>
                    <Text style={styles.totalLabel}>💰 Total</Text>
                    <Text style={styles.totalValue}>{formatCurrency(finalTotal)}</Text>
                </View>
            </View>

            {/* Información de entrega */}
            <View style={styles.infoCard}>
                <Text style={styles.infoTitle}>📍 Entrega</Text>
                <Text style={styles.infoText}>{address}</Text>
                <Text style={styles.infoText}>📞 {phone}</Text>
            </View>

            {/* Método de pago */}
            <View style={styles.infoCard}>
                <Text style={styles.infoTitle}>💳 Pago</Text>
                <Text style={styles.infoText}>
                    {paymentMethod === 'cash' && '💵 Efectivo al recibir'}
                    {paymentMethod === 'transfer' && '🏦 Nequi / Transferencia'}
                    {paymentMethod === 'wompi' && '💳 Tarjeta (Wompi)'}
                </Text>
                {paymentMethod === 'transfer' && (
                    <View style={styles.transferNote}>
                        <Icon name="info" size={16} color="#2196F3" />
                        <Text style={styles.transferNoteText}>
                            Recibirás los datos bancarios después de confirmar
                        </Text>
                    </View>
                )}
                {paymentMethod === 'wompi' && (
                    <View style={styles.transferNote}>
                        <Icon name="info" size={16} color="#FF6B35" />
                        <Text style={styles.transferNoteText}>
                            Serás redirigido a Wompi para completar el pago
                        </Text>
                    </View>
                )}
            </View>

            {orderNotes && (
                <View style={styles.infoCard}>
                    <Text style={styles.infoTitle}>📝 Notas</Text>
                    <Text style={styles.infoText}>{orderNotes}</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: SPACING.lg,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: COLORS.dark,
        marginBottom: SPACING.lg,
        textAlign: 'center',
        marginTop: SPACING.md,
    },
    summaryCard: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: SPACING.lg,
        marginBottom: SPACING.md,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    summaryTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.dark,
        marginBottom: SPACING.md,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.sm,
    },
    summaryLabel: {
        fontSize: 16,
        color: COLORS.gray,
    },
    summaryValue: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.dark,
    },
    freeShipping: {
        color: COLORS.primary,
        fontWeight: 'bold',
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.lightGray,
        marginVertical: SPACING.md,
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    totalValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    infoCard: {
        backgroundColor: COLORS.white,
        borderRadius: 12,
        padding: SPACING.md,
        marginBottom: SPACING.sm,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    infoTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginBottom: SPACING.xs,
    },
    infoText: {
        fontSize: 14,
        color: COLORS.dark,
        lineHeight: 20,
    },
    transferNote: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E3F2FD',
        padding: SPACING.sm,
        borderRadius: 8,
        marginTop: SPACING.sm,
    },
    transferNoteText: {
        fontSize: 12,
        color: '#1976D2',
        marginLeft: SPACING.xs,
        flex: 1,
    },
});

export default ConfirmSection;
