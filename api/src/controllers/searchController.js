const { searchProducts, PRODUCTS_DATA } = require('../data/mockData');

// Búsqueda básica de productos
const searchProductsBasic = async (req, res) => {
  try {
    const { q, category, minPrice, maxPrice, minStars, limit } = req.query;
    console.log(`🔍 Basic search with query: ${q}`);
    
    const filters = {
      category: category || 'all',
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      minStars: minStars ? parseFloat(minStars) : undefined,
      limit: limit ? parseInt(limit) : undefined
    };
    
    const results = searchProducts(q, filters);
    
    res.status(200).json({
      success: true,
      data: results,
      count: results.length,
      query: q,
      filters
    });
  } catch (error) {
    console.error('❌ Error in basic search:', error);
    res.status(500).json({
      success: false,
      error: 'Error en la búsqueda'
    });
  }
};

// Búsqueda avanzada con información de restaurantes
const searchProductsAdvanced = async (req, res) => {
  try {
    const { q, category, minPrice, maxPrice, minStars, limit } = req.query;
    console.log(`🔍 Advanced search with query: ${q}`);
    
    const filters = {
      category: category || 'all',
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      minStars: minStars ? parseFloat(minStars) : undefined,
      limit: limit ? parseInt(limit) : undefined
    };
    
    const results = searchProducts(q, filters);
    
    res.status(200).json({
      success: true,
      data: results,
      count: results.length,
      query: q,
      filters
    });
  } catch (error) {
    console.error('❌ Error in advanced search:', error);
    res.status(500).json({
      success: false,
      error: 'Error en la búsqueda avanzada'
    });
  }
};

// Obtener productos destacados
const getFeaturedProducts = async (req, res) => {
  try {
    const { limit = 12 } = req.query;
    console.log(`⭐ Getting featured products (limit: ${limit})`);
    
    // Obtener productos destacados ordenados por calidad y precio
    const results = searchProducts('', { limit: parseInt(limit) });
    
    res.status(200).json({
      success: true,
      data: results,
      count: results.length
    });
  } catch (error) {
    console.error('❌ Error getting featured products:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener productos destacados'
    });
  }
};

// Obtener categorías disponibles
const getCategories = async (req, res) => {
  try {
    console.log('📂 Getting available categories');
    
    // Obtener categorías únicas de productos
    const categories = [...new Set(PRODUCTS_DATA.map(p => p.category))];
    
    res.status(200).json({
      success: true,
      data: categories,
      count: categories.length
    });
  } catch (error) {
    console.error('❌ Error getting categories:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener categorías'
    });
  }
};

module.exports = {
  searchProductsBasic,
  searchProductsAdvanced,
  getFeaturedProducts,
  getCategories
}; 