const express = require('express');
const router = express.Router();
const { populateDatabase } = require('../scripts/populateDatabase');
const authenticate = require('../middleware/auth');
const allowRoles = require('../middleware/roles');

// Endpoint de salud
router.get('/health', async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'API y base de datos funcionando correctamente',
      firebase: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

// Endpoint público para poblar base de datos en producción
router.post('/populate-production', async (req, res) => {
  try {
    console.log('🚀 Iniciando población de base de datos en producción...');
    
    // Verificar que estamos en producción
    if (process.env.NODE_ENV !== 'production') {
      return res.status(403).json({
        success: false,
        error: 'Este endpoint solo está disponible en producción'
      });
    }
    
    // Poblar la base de datos
    await populateDatabase();
    
    console.log('🎉 Base de datos poblada exitosamente en producción!');
    
    res.json({
      success: true,
      message: 'Base de datos poblada exitosamente',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Error poblando base de datos:', error);
    res.status(500).json({
      success: false,
      error: 'Error poblando base de datos',
      details: error.message
    });
  }
});

// Endpoint protegido para poblar base de datos (requiere autenticación)
router.post('/populate-database', async (req, res) => {
  try {
    console.log('🚀 Iniciando población de base de datos...');
    
    // Poblar la base de datos
    await populateDatabase();
    
    console.log('🎉 Base de datos poblada exitosamente!');
    
    res.json({
      success: true,
      message: 'Base de datos poblada exitosamente',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Error poblando base de datos:', error);
    res.status(500).json({
      success: false,
      error: 'Error poblando base de datos',
      details: error.message
    });
  }
});

module.exports = router; 