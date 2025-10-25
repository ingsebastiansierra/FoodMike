import { supabase, handleError } from '../config/supabase';

// Implementación usando Supabase
const productsService = {
  // Obtener productos de un lugar
  getByPlace: async (placeId) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('restaurantid', placeId);
      
      if (error) throw error;
      return { data };
    } catch (error) {
      handleError(error, `getByPlace products ${placeId}`);
    }
  },

  // Obtener producto por ID
  getById: async (id) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return { data };
    } catch (error) {
      handleError(error, `getById product ${id}`);
    }
  },

  // Obtener productos por restaurante
  getByRestaurant: async (restaurantId) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('restaurantid', restaurantId);
      
      if (error) throw error;
      return { data };
    } catch (error) {
      handleError(error, `getByRestaurant products ${restaurantId}`);
    }
  },

  // Obtener productos por categoría
  getByCategory: async (category) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', category);
      
      if (error) throw error;
      return { data };
    } catch (error) {
      handleError(error, `getByCategory products ${category}`);
    }
  },

  // Obtener productos populares
  getPopular: async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('reviews', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return { data };
    } catch (error) {
      handleError(error, 'getPopular products');
    }
  },

  // Crear producto
  create: async (productData) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert(productData)
        .select();
      
      if (error) throw error;
      return { data };
    } catch (error) {
      handleError(error, 'create product');
    }
  },

  // Actualizar producto
  update: async (id, productData) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return { data };
    } catch (error) {
      handleError(error, `update product ${id}`);
    }
  },

  // Eliminar producto
  delete: async (id) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return { success: true };
    } catch (error) {
      handleError(error, `delete product ${id}`);
    }
  }
};

// Exportamos el servicio para que los componentes lo usen
export const products = productsService;