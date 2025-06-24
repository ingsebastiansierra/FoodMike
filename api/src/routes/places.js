const express = require('express');
const router = express.Router();
const {
  getAllRestaurants,
  getRestaurantById,
  getRestaurantsByCategory,
  getOpenRestaurants,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant
} = require('../controllers/restaurantsController');
const authenticate = require('../middleware/auth');
const allowRoles = require('../middleware/roles');

// GET /api/places - Obtener todos los lugares (sin autenticación temporalmente)
router.get('/', getAllRestaurants);

// GET /api/places/open - Obtener lugares abiertos (sin autenticación temporalmente)
router.get('/open', getOpenRestaurants);

// GET /api/places/category/:category - Obtener lugares por categoría (sin autenticación temporalmente)
router.get('/category/:category', getRestaurantsByCategory);

// GET /api/places/:id - Obtener lugar por ID (sin autenticación temporalmente)
router.get('/:id', getRestaurantById);

// POST /api/places - Crear nuevo lugar (solo admin)
router.post('/', authenticate, allowRoles('admin'), createRestaurant);

// PUT /api/places/:id - Actualizar lugar (solo admin)
router.put('/:id', authenticate, allowRoles('admin'), updateRestaurant);

// DELETE /api/places/:id - Eliminar lugar (solo admin)
router.delete('/:id', authenticate, allowRoles('admin'), deleteRestaurant);

module.exports = router; 