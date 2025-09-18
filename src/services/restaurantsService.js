import { supabase, handleError } from '../config/supabase';

// Implementación usando Supabase
const restaurantsService = {
  // Obtener todos los restaurantes
  getAll: async () => {
    try {
      const { data, error } = await supabase
        .from('restaurants')
        .select('*');
      
      if (error) throw error;
      return { data };
    } catch (error) {
      handleError(error, 'getAll restaurants');
    }
  },

  // Obtener restaurante por ID
  getById: async (id) => {
    try {
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return { data };
    } catch (error) {
      handleError(error, `getById restaurant ${id}`);
    }
  },

  // Obtener menú completo de un restaurante
  getMenu: async (id) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('restaurantid', id); // ojo: aquí uso restaurantid en minúscula
       
      if (error) throw error;
      return { data };
    } catch (error) {
      handleError(error, `getMenu restaurant ${id}`);
    }
  },

  // Obtener restaurantes por categoría
  getByCategory: async (category) => {
    try {
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .eq('category', category);
      
      if (error) throw error;
      return { data };
    } catch (error) {
      handleError(error, `getByCategory restaurants ${category}`);
    }
  },

  // Obtener restaurantes abiertos
  getOpen: async () => {
    try {
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .eq('isopen', true);
      
      if (error) throw error;
      return { data };
    } catch (error) {
      handleError(error, 'getOpen restaurants');
    }
  },

  // Crear restaurante
  create: async (restaurantData) => {
    try {
      const { data, error } = await supabase
        .from('restaurants')
        .insert(restaurantData)
        .select();
      
      if (error) throw error;
      return { data };
    } catch (error) {
      handleError(error, 'create restaurant');
    }
  },

  // Actualizar restaurante
  update: async (id, restaurantData) => {
    try {
      const { data, error } = await supabase
        .from('restaurants')
        .update(restaurantData)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return { data };
    } catch (error) {
      handleError(error, `update restaurant ${id}`);
    }
  },

  // Eliminar restaurante
  delete: async (id) => {
    try {
      const { error } = await supabase
        .from('restaurants')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return { success: true };
    } catch (error) {
      handleError(error, `delete restaurant ${id}`);
    }
  }
};
// Exportamos con un nombre corto y claro

export default restaurantsService;