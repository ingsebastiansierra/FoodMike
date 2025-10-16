import React, { useState, useEffect } from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../theme/colors';
import restaurantAdminService from '../services/restaurantAdminService';

const PendingOrdersButton = () => {
    const navigation = useNavigation();
    const [pendingCount, setPendingCount] = useState(0);

    useEffect(() => {
        loadPendingOrders();
        // Actualizar cada 30 segundos
        const interval = setInterval(loadPendingOrders, 30000);
        return () => clearInterval(interval);
    }, []);

    const loadPendingOrders = async () => {
        try {
            // Obtener todos los pedidos
            const response = await restaurantAdminService.getOrders(null);

            // Contar pedidos que NO están en preparación, listos o entregados
            // Es decir: pending y confirmed (los que el chef aún no ha comenzado a preparar)
            const pendingOrders = response.data?.filter(order =>
                order.status === 'pending' || order.status === 'confirmed'
            ) || [];

            console.log('🔔 Pedidos pendientes de preparar:', pendingOrders.length);
            setPendingCount(pendingOrders.length);
        } catch (error) {
            console.error('Error loading pending orders:', error);
        }
    };

    const handlePress = () => {
        navigation.navigate('Orders');
    };

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={handlePress}
            activeOpacity={0.7}
        >
            <Icon name="receipt-long" size={32} color={COLORS.white} />
            {pendingCount > 0 && (
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                        {pendingCount > 99 ? '99+' : pendingCount}
                    </Text>
                </View>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        marginRight: 16,
        position: 'relative',
        padding: 4,
    },
    badge: {
        position: 'absolute',
        top: -2,
        right: -6,
        backgroundColor: '#FF6B6B',
        borderRadius: 12,
        minWidth: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 6,
        borderWidth: 2,
        borderColor: COLORS.primary,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    badgeText: {
        color: '#FFF',
        fontSize: 13,
        fontWeight: 'bold',
    },
});

export default PendingOrdersButton;
