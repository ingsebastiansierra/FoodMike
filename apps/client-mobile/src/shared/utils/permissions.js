// Utilidades de permisos
export const permissionUtils = {
  async requestCameraPermission() {
    try {
      const { Camera } = require('expo-camera');
      const { status } = await Camera.requestCameraPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting camera permission:', error);
      return false;
    }
  },

  async requestLocationPermission() {
    try {
      const { Location } = require('expo-location');
      const { status } = await Location.requestForegroundPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting location permission:', error);
      return false;
    }
  },
};
