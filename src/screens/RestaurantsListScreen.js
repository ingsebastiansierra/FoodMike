import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
    RefreshControl,
    ActivityIndicator,
    TextInput,
    ScrollView,
    Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../theme/colors';
import { SPACING } from '../theme/spacing';
import restaurantsService from '../services/restaurantsService';

const { width } = Dimensions.get('window');

const RestaurantsListScreen = ({ navigation }) => {
    const [restaurants, setRestaurants] = useState([]);
    const [filteredRestaurants, setFilteredRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTab, setSelectedTab] = useState('recommended');

    useEffect(() => {
        loadRestaurants();
    }, []);

    useEffect(() => {
        filterRestaurants();
    }, [searchQuery, restaurants]);

    const loadRestaurants = async () => {
        try {
            setLoading(true);
            const response = await restaurantsService.getOpen();
            setRestaurants(response.data || []);
        } catch (error) {
            console.error('Error loading restaurants:', error);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadRestaurants();
        setRefreshing(false);
    };

    const filterRestaurants = () => {
        if (!searchQuery.trim()) {
            setFilteredRestaurants(restaurants);
            return;
        }

        const filtered = restaurants.filter((restaurant) =>
            restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            restaurant.description?.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredRestaurants(filtered);
    };

    const renderLocationHeader = () => (
        <View style={styles.locationHeader}>
            <View style={styles.locationInfo}>
                <Icon name="location-on" size={24} color="#FFF" />
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
                    <Icon name="account-circle" size={40} color="#FFF" />
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
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                <Icon name="search" size={24} color="#999" style={styles.searchBarIcon} />
                <View style={styles.divider} />
                <Icon name="mic" size={24} color="#FF6B35" style={styles.micIcon} />
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
                    <Icon name="chevron-right" size={16} color="#FFF" />
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
                    <Icon name="restaurant" size={80} color="#8B4513" />
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
                    <Icon name="favorite-border" size={20} color={selectedTab === 'favourites' ? '#FF6B35' : '#666'} />
                    <Text style={[styles.tabText, selectedTab === 'favourites' && styles.tabTextActive]}>
                        Favourites
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderRestaurant = ({ item }) => (
        <TouchableOpacity
            style={styles.restaurantCard}
            onPress={() => navigation.navigate('RestaurantDetail', { restaurant: item })}
        >
            <Image source={{ uri: item.image }} style={styles.restaurantImage} />
            <TouchableOpacity style={styles.favoriteIcon}>
                <Icon name="favorite-border" size={24} color="#FFF" />
            </TouchableOpacity>
            {item.isfeatured && (
                <View style={styles.discountBadge}>
                    <Text style={styles.discountText}>40% OFF</Text>
                    <Text style={styles.discountSubtext}>up to ₹80</Text>
                </View>
            )}
            <View style={styles.restaurantInfo}>
                <Text style={styles.restaurantName} numberOfLines={1}>
                    {item.name}
                </Text>
                <Text style={styles.restaurantDescription} numberOfLines={1}>
                    {item.description || 'North Indian'}
                </Text>
                <View style={styles.restaurantMeta}>
                    <Icon name="circle" size={8} color="#4ECDC4" />
                    <Text style={styles.deliveryTime}>30-35 min</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>Cargando restaurantes...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={filteredRestaurants}
                renderItem={renderRestaurant}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2}
                columnWrapperStyle={styles.row}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
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
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Icon name="restaurant" size={80} color={COLORS.textSecondary} />
                        <Text style={styles.emptyText}>
                            {searchQuery ? 'No se encontraron restaurantes' : 'No hay restaurantes disponibles'}
                        </Text>
                    </View>
                }
            />
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
        backgroundColor: '#F5F5F5',
    },
    loadingText: {
        marginTop: SPACING.md,
        fontSize: 16,
        color: COLORS.textSecondary,
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
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    locationSubtitle: {
        color: '#FFF',
        fontSize: 12,
        opacity: 0.9,
    },
    headerButtons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    plusButton: {
        backgroundColor: '#FFF',
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
        backgroundColor: '#FFF',
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
        color: '#FFF',
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
        color: '#FFF',
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
        color: '#FFF',
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
        backgroundColor: '#FFF',
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
        paddingHorizontal: 8,
        paddingBottom: 20,
    },
    row: {
        justifyContent: 'space-between',
        paddingHorizontal: 8,
    },
    restaurantCard: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        marginBottom: 16,
        overflow: 'hidden',
        width: (width - 48) / 2,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    restaurantImage: {
        width: '100%',
        height: 120,
        backgroundColor: COLORS.lightGray,
    },
    favoriteIcon: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 20,
        padding: 6,
    },
    discountBadge: {
        position: 'absolute',
        bottom: 130,
        left: 0,
        backgroundColor: '#FF6B35',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderTopRightRadius: 8,
        borderBottomRightRadius: 8,
    },
    discountText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: 'bold',
    },
    discountSubtext: {
        color: '#FFF',
        fontSize: 10,
    },
    restaurantInfo: {
        padding: 12,
    },
    restaurantName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 4,
    },
    restaurantDescription: {
        fontSize: 13,
        color: COLORS.textSecondary,
        marginBottom: 6,
    },
    restaurantMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    deliveryTime: {
        fontSize: 12,
        color: COLORS.textSecondary,
        marginLeft: 4,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: 16,
        color: COLORS.textSecondary,
        marginTop: SPACING.md,
        textAlign: 'center',
    },
});

export default RestaurantsListScreen;
