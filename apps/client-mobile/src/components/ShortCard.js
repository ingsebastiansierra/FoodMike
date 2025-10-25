import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    ActivityIndicator,
    Animated,
} from 'react-native';
import { Video } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import { SPACING } from '../theme/spacing';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const ShortCard = ({
    short,
    isActive,
    onLike,
    onComment,
    onShare,
    onRestaurantPress,
}) => {
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [showLikeAnimation, setShowLikeAnimation] = useState(false);
    const likeAnimationValue = useRef(new Animated.Value(0)).current;
    const lastTap = useRef(null);

    useEffect(() => {
        const playVideo = async () => {
            if (isActive && videoRef.current) {
                try {
                    await videoRef.current.playAsync();
                    setIsPlaying(true);
                } catch (error) {
                    console.log('Error playing video:', error);
                }
            } else if (!isActive && videoRef.current) {
                try {
                    await videoRef.current.pauseAsync();
                    await videoRef.current.setPositionAsync(0);
                    setIsPlaying(false);
                } catch (error) {
                    console.log('Error pausing video:', error);
                }
            }
        };

        playVideo();
    }, [isActive]);

    useEffect(() => {
        return () => {
            if (videoRef.current) {
                videoRef.current.pauseAsync().catch(() => { });
                videoRef.current.unloadAsync().catch(() => { });
            }
        };
    }, []);

    const handleDoubleTap = () => {
        const now = Date.now();
        const DOUBLE_TAP_DELAY = 300;

        if (lastTap.current && (now - lastTap.current) < DOUBLE_TAP_DELAY) {
            lastTap.current = null;
            requestAnimationFrame(() => {
                handleLikeAnimation();
                onLike();
            });
        } else {
            lastTap.current = now;
            setTimeout(() => {
                if (lastTap.current === now) {
                    handlePlayPause();
                }
            }, DOUBLE_TAP_DELAY);
        }
    };

    const handleLikeAnimation = () => {
        requestAnimationFrame(() => {
            setShowLikeAnimation(true);
            likeAnimationValue.setValue(0);

            Animated.sequence([
                Animated.spring(likeAnimationValue, {
                    toValue: 1,
                    friction: 3,
                    tension: 40,
                    useNativeDriver: true,
                }),
                Animated.timing(likeAnimationValue, {
                    toValue: 0,
                    duration: 200,
                    delay: 400,
                    useNativeDriver: true,
                }),
            ]).start(() => {
                requestAnimationFrame(() => {
                    setShowLikeAnimation(false);
                });
            });
        });
    };

    const handlePlayPause = async () => {
        if (!videoRef.current) return;

        if (isPlaying) {
            await videoRef.current.pauseAsync();
            setIsPlaying(false);
        } else {
            await videoRef.current.playAsync();
            setIsPlaying(true);
        }
    };

    return (
        <View style={styles.container}>
            <Video
                ref={videoRef}
                source={{ uri: short.video_url }}
                style={styles.video}
                resizeMode="cover"
                isLooping
                shouldPlay={false}
                useNativeControls={false}
                onLoad={() => {
                    setIsLoading(false);
                    setHasError(false);
                }}
                onError={(error) => {
                    console.warn('Video playback error:', error);
                    setIsLoading(false);
                    setHasError(true);
                }}
                onLoadStart={() => setIsLoading(true)}
                videoStyle={styles.video}
            />

            {isLoading && !hasError && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            )}

            {hasError && (
                <View style={styles.errorContainer}>
                    <Ionicons name="alert-circle-outline" size={50} color="white" />
                    <Text style={styles.errorText}>Video no compatible</Text>
                    <Text style={styles.errorSubtext}>Este formato de video no es soportado</Text>
                </View>
            )}

            <TouchableOpacity
                style={styles.videoOverlay}
                activeOpacity={1}
                onPress={handleDoubleTap}
            >
                {!isPlaying && !isLoading && (
                    <View style={styles.playButton}>
                        <Ionicons name="play" size={50} color="white" />
                    </View>
                )}

                {showLikeAnimation && (
                    <Animated.View
                        style={[
                            styles.likeAnimationContainer,
                            {
                                opacity: likeAnimationValue,
                                transform: [
                                    {
                                        scale: likeAnimationValue.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [0, 1],
                                        }),
                                    },
                                ],
                            },
                        ]}
                    >
                        <Ionicons name="heart" size={120} color={COLORS.error} />
                    </Animated.View>
                )}
            </TouchableOpacity>

            <View style={styles.restaurantInfo}>
                <TouchableOpacity
                    style={styles.restaurantHeader}
                    onPress={onRestaurantPress}
                    activeOpacity={0.8}
                >
                    <View style={styles.restaurantAvatar}>
                        <Ionicons name="restaurant" size={20} color="white" />
                    </View>
                    <Text style={styles.restaurantName}>@{short.restaurant?.name}</Text>
                </TouchableOpacity>
                {short.title && <Text style={styles.title}>{short.title}</Text>}
                {short.description && (
                    <Text style={styles.description} numberOfLines={3}>
                        {short.description}
                    </Text>
                )}
            </View>

            <View style={styles.actionsContainer}>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={onLike}
                    activeOpacity={0.7}
                >
                    <Ionicons
                        name={short.liked_by_user ? 'heart' : 'heart-outline'}
                        size={32}
                        color={short.liked_by_user ? COLORS.error : 'white'}
                    />
                    <Text style={styles.actionText}>{short.likes_count || 0}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={onComment}
                    activeOpacity={0.7}
                >
                    <Ionicons name="chatbubble-outline" size={30} color="white" />
                    <Text style={styles.actionText}>{short.comments_count || 0}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={onShare}
                    activeOpacity={0.7}
                >
                    <Ionicons name="share-social-outline" size={30} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: SCREEN_HEIGHT,
        width: '100%',
        backgroundColor: COLORS.dark,
    },
    video: {
        width: '100%',
        height: '100%',
    },
    loadingContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    errorContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.8)',
        padding: SPACING.xl,
    },
    errorText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: SPACING.md,
        textAlign: 'center',
    },
    errorSubtext: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 14,
        marginTop: SPACING.xs,
        textAlign: 'center',
    },
    videoOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    playButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    likeAnimationContainer: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },
    restaurantInfo: {
        position: 'absolute',
        bottom: 120,
        left: SPACING.md,
        right: 80,
    },
    restaurantHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.sm,
    },
    restaurantAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.sm,
        borderWidth: 2,
        borderColor: 'white',
    },
    restaurantName: {
        fontSize: 15,
        fontWeight: 'bold',
        color: 'white',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },
    title: {
        fontSize: 15,
        fontWeight: '700',
        color: 'white',
        marginBottom: SPACING.xs,
        textShadowColor: 'rgba(0, 0, 0, 0.9)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
    },
    description: {
        fontSize: 14,
        color: 'white',
        lineHeight: 18,
        textShadowColor: 'rgba(0, 0, 0, 0.9)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
    },
    actionsContainer: {
        position: 'absolute',
        right: SPACING.md,
        bottom: 120,
        alignItems: 'center',
    },
    actionButton: {
        alignItems: 'center',
        marginBottom: SPACING.xl,
    },
    actionText: {
        color: 'white',
        fontSize: 13,
        fontWeight: 'bold',
        marginTop: 4,
        textShadowColor: 'rgba(0, 0, 0, 0.9)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
    },
});

export default ShortCard;
