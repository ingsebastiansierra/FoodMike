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

// GET /api/restaurants - Obtener todos los restaurantes
router.get('/', authenticate, allowRoles('admin', 'user'), getAllRestaurants);

// GET /api/restaurants/open - Obtener restaurantes abiertos
router.get('/open', authenticate, allowRoles('admin', 'user'), getOpenRestaurants);

// GET /api/restaurants/category/:category - Obtener restaurantes por categoría
router.get('/category/:category', authenticate, allowRoles('admin', 'user'), getRestaurantsByCategory);

// GET /api/restaurants/:id - Obtener restaurante por ID
router.get('/:id', authenticate, allowRoles('admin', 'user'), getRestaurantById);

// POST /api/restaurants - Crear nuevo restaurante (solo admin)
router.post('/', authenticate, allowRoles('admin'), createRestaurant);

// PUT /api/restaurants/:id - Actualizar restaurante (solo admin)
router.put('/:id', authenticate, allowRoles('admin'), updateRestaurant);

// DELETE /api/restaurants/:id - Eliminar restaurante (solo admin)
router.delete('/:id', authenticate, allowRoles('admin'), deleteRestaurant);

module.exports = router; 