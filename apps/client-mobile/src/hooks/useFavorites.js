import { useState, useEffect, useCallback } from 'react';
import favoritesService from '../services/favoritesService';
import { useAuth } from '../context/AuthContext';

export const useFavorites = () => {
    const { user } = useAuth();
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [favoriteIds, setFavoriteIds] = useState(new Set());

    // Cargar favoritos del usuario
    const loadFavorites = useCallback(async () => {
        if (!user?.id) {
            setFavorites([]);
            setFavoriteIds(new Set());
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const response = await favoritesService.getUserFavorites(user.id);
            const favoritesData = response.data || [];
            setFavorites(favoritesData);

            // Crear un Set con los IDs de productos favoritos para búsqueda rápida
            const ids = new Set(favoritesData.map(fav => fav.product_id));
            setFavoriteIds(ids);
        } catch (error) {
            console.error('Error loading favorites:', error);
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

    // Verificar si un producto es favorito
    const isFavorite = useCallback((productId) => {
        return favoriteIds.has(productId);
    }, [favoriteIds]);

    // Toggle favorito
    const toggleFavorite = useCallback(async (productId) => {
        console.log('🔄 Toggle favorite called for product:', productId);
        console.log('👤 User ID:', user?.id);

        if (!user?.id) {
            console.warn('❌ User not logged in');
            return { success: false, message: 'Debes iniciar sesión' };
        }

        try {
            const wasFavorite = favoriteIds.has(productId);
            console.log('💖 Was favorite?', wasFavorite);
            console.log('📋 Current favorite IDs:', Array.from(favoriteIds));

            // Actualizar UI optimísticamente
            if (wasFavorite) {
                setFavoriteIds(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(productId);
                    return newSet;
                });
                setFavorites(prev => prev.filter(fav => fav.product_id !== productId));
            } else {
                setFavoriteIds(prev => new Set([...prev, productId]));
            }

            // Hacer la petición al servidor
            console.log('📡 Calling favoritesService.toggleFavorite...');
            const response = await favoritesService.toggleFavorite(user.id, productId);
            console.log('📡 Response:', response);

            if (!response.success) {
                console.error('❌ Failed to toggle favorite');
                // Revertir cambios si falla
                if (wasFavorite) {
                    setFavoriteIds(prev => new Set([...prev, productId]));
                } else {
                    setFavoriteIds(prev => {
                        const newSet = new Set(prev);
                        newSet.delete(productId);
                        return newSet;
                    });
                }
                return { success: false, message: 'Error al actualizar favorito' };
            }

            // Recargar favoritos para tener datos completos
            if (!wasFavorite) {
                console.log('🔄 Reloading favorites...');
                await loadFavorites();
            }

            console.log('✅ Favorite toggled successfully');
            return {
                success: true,
                isFavorite: !wasFavorite,
                message: wasFavorite ? 'Eliminado de favoritos' : 'Agregado a favoritos'
            };
        } catch (error) {
            console.error('❌ Error toggling favorite:', error);
            return { success: false, message: 'Error al actualizar favorito' };
        }
    }, [user?.id, favoriteIds, loadFavorites]);

    // Cargar favoritos al montar el componente
    useEffect(() => {
        loadFavorites();
    }, [loadFavorites]);

    return {
        favorites,
        loading,
        isFavorite,
        toggleFavorite,
        refreshFavorites: loadFavorites
    };
};
