import { supabase } from '../config/supabase';
import { CLOUDINARY_CONFIG } from '../config/cloudinary';

/**
 * Servicio para gestionar los Shorts de restaurantes
 */
export const shortsService = {
    /**
     * Obtener shorts con paginación
     */
    getShorts: async ({ limit = 10, offset = 0, restaurantId = null, userId = null }) => {
        try {
            let query = supabase
                .from('shorts')
                .select(`
          *,
          restaurant:restaurants(id, name, image, stars, address, description),
          likes:short_likes(count),
          comments:short_comments(count)
        `)
                .eq('is_active', true)
                .order('created_at', { ascending: false })
                .range(offset, offset + limit - 1);

            if (restaurantId) {
                query = query.eq('restaurant_id', restaurantId);
            }

            const { data, error } = await query;

            if (error) throw error;

            // Verificar si el usuario actual dio like
            if (userId && data) {
                const shortIds = data.map(s => s.id);
                const { data: userLikes } = await supabase
                    .from('short_likes')
                    .select('short_id')
                    .eq('user_id', userId)
                    .in('short_id', shortIds);

                const likedIds = new Set(userLikes?.map(l => l.short_id) || []);

                return data.map(short => ({
                    ...short,
                    liked_by_user: likedIds.has(short.id),
                    likes_count: short.likes?.[0]?.count || 0,
                    comments_count: short.comments?.[0]?.count || 0,
                }));
            }

            return data.map(short => ({
                ...short,
                liked_by_user: false,
                likes_count: short.likes?.[0]?.count || 0,
                comments_count: short.comments?.[0]?.count || 0,
            }));
        } catch (error) {
            console.error('Error fetching shorts:', error);
            throw error;
        }
    },

    /**
     * Crear un nuevo short
     */
    createShort: async ({
        restaurantId,
        videoUrl,
        thumbnailUrl,
        title,
        description,
        tags = [],
        publishAt = null,
        durationHours = 48,
        isPermanent = false
    }) => {
        try {
            const shortData = {
                restaurant_id: restaurantId,
                video_url: videoUrl,
                thumbnail_url: thumbnailUrl,
                title,
                description,
                tags,
                duration_hours: durationHours,
                is_active: true,
                is_permanent: isPermanent,
            };

            // Si es permanente, no establecer expiración
            if (isPermanent) {
                shortData.expires_at = null;
                shortData.pinned_at = new Date().toISOString();
            }

            // Si se proporciona publishAt, usarlo; si no, publicar inmediatamente
            if (publishAt && !isPermanent) {
                shortData.publish_at = publishAt;
                // Si la fecha de publicación es futura, no activar aún
                const publishDate = new Date(publishAt);
                if (publishDate > new Date()) {
                    shortData.is_active = false;
                }
            }

            const { data, error } = await supabase
                .from('shorts')
                .insert([shortData])
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error creating short:', error);
            throw error;
        }
    },

    /**
     * Obtener shorts del restaurante (incluyendo programados y expirados)
     */
    getRestaurantShorts: async (restaurantId) => {
        try {
            const { data, error } = await supabase
                .from('shorts')
                .select(`
                    *,
                    likes:short_likes(count),
                    comments:short_comments(count)
                `)
                .eq('restaurant_id', restaurantId)
                .order('created_at', { ascending: false });

            if (error) throw error;

            return data.map(short => ({
                ...short,
                likes_count: short.likes?.[0]?.count || 0,
                comments_count: short.comments?.[0]?.count || 0,
                is_expired: short.expires_at ? new Date(short.expires_at) < new Date() : false,
                is_scheduled: short.publish_at ? new Date(short.publish_at) > new Date() : false,
            }));
        } catch (error) {
            console.error('Error fetching restaurant shorts:', error);
            throw error;
        }
    },

    /**
     * Eliminar un short
     */
    deleteShort: async (shortId) => {
        try {
            const { error } = await supabase
                .from('shorts')
                .delete()
                .eq('id', shortId);

            if (error) throw error;
            return { success: true };
        } catch (error) {
            console.error('Error deleting short:', error);
            throw error;
        }
    },

    /**
     * Actualizar un short
     */
    updateShort: async (shortId, updates) => {
        try {
            const { data, error } = await supabase
                .from('shorts')
                .update(updates)
                .eq('id', shortId)
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error updating short:', error);
            throw error;
        }
    },

    /**
     * Desactivar shorts expirados
     */
    deactivateExpiredShorts: async () => {
        try {
            const { error } = await supabase.rpc('deactivate_expired_shorts');
            if (error) throw error;
            return { success: true };
        } catch (error) {
            console.error('Error deactivating expired shorts:', error);
            return { success: false };
        }
    },

    /**
     * Activar shorts programados
     */
    activateScheduledShorts: async () => {
        try {
            const { error } = await supabase.rpc('activate_scheduled_shorts');
            if (error) throw error;
            return { success: true };
        } catch (error) {
            console.error('Error activating scheduled shorts:', error);
            return { success: false };
        }
    },

    /**
     * Obtener publicaciones permanentes del perfil del restaurante
     */
    getRestaurantProfileShorts: async (restaurantId) => {
        try {
            // Primero intentar con RPC
            const { data: rpcData, error: rpcError } = await supabase.rpc('get_restaurant_profile_shorts', {
                p_restaurant_id: restaurantId
            });

            if (!rpcError && rpcData) {
                return rpcData;
            }

            // Si RPC falla, usar consulta directa
            console.log('RPC failed, using direct query');
            const { data, error } = await supabase
                .from('shorts')
                .select('*')
                .eq('restaurant_id', restaurantId)
                .eq('is_active', true)
                .eq('is_permanent', true)
                .order('pinned_at', { ascending: false });

            if (error) throw error;

            // Agregar conteos de likes y comentarios
            const shortsWithStats = await Promise.all(
                (data || []).map(async (short) => {
                    const { count: likesCount } = await supabase
                        .from('short_likes')
                        .select('*', { count: 'exact', head: true })
                        .eq('short_id', short.id);

                    const { count: commentsCount } = await supabase
                        .from('short_comments')
                        .select('*', { count: 'exact', head: true })
                        .eq('short_id', short.id);

                    return {
                        ...short,
                        likes_count: likesCount || 0,
                        comments_count: commentsCount || 0,
                    };
                })
            );

            return shortsWithStats;
        } catch (error) {
            console.error('Error fetching restaurant profile shorts:', error);
            return [];
        }
    },

    /**
     * Obtener conteo de publicaciones permanentes
     */
    getPermanentShortsCount: async (restaurantId) => {
        try {
            const { data, error } = await supabase.rpc('get_permanent_shorts_count', {
                p_restaurant_id: restaurantId
            });

            if (error) throw error;
            return data || 0;
        } catch (error) {
            console.error('Error getting permanent shorts count:', error);
            return 0;
        }
    },

    /**
     * Convertir un short en publicación permanente
     */
    makeShortPermanent: async (shortId) => {
        try {
            const { data, error } = await supabase.rpc('make_short_permanent', {
                p_short_id: shortId
            });

            if (error) {
                if (error.message.includes('Límite de 15')) {
                    throw new Error('Ya tienes el máximo de 15 publicaciones permanentes');
                }
                throw error;
            }
            return { success: true };
        } catch (error) {
            console.error('Error making short permanent:', error);
            throw error;
        }
    },

    /**
     * Convertir un short permanente en temporal
     */
    makeShortTemporary: async (shortId, durationHours = 48) => {
        try {
            const { data, error } = await supabase.rpc('make_short_temporary', {
                p_short_id: shortId,
                p_duration_hours: durationHours
            });

            if (error) throw error;
            return { success: true };
        } catch (error) {
            console.error('Error making short temporary:', error);
            throw error;
        }
    },

    /**
     * Dar like a un short
     */
    likeShort: async (shortId, userId) => {
        try {
            const { data, error } = await supabase
                .from('short_likes')
                .insert([{
                    short_id: shortId,
                    user_id: userId,
                }])
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error liking short:', error);
            throw error;
        }
    },

    /**
     * Quitar like de un short
     */
    unlikeShort: async (shortId, userId) => {
        try {
            const { error } = await supabase
                .from('short_likes')
                .delete()
                .eq('short_id', shortId)
                .eq('user_id', userId);

            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Error unliking short:', error);
            throw error;
        }
    },

    /**
     * Obtener comentarios de un short
     */
    getComments: async (shortId, { limit = 20, offset = 0 } = {}) => {
        try {
            const { data, error } = await supabase
                .from('short_comments')
                .select('*')
                .eq('short_id', shortId)
                .order('created_at', { ascending: false })
                .range(offset, offset + limit - 1);

            if (error) throw error;

            // Obtener información de usuarios manualmente
            if (data && data.length > 0) {
                const userIds = [...new Set(data.map(c => c.user_id))];
                const { data: users } = await supabase
                    .from('profiles')
                    .select('id, full_name')
                    .in('id', userIds);

                const usersMap = {};
                users?.forEach(u => {
                    usersMap[u.id] = u;
                });

                return data.map(comment => ({
                    ...comment,
                    user: usersMap[comment.user_id] || { id: comment.user_id, full_name: 'Usuario' }
                }));
            }

            return data || [];
        } catch (error) {
            console.error('Error fetching comments:', error);
            throw error;
        }
    },

    /**
     * Agregar comentario a un short
     */
    addComment: async (shortId, userId, comment) => {
        try {
            const { data, error } = await supabase
                .from('short_comments')
                .insert([{
                    short_id: shortId,
                    user_id: userId,
                    comment,
                }])
                .select('*')
                .single();

            if (error) throw error;

            // Obtener información del usuario manualmente
            const { data: userProfile } = await supabase
                .from('profiles')
                .select('id, full_name')
                .eq('id', userId)
                .single();

            return {
                ...data,
                user: userProfile || { id: userId, full_name: 'Usuario' }
            };
        } catch (error) {
            console.error('Error adding comment:', error);
            throw error;
        }
    },

    /**
     * Incrementar contador de vistas
     */
    incrementViews: async (shortId) => {
        try {
            const { error } = await supabase.rpc('increment_short_views', {
                short_id: shortId,
            });

            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Error incrementing views:', error);
            // No lanzar error, las vistas no son críticas
            return false;
        }
    },

    /**
     * Subir video a storage
     */
    uploadVideo: async (uri, restaurantId) => {
        try {
            console.log('📹 Iniciando upload de video a Cloudinary...', { uri, restaurantId });

            const fileName = `shorts_${restaurantId}_${Date.now()}`;

            // Crear FormData para Cloudinary
            const formData = new FormData();
            formData.append('file', {
                uri: uri,
                type: 'video/mp4',
                name: `${fileName}.mp4`,
            });
            formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
            formData.append('folder', `shorts/${restaurantId}`);
            formData.append('resource_type', 'video');

            console.log('📤 Subiendo a Cloudinary...');

            // Subir a Cloudinary
            const cloudinaryUrl = `${CLOUDINARY_CONFIG.apiUrl}/video/upload`;

            const response = await fetch(cloudinaryUrl, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json',
                },
            });

            const data = await response.json();

            if (!response.ok) {
                console.error('❌ Error de Cloudinary:', data);
                throw new Error(data.error?.message || 'Error subiendo video');
            }

            console.log('✅ Video subido a Cloudinary:', data.secure_url);

            return data.secure_url;
        } catch (error) {
            console.error('❌ Error uploading video:', error);
            throw error;
        }
    },

    /**
     * Subir thumbnail a storage
     */
    uploadThumbnail: async (uri, restaurantId) => {
        try {
            const fileName = `thumb_${restaurantId}_${Date.now()}`;

            const formData = new FormData();
            formData.append('file', {
                uri: uri,
                type: 'image/jpeg',
                name: `${fileName}.jpg`,
            });
            formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
            formData.append('folder', `thumbnails/${restaurantId}`);

            const cloudinaryUrl = `${CLOUDINARY_CONFIG.apiUrl}/image/upload`;

            const response = await fetch(cloudinaryUrl, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json',
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error?.message || 'Error subiendo thumbnail');
            }

            return data.secure_url;
        } catch (error) {
            console.error('Error uploading thumbnail:', error);
            throw error;
        }
    },
};
