import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { COLORS } from '../theme/colors';
import { SPACING } from '../theme/spacing';

// Skeleton base con animación de pulso
const SkeletonBase = ({ width, height, borderRadius = 8, style }) => {
    const opacity = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0.3,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    return (
        <Animated.View
            style={[
                styles.skeleton,
                { width, height, borderRadius, opacity },
                style,
            ]}
        />
    );
};

// Skeleton para cards de estadísticas
export const StatCardSkeleton = () => (
    <View style={styles.statCard}>
        <SkeletonBase width={40} height={40} borderRadius={20} />
        <View style={{ marginLeft: SPACING.md, flex: 1 }}>
            <SkeletonBase width="60%" height={20} style={{ marginBottom: 8 }} />
            <SkeletonBase width="40%" height={14} />
        </View>
    </View>
);

// Skeleton para lista de pedidos
export const OrderCardSkeleton = () => (
    <View style={styles.orderCard}>
        <View style={styles.orderHeader}>
            <View style={{ flex: 1 }}>
                <SkeletonBase width="50%" height={16} style={{ marginBottom: 8 }} />
                <SkeletonBase width="70%" height={12} />
            </View>
            <SkeletonBase width={80} height={28} borderRadius={14} />
        </View>
        <View style={styles.orderBody}>
            <SkeletonBase width="40%" height={14} />
            <SkeletonBase width="30%" height={18} />
        </View>
    </View>
);

// Skeleton para cards de productos
export const ProductCardSkeleton = () => (
    <View style={styles.productCard}>
        <SkeletonBase width="100%" height={140} borderRadius={16} />
        <View style={{ padding: SPACING.sm }}>
            <SkeletonBase width="80%" height={16} style={{ marginBottom: 8 }} />
            <SkeletonBase width="60%" height={12} style={{ marginBottom: 8 }} />
            <SkeletonBase width="40%" height={18} />
        </View>
    </View>
);

// Skeleton para menú de configuración
export const MenuItemSkeleton = () => (
    <View style={styles.menuItem}>
        <SkeletonBase width={48} height={48} borderRadius={24} />
        <View style={{ marginLeft: SPACING.md, flex: 1 }}>
            <SkeletonBase width="60%" height={16} style={{ marginBottom: 6 }} />
            <SkeletonBase width="80%" height={12} />
        </View>
        <SkeletonBase width={24} height={24} borderRadius={12} />
    </View>
);

const styles = StyleSheet.create({
    skeleton: {
        backgroundColor: COLORS.lightGray,
    },
    statCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: SPACING.md,
        marginBottom: SPACING.md,
        elevation: 2,
    },
    orderCard: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: SPACING.md,
        marginBottom: SPACING.md,
        elevation: 2,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: SPACING.sm,
    },
    orderBody: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    productCard: {
        width: 160,
        backgroundColor: '#FFF',
        borderRadius: 16,
        marginRight: SPACING.md,
        elevation: 2,
        overflow: 'hidden',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.md,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: COLORS.lightGray,
    },
});

export default SkeletonBase;
