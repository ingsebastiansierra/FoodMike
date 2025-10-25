import { supabase } from '../config/supabase';

/**
 * Servicio para gestionar los menús del día
 */
export const dailyMenuService = {
    /**
     * Obtener menús del día de un restaurante
     */
    getDailyMenus: async (restaurantId) => {
        try {
            const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
            const currentTime = new Date().toTimeString().slice(0, 8);

            const { data, error } = await supabase
                .from('daily_menus')
                .select('*')
                .eq('restaurant_id', restaurantId)
                .eq('is_active', true)
                .contains('available_days', [today])
                .lte('start_time', currentTime)
                .gte('end_time', currentTime);

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error fetching daily menus:', error);
            return [];
        }
    },

    /**
     * Obtener todos los menús del día de un restaurante (sin filtro de horario)
     */
    getAllDailyMenus: async (restaurantId) => {
        try {
            const { data, error } = await supabase
                .from('daily_menus')
                .select('*')
                .eq('restaurant_id', restaurantId)
                .eq('is_active', true)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error fetching all daily menus:', error);
            return [];
        }
    },

    /**
     * Crear un nuevo menú del día
     */
    createDailyMenu: async (menuData) => {
        try {
            const { data, error } = await supabase
                .from('daily_menus')
                .insert([menuData])
                .select()
                .single();

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Error creating daily menu:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Actualizar un menú del día
     */
    updateDailyMenu: async (menuId, updates) => {
        try {
            const { data, error } = await supabase
                .from('daily_menus')
                .update(updates)
                .eq('id', menuId)
                .select()
                .single();

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Error updating daily menu:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Eliminar un menú del día
     */
    deleteDailyMenu: async (menuId) => {
        try {
            const { error } = await supabase
                .from('daily_menus')
                .delete()
                .eq('id', menuId);

            if (error) throw error;
            return { success: true };
        } catch (error) {
            console.error('Error deleting daily menu:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Verificar si un menú está disponible ahora
     */
    isMenuAvailable: (menu) => {
        const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
        const currentTime = new Date().toTimeString().slice(0, 8);

        const isDayAvailable = menu.available_days?.includes(today);
        const isTimeAvailable = currentTime >= menu.start_time && currentTime <= menu.end_time;

        return isDayAvailable && isTimeAvailable && menu.is_active;
    },
};
