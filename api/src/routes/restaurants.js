const express = require('express');
const router = express.Router();
const {
  getAllRestaurants,
  getRestaurantById,
  getRestaurantsByCategory,
  getOpenRestaurants,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getRestaurantMenu
} = require('../controllers/restaurantsController');
const authenticate = require('../middleware/auth');
const allowRoles = require('../middleware/roles');

// GET /api/restaurants - Obtener todos los restaurantes
router.get('/', authenticate, allowRoles('admin', 'user'), getAllRestaurants);

// GET /api/restaurants/open - Obtener restaurantes abiertos (PÚBLICO)
router.get('/open', getOpenRestaurants);

// GET /api/restaurants/category/:category - Obtener restaurantes por categoría
router.get('/category/:category', authenticate, allowRoles('admin', 'user'), getRestaurantsByCategory);

// GET /api/restaurants/:id - Obtener restaurante por ID con menú completo
router.get('/:id', authenticate, allowRoles('admin', 'user'), getRestaurantById);

// GET /api/restaurants/:id/menu - Obtener menú completo de un restaurante
router.get('/:id/menu', authenticate, allowRoles('admin', 'user'), getRestaurantMenu);

// GET /api/restaurants/:id/products - Obtener productos de un restaurante
router.get('/:id/products', async (req, res) => {
  try {
    const { id } = req.params;
    const snapshot = await require('../config/firebase').db.collection('places').doc(id).collection('products').get();
    const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json({ success: true, data: products, count: products.length });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// POST /api/restaurants - Crear nuevo restaurante (solo admin)
router.post('/', authenticate, allowRoles('admin'), createRestaurant);

// PUT /api/restaurants/:id - Actualizar restaurante (solo admin)
router.put('/:id', authenticate, allowRoles('admin'), updateRestaurant);

// DELETE /api/restaurants/:id - Eliminar restaurante (solo admin)
router.delete('/:id', authenticate, allowRoles('admin'), deleteRestaurant);

module.exports = router; 