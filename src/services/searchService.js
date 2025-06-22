import api from '../config/api';

export const searchService = {
  // Búsqueda básica de productos
  searchProducts: async (query, filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      if (query) params.append('q', query);
      if (filters.category) params.append('category', filters.category);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.minStars) params.append('minStars', filters.minStars);
      if (filters.limit) params.append('limit', filters.limit);

      const response = await api.get(`/search?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Error en la búsqueda');
    }
  },

  // Búsqueda avanzada con información de restaurantes
  advancedSearch: async (query, filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      if (query) params.append('q', query);
      if (filters.category) params.append('category', filters.category);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.minStars) params.append('minStars', filters.minStars);
      if (filters.limit) params.append('limit', filters.limit);

      const response = await api.get(`/search/advanced?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Error en la búsqueda avanzada');
    }
  },

  // Obtener productos destacados
  getFeaturedProducts: async (limit = 12) => {
    try {
      const response = await api.get(`/search/featured?limit=${limit}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Error al obtener productos destacados');
    }
  },

  // Obtener categorías disponibles
  getCategories: async () => {
    try {
      const response = await api.get('/search/categories');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Error al obtener categorías');
    }
  }
}; 