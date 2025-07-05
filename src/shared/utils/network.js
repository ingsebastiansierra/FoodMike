// Utilidades de red
export const networkUtils = {
  isConnected: async () => {
    try {
      const NetInfo = require('@react-native-community/netinfo');
      const state = await NetInfo.fetch();
      return state.isConnected;
    } catch (error) {
      console.error('Error checking network connection:', error);
      return true; // Asumir conectado por defecto
    }
  },

  getConnectionType: async () => {
    try {
      const NetInfo = require('@react-native-community/netinfo');
      const state = await NetInfo.fetch();
      return state.type;
    } catch (error) {
      console.error('Error getting connection type:', error);
      return 'unknown';
    }
  },
};
