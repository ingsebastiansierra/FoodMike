import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '../theme';

const DailyMenuCard = ({ menu, onPress, onAddToCart }) => {
    const formatTime = (time) => {
        if (!time) return '';
        return time.slice(0, 5); // HH:MM
    };

    const getDaysText = (days) => {
        if (!days || days.length === 7) return 'Todos los días';

        const daysMap = {
            monday: 'Lun',
            tuesday: 'Mar',
            wednesday: 'Mié',
            thursday: 'Jue',
            friday: 'Vie',
            saturday: 'Sáb',
            sunday: 'Dom'
        };

        return days.map(day => daysMap[day] || day).join(', ');
    };

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={onPress}
            activeOpacity={0.8}
        >
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: menu.image_url || 'https://via.placeholder.com/150' }}
                    style={styles.image}
                    resizeMode="cover"
                />
                <View style={styles.badge}>
                    <Ionicons name="restaurant" size={14} color={COLORS.white} />
                    <Text style={styles.badgeText}>Menú del Día</Text>
                </View>
            </View>

            <View style={styles.content}>
                <Text style={styles.name} numberOfLines={2}>{menu.name}</Text>

                {menu.description && (
                    <Text style={styles.description} numberOfLines={2}>
                        {menu.description}
                    </Text>
                )}

                <View style={styles.infoRow}>
                    <Ionicons name="time-outline" size={14} color={COLORS.gray} />
                    <Text style={styles.infoText}>
                        {formatTime(menu.start_time)} - {formatTime(menu.end_time)}
                    </Text>
                </View>

                <View style={styles.infoRow}>
                    <Ionicons name="calendar-outline" size={14} color={COLORS.gray} />
                    <Text style={styles.infoText} numberOfLines={1}>
                        {getDaysText(menu.available_days)}
                    </Text>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.price}>${menu.price?.toLocaleString()}</Text>

                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={(e) => {
                            e.stopPropagation();
                            onAddToCart(menu);
                        }}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="add" size={20} color={COLORS.white} />
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.white,
        borderRadius: 12,
        marginBottom: SPACING.md,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    imageContainer: {
        position: 'relative',
        width: '100%',
        height: 140,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    badge: {
        position: 'absolute',
        top: SPACING.sm,
        left: SPACING.sm,
        backgroundColor: COLORS.primary,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SPACING.sm,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 4,
    },
    badgeText: {
        color: COLORS.white,
        fontSize: 11,
        fontWeight: '600',
    },
    content: {
        padding: SPACING.md,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.dark,
        marginBottom: SPACING.xs,
    },
    description: {
        fontSize: 13,
        color: COLORS.gray,
        marginBottom: SPACING.sm,
        lineHeight: 18,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
        gap: 6,
    },
    infoText: {
        fontSize: 12,
        color: COLORS.gray,
        flex: 1,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: SPACING.sm,
        paddingTop: SPACING.sm,
        borderTopWidth: 1,
        borderTopColor: COLORS.lightGray,
    },
    price: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    addButton: {
        backgroundColor: COLORS.primary,
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default DailyMenuCard;
