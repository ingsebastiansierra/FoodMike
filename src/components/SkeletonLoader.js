import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { COLORS } from '../theme/colors';
import { SPACING } from '../theme/spacing';

const SkeletonLoader = ({ width = '100%', height = 20, borderRadius = 8, style }) => {
    const animatedValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(animatedValue, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(animatedValue, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [animatedValue]);

    const opacity = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0.3, 0.7],
    });

    return (
        <Animated.View
            style={[
                styles.skeleton,
                {
                    width,
                    height,
                    borderRadius,
                    opacity,
                },
                style,
            ]}
        />
    );
};

export const ProductCardSkeleton = () => (
    <View style={styles.productCard}>
        <SkeletonLoader width="100%" height={150} borderRadius={12} />
        <View style={styles.productInfo}>
            <SkeletonLoader width="80%" height={20} style={{ marginBottom: 8 }} />
            <SkeletonLoader width="60%" height={16} style={{ marginBottom: 8 }} />
            <SkeletonLoader width="40%" height={18} />
        </View>
    </View>
);

export const DashboardCardSkeleton = () => (
    <View style={styles.dashboardCard}>
        <SkeletonLoader width={50} height={50} borderRadius={25} style={{ marginBottom: 12 }} />
        <SkeletonLoader width="60%" height={24} style={{ marginBottom: 8 }} />
        <SkeletonLoader width="40%" height={16} />
    </View>
);

export const ListItemSkeleton = () => (
    <View style={styles.listItem}>
        <SkeletonLoader width={60} height={60} borderRadius={8} />
        <View style={styles.listItemContent}>
            <SkeletonLoader width="70%" height={18} style={{ marginBottom: 8 }} />
            <SkeletonLoader width="50%" height={14} />
        </View>
    </View>
);

const styles = StyleSheet.create({
    skeleton: {
        backgroundColor: COLORS.lightGray || '#E0E0E0',
    },
    productCard: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        marginBottom: SPACING.md,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    productInfo: {
        padding: SPACING.md,
    },
    dashboardCard: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: SPACING.lg,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    listItem: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: SPACING.md,
        marginBottom: SPACING.sm,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    listItemContent: {
        flex: 1,
        marginLeft: SPACING.md,
    },
});

export default SkeletonLoader;
