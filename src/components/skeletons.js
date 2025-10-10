import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    Easing,
} from 'react-native-reanimated';
import { COLORS } from '../theme/colors';
import { SPACING } from '../theme/spacing';

const { width } = Dimensions.get('window');

// Componente base de skeleton con animación shimmer
export const SkeletonBase = ({ width: w, height, borderRadius = 8, style }) => {
    const translateX = useSharedValue(-width);

    React.useEffect(() => {
        translateX.value = withRepeat(
            withTiming(width, {
                duration: 1500,
                easing: Easing.linear,
            }),
            -1,
            false
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
    }));

    return (
        <View
            style={[
                styles.skeletonBase,
                {
                    width: typeof w === 'string' ? undefined : w,
                    height,
                    borderRadius,
                },
                style,
            ]}
        >
            <Animated.View style={[styles.shimmerContainer, animatedStyle]}>
                <LinearGradient
                    colors={['transparent', 'rgba(255,255,255,0.3)', 'transparent']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.shimmer}
                />
            </Animated.View>
        </View>
    );
};

// Skeleton para lista de productos
export const SkeletonProductList = ({ itemCount = 4 }) => {
    return (
        <View style={styles.productListContainer}>
            {[...Array(itemCount)].map((_, index) => (
                <View key={index} style={styles.productSkeletonCard}>
                    <SkeletonBase width={160} height={120} borderRadius={12} />
                    <View style={styles.productSkeletonInfo}>
                        <SkeletonBase width="80%" height={16} borderRadius={4} style={{ marginTop: 8 }} />
                        <SkeletonBase width="60%" height={14} borderRadius={4} style={{ marginTop: 6 }} />
                        <View style={styles.productSkeletonFooter}>
                            <SkeletonBase width={40} height={14} borderRadius={4} />
                            <SkeletonBase width={60} height={20} borderRadius={4} />
                        </View>
                    </View>
                </View>
            ))}
        </View>
    );
};

// Skeleton para lista de restaurantes
export const SkeletonRestaurantList = ({ itemCount = 3 }) => {
    return (
        <View style={styles.restaurantListContainer}>
            {[...Array(itemCount)].map((_, index) => (
                <View key={index} style={styles.restaurantSkeletonCard}>
                    <SkeletonBase width="100%" height={140} borderRadius={12} />
                    <View style={styles.restaurantSkeletonInfo}>
                        <SkeletonBase width="70%" height={18} borderRadius={4} style={{ marginTop: 12 }} />
                        <SkeletonBase width="50%" height={14} borderRadius={4} style={{ marginTop: 8 }} />
                        <View style={styles.restaurantSkeletonFooter}>
                            <SkeletonBase width={60} height={14} borderRadius={4} />
                            <SkeletonBase width={80} height={14} borderRadius={4} />
                        </View>
                    </View>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    skeletonBase: {
        backgroundColor: COLORS.lightGray || '#E1E9EE',
        overflow: 'hidden',
    },
    shimmerContainer: {
        width: '100%',
        height: '100%',
    },
    shimmer: {
        width: '100%',
        height: '100%',
    },
    productListContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    productSkeletonCard: {
        width: 160,
        marginRight: 12,
    },
    productSkeletonInfo: {
        paddingVertical: 8,
    },
    productSkeletonFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },
    restaurantListContainer: {
        gap: 16,
    },
    restaurantSkeletonCard: {
        marginBottom: 16,
    },
    restaurantSkeletonInfo: {
        paddingVertical: 8,
    },
    restaurantSkeletonFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },
});

// Skeleton para lista simple
export const SkeletonList = ({ itemCount = 5, itemType = 'default' }) => {
    return (
        <View style={{ padding: 12 }}>
            {[...Array(itemCount)].map((_, index) => (
                <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                    <SkeletonBase width={60} height={60} borderRadius={8} />
                    <View style={{ flex: 1, marginLeft: 12 }}>
                        <SkeletonBase width="80%" height={16} borderRadius={4} />
                        <SkeletonBase width="60%" height={14} borderRadius={4} style={{ marginTop: 8 }} />
                    </View>
                </View>
            ))}
        </View>
    );
};

// Skeleton para tarjetas
export const SkeletonCard = () => (
    <View style={{ backgroundColor: '#FFF', borderRadius: 12, marginBottom: 12, overflow: 'hidden' }}>
        <SkeletonBase width="100%" height={150} borderRadius={12} />
        <View style={{ padding: 12 }}>
            <SkeletonBase width="70%" height={18} borderRadius={4} />
            <SkeletonBase width="50%" height={14} borderRadius={4} style={{ marginTop: 8 }} />
        </View>
    </View>
);

// Skeleton para perfil
export const SkeletonProfile = () => (
    <View style={{ alignItems: 'center', padding: 24 }}>
        <SkeletonBase width={80} height={80} borderRadius={40} />
        <SkeletonBase width="60%" height={20} borderRadius={4} style={{ marginTop: 12 }} />
        <SkeletonBase width="40%" height={16} borderRadius={4} style={{ marginTop: 8 }} />
    </View>
);

// Skeleton para carrito
export const SkeletonCart = () => (
    <View style={{ padding: 12 }}>
        {[...Array(3)].map((_, index) => (
            <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                <SkeletonBase width={60} height={60} borderRadius={8} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                    <SkeletonBase width="70%" height={16} borderRadius={4} />
                    <SkeletonBase width="40%" height={14} borderRadius={4} style={{ marginTop: 8 }} />
                </View>
            </View>
        ))}
    </View>
);

// Skeleton para búsqueda
export const SkeletonSearch = () => (
    <View style={{ padding: 12 }}>
        <SkeletonBase width="100%" height={50} borderRadius={25} style={{ marginBottom: 16 }} />
        <SkeletonList itemCount={5} />
    </View>
);

// Skeleton para pedidos
export const SkeletonOrders = ({ itemCount = 3 }) => (
    <View style={{ padding: 12 }}>
        {[...Array(itemCount)].map((_, index) => (
            <View key={index} style={{ marginBottom: 12 }}>
                <SkeletonBase width="100%" height={100} borderRadius={12} />
            </View>
        ))}
    </View>
);

// Skeleton para detalle de pedido
export const SkeletonOrderDetail = () => (
    <View style={{ padding: 12 }}>
        <SkeletonBase width="100%" height={60} borderRadius={12} style={{ marginBottom: 16 }} />
        <SkeletonBase width="100%" height={150} borderRadius={12} style={{ marginBottom: 16 }} />
        <SkeletonBase width="100%" height={100} borderRadius={12} />
    </View>
);
