import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../theme/colors';
import { SPACING } from '../theme/spacing';
import { normalizeImageSource } from '../shared/utils/imageUtils';

const { width } = Dimensions.get('window');

const RestaurantCard = ({ restaurant, onPress }) => {
    if (!restaurant) {
        return null;
    }

    const normalizedImage = typeof restaurant.image === 'string' ? { uri: restaurant.image } : restaurant.image;

    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < fullStars; i++) {
            stars.push(
                <Icon key={`full-${i}`} name="star" size={12} color="#FFD700" />
            );
        }

        if (hasHalfStar) {
            stars.push(
                <Icon key="half" name="star-half-o" size={12} color="#FFD700" />
            );
        }

        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars.push(
                <Icon key={`empty-${i}`} name="star-o" size={12} color="#FFD700" />
            );
        }

        return stars;
    };

    const getStatusColor = () => {
        const now = new Date();
        const hour = now.getHours();
        const isOpen = hour >= 6 && hour <= 23;
        return isOpen ? '#4CAF50' : '#FF5722';
    };

    const getStatusText = () => {
        const now = new Date();
        const hour = now.getHours();
        const isOpen = hour >= 6 && hour <= 23;
        return isOpen ? 'Abierto' : 'Cerrado';
    };

    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
            <View style={styles.imageContainer}>
                <Image source={normalizeImageSource(restaurant.image)} style={styles.image} />
                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.7)']}
                    style={styles.imageOverlay}
                />

                <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
                    <Icon name="circle" size={6} color={COLORS.white} />
                    <Text style={styles.statusText}>{getStatusText()}</Text>
                </View>

                <View style={styles.ratingBadge}>
                    <Icon name="star" size={10} color="#FFD700" />
                    <Text style={styles.ratingText}>{restaurant.stars}</Text>
                </View>
            </View>

            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.name} numberOfLines={1}>
                        {restaurant.name}
                    </Text>
                    <TouchableOpacity style={styles.favoriteButton}>
                        <Icon name="heart-o" size={16} color={COLORS.gray} />
                    </TouchableOpacity>
                </View>

                <View style={styles.ratingContainer}>
                    <View style={styles.starsContainer}>
                        {renderStars(restaurant.stars)}
                    </View>
                    <Text style={styles.ratingCount}>({Math.floor(Math.random() * 500) + 50} reseñas)</Text>
                </View>

                <View style={styles.infoRow}>
                    <Icon name="map-marker" size={12} color={COLORS.gray} />
                    <Text style={styles.address} numberOfLines={1}>
                        {restaurant.address}
                    </Text>
                </View>

                <View style={styles.infoRow}>
                    <Icon name="clock-o" size={12} color={COLORS.gray} />
                    <Text style={styles.schedule}>
                        {restaurant.deliveryTime || '20-30 min'}
                    </Text>
                </View>

                <View style={styles.tagsContainer}>
                    <View style={styles.tag}>
                        <Text style={styles.tagText}>Delivery</Text>
                    </View>
                    <View style={styles.tag}>
                        <Text style={styles.tagText}>15-25 min</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.white,
        borderRadius: 12,
        width: '100%',
        alignSelf: 'center',
        marginBottom: SPACING.sm,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        overflow: 'hidden',
    },
    imageContainer: {
        position: 'relative',
        height: 110,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    imageOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 60,
    },
    statusBadge: {
        position: 'absolute',
        top: SPACING.sm,
        left: SPACING.sm,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SPACING.sm,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        color: COLORS.white,
        fontSize: 11,
        fontWeight: 'bold',
        marginLeft: 4,
    },
    ratingBadge: {
        position: 'absolute',
        top: SPACING.sm,
        right: SPACING.sm,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.8)',
        paddingHorizontal: SPACING.sm,
        paddingVertical: 4,
        borderRadius: 12,
    },
    ratingText: {
        color: COLORS.white,
        fontSize: 12,
        fontWeight: 'bold',
        marginLeft: 4,
    },
    content: {
        padding: SPACING.md,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: SPACING.sm,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.primary,
        flex: 1,
        marginRight: SPACING.sm,
    },
    favoriteButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: COLORS.lightGray,
        justifyContent: 'center',
        alignItems: 'center',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.sm,
    },
    starsContainer: {
        flexDirection: 'row',
        marginRight: SPACING.xs,
    },
    ratingCount: {
        fontSize: 12,
        color: COLORS.gray,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.xs,
    },
    address: {
        fontSize: 13,
        color: COLORS.gray,
        marginLeft: SPACING.xs,
        flex: 1,
    },
    schedule: {
        fontSize: 13,
        color: COLORS.gray,
        marginLeft: SPACING.xs,
    },
    tagsContainer: {
        flexDirection: 'row',
        marginTop: SPACING.sm,
    },
    tag: {
        backgroundColor: COLORS.lightGray,
        paddingHorizontal: SPACING.sm,
        paddingVertical: 4,
        borderRadius: 8,
        marginRight: SPACING.sm,
    },
    tagText: {
        fontSize: 11,
        color: COLORS.gray,
        fontWeight: '500',
    },
});

export default RestaurantCard;
