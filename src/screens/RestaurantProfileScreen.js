import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    FlatList,
    Dimensions,
    ActivityIndicator,
    RefreshControl,
    StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING } from '../theme';
import { shortsService } from '../services/shortsService';

const { width } = Dimensions.get('window');
const GRID_ITEM_SIZE = (width - 48) / 3; // 3 columnas con padding

const RestaurantProfileScreen = ({ route, navigation }) => {
    const { restaurant } = route.params;

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [stats, setStats] = useState({
        postsCount: 0,
        totalViews: 0,
        totalLikes: 0,
    });

    useEffect(() => {
        loadPosts();
    }, []);

    const loadPosts = async () => {
        try {
            setLoading(true);
            const data = await shortsService.getRestaurantProfileShorts(restaurant.id);
            setPosts(data);

            // Calcular estadísticas
            const totalViews = data.reduce((sum, post) => sum + (post.views_count || 0), 0);
            const totalLikes = data.reduce((sum, post) => sum + (post.likes_count || 0), 0);

            setStats({
                postsCount: data.length,
                totalViews,
                totalLikes,
            });
        } catch (error) {
            console.error('Error loading posts:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleRefresh = () => {
        setRefreshing(true);
        loadPosts();
    };

    const handlePostPress = (post) => {
        // Navegar a ver el short en pantalla completa
        navigation.navigate('RestaurantShortsViewer', {
            initialShortId: post.id,
            restaurantId: restaurant.id,
        });
    };

    const renderPost = ({ item }) => (
        <TouchableOpacity
            style={styles.gridItem}
            onPress={() => handlePostPress(item)}
            activeOpacity={0.8}
        >
            <Image
                source={{ uri: item.thumbnail_url || item.video_url }}
                style={styles.gridImage}
            />
            <View style={styles.gridOverlay}>
                <View style={styles.gridStats}>
                    <Ionicons name="play" size={16} color="white" />
                    <Text style={styles.gridStatText}>
                        {item.views_count > 1000
                            ? `${(item.views_count / 1000).toFixed(1)}K`
                            : item.views_count || 0}
                    </Text>
                </View>
            </View>
            {item.is_permanent && (
                <View style={styles.permanentBadge}>
                    <Ionicons name="bookmark" size={12} color={COLORS.primary} />
                </View>
            )}
        </TouchableOpacity>
    );

    const renderEmptyState = () => (
        <View style={styles.emptyContainer}>
            <Ionicons name="videocam-outline" size={64} color={COLORS.textSecondary} />
            <Text style={styles.emptyTitle}>Sin publicaciones</Text>
            <Text style={styles.emptyText}>
                Este restaurante aún no ha publicado contenido
            </Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="white" />
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{restaurant.name}</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                }
            >
                {/* Profile Info */}
                <View style={styles.profileSection}>
                    <View style={styles.profileImageContainer}>
                        <Image
                            source={{ uri: restaurant.image }}
                            style={styles.profileImage}
                        />
                    </View>

                    <Text style={styles.restaurantName}>{restaurant.name}</Text>

                    {restaurant.description && (
                        <Text style={styles.description}>{restaurant.description}</Text>
                    )}

                    {/* Stats */}
                    <View style={styles.statsContainer}>
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>{stats.postsCount}</Text>
                            <Text style={styles.statLabel}>Publicaciones</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>
                                {stats.totalViews > 1000
                                    ? `${(stats.totalViews / 1000).toFixed(1)}K`
                                    : stats.totalViews}
                            </Text>
                            <Text style={styles.statLabel}>Vistas</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>
                                {stats.totalLikes > 1000
                                    ? `${(stats.totalLikes / 1000).toFixed(1)}K`
                                    : stats.totalLikes}
                            </Text>
                            <Text style={styles.statLabel}>Me gusta</Text>
                        </View>
                    </View>

                    {/* Action Buttons */}
                    <View style={styles.actionsContainer}>
                        <TouchableOpacity
                            style={styles.primaryButton}
                            onPress={() => navigation.navigate('RestaurantDetail', { restaurant })}
                        >
                            <Ionicons name="restaurant" size={18} color="white" />
                            <Text style={styles.primaryButtonText}>Ver Menú</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.secondaryButton}
                            onPress={() => {
                                // Compartir perfil
                            }}
                        >
                            <Ionicons name="share-social" size={18} color={COLORS.primary} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Posts Grid */}
                <View style={styles.postsSection}>
                    <View style={styles.postsSectionHeader}>
                        <Ionicons name="grid" size={20} color={COLORS.text} />
                        <Text style={styles.postsSectionTitle}>Publicaciones</Text>
                    </View>

                    {loading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color={COLORS.primary} />
                        </View>
                    ) : posts.length === 0 ? (
                        renderEmptyState()
                    ) : (
                        <FlatList
                            data={posts}
                            renderItem={renderPost}
                            keyExtractor={(item) => item.id}
                            numColumns={3}
                            scrollEnabled={false}
                            contentContainerStyle={styles.gridContainer}
                        />
                    )}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SPACING.md,
        paddingTop: 40, // Espacio para el StatusBar
        paddingBottom: SPACING.md,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        backgroundColor: 'white',
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    profileSection: {
        alignItems: 'center',
        paddingVertical: SPACING.xl,
        paddingHorizontal: SPACING.lg,
    },
    profileImageContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        overflow: 'hidden',
        marginBottom: SPACING.md,
        borderWidth: 3,
        borderColor: COLORS.primary,
    },
    profileImage: {
        width: '100%',
        height: '100%',
    },
    restaurantName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: SPACING.xs,
    },
    description: {
        fontSize: 14,
        color: COLORS.textSecondary,
        textAlign: 'center',
        marginBottom: SPACING.md,
        paddingHorizontal: SPACING.md,
    },
    statsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: SPACING.lg,
        paddingHorizontal: SPACING.xl,
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statNumber: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    statLabel: {
        fontSize: 12,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    statDivider: {
        width: 1,
        height: 30,
        backgroundColor: COLORS.border,
        marginHorizontal: SPACING.md,
    },
    actionsContainer: {
        flexDirection: 'row',
        gap: SPACING.sm,
        width: '100%',
        paddingHorizontal: SPACING.md,
    },
    primaryButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.primary,
        paddingVertical: SPACING.sm,
        borderRadius: 8,
        gap: SPACING.xs,
    },
    primaryButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
    },
    secondaryButton: {
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 8,
    },
    postsSection: {
        paddingTop: SPACING.md,
    },
    postsSectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
        gap: SPACING.sm,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
    },
    postsSectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.text,
    },
    gridContainer: {
        paddingHorizontal: SPACING.md,
    },
    gridItem: {
        width: GRID_ITEM_SIZE,
        height: GRID_ITEM_SIZE * 1.5,
        margin: 2,
        borderRadius: 4,
        overflow: 'hidden',
        backgroundColor: COLORS.background,
    },
    gridImage: {
        width: '100%',
        height: '100%',
    },
    gridOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.2)',
        justifyContent: 'flex-end',
        padding: 6,
    },
    gridStats: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    gridStatText: {
        color: 'white',
        fontSize: 11,
        fontWeight: '600',
    },
    permanentBadge: {
        position: 'absolute',
        top: 6,
        right: 6,
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 4,
    },
    loadingContainer: {
        paddingVertical: 60,
        alignItems: 'center',
    },
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: 60,
        paddingHorizontal: SPACING.xl,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.text,
        marginTop: SPACING.md,
        marginBottom: SPACING.xs,
    },
    emptyText: {
        fontSize: 14,
        color: COLORS.textSecondary,
        textAlign: 'center',
    },
});

export default RestaurantProfileScreen;
