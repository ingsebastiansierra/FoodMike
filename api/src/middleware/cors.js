const cors = require('cors');

const corsOptions = {
  origin: function (origin, callback) {
    // Permitir requests sin origin (como apps móviles)
    if (!origin) return callback(null, true);
    
    // Lista de orígenes permitidos
    const allowedOrigins = [
      // Desarrollo local
      'http://localhost:3000',
      'http://192.168.1.6:3000',
      'http://192.168.1.6:8081', // Expo dev server
      'exp://192.168.1.6:8081',  // Expo
      'http://localhost:8081',   // Expo local
      'exp://localhost:8081',    // Expo local
      
      // Producción - Expo Go y builds de producción
      'exp://exp.host',
      'exp://u.expo.dev',
      'https://expo.dev',
      'https://expo.io',
      
      // Producción - App builds
      'foodmike://',  // Deep link de la app
      'com.sebasing.foodmike://', // Package name
      
      // Web (si tienes versión web)
      'https://foodmike.web.app',
      'https://foodmike.firebaseapp.com'
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('⚠️ CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

module.exports = cors(corsOptions); 