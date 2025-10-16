import React from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../theme/colors';
import { SPACING } from '../theme/spacing';
import { formatCurrency } from '../shared/utils/format';

const AdminProductCard = ({ product, onPress, onEdit }) => {
    const renderStars = (stars) => {
        const starsValue = typeof stars === 'number' ? stars : 0;
        const fullStars = Math.floor(starsValue);

        return (
            <View style={styles.starsContainer}>
                {[...Array(5)].map((_, index) => (
                    <Icon
                        key={index}
                        name={index < fullStars ? "star" : "star-border"}
                        size={14}
                        color="#FFD700"
                    />
                ))}
                <Text style={styles.starsText}>{starsValue.toFixed(1)}</Text>
            </View>
        );
    };

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={onPress}
            activeOpacity={0.9}
        >
            <View style={styles.card}>
                {/* Imagen del producto */}
                <View style={styles.imageContainer}>
                    {product.image ? (
                        <Image
                            source={{ uri: product.image }}
                            style={styles.image}
                            resizeMode="cover"
                        />
                    ) : (
                        <View style={styles.imagePlaceholder}>
                            <Icon name="restaurant" size={40} color={COLORS.textSecondary} />
                        </View>
                    )}

                    {/* Badge de disponibilidad */}
                    <View style={[
                        styles.availabilityBadge,
                        { backgroundColor: product.is_available ? '#4ECDC4' : '#FF6B6B' }
                    ]}>
                        <Text style={styles.availabilityText}>
                            {product.is_available ? 'Disponible' : 'No disponible'}
                        </Text>
                    </View>

                    {/* Botón de editar */}
                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={(e) => {
                            e.stopPropagation();
                            onEdit && onEdit();
                        }}
                        activeOpacity={0.8}
                    >
                        <Icon name="edit" size={18} color="#FFF" />
                    </TouchableOpacity>
                </View>

                {/* Información del producto */}
                <View style={styles.content}>
                    <Text style={styles.name} numberOfLines={1}>
                        {product.name}
                    </Text>

                    <Text style={styles.description} numberOfLines={2}>
                        {product.description || 'Sin descripción'}
                    </Text>

                    {/* Categoría */}
                    {product.category && (
                        <View style={styles.categoryContainer}>
                            <Icon name="category" size={12} color={COLORS.textSecondary} />
                            <Text style={styles.categoryText}>{product.category}</Text>
                        </View>
                    )}

                    {/* Calificación */}
                    {renderStars(product.stars)}

                    {/* Precio y estadísticas */}
                    <View style={styles.footer}>
                        <Text style={styles.price}>{formatCurrency(product.price)}</Text>
                        <View style={styles.stats}>
                            <Icon name="shopping-cart" size={14} color={COLORS.textSecondary} />
                            <Text style={styles.statsText}>{product.reviews || 0}</Text>
                        </View>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 160,
        marginRight: SPACING.md,
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    imageContainer: {
        position: 'relative',
        height: 140,
        backgroundColor: COLORS.lightGray,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    imagePlaceholder: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.background,
    },
    availabilityBadge: {
        position: 'absolute',
        top: 8,
        left: 8,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    availabilityText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: '600',
    },
    editButton: {
        position: 'absolute',
        bottom: 8,
        right: 8,
        backgroundColor: COLORS.primary,
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
    },
    content: {
        padding: SPACING.sm,
    },
    name: {
        fontSize: 15,
        fontWeight: '700',
        color: COLORS.text,
        marginBottom: 4,
    },
    description: {
        fontSize: 12,
        color: COLORS.textSecondary,
        marginBottom: 8,
        lineHeight: 16,
    },
    categoryContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
        gap: 4,
    },
    categoryText: {
        fontSize: 11,
        color: COLORS.textSecondary,
    },
    starsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        gap: 2,
    },
    starsText: {
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.text,
        marginLeft: 4,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    price: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.primary,
    },
    stats: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    statsText: {
        fontSize: 12,
        color: COLORS.textSecondary,
        fontWeight: '600',
    },
});

export default AdminProductCard;
