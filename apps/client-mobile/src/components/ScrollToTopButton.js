import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, StyleSheet, Animated, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../theme';

const ScrollToTopButton = ({ visible, onPress }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const bounceAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Animación de fade in/out
        Animated.timing(fadeAnim, {
            toValue: visible ? 1 : 0,
            duration: 300,
            useNativeDriver: true,
        }).start();

        // Animación de rebote continuo de la flecha
        if (visible) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(bounceAnim, {
                        toValue: -6,
                        duration: 600,
                        useNativeDriver: true,
                    }),
                    Animated.timing(bounceAnim, {
                        toValue: 0,
                        duration: 600,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        }
    }, [visible]);

    if (!visible) return null;

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    opacity: fadeAnim,
                    transform: [{ scale: fadeAnim }],
                },
            ]}
        >
            <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.8}>
                <Animated.View style={[styles.iconContainer, { transform: [{ translateY: bounceAnim }] }]}>
                    <Ionicons name="arrow-up" size={16} color={colors.white} />
                </Animated.View>
                <Text style={styles.text}>Volver arriba</Text>
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignSelf: 'center',
        marginTop: spacing.md,
        marginBottom: spacing.xs,
        zIndex: 999,
    },
    button: {
        backgroundColor: colors.darkGray,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 18,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 6,
    },
    iconContainer: {
        marginRight: 6,
    },
    text: {
        color: colors.white,
        fontSize: 13,
        fontWeight: '600',
    },
});

export default ScrollToTopButton;
