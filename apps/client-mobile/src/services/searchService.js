import { supabase, handleError } from '../config/supabase';

// Implementación usando Supabase
const searchService = {
  // Obtener todos los productos
  getAllProducts: async (limit = 1000) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .limit(limit);

      if (error) throw error;
      return { data };
    } catch (error) {
      handleError(error, 'getAllProducts');
    }
  },

  // Buscar productos por término y filtros
  searchProducts: async (query, filters = {}) => {
    try {
      let queryBuilder = supabase
        .from('products')
        .select('*');

      // Aplicar filtros
      if (query) {
        queryBuilder = queryBuilder.ilike('name', `%${query}%`);
      }

      if (filters.category) {
        queryBuilder = queryBuilder.eq('category', filters.category);
      }

      if (filters.minPrice) {
        queryBuilder = queryBuilder.gte('price', filters.minPrice);
      }

      if (filters.maxPrice) {
        queryBuilder = queryBuilder.lte('price', filters.maxPrice);
      }

      if (filters.minStars) {
        queryBuilder = queryBuilder.gte('stars', filters.minStars);
      }

      if (filters.limit) {
        queryBuilder = queryBuilder.limit(filters.limit);
      }

      const { data, error } = await queryBuilder;

      if (error) throw error;
      return { data };
    } catch (error) {
      handleError(error, `searchProducts ${query}`);
    }
  },

  // Búsqueda avanzada con información de restaurantes
  advancedSearch: async (query, filters = {}) => {
    try {
      // Primero obtenemos los productos que coinciden con la búsqueda
      let queryBuilder = supabase
        .from('products')
        .select('*, restaurants(*)');

      // Aplicar filtros
      if (query) {
        queryBuilder = queryBuilder.ilike('name', `%${query}%`);
      }

      if (filters.category) {
        queryBuilder = queryBuilder.eq('category', filters.category);
      }

      if (filters.minPrice) {
        queryBuilder = queryBuilder.gte('price', filters.minPrice);
      }

      if (filters.maxPrice) {
        queryBuilder = queryBuilder.lte('price', filters.maxPrice);
      }

      if (filters.minStars) {
        queryBuilder = queryBuilder.gte('stars', filters.minStars);
      }

      if (filters.limit) {
        queryBuilder = queryBuilder.limit(filters.limit);
      }

      const { data, error } = await queryBuilder;

      if (error) throw error;
      return { data };
    } catch (error) {
      handleError(error, `advancedSearch ${query}`);
    }
  },

  // Obtener productos destacados
  getFeaturedProducts: async (limit = 8) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('isfeatured', true)
        .order('reviews', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return { data };
    } catch (error) {
      handleError(error, 'getFeaturedProducts');
    }
  },

  // Obtener categorías disponibles
  getCategories: async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*');

      if (error) throw error;
      return { data };
    } catch (error) {
      handleError(error, 'getCategories');
    }
  },

  // Obtener productos por restaurante
  getByRestaurant: async (restaurantId) => {
    try {
      // Intentar buscar por restaurantid
      let { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('restaurantid', restaurantId);

      // Si no hay resultados, intentar con restaurant_id
      if ((!data || data.length === 0) && !error) {
        const response = await supabase
          .from('products')
          .select('*')
          .eq('restaurant_id', restaurantId);

        data = response.data;
        error = response.error;
      }

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error al obtener productos por restaurante:', error);
      return handleError(error, 'Error al obtener productos por restaurante');
    }
  }
};

// Exportamos el servicio para que los componentes lo usen
export const search = searchService;
// Exportamos también como searchService para mantener compatibilidad
export { searchService };