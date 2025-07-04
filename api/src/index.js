require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const compression = require('compression');

// Importar rutas
const restaurantsRoutes = require('./routes/restaurants');
const productsRoutes = require('./routes/products');
const searchRoutes = require('./routes/search');
const placesRoutes = require('./routes/places');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');

// Importar middleware
const corsMiddleware = require('./middleware/cors');
const { apiLimiter, authLimiter } = require('./middleware/rateLimit');

// Importar `db` para el health check
const { db } = require('./config/firebase');

const app = express();
const PORT = process.env.PORT || 3001;

// Configurar trust proxy para rate limiting
app.set('trust proxy', 1);

// Middleware de seguridad y optimización
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));

// Middleware de CORS
app.use(corsMiddleware);

// Rate limiting
app.use(apiLimiter);

// Middleware para parsing JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Ruta de health check simple (para estabilizar el despliegue)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'FoodMike API is running',
    timestamp: new Date().toISOString()
  });
});

// Rutas de la API
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/restaurants', restaurantsRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/places', placesRoutes);
app.use('/api/admin', adminRoutes);

// Middleware para manejo de errores 404
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `The route ${req.originalUrl} does not exist`,
    timestamp: new Date().toISOString()
  });
});

// Middleware para manejo de errores globales
app.use((error, req, res, next) => {
  console.error('Error:', error);
  
  res.status(error.status || 500).json({
    error: error.message || 'Internal server error',
    timestamp: new Date().toISOString(),
    path: req.originalUrl
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 FoodMike API running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app; 