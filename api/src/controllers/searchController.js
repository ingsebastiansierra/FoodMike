const { searchProducts, PRODUCTS_DATA } = require('../data/mockData');
const { db } = require('../config/firebase');

const MAIN_CATEGORIES = [
  'hamburguesa', 'pizza', 'plato', 'sushi', 'mexicana', 'pollo', 'ensalada', 'postre',
  'combo', 'taco', 'parrilla', 'arepa'
];

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
const advancedSearch = async (req, res) => {
  try {
    const { q = '', category, minPrice, maxPrice, minStars, limit = 100 } = req.query;
    let searchTerm = q.toLowerCase();

    // Obtener todos los lugares
    const placesSnapshot = await db.collection('places').get();
    let allProducts = [];
    for (const placeDoc of placesSnapshot.docs) {
      const productsSnapshot = await db.collection('places').doc(placeDoc.id).collection('products').get();
      const products = productsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        placeId: placeDoc.id,
        place: { id: placeDoc.id, ...placeDoc.data() }
      }));
      allProducts = allProducts.concat(products);
    }

    // Filtros
    let results = allProducts;
    // Si no se especifica categoría, solo mostrar productos principales
    if (!category || category === 'all') {
      results = results.filter(p => MAIN_CATEGORIES.includes((p.category || '').toLowerCase()));
    } else {
      results = results.filter(p => (p.category || '').toLowerCase() === category.toLowerCase());
    }
    if (minPrice) {
      results = results.filter(p => p.price >= Number(minPrice));
    }
    if (maxPrice) {
      results = results.filter(p => p.price <= Number(maxPrice));
    }
    if (minStars) {
      results = results.filter(p => (p.stars || 0) >= Number(minStars));
    }
    // Búsqueda por texto
    if (searchTerm) {
      results = results.filter(p =>
        (p.name || '').toLowerCase().includes(searchTerm) ||
        (p.description || '').toLowerCase().includes(searchTerm) ||
        (p.category || '').toLowerCase().includes(searchTerm) ||
        (p.tags || []).some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }

    // Si no hay búsqueda específica, crear variedad de categorías
    if (!searchTerm && (!category || category === 'all')) {
      // Agrupar productos por categoría
      const productsByCategory = {};
      results.forEach(product => {
        const cat = (product.category || '').toLowerCase();
        if (!productsByCategory[cat]) {
          productsByCategory[cat] = [];
        }
        productsByCategory[cat].push(product);
      });

      // Ordenar productos dentro de cada categoría
      Object.keys(productsByCategory).forEach(cat => {
        productsByCategory[cat].sort((a, b) => {
          const scoreA = (a.stars || 0) * 0.7 + ((100 - (a.price || 0)) * 0.3);
          const scoreB = (b.stars || 0) * 0.7 + ((100 - (b.price || 0)) * 0.3);
          return scoreB - scoreA;
        });
      });

      // Crear resultado con variedad: tomar los mejores de cada categoría
      const variedResults = [];
      const maxPerCategory = Math.ceil(parseInt(limit) / MAIN_CATEGORIES.length);
      
      MAIN_CATEGORIES.forEach(cat => {
        const categoryProducts = productsByCategory[cat] || [];
        const productsToAdd = categoryProducts.slice(0, maxPerCategory);
        variedResults.push(...productsToAdd);
      });

      // Si no llenamos el límite, agregar más productos de las categorías con más productos
      if (variedResults.length < parseInt(limit)) {
        const remainingSlots = parseInt(limit) - variedResults.length;
        const allSortedProducts = results.sort((a, b) => {
          const scoreA = (a.stars || 0) * 0.7 + ((100 - (a.price || 0)) * 0.3);
          const scoreB = (b.stars || 0) * 0.7 + ((100 - (b.price || 0)) * 0.3);
          return scoreB - scoreA;
        });
        
        // Agregar productos que no estén ya en variedResults
        const existingIds = new Set(variedResults.map(p => p.id));
        const additionalProducts = allSortedProducts
          .filter(p => !existingIds.has(p.id))
          .slice(0, remainingSlots);
        
        variedResults.push(...additionalProducts);
      }

      results = variedResults;
    } else {
      // Ordenar por score de calidad (estrellas * 0.7 + precio * 0.3)
      results.sort((a, b) => {
        const scoreA = (a.stars || 0) * 0.7 + ((100 - (a.price || 0)) * 0.3);
        const scoreB = (b.stars || 0) * 0.7 + ((100 - (b.price || 0)) * 0.3);
        return scoreB - scoreA;
      });
      // Limitar resultados
      results = results.slice(0, parseInt(limit));
    }

    console.log(`🔍 Búsqueda: "${searchTerm}", Categoría: "${category}", Resultados: ${results.length}`);
    console.log(`📊 Categorías encontradas:`, [...new Set(results.map(p => p.category))]);

    res.status(200).json({
      success: true,
      data: results,
      count: results.length
    });
  } catch (error) {
    console.error('❌ Error en búsqueda avanzada:', error);
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

    // Obtener todos los lugares
    const placesSnapshot = await db.collection('places').get();
    let allProducts = [];
    for (const placeDoc of placesSnapshot.docs) {
      const productsSnapshot = await db.collection('places').doc(placeDoc.id).collection('products').get();
      const products = productsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        placeId: placeDoc.id,
        place: { id: placeDoc.id, ...placeDoc.data() }
      }));
      allProducts = allProducts.concat(products);
    }

    // Filtrar solo productos de categorías principales
    let results = allProducts.filter(p => MAIN_CATEGORIES.includes((p.category || '').toLowerCase()));
    console.log(`📊 Total productos: ${allProducts.length}, Productos principales: ${results.length}`);

    // Ordenar por estrellas y precio (puedes ajustar el score)
    results.sort((a, b) => {
      const scoreA = (a.stars || 0) * 0.7 + ((100 - (a.price || 0)) * 0.3);
      const scoreB = (b.stars || 0) * 0.7 + ((100 - (b.price || 0)) * 0.3);
      return scoreB - scoreA;
    });

    // Limitar resultados
    results = results.slice(0, parseInt(limit));

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
  advancedSearch,
  getFeaturedProducts,
  getCategories
}; 