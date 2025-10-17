import { supabase, handleError } from '../config/supabase';

const favoritesService = {
    // Obtener favoritos de un usuario
    getUserFavorites: async (userId) => {
        try {
            const { data, error } = await supabase
                .from('favorites')
                .select(`
          *,
          products (
            *,
            restaurants (
              id,
              name,
              image,
              address
            )
          )
        `)
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return { data };
        } catch (error) {
            handleError(error, `getUserFavorites ${userId}`);
            return { data: [] };
        }
    },

    // Verificar si un producto es favorito
    isFavorite: async (userId, productId) => {
        try {
            const { data, error } = await supabase
                .from('favorites')
                .select('id')
                .eq('user_id', userId)
                .eq('product_id', productId)
                .single();

            if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
            return { isFavorite: !!data };
        } catch (error) {
            handleError(error, `isFavorite ${userId} ${productId}`);
            return { isFavorite: false };
        }
    },

    // Agregar a favoritos
    addFavorite: async (userId, productId) => {
        try {
            console.log('➕ Adding favorite:', { userId, productId });
            const { data, error } = await supabase
                .from('favorites')
                .insert({
                    user_id: userId,
                    product_id: productId,
                    created_at: new Date().toISOString()
                })
                .select();

            if (error) {
                console.error('❌ Supabase error adding favorite:', error);
                throw error;
            }
            console.log('✅ Favorite added successfully:', data);
            return { data, success: true };
        } catch (error) {
            console.error('❌ Error in addFavorite:', error);
            handleError(error, `addFavorite ${userId} ${productId}`);
            return { success: false };
        }
    },

    // Remover de favoritos
    removeFavorite: async (userId, productId) => {
        try {
            const { error } = await supabase
                .from('favorites')
                .delete()
                .eq('user_id', userId)
                .eq('product_id', productId);

            if (error) throw error;
            return { success: true };
        } catch (error) {
            handleError(error, `removeFavorite ${userId} ${productId}`);
            return { success: false };
        }
    },

    // Toggle favorito (agregar o remover)
    toggleFavorite: async (userId, productId) => {
        try {
            console.log('🔧 favoritesService.toggleFavorite called');
            console.log('   userId:', userId, 'type:', typeof userId);
            console.log('   productId:', productId, 'type:', typeof productId);

            const { isFavorite } = await favoritesService.isFavorite(userId, productId);
            console.log('   isFavorite:', isFavorite);

            if (isFavorite) {
                console.log('   ➡️ Removing from favorites...');
                return await favoritesService.removeFavorite(userId, productId);
            } else {
                console.log('   ➡️ Adding to favorites...');
                return await favoritesService.addFavorite(userId, productId);
            }
        } catch (error) {
            console.error('❌ Error in toggleFavorite:', error);
            handleError(error, `toggleFavorite ${userId} ${productId}`);
            return { success: false };
        }
    }
};

export default favoritesService;
