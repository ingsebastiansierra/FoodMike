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

// GET /api/products - Obtener todos los productos
router.get('/', getAllProducts);

// GET /api/products/popular - Obtener productos populares
router.get('/popular', getPopularProducts);

// GET /api/products/category/:category - Obtener productos por categoría
router.get('/category/:category', getProductsByCategory);

// GET /api/products/restaurant/:restaurantId - Obtener productos por restaurante
router.get('/restaurant/:restaurantId', getProductsByRestaurant);

// GET /api/products/:id - Obtener producto por ID
router.get('/:id', getProductById);

// POST /api/products - Crear nuevo producto
router.post('/', createProduct);

// PUT /api/products/:id - Actualizar producto
router.put('/:id', updateProduct);

// DELETE /api/products/:id - Eliminar producto
router.delete('/:id', deleteProduct);

module.exports = router; 