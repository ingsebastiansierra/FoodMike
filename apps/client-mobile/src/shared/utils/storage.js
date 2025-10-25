import AsyncStorage from '@react-native-async-storage/async-storage';

// Utilidades de almacenamiento
export const storageUtils = {
  async getItem(key) {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Error getting item from storage:', error);
      return null;
    }
  },

  async setItem(key, value) {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Error setting item in storage:', error);
      return false;
    }
  },

  async removeItem(key) {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing item from storage:', error);
      return false;
    }
  },

  async clear() {
    try {
      await AsyncStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing storage:', error);
      return false;
    }
  },
};
