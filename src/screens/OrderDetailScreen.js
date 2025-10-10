import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../theme/colors';
import { SPACING } from '../theme/spacing';
import { formatCurrency } from '../shared/utils/format';
import restaurantAdminService from '../services/restaurantAdminService';

const OrderDetailScreen = ({ route, navigation }) => {
    const { order } = route.params;

    const updateStatus = async (newStatus) => {
        try {
            await restaurantAdminService.updateOrderStatus(order.id, newStatus);
            Alert.alert('Éxito', 'Estado actualizado correctamente', [
                { text: 'OK', onPress: () => navigation.goBack() },
            ]);
        } catch (error) {
            console.error('Error updating status:', error);
            Alert.alert('Error', 'No se pudo actualizar el estado');
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: '#FFD93D',
            confirmed: '#4ECDC4',
            preparing: '#667eea',
            ready: '#6BCF7F',
            delivered: '#95E1D3',
            cancelled: '#FF6B6B',
        };
        return colors[status] || '#999';
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.orderId}>Pedido #{order.id.slice(0, 8)}</Text>
                <View
                    style={[
                        styles.statusBadge,
                        { backgroundColor: getStatusColor(order.status) },
                    ]}
                >
                    <Text style={styles.statusText}>{order.status}</Text>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Información del Pedido</Text>
                <View style={styles.infoRow}>
                    <Icon name="schedule" size={20} color={COLORS.textSecondary} />
                    <Text style={styles.infoText}>
                        {new Date(order.created_at).toLocaleString()}
                    </Text>
                </View>
                <View style={styles.infoRow}>
                    <Icon name="attach-money" size={20} color={COLORS.textSecondary} />
                    <Text style={styles.infoText}>{formatCurrency(order.total)}</Text>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Acciones</Text>
                {order.status === 'pending' && (
                    <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: '#4ECDC4' }]}
                        onPress={() => updateStatus('confirmed')}
                    >
                        <Text style={styles.actionButtonText}>Confirmar Pedido</Text>
                    </TouchableOpacity>
                )}
                {order.status === 'confirmed' && (
                    <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: '#667eea' }]}
                        onPress={() => updateStatus('preparing')}
                    >
                        <Text style={styles.actionButtonText}>Marcar como Preparando</Text>
                    </TouchableOpacity>
                )}
                {order.status === 'preparing' && (
                    <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: '#6BCF7F' }]}
                        onPress={() => updateStatus('ready')}
                    >
                        <Text style={styles.actionButtonText}>Marcar como Listo</Text>
                    </TouchableOpacity>
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        backgroundColor: '#FFF',
        padding: SPACING.md,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    orderId: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    statusBadge: {
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.xs,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFF',
    },
    section: {
        backgroundColor: '#FFF',
        marginTop: SPACING.md,
        padding: SPACING.md,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: SPACING.md,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.sm,
    },
    infoText: {
        fontSize: 16,
        color: COLORS.text,
        marginLeft: SPACING.sm,
    },
    actionButton: {
        padding: SPACING.md,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: SPACING.sm,
    },
    actionButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default OrderDetailScreen;
