import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../../theme/colors';
import { SPACING } from '../../theme/spacing';
import wompiService from '../../services/wompiService';
import { formatCurrency } from '../../shared/utils/format';

const PaymentResultScreen = ({ route, navigation }) => {
    const { transactionId, reference } = route.params || {};
    const [loading, setLoading] = useState(true);
    const [transaction, setTransaction] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (transactionId) {
            checkTransactionStatus();
        } else {
            setError('No se encontró información de la transacción');
            setLoading(false);
        }
    }, [transactionId]);

    const checkTransactionStatus = async () => {
        try {
            const result = await wompiService.getTransactionStatus(transactionId);
            setTransaction(result);
        } catch (err) {
            console.error('Error verificando transacción:', err);
            setError('No se pudo verificar el estado del pago');
        } finally {
            setLoading(false);
        }
    };

    const handleGoHome = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: 'Inicio', params: { screen: 'HomeInitial' } }],
        });
    };

    const handleViewOrder = () => {
        // Aquí deberías navegar al detalle del pedido
        // navigation.navigate('OrderDetail', { orderId: ... });
        handleGoHome();
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>Verificando pago...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Icon name="error-outline" size={80} color={COLORS.error} />
                <Text style={styles.errorTitle}>Error</Text>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity style={styles.button} onPress={handleGoHome}>
                    <Text style={styles.buttonText}>Volver al Inicio</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const isApproved = transaction?.status === 'APPROVED';
    const isPending = transaction?.status === 'PENDING';
    const isDeclined = transaction?.status === 'DECLINED';

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={
                    isApproved
                        ? [COLORS.success, COLORS.primary]
                        : isPending
                            ? [COLORS.warning, COLORS.accent]
                            : [COLORS.error, COLORS.dark]
                }
                style={styles.gradient}
            >
                <Icon
                    name={
                        isApproved
                            ? 'check-circle'
                            : isPending
                                ? 'schedule'
                                : 'cancel'
                    }
                    size={100}
                    color={COLORS.white}
                />

                <Text style={styles.title}>
                    {isApproved && '¡Pago Exitoso!'}
                    {isPending && 'Pago Pendiente'}
                    {isDeclined && 'Pago Rechazado'}
                </Text>

                <Text style={styles.subtitle}>
                    {isApproved && 'Tu pedido ha sido confirmado'}
                    {isPending && 'Estamos procesando tu pago'}
                    {isDeclined && 'No se pudo procesar el pago'}
                </Text>

                {transaction && (
                    <View style={styles.detailsCard}>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Referencia:</Text>
                            <Text style={styles.detailValue}>{transaction.reference}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Monto:</Text>
                            <Text style={styles.detailValue}>
                                {formatCurrency(transaction.amount_in_cents / 100)}
                            </Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Estado:</Text>
                            <Text style={[styles.detailValue, styles.statusText]}>
                                {transaction.status}
                            </Text>
                        </View>
                        {transaction.payment_method_type && (
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Método:</Text>
                                <Text style={styles.detailValue}>
                                    {transaction.payment_method_type}
                                </Text>
                            </View>
                        )}
                    </View>
                )}

                <View style={styles.buttonContainer}>
                    {isApproved && (
                        <TouchableOpacity
                            style={[styles.button, styles.primaryButton]}
                            onPress={handleViewOrder}
                        >
                            <Text style={styles.buttonText}>Ver mi Pedido</Text>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity
                        style={[styles.button, styles.secondaryButton]}
                        onPress={handleGoHome}
                    >
                        <Text style={[styles.buttonText, styles.secondaryButtonText]}>
                            Volver al Inicio
                        </Text>
                    </TouchableOpacity>
                </View>
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    gradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING.xl,
    },
    loadingText: {
        marginTop: SPACING.lg,
        fontSize: 16,
        color: COLORS.dark,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.white,
        marginTop: SPACING.lg,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.white,
        marginTop: SPACING.sm,
        textAlign: 'center',
        opacity: 0.9,
    },
    detailsCard: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: SPACING.lg,
        marginTop: SPACING.xl,
        width: '100%',
        maxWidth: 400,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: SPACING.sm,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.lightGray,
    },
    detailLabel: {
        fontSize: 14,
        color: COLORS.gray,
        fontWeight: '600',
    },
    detailValue: {
        fontSize: 14,
        color: COLORS.dark,
        fontWeight: 'bold',
    },
    statusText: {
        color: COLORS.primary,
    },
    buttonContainer: {
        width: '100%',
        marginTop: SPACING.xl,
    },
    button: {
        paddingVertical: SPACING.lg,
        paddingHorizontal: SPACING.xl,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    primaryButton: {
        backgroundColor: COLORS.white,
    },
    secondaryButton: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: COLORS.white,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    secondaryButtonText: {
        color: COLORS.white,
    },
    errorTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.error,
        marginTop: SPACING.lg,
    },
    errorText: {
        fontSize: 16,
        color: COLORS.gray,
        marginTop: SPACING.sm,
        textAlign: 'center',
        paddingHorizontal: SPACING.xl,
    },
});

export default PaymentResultScreen;
