const { db } = require('../config/firebase');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Addition = require('../models/Addition');

// Obtener todos los restaurantes
const getAllRestaurants = async (req, res) => {
  try {
    const snapshot = await db.collection('restaurants').get();
    
    const restaurants = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    res.json({
      success: true,
      data: restaurants,
      count: restaurants.length
    });
  } catch (error) {
    console.error('Error obteniendo restaurantes:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

// Obtener restaurante por ID
const getRestaurantById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const doc = await db.collection('restaurants').doc(id).get();
    
    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        error: 'Restaurante no encontrado'
      });
    }
    
    const restaurant = {
      id: doc.id,
      ...doc.data()
    };
    
    res.json({
      success: true,
      data: restaurant
    });
  } catch (error) {
    console.error('Error obteniendo restaurante:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

// Obtener restaurantes abiertos
const getOpenRestaurants = async (req, res) => {
  try {
    const snapshot = await db.collection('restaurants')
      .where('isOpen', '==', true)
      .get();
    
    const restaurants = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    res.json({
      success: true,
      data: restaurants,
      count: restaurants.length,
      message: 'Restaurantes abiertos obtenidos exitosamente'
    });
  } catch (error) {
    console.error('Error obteniendo restaurantes abiertos:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

// Obtener restaurantes por categoría
const getRestaurantsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    
    const snapshot = await db.collection('restaurants')
      .where('categories', 'array-contains', category)
      .get();
    
    const restaurants = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    res.json({
      success: true,
      data: restaurants,
      count: restaurants.length
    });
  } catch (error) {
    console.error('Error obteniendo restaurantes por categoría:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

// Obtener menú completo de un restaurante
const getRestaurantMenu = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar que el restaurante existe
    const restaurantDoc = await db.collection('restaurants').doc(id).get();
    
    if (!restaurantDoc.exists) {
      return res.status(404).json({
        success: false,
        error: 'Restaurante no encontrado'
      });
    }
    
    const restaurant = {
      id: restaurantDoc.id,
      ...restaurantDoc.data()
    };
    
    // Obtener productos del restaurante
    const productsSnapshot = await db.collection('products')
      .where('restaurantId', '==', id)
      .get();
    
    const products = productsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Agrupar productos por categoría
    const productsByCategory = {};
    products.forEach(product => {
      const category = product.category || 'Sin categoría';
      if (!productsByCategory[category]) {
        productsByCategory[category] = [];
      }
      productsByCategory[category].push(product);
    });
    
    res.json({
      success: true,
      data: {
        restaurant,
        menu: productsByCategory,
        categories: Object.keys(productsByCategory),
        totalProducts: products.length
      }
    });
  } catch (error) {
    console.error('Error obteniendo menú del restaurante:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

// Crear nuevo restaurante
const createRestaurant = async (req, res) => {
  try {
    const restaurantData = req.body;
    
    const restaurantRef = db.collection('restaurants').doc();
    const restaurant = {
      id: restaurantRef.id,
      ...restaurantData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await restaurantRef.set(restaurant);
    
    res.status(201).json({
      success: true,
      data: restaurant,
      message: 'Restaurante creado exitosamente'
    });
  } catch (error) {
    console.error('Error creando restaurante:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

// Actualizar restaurante
const updateRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const restaurantRef = db.collection('restaurants').doc(id);
    const doc = await restaurantRef.get();
    
    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        error: 'Restaurante no encontrado'
      });
    }
    
    await restaurantRef.update({
      ...updateData,
      updatedAt: new Date()
    });
    
    res.json({
      success: true,
      message: 'Restaurante actualizado exitosamente'
    });
  } catch (error) {
    console.error('Error actualizando restaurante:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

// Eliminar restaurante
const deleteRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    
    const restaurantRef = db.collection('restaurants').doc(id);
    const doc = await restaurantRef.get();
    
    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        error: 'Restaurante no encontrado'
      });
    }
    
    // Eliminar productos asociados
    const productsSnapshot = await db.collection('products')
      .where('restaurantId', '==', id)
      .get();
    
    const batch = db.batch();
    productsSnapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    // Eliminar restaurante
    batch.delete(restaurantRef);
    await batch.commit();
    
    res.json({
      success: true,
      message: 'Restaurante eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error eliminando restaurante:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

module.exports = {
  getAllRestaurants,
  getRestaurantById,
  getOpenRestaurants,
  getRestaurantsByCategory,
  getRestaurantMenu,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant
}; 