const express = require('express');
const router = express.Router();
const {
  searchProductsBasic,
  advancedSearch,
  getFeaturedProducts,
  getCategories
} = require('../controllers/searchController');

// GET /api/search - Búsqueda básica de productos
router.get('/', searchProductsBasic);

// GET /api/search/advanced - Búsqueda avanzada con información de restaurantes
router.get('/advanced', advancedSearch);

// GET /api/search/featured - Obtener productos destacados
router.get('/featured', getFeaturedProducts);

// GET /api/search/categories - Obtener categorías disponibles
router.get('/categories', getCategories);

module.exports = router; 