import * as Location from 'expo-location';

const locationService = {
  // Solicitar permisos de ubicación
  requestLocationPermission: async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error solicitando permisos de ubicación:', error);
      return false;
    }
  },

  // Obtener ubicación actual
  getCurrentLocation: async () => {
    try {
      const hasPermission = await locationService.requestLocationPermission();
      if (!hasPermission) {
        throw new Error('Permisos de ubicación denegados');
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        timeout: 15000,
        maximumAge: 10000,
      });

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy,
      };
    } catch (error) {
      console.error('Error obteniendo ubicación:', error);
      throw error;
    }
  },

  // Convertir coordenadas a dirección (geocoding reverso)
  reverseGeocode: async (latitude, longitude) => {
    try {
      const addresses = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (addresses && addresses.length > 0) {
        const address = addresses[0];
        return {
          formattedAddress: locationService.formatAddress(address),
          street: address.street || '',
          streetNumber: address.streetNumber || '',
          district: address.district || address.subregion || '',
          city: address.city || '',
          region: address.region || '',
          country: address.country || '',
          postalCode: address.postalCode || '',
          name: address.name || '',
        };
      }

      return null;
    } catch (error) {
      console.error('Error en geocoding reverso:', error);
      throw error;
    }
  },

  // Formatear dirección para mostrar
  formatAddress: (address) => {
    const parts = [];
    
    if (address.street) {
      let streetPart = address.street;
      if (address.streetNumber) {
        streetPart += ` ${address.streetNumber}`;
      }
      parts.push(streetPart);
    }
    
    if (address.district) {
      parts.push(address.district);
    }
    
    if (address.city) {
      parts.push(address.city);
    }
    
    if (address.region && address.region !== address.city) {
      parts.push(address.region);
    }

    return parts.join(', ') || 'Dirección no disponible';
  },

  // Obtener ubicación completa (coordenadas + dirección)
  getCompleteLocation: async () => {
    try {
      const coordinates = await locationService.getCurrentLocation();
      const addressInfo = await locationService.reverseGeocode(
        coordinates.latitude,
        coordinates.longitude
      );

      return {
        coordinates,
        address: addressInfo,
      };
    } catch (error) {
      console.error('Error obteniendo ubicación completa:', error);
      throw error;
    }
  },

  // Calcular distancia entre dos puntos (en km)
  calculateDistance: (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radio de la Tierra en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return Math.round(distance * 100) / 100; // Redondear a 2 decimales
  },

  // Verificar si la ubicación está dentro del área de servicio
  isWithinServiceArea: (latitude, longitude, serviceCenter, maxDistanceKm = 10) => {
    const distance = locationService.calculateDistance(
      latitude,
      longitude,
      serviceCenter.latitude,
      serviceCenter.longitude
    );
    return distance <= maxDistanceKm;
  },
};

export default locationService;