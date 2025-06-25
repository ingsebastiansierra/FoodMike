const express = require('express');
const router = express.Router();
const { populateDatabase } = require('../../scripts/populateDatabase');
const authenticate = require('../middleware/auth');
const allowRoles = require('../middleware/roles');

// POST /api/admin/populate-database - Poblar base de datos (solo admin)
router.post('/populate-database', authenticate, allowRoles('admin'), async (req, res) => {
  try {
    console.log('🚀 Iniciando población de base de datos desde API...');
    
    await populateDatabase();
    
    res.json({
      success: true,
      message: 'Base de datos poblada exitosamente',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Error poblando base de datos:', error);
    res.status(500).json({
      success: false,
      message: 'Error poblando base de datos',
      error: error.message
    });
  }
});

// GET /api/admin/health - Health check detallado
router.get('/health', async (req, res) => {
  try {
    const { db } = require('../config/firebase');
    
    // Verificar conexión a Firestore
    const testDoc = await db.collection('test').doc('health').get();
    
    res.json({
      success: true,
      message: 'API y base de datos funcionando correctamente',
      firebase: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Error en health check:', error);
    res.status(500).json({
      success: false,
      message: 'Error en health check',
      error: error.message
    });
  }
});

module.exports = router; 