import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../theme';
import { usePendingOrders } from '../hooks/usePendingOrders';

const AppHeaderAdmin = ({
    screenName = 'INICIO',
    showOrders = true,
    onOrdersPress,
    navigation
}) => {
    const { pendingCount } = usePendingOrders();

    const handleOrdersPress = () => {
        if (onOrdersPress) {
            onOrdersPress();
        } else if (navigation) {
            navigation.navigate('Pedidos');
        }
    };

    return (
        <SafeAreaView edges={['top']} style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
            <View style={styles.headerContainer}>
                <View style={styles.headerContent}>
                    <View style={styles.headerTextContainer}>
                        <Text style={styles.headerLabel}>{screenName}</Text>
                        <Text style={styles.headerTitle}>TOC TOC</Text>
                    </View>

                    {showOrders && (
                        <TouchableOpacity
                            style={styles.ordersButton}
                            onPress={handleOrdersPress}
                        >
                            <Ionicons name="receipt" size={24} color={colors.white} />
                            {pendingCount > 0 && (
                                <View style={styles.ordersBadge}>
                                    <Text style={styles.ordersBadgeText}>{pendingCount}</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: colors.white,
    },
    headerContainer: {
        backgroundColor: colors.white,
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.md,
        paddingBottom: spacing.lg,
        borderBottomWidth: 0,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    headerTextContainer: {
        flex: 1,
    },
    headerLabel: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.primary,
        letterSpacing: 1,
        marginBottom: 6,
    },
    headerTitle: {
        fontSize: 30,
        fontWeight: '700',
        color: colors.darkGray,
        lineHeight: 36,
    },
    ordersButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: colors.darkGray,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    ordersBadge: {
        position: 'absolute',
        top: -4,
        right: -4,
        backgroundColor: colors.primary,
        minWidth: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 6,
    },
    ordersBadgeText: {
        color: colors.white,
        fontSize: 12,
        fontWeight: '700',
    },
});

export default AppHeaderAdmin;
