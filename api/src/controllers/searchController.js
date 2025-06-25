const { db } = require('../config/firebase');

// Obtener todos los productos (sin filtros)
const getAllProducts = async (req, res) => {
  try {
    const { limit = 1000 } = req.query; // Límite alto por defecto
    
    const snapshot = await db.collection('products')
      .limit(parseInt(limit))
      .get();

    const products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json({
      success: true,
      data: products,
      count: products.length
    });
  } catch (error) {
    console.error('Error obteniendo todos los productos:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

// Obtener productos destacados
const getFeaturedProducts = async (req, res) => {
  try {
    const { limit = 12 } = req.query;
    
    const snapshot = await db.collection('products')
      .where('isFeatured', '==', true)
      .limit(parseInt(limit))
      .get();

    const products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json({
      success: true,
      data: products,
      count: products.length
    });
  } catch (error) {
    console.error('Error obteniendo productos destacados:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

// Búsqueda básica de productos
const searchProducts = async (req, res) => {
  try {
    const { q, category, minPrice, maxPrice, minStars, limit = 20 } = req.query;
    
    let query = db.collection('products');
    
    // Aplicar filtros
    if (category && category !== 'all') {
      query = query.where('category', '==', category);
    }
    
    if (minPrice) {
      query = query.where('price', '>=', parseInt(minPrice));
    }
    
    if (maxPrice) {
      query = query.where('price', '<=', parseInt(maxPrice));
    }
    
    if (minStars) {
      query = query.where('stars', '>=', parseFloat(minStars));
    }
    
    query = query.limit(parseInt(limit));
    
    const snapshot = await query.get();
    let products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Filtrar por término de búsqueda si se proporciona
    if (q) {
      const searchTerm = q.toLowerCase();
      products = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
      );
    }
    
    res.json({
      success: true,
      data: products,
      count: products.length
    });
  } catch (error) {
    console.error('Error en búsqueda de productos:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

// Búsqueda avanzada con información de restaurantes
const advancedSearch = async (req, res) => {
  try {
    const { q, category, minPrice, maxPrice, minStars, limit = 20 } = req.query;
    
    let query = db.collection('products');
    
    // Aplicar filtros
    if (category && category !== 'all') {
      query = query.where('category', '==', category);
    }
    
    if (minPrice) {
      query = query.where('price', '>=', parseInt(minPrice));
    }
    
    if (maxPrice) {
      query = query.where('price', '<=', parseInt(maxPrice));
    }
    
    if (minStars) {
      query = query.where('stars', '>=', parseFloat(minStars));
    }
    
    query = query.limit(parseInt(limit));
    
    const snapshot = await query.get();
    let products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Filtrar por término de búsqueda si se proporciona
    if (q) {
      const searchTerm = q.toLowerCase();
      products = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm) ||
        (product.restaurant && product.restaurant.name.toLowerCase().includes(searchTerm))
      );
    }
    
    res.json({
      success: true,
      data: products,
      count: products.length
    });
  } catch (error) {
    console.error('Error en búsqueda avanzada:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

// Obtener categorías disponibles
const getCategories = async (req, res) => {
  try {
    const snapshot = await db.collection('categories').get();
    
    const categories = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    res.json({
      success: true,
      data: categories,
      count: categories.length
    });
  } catch (error) {
    console.error('Error obteniendo categorías:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

module.exports = {
  getAllProducts,
  getFeaturedProducts,
  searchProducts,
  advancedSearch,
  getCategories
}; 