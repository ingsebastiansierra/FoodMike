import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    ScrollView,
    Image,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Text,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import { SPACING, BORDER_RADIUS } from '../theme/spacing';
import { FONT_SIZES, FONT_WEIGHTS } from '../theme/typography';
import { normalizeImageSource } from '../shared/utils/imageUtils';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width - 40;

const AutoCarousel = ({ items, autoPlay = true, interval = 3000 }) => {
    const scrollViewRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (!autoPlay || items.length <= 1) return;

        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) => {
                const nextIndex = (prevIndex + 1) % items.length;
                scrollViewRef.current?.scrollTo({
                    x: nextIndex * width,
                    animated: true,
                });
                return nextIndex;
            });
        }, interval);

        return () => clearInterval(timer);
    }, [autoPlay, interval, items.length]);

    const handleScroll = (event) => {
        const contentOffset = event.nativeEvent.contentOffset.x;
        const index = Math.round(contentOffset / width);
        setCurrentIndex(index);
    };

    if (!items || items.length === 0) {
        return null;
    }

    return (
        <View style={styles.container}>
            <View style={styles.carouselContainer}>
                <ScrollView
                    ref={scrollViewRef}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                    style={styles.scrollView}
                >
                    {items.map((item, index) => {
                        const imageSource = normalizeImageSource(item.image);

                        return (
                            <TouchableOpacity
                                key={item.id}
                                style={styles.itemContainer}
                                onPress={item.onPress}
                            >
                                {imageSource ? (
                                    <Image source={imageSource} style={styles.image} resizeMode="cover" />
                                ) : (
                                    <View style={[styles.image, styles.placeholderImage]}>
                                        <Ionicons name="restaurant-outline" size={50} color={COLORS.mediumGray} />
                                    </View>
                                )}
                                <LinearGradient
                                    colors={['transparent', 'rgba(0,0,0,0.7)']}
                                    style={styles.overlay}
                                >
                                    <Text style={styles.title}>{item.title}</Text>
                                    <Text style={styles.description}>{item.description}</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>

            {items.length > 1 && (
                <View style={styles.indicators}>
                    {items.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.indicator,
                                index === currentIndex && styles.indicatorActive
                            ]}
                        />
                    ))}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: SPACING.md,
    },
    carouselContainer: {
        height: 200,
        borderRadius: BORDER_RADIUS.lg,
        overflow: 'hidden',
    },
    scrollView: {
        flex: 1,
    },
    itemContainer: {
        width: width - (SPACING.md * 2),
        height: 200,
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    placeholderImage: {
        backgroundColor: COLORS.lightGray,
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: SPACING.lg,
        paddingTop: SPACING.xl,
    },
    title: {
        fontSize: FONT_SIZES.lg,
        fontWeight: FONT_WEIGHTS.bold,
        color: COLORS.white,
        marginBottom: SPACING.xs,
    },
    description: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.white,
        opacity: 0.9,
    },
    indicators: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: SPACING.sm,
    },
    indicator: {
        width: 8,
        height: 8,
        borderRadius: BORDER_RADIUS.full,
        backgroundColor: COLORS.mediumGray,
        marginHorizontal: SPACING.xs,
    },
    indicatorActive: {
        backgroundColor: COLORS.primary,
        width: 24,
    },
});

export default AutoCarousel;
