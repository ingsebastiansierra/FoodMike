const express = require('express');
const router = express.Router();
const {
  searchProductsBasic,
  advancedSearch,
  getFeaturedProducts,
  getCategories
} = require('../controllers/searchController');

// GET /api/search - Búsqueda básica de productos (sin autenticación temporalmente)
router.get('/', searchProductsBasic);

// GET /api/search/advanced - Búsqueda avanzada con información de restaurantes (sin autenticación temporalmente)
router.get('/advanced', advancedSearch);

// GET /api/search/featured - Obtener productos destacados (sin autenticación temporalmente)
router.get('/featured', getFeaturedProducts);

// GET /api/search/categories - Obtener categorías disponibles (sin autenticación temporalmente)
router.get('/categories', getCategories);

module.exports = router; 