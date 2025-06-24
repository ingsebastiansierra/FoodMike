import api from '../config/api';

export const restaurantsService = {
  // Obtener todos los lugares (restaurantes, pizzerías, etc.)
  getAll: async () => {
    try {
      const response = await api.get('/places');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Error al obtener lugares');
    }
  },

  // Obtener lugar por ID
  getById: async (id) => {
    try {
      const response = await api.get(`/places/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Error al obtener lugar');
    }
  },

  // Obtener productos de un lugar
  getProducts: async (placeId) => {
    try {
      const response = await api.get(`/places/${placeId}/products`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Error al obtener productos del lugar');
    }
  },

  // Obtener lugares por categoría
  getByCategory: async (category) => {
    try {
      const response = await api.get(`/places/category/${category}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Error al obtener lugares por categoría');
    }
  },

  // Obtener lugares abiertos
  getOpen: async () => {
    try {
      const response = await api.get('/places/open');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Error al obtener lugares abiertos');
    }
  },

  // Crear lugar
  create: async (placeData) => {
    try {
      const response = await api.post('/places', placeData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Error al crear lugar');
    }
  },

  // Actualizar lugar
  update: async (id, placeData) => {
    try {
      const response = await api.put(`/places/${id}`, placeData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Error al actualizar lugar');
    }
  },

  // Eliminar lugar
  delete: async (id) => {
    try {
      const response = await api.delete(`/places/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Error al eliminar lugar');
    }
  }
}; 