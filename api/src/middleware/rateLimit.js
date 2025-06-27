const rateLimit = require('express-rate-limit');

// Rate limiter para autenticación
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // Máximo 5 intentos por IP
  message: {
    success: false,
    error: 'Demasiados intentos de autenticación. Intenta de nuevo en 15 minutos.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // No contar intentos exitosos
  keyGenerator: (req) => {
    // Usar IP + User-Agent para mejor identificación
    return req.ip + req.get('User-Agent');
  }
});

// Rate limiter para API general
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Máximo 100 requests por IP
  message: {
    success: false,
    error: 'Demasiadas solicitudes. Intenta de nuevo en 15 minutos.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // No aplicar límite a rutas de autenticación (ya tienen su propio límite)
    return req.path.startsWith('/auth/');
  }
});

// Rate limiter para usuarios autenticados
const userLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 1000, // Máximo 1000 requests por usuario autenticado
  message: {
    success: false,
    error: 'Demasiadas solicitudes. Intenta de nuevo en 15 minutos.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Usar UID del usuario autenticado
    return req.user ? req.user.uid : req.ip;
  },
  skip: (req) => {
    // Solo aplicar a usuarios autenticados
    return !req.user;
  }
});

// Rate limiter para administradores (más permisivo)
const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5000, // Máximo 5000 requests por administrador
  message: {
    success: false,
    error: 'Demasiadas solicitudes. Intenta de nuevo en 15 minutos.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.user ? req.user.uid : req.ip;
  },
  skip: (req) => {
    // Solo aplicar a administradores
    return !req.user || req.user.role !== 'administrador';
  }
});

module.exports = {
  authLimiter,
  apiLimiter,
  userLimiter,
  adminLimiter
}; 