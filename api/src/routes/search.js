const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getFeaturedProducts,
  searchProducts,
  advancedSearch,
  getCategories
} = require('../controllers/searchController');

// GET /api/search/all - Obtener todos los productos
router.get('/all', getAllProducts);

// GET /api/search/featured - Obtener productos destacados
router.get('/featured', getFeaturedProducts);

// GET /api/search - Búsqueda básica de productos
router.get('/', searchProducts);

// GET /api/search/advanced - Búsqueda avanzada
router.get('/advanced', advancedSearch);

// GET /api/search/categories - Obtener categorías disponibles
router.get('/categories', getCategories);

module.exports = router; 