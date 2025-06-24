const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  getProductsByRestaurant,
  getProductsByCategory,
  getPopularProducts,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productsController');
const authenticate = require('../middleware/auth');
const allowRoles = require('../middleware/roles');

// GET /api/products - Obtener todos los productos
router.get('/', authenticate, allowRoles('admin', 'user'), getAllProducts);

// GET /api/products/popular - Obtener productos populares
router.get('/popular', authenticate, allowRoles('admin', 'user'), getPopularProducts);

// GET /api/products/category/:category - Obtener productos por categoría
router.get('/category/:category', authenticate, allowRoles('admin', 'user'), getProductsByCategory);

// GET /api/products/restaurant/:restaurantId - Obtener productos por restaurante
router.get('/restaurant/:restaurantId', authenticate, allowRoles('admin', 'user'), getProductsByRestaurant);

// GET /api/products/:id - Obtener producto por ID
router.get('/:id', authenticate, allowRoles('admin', 'user'), getProductById);

// POST /api/products - Crear nuevo producto (solo admin)
router.post('/', authenticate, allowRoles('admin'), createProduct);

// PUT /api/products/:id - Actualizar producto (solo admin)
router.put('/:id', authenticate, allowRoles('admin'), updateProduct);

// DELETE /api/products/:id - Eliminar producto (solo admin)
router.delete('/:id', authenticate, allowRoles('admin'), deleteProduct);

module.exports = router; 