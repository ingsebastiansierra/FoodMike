import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../../../../theme/colors';
import { SPACING } from '../../../../theme/spacing';
import { formatCurrency } from '../../../../shared/utils/format';

const PaymentSection = ({ paymentMethod, setPaymentMethod, finalTotal, cartItems, onContinue }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>💳 Método de Pago</Text>
            <Text style={styles.subtitle}>Selecciona cómo deseas pagar</Text>

            {/* Resumen del total */}
            <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>Total a pagar</Text>
                <Text style={styles.summaryAmount}>{formatCurrency(finalTotal)}</Text>
                <Text style={styles.summaryNote}>
                    {cartItems.length} {cartItems.length === 1 ? 'producto' : 'productos'}
                </Text>
            </View>

            {/* Efectivo */}
            <TouchableOpacity
                style={styles.paymentOption}
                onPress={() => setPaymentMethod('cash')}
                activeOpacity={0.7}
            >
                <View style={[styles.paymentCard, paymentMethod === 'cash' && styles.paymentCardActive]}>
                    <View style={[styles.paymentIconContainer, paymentMethod === 'cash' && styles.paymentIconContainerActive]}>
                        <Icon name="payments" size={26} color={paymentMethod === 'cash' ? COLORS.white : COLORS.primary} />
                    </View>
                    <View style={styles.paymentInfo}>
                        <Text style={styles.paymentTitle}>💵 Efectivo</Text>
                        <Text style={styles.paymentSubtitle}>Paga al recibir tu pedido</Text>
                    </View>
                    {paymentMethod === 'cash' && <Icon name="check-circle" size={26} color={COLORS.primary} />}
                </View>
            </TouchableOpacity>

            {/* Nequi / Transferencia */}
            <TouchableOpacity
                style={styles.paymentOption}
                onPress={() => setPaymentMethod('transfer')}
                activeOpacity={0.7}
            >
                <View style={[styles.paymentCard, paymentMethod === 'transfer' && styles.paymentCardActive]}>
                    <View style={[styles.paymentIconContainer, paymentMethod === 'transfer' && styles.paymentIconContainerActive]}>
                        <Icon name="account-balance" size={26} color={paymentMethod === 'transfer' ? COLORS.white : '#4CAF50'} />
                    </View>
                    <View style={styles.paymentInfo}>
                        <Text style={styles.paymentTitle}>🏦 Nequi / Transferencia</Text>
                        <Text style={styles.paymentSubtitle}>Paga por Nequi o transferencia</Text>
                    </View>
                    {paymentMethod === 'transfer' && <Icon name="check-circle" size={26} color="#4CAF50" />}
                </View>
            </TouchableOpacity>

            {/* Wompi */}
            <TouchableOpacity
                style={styles.paymentOption}
                onPress={() => setPaymentMethod('wompi')}
                activeOpacity={0.7}
            >
                <View style={[styles.paymentCard, paymentMethod === 'wompi' && styles.paymentCardActive]}>
                    <View style={[styles.paymentIconContainer, paymentMethod === 'wompi' && styles.paymentIconContainerActive]}>
                        <Icon name="credit-card" size={26} color={paymentMethod === 'wompi' ? COLORS.white : '#FF6B35'} />
                    </View>
                    <View style={styles.paymentInfo}>
                        <Text style={styles.paymentTitle}>💳 Tarjeta (Wompi)</Text>
                        <Text style={styles.paymentSubtitle}>Pago seguro con tarjeta</Text>
                    </View>
                    {paymentMethod === 'wompi' && <Icon name="check-circle" size={26} color="#FF6B35" />}
                </View>
            </TouchableOpacity>

            {/* Información según método */}
            {paymentMethod === 'cash' && (
                <View style={styles.infoBox}>
                    <Icon name="info" size={18} color="#4CAF50" />
                    <Text style={styles.infoText}>
                        Prepara el monto exacto. El repartidor recibirá el pago al entregar.
                    </Text>
                </View>
            )}

            {paymentMethod === 'transfer' && (
                <View style={styles.infoBox}>
                    <Icon name="info" size={18} color="#2196F3" />
                    <Text style={styles.infoText}>
                        Recibirás los datos bancarios y Nequi después de confirmar tu pedido.
                    </Text>
                </View>
            )}

            {paymentMethod === 'wompi' && (
                <View style={styles.infoBox}>
                    <Icon name="info" size={18} color="#FF6B35" />
                    <Text style={styles.infoText}>
                        Serás redirigido a Wompi para completar el pago de forma segura.
                    </Text>
                </View>
            )}

            {/* Nota de seguridad */}
            <View style={styles.securityNote}>
                <Icon name="verified-user" size={16} color={COLORS.primary} />
                <Text style={styles.securityNoteText}>Pago 100% seguro</Text>
            </View>

            {/* Botón Continuar */}
            <TouchableOpacity style={styles.continueButton} onPress={onContinue}>
                <Text style={styles.continueButtonText}>Continuar →</Text>
            </TouchableOpacity>
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
        marginBottom: SPACING.xs,
        textAlign: 'center',
        marginTop: SPACING.md,
    },
    subtitle: {
        fontSize: 15,
        color: COLORS.gray,
        textAlign: 'center',
        marginBottom: SPACING.lg,
        lineHeight: 22,
    },
    summaryCard: {
        backgroundColor: COLORS.primary,
        borderRadius: 16,
        padding: SPACING.lg,
        marginBottom: SPACING.lg,
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    summaryLabel: {
        fontSize: 14,
        color: COLORS.white,
        opacity: 0.9,
        marginBottom: 4,
    },
    summaryAmount: {
        fontSize: 32,
        fontWeight: 'bold',
        color: COLORS.white,
        marginBottom: 4,
    },
    summaryNote: {
        fontSize: 13,
        color: COLORS.white,
        opacity: 0.8,
    },
    paymentOption: {
        marginBottom: SPACING.sm,
    },
    paymentCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        borderRadius: 12,
        padding: SPACING.md,
        borderWidth: 2,
        borderColor: COLORS.lightGray,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    paymentCardActive: {
        borderColor: COLORS.primary,
        borderWidth: 2,
        elevation: 3,
        shadowOpacity: 0.1,
    },
    paymentIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: COLORS.lightGray,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.md,
    },
    paymentIconContainerActive: {
        backgroundColor: COLORS.primary,
    },
    paymentInfo: {
        flex: 1,
    },
    paymentTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.dark,
        marginBottom: 2,
    },
    paymentSubtitle: {
        fontSize: 13,
        color: COLORS.gray,
    },
    infoBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF3E0',
        borderRadius: 10,
        padding: SPACING.md,
        marginTop: SPACING.sm,
        marginBottom: SPACING.md,
    },
    infoText: {
        fontSize: 13,
        color: COLORS.dark,
        marginLeft: SPACING.sm,
        flex: 1,
        lineHeight: 18,
    },
    securityNote: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: SPACING.md,
        marginTop: SPACING.sm,
    },
    securityNoteText: {
        fontSize: 13,
        color: COLORS.gray,
        marginLeft: SPACING.xs,
        fontWeight: '500',
    },
    continueButton: {
        backgroundColor: COLORS.primary,
        padding: SPACING.md,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: SPACING.md,
    },
    continueButtonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default PaymentSection;
