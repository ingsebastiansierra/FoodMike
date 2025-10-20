import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Platform,
    StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../theme';
import { useCart } from '../context/CartContext';

const AppHeader = ({
    screenName = 'HOME',
    showCart = true,
    onCartPress,
    navigation
}) => {
    const { cartItems } = useCart();
    const cartItemCount = cartItems?.length || 0;

    const handleCartPress = () => {
        if (onCartPress) {
            onCartPress();
        } else if (navigation) {
            navigation.navigate('Carrito');
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

                    {showCart && (
                        <TouchableOpacity
                            style={styles.cartButton}
                            onPress={handleCartPress}
                        >
                            <Ionicons name="cart" size={24} color={colors.white} />
                            {cartItemCount > 0 && (
                                <View style={styles.cartBadge}>
                                    <Text style={styles.cartBadgeText}>{cartItemCount}</Text>
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
    cartButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: colors.darkGray,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    cartBadge: {
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
    cartBadgeText: {
        color: colors.white,
        fontSize: 12,
        fontWeight: '700',
    },
});

export default AppHeader;
