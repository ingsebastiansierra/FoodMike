import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    RefreshControl,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../theme';
import RestaurantCard from '../../components/RestaurantCard';
import restaurantsService from '../../services/restaurantsService';
import { showAlert } from '../../features/core/utils/alert';
import { useAutoCloseCart } from '../../hooks/useAutoCloseCart';
import AppHeader from '../../components/AppHeader';
import ScrollToTopButton from '../../components/ScrollToTopButton';

const { width } = Dimensions.get('window');

const RestaurantsListScreen = ({ navigation }) => {
    const [restaurants, setRestaurants] = useState([]);
    const [filteredRestaurants, setFilteredRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [selectedTab, setSelectedTab] = useState('recommended');

    const flatListRef = useRef(null);
    useAutoCloseCart();

    useEffect(() => {
        loadRestaurants();
    }, []);

    const loadRestaurants = async () => {
        try {
            setLoading(true);
            const response = await restaurantsService.getOpen();
            setRestaurants(response.data || []);
            setFilteredRestaurants(response.data || []);
        } catch (error) {
            console.error('Error cargando restaurantes:', error);
            showAlert('Error', 'No se pudieron cargar los restaurantes');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (searchTerm.trim()) {
            const searchLower = searchTerm.toLowerCase();
            const filtered = restaurants.filter(
                (restaurant) =>
                    (restaurant.name && restaurant.name.toLowerCase().includes(searchLower)) ||
                    (restaurant.address && restaurant.address.toLowerCase().includes(searchLower))
            );
            setFilteredRestaurants(filtered);
        } else {
            setFilteredRestaurants(restaurants);
        }
    }, [searchTerm, restaurants]);

    const handleRefresh = async () => {
        setRefreshing(true);
        await loadRestaurants();
        setRefreshing(false);
    };

    const handleRestaurantPress = (restaurant) => {
        navigation.navigate('RestaurantDetail', { restaurant });
    };

    const handleScroll = (event) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        setShowScrollTop(offsetY > 200);
    };

    const scrollToTop = () => {
        flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    };

    const renderRestaurant = ({ item }) => (
        <RestaurantCard
            restaurant={item}
            onPress={() => handleRestaurantPress(item)}
        />
    );

    const renderEmptyState = () => (
        <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No hay restaurantes disponibles</Text>
            <Text style={styles.emptySubtitle}>
                Intenta más tarde o verifica tu conexión
            </Text>
        </View>
    );

    const renderLocationHeader = () => (
        <View style={styles.locationHeader}>
            <View style={styles.locationInfo}>
                <Ionicons name="location" size={24} color={colors.white} />
                <View style={styles.locationText}>
                    <Text style={styles.locationTitle}>Hotel</Text>
                    <Text style={styles.locationSubtitle}>Hyatt Regency Delhi Ring Rd, Bhikaji...</Text>
                </View>
            </View>
            <View style={styles.headerButtons}>
                <TouchableOpacity style={styles.plusButton}>
                    <Text style={styles.plusButtonText}>Plus</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.profileButton}>
                    <Ionicons name="person-circle" size={40} color={colors.white} />
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderSearchBar = () => (
        <View style={styles.searchBarContainer}>
            <View style={styles.searchBar}>
                <TextInput
                    style={styles.searchBarInput}
                    placeholder="Search for 'Pizza'"
                    placeholderTextColor="#999"
                    value={searchTerm}
                    onChangeText={setSearchTerm}
                />
                <Ionicons name="search" size={24} color="#999" style={styles.searchBarIcon} />
                <View style={styles.divider} />
                <Ionicons name="mic" size={24} color="#FF6B35" style={styles.micIcon} />
            </View>
        </View>
    );

    const renderOffersSection = () => (
        <View style={styles.offersSection}>
            <View style={styles.offersContent}>
                <Text style={styles.offersTitle}>Explosive Offers</Text>
                <Text style={styles.offersTitle}>for you</Text>
                <TouchableOpacity style={styles.offersButton}>
                    <Text style={styles.offersButtonText}>MIN. ₹150 OFF</Text>
                    <Ionicons name="chevron-forward" size={16} color={colors.white} />
                </TouchableOpacity>
            </View>
            <View style={styles.offersCircle} />
        </View>
    );

    const renderPromotionCarousel = () => (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.carouselContainer}
            contentContainerStyle={styles.carouselContent}
        >
            <View style={styles.promotionCard}>
                <View style={styles.promotionTextContainer}>
                    <Text style={styles.promotionTitle}>IT'S DINNER TIME</Text>
                    <Text style={styles.promotionSubtitle}>Get flat ₹125 OFF</Text>
                    <Text style={styles.promotionSubtitle}>& more on your food!</Text>
                    <TouchableOpacity style={styles.orderNowButton}>
                        <Text style={styles.orderNowText}>Order now</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.promotionImagePlaceholder}>
                    <Ionicons name="fast-food" size={80} color="#8B4513" />
                </View>
            </View>
        </ScrollView>
    );

    const renderTabs = () => (
        <View style={styles.tabsContainer}>
            <View style={styles.tabsWrapper}>
                <TouchableOpacity
                    style={[styles.tab, selectedTab === 'recommended' && styles.tabActive]}
                    onPress={() => setSelectedTab('recommended')}
                >
                    <Text style={[styles.tabText, selectedTab === 'recommended' && styles.tabTextActive]}>
                        Recommended
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, selectedTab === 'favourites' && styles.tabActive]}
                    onPress={() => setSelectedTab('favourites')}
                >
                    <Ionicons name="heart-outline" size={20} color={selectedTab === 'favourites' ? '#FF6B35' : '#666'} />
                    <Text style={[styles.tabText, selectedTab === 'favourites' && styles.tabTextActive]}>
                        Favourites
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.container}>
                <AppHeader
                    screenName="RESTAURANTS"
                    navigation={navigation}
                />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={styles.loadingText}>Cargando restaurantes...</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <AppHeader
                screenName="RESTAURANTS"
                navigation={navigation}
            />

            <FlatList
                ref={flatListRef}
                data={filteredRestaurants}
                renderItem={renderRestaurant}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        tintColor={colors.primary}
                    />
                }
                ListHeaderComponent={
                    <>
                        {renderLocationHeader()}
                        {renderSearchBar()}
                        {renderOffersSection()}
                        {renderPromotionCarousel()}
                        {renderTabs()}
                    </>
                }
                ListEmptyComponent={renderEmptyState}
            />

            <View style={styles.floatingButtonContainer}>
                <ScrollToTopButton visible={showScrollTop} onPress={scrollToTop} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: spacing.md,
        fontSize: typography.sizes.md,
        color: colors.gray,
    },
    locationHeader: {
        backgroundColor: '#FF8C42',
        paddingHorizontal: 16,
        paddingVertical: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    locationInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    locationText: {
        marginLeft: 8,
        flex: 1,
    },
    locationTitle: {
        color: colors.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
    locationSubtitle: {
        color: colors.white,
        fontSize: 12,
        opacity: 0.9,
    },
    headerButtons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    plusButton: {
        backgroundColor: colors.white,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    plusButtonText: {
        color: '#FF8C42',
        fontWeight: 'bold',
        fontSize: 14,
    },
    profileButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchBarContainer: {
        backgroundColor: '#FF8C42',
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    searchBar: {
        backgroundColor: colors.white,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    searchBarInput: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
    searchBarIcon: {
        marginLeft: 8,
    },
    divider: {
        width: 1,
        height: 24,
        backgroundColor: '#DDD',
        marginHorizontal: 12,
    },
    micIcon: {
        marginLeft: 4,
    },
    offersSection: {
        backgroundColor: '#FF8C42',
        marginHorizontal: 16,
        marginTop: 16,
        borderRadius: 16,
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        overflow: 'hidden',
    },
    offersContent: {
        flex: 1,
    },
    offersTitle: {
        color: colors.white,
        fontSize: 24,
        fontWeight: 'bold',
        lineHeight: 30,
    },
    offersButton: {
        backgroundColor: '#D32F2F',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginTop: 12,
        alignSelf: 'flex-start',
    },
    offersButtonText: {
        color: colors.white,
        fontWeight: 'bold',
        fontSize: 12,
        marginRight: 4,
    },
    offersCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        position: 'absolute',
        right: -20,
        top: -10,
    },
    carouselContainer: {
        marginTop: 16,
    },
    carouselContent: {
        paddingHorizontal: 16,
    },
    promotionCard: {
        backgroundColor: '#E8DCC4',
        borderRadius: 16,
        padding: 20,
        flexDirection: 'row',
        width: width - 32,
        marginRight: 16,
    },
    promotionTextContainer: {
        flex: 1,
    },
    promotionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#5D4E37',
        marginBottom: 8,
    },
    promotionSubtitle: {
        fontSize: 14,
        color: '#5D4E37',
        marginBottom: 2,
    },
    orderNowButton: {
        backgroundColor: '#8B6914',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        alignSelf: 'flex-start',
        marginTop: 12,
    },
    orderNowText: {
        color: colors.white,
        fontWeight: 'bold',
        fontSize: 14,
    },
    promotionImagePlaceholder: {
        width: 100,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabsContainer: {
        marginTop: 20,
        marginBottom: 16,
        alignItems: 'center',
    },
    tabsWrapper: {
        flexDirection: 'row',
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    tab: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
        gap: 6,
    },
    tabActive: {
        backgroundColor: '#FFF5E6',
        borderWidth: 2,
        borderColor: '#FF8C42',
    },
    tabText: {
        fontSize: 16,
        color: '#666',
        fontWeight: '500',
    },
    tabTextActive: {
        color: '#FF6B35',
        fontWeight: 'bold',
    },
    listContainer: {
        paddingHorizontal: spacing.md,
        paddingBottom: 120,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: spacing.xl * 2,
    },
    emptyTitle: {
        fontSize: typography.sizes.lg,
        fontWeight: 'bold',
        color: colors.darkGray,
        marginTop: spacing.lg,
        textAlign: 'center',
    },
    emptySubtitle: {
        fontSize: typography.sizes.md,
        color: colors.gray,
        marginTop: spacing.sm,
        textAlign: 'center',
        paddingHorizontal: spacing.lg,
    },
    floatingButtonContainer: {
        position: 'absolute',
        top: 210,
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 1000,
        pointerEvents: 'box-none',
    },
});

export default RestaurantsListScreen;
