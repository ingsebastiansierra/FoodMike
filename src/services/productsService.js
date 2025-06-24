import api from '../config/api';

export const productsService = {
  // Obtener productos de un lugar
  getByPlace: async (placeId) => {
    try {
      const response = await api.get(`/places/${placeId}/products`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Error al obtener productos del lugar');
    }
  },

  // Obtener producto por ID dentro de un lugar
  getById: async (placeId, productId) => {
    try {
      const response = await api.get(`/places/${placeId}/products/${productId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Error al obtener producto');
    }
  },

  // Obtener productos por restaurante
  getByRestaurant: async (restaurantId) => {
    try {
      const response = await api.get(`/products/restaurant/${restaurantId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Error al obtener productos del restaurante');
    }
  },

  // Obtener productos por categoría
  getByCategory: async (category) => {
    try {
      const response = await api.get(`/products/category/${category}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Error al obtener productos por categoría');
    }
  },

  // Obtener productos populares
  getPopular: async () => {
    try {
      const response = await api.get('/products/popular');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Error al obtener productos populares');
    }
  },

  // Crear producto
  create: async (productData) => {
    try {
      const response = await api.post('/products', productData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Error al crear producto');
    }
  },

  // Actualizar producto
  update: async (id, productData) => {
    try {
      const response = await api.put(`/products/${id}`, productData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Error al actualizar producto');
    }
  },

  // Eliminar producto
  delete: async (id) => {
    try {
      const response = await api.delete(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Error al eliminar producto');
    }
  }
}; 