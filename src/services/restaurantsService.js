import api from '../config/api';

export const restaurantsService = {
  // Obtener todos los restaurantes
  getAll: async () => {
    try {
      const response = await api.get('/restaurants');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener restaurantes');
    }
  },

  // Obtener restaurante por ID
  getById: async (id) => {
    try {
      const response = await api.get(`/restaurants/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener restaurante');
    }
  },

  // Obtener menú completo de un restaurante
  getMenu: async (id) => {
    try {
      const response = await api.get(`/restaurants/${id}/menu`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener menú del restaurante');
    }
  },

  // Obtener restaurantes por categoría
  getByCategory: async (category) => {
    try {
      const response = await api.get(`/restaurants/category/${category}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener restaurantes por categoría');
    }
  },

  // Obtener restaurantes abiertos
  getOpen: async () => {
    try {
      const response = await api.get('/restaurants/open');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener restaurantes abiertos');
    }
  },

  // Crear restaurante
  create: async (restaurantData) => {
    try {
      const response = await api.post('/restaurants', restaurantData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al crear restaurante');
    }
  },

  // Actualizar restaurante
  update: async (id, restaurantData) => {
    try {
      const response = await api.put(`/restaurants/${id}`, restaurantData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al actualizar restaurante');
    }
  },

  // Eliminar restaurante
  delete: async (id) => {
    try {
      const response = await api.delete(`/restaurants/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al eliminar restaurante');
    }
  }
}; 