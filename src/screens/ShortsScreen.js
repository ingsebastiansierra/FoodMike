import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    Dimensions,
    Alert,
    Share,
    StatusBar,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import ShortCard from '../components/ShortCard';
import CommentsModal from '../components/CommentsModal';
import { shortsService } from '../services/shortsService';
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../theme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const ShortsScreen = () => {
    const navigation = useNavigation();
    const { user } = useAuth();
    const flatListRef = useRef(null);

    const [shorts, setShorts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [commentsModalVisible, setCommentsModalVisible] = useState(false);
    const [selectedShortId, setSelectedShortId] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const [isScreenFocused, setIsScreenFocused] = useState(true);

    useEffect(() => {
        loadShorts();
    }, []);

    // Pausar videos cuando sales de la pantalla
    useFocusEffect(
        useCallback(() => {
            // Cuando la pantalla está enfocada
            setIsScreenFocused(true);

            // Cuando la pantalla pierde el foco
            return () => {
                setIsScreenFocused(false);
            };
        }, [])
    );

    const loadShorts = async (refresh = false) => {
        if (loading || (!hasMore && !refresh)) return;

        try {
            if (refresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            const offset = refresh ? 0 : shorts.length;
            const data = await shortsService.getShorts({
                limit: 10,
                offset,
                userId: user?.id,
            });

            if (refresh) {
                setShorts(data);
                setHasMore(data.length === 10);
            } else {
                setShorts([...shorts, ...data]);
                setHasMore(data.length === 10);
            }
        } catch (error) {
            console.error('Error loading shorts:', error);
            Alert.alert('Error', 'No se pudieron cargar los shorts');
        } finally {
            setLoading(false);
            setRefreshing(false);
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
            Alert.alert('Inicia sesión', 'Debes iniciar sesión para dar like');
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
        if (!user) {
            Alert.alert('Inicia sesión', 'Debes iniciar sesión para comentar');
            return;
        }
        setSelectedShortId(short.id);
        setCommentsModalVisible(true);
    };

    const handleShare = async (short) => {
        try {
            await Share.share({
                message: `¡Mira este video de ${short.restaurant?.name}! ${short.title || ''}`,
                url: short.video_url,
            });
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };

    const handleRestaurantPress = (short) => {
        if (!short.restaurant) {
            Alert.alert('Error', 'No se pudo cargar la información del restaurante');
            return;
        }

        // Construir el objeto restaurant con los datos del short
        const restaurant = {
            id: short.restaurant_id,
            name: short.restaurant.name,
            image: short.restaurant.image || 'https://via.placeholder.com/400',
            stars: short.restaurant.stars || '4.5',
            address: short.restaurant.address || 'Ubicación no disponible',
            description: short.restaurant.description || 'Deliciosa comida te espera.',
        };

        navigation.navigate('RestaurantProfile', {
            restaurant: restaurant,
        });
    };

    const renderShort = ({ item, index }) => (
        <ShortCard
            short={item}
            isActive={index === currentIndex && isScreenFocused}
            onLike={() => handleLike(item)}
            onComment={() => handleComment(item)}
            onShare={() => handleShare(item)}
            onRestaurantPress={() => handleRestaurantPress(item)}
        />
    );

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
                onEndReached={() => loadShorts()}
                onEndReachedThreshold={0.5}
                onRefresh={() => loadShorts(true)}
                refreshing={refreshing}
                removeClippedSubviews={true}
                maxToRenderPerBatch={3}
                windowSize={5}
            />

            <CommentsModal
                visible={commentsModalVisible}
                onClose={() => setCommentsModalVisible(false)}
                shortId={selectedShortId}
                userId={user?.id}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.dark,
    },
});

export default ShortsScreen;
