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

// GET /api/restaurants - Obtener todos los restaurantes
router.get('/', getAllRestaurants);

// GET /api/restaurants/open - Obtener restaurantes abiertos
router.get('/open', getOpenRestaurants);

// GET /api/restaurants/category/:category - Obtener restaurantes por categoría
router.get('/category/:category', getRestaurantsByCategory);

// GET /api/restaurants/:id - Obtener restaurante por ID
router.get('/:id', getRestaurantById);

// POST /api/restaurants - Crear nuevo restaurante
router.post('/', createRestaurant);

// PUT /api/restaurants/:id - Actualizar restaurante
router.put('/:id', updateRestaurant);

// DELETE /api/restaurants/:id - Eliminar restaurante
router.delete('/:id', deleteRestaurant);

module.exports = router; 