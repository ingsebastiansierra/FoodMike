import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Forzar siempre la URL de producción
const API_BASE_URL = 'https://foodmike.onrender.com/api';

console.log(`🌍 API Base URL: ${API_BASE_URL}`);

// Crear instancia de axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para requests
api.interceptors.request.use(
  async (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    
    // Agregar token JWT si existe (opcional para endpoints públicos)
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('❌ Error getting token from storage:', error);
    }
    
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Interceptor para responses
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', error.response?.data || error.message);
    
    // Solo limpiar el token si es un error 401 y tenemos un token
    if (error.response?.status === 401) {
      AsyncStorage.getItem('userToken').then(token => {
        if (token) {
          AsyncStorage.removeItem('userToken');
          console.log('🔐 Token inválido, limpiando storage');
        }
      });
    }
    
    return Promise.reject(error);
  }
);

export default api; 