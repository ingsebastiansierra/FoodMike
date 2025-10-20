import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    Dimensions,
    StatusBar,
    ActivityIndicator,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import ShortCard from '../components/ShortCard';
import { shortsService } from '../services/shortsService';
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../theme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const RestaurantShortsViewerScreen = ({ route }) => {
    const navigation = useNavigation();
    const { user } = useAuth();
    const { restaurantId, initialShortId } = route.params;
    const flatListRef = useRef(null);

    const [shorts, setShorts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isScreenFocused, setIsScreenFocused] = useState(true);

    useEffect(() => {
        loadShorts();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            setIsScreenFocused(true);
            return () => {
                setIsScreenFocused(false);
            };
        }, [])
    );

    const loadShorts = async () => {
        try {
            setLoading(true);
            const data = await shortsService.getRestaurantProfileShorts(restaurantId);

            // Agregar información del restaurante a cada short
            const shortsWithRestaurant = data.map(short => ({
                ...short,
                restaurant_id: restaurantId,
                liked_by_user: false, // Puedes verificar esto si tienes la info
            }));

            setShorts(shortsWithRestaurant);

            // Si hay un short inicial, scrollear a él
            if (initialShortId && shortsWithRestaurant.length > 0) {
                const initialIndex = shortsWithRestaurant.findIndex(s => s.id === initialShortId);
                if (initialIndex !== -1) {
                    setCurrentIndex(initialIndex);
                    setTimeout(() => {
                        flatListRef.current?.scrollToIndex({
                            index: initialIndex,
                            animated: false,
                        });
                    }, 100);
                }
            }
        } catch (error) {
            console.error('Error loading shorts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewableItemsChanged = useRef(({ viewableItems }) => {
        if (viewableItems.length > 0) {
            const index = viewableItems[0].index;
            setCurrentIndex(index);

            // Incrementar vistas
            const short = shorts[index];
            if (short) {
                shortsService.incrementViews(short.id);
            }
        }
    }).current;

    const handleLike = async (short) => {
        if (!user) {
            return;
        }

        try {
            const updatedShorts = [...shorts];
            const index = updatedShorts.findIndex(s => s.id === short.id);

            if (short.liked_by_user) {
                await shortsService.unlikeShort(short.id, user.id);
                updatedShorts[index] = {
                    ...short,
                    liked_by_user: false,
                    likes_count: short.likes_count - 1,
                };
            } else {
                await shortsService.likeShort(short.id, user.id);
                updatedShorts[index] = {
                    ...short,
                    liked_by_user: true,
                    likes_count: short.likes_count + 1,
                };
            }

            setShorts(updatedShorts);
        } catch (error) {
            console.error('Error toggling like:', error);
        }
    };

    const handleComment = (short) => {
        // Navegar a comentarios o abrir modal
        console.log('Open comments for:', short.id);
    };

    const handleShare = async (short) => {
        // Compartir short
        console.log('Share short:', short.id);
    };

    const handleRestaurantPress = () => {
        // Volver al perfil del restaurante
        navigation.goBack();
    };

    const renderShort = ({ item, index }) => (
        <ShortCard
            short={item}
            isActive={index === currentIndex && isScreenFocused}
            onLike={() => handleLike(item)}
            onComment={() => handleComment(item)}
            onShare={() => handleShare(item)}
            onRestaurantPress={handleRestaurantPress}
        />
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            <FlatList
                ref={flatListRef}
                data={shorts}
                renderItem={renderShort}
                keyExtractor={(item) => item.id}
                pagingEnabled
                showsVerticalScrollIndicator={false}
                snapToInterval={SCREEN_HEIGHT}
                snapToAlignment="start"
                decelerationRate="fast"
                onViewableItemsChanged={handleViewableItemsChanged}
                viewabilityConfig={{
                    itemVisiblePercentThreshold: 50,
                }}
                removeClippedSubviews={true}
                maxToRenderPerBatch={3}
                windowSize={5}
                onScrollToIndexFailed={(info) => {
                    const wait = new Promise(resolve => setTimeout(resolve, 500));
                    wait.then(() => {
                        flatListRef.current?.scrollToIndex({
                            index: info.index,
                            animated: false,
                        });
                    });
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.dark,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.dark,
    },
});

export default RestaurantShortsViewerScreen;
