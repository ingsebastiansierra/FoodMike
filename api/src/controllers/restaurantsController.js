const { db } = require('../config/firebase');

// Obtener todos los restaurantes
const getAllRestaurants = async (req, res) => {
  try {
    console.log('📋 Getting all restaurants from Firestore');
    
    const snapshot = await db.collection('places').get();
    const restaurants = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    res.status(200).json({
      success: true,
      data: restaurants,
      count: restaurants.length
    });
  } catch (error) {
    console.error('❌ Error getting restaurants:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener restaurantes'
    });
  }
};

// Obtener restaurante por ID
const getRestaurantById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🏪 Getting restaurant by ID: ${id}`);
    
    const doc = await db.collection('places').doc(id).get();
    
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
    
    res.status(200).json({
      success: true,
      data: restaurant
    });
  } catch (error) {
    console.error('❌ Error getting restaurant:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener restaurante'
    });
  }
};

// Obtener restaurantes por categoría
const getRestaurantsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    console.log(`🏪 Getting restaurants by category: ${category}`);
    
    const snapshot = await db.collection('places')
      .where('category', '==', category)
      .get();
    
    const restaurants = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    res.status(200).json({
      success: true,
      data: restaurants,
      count: restaurants.length
    });
  } catch (error) {
    console.error('❌ Error getting restaurants by category:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener restaurantes por categoría'
    });
  }
};

// Obtener restaurantes abiertos
const getOpenRestaurants = async (req, res) => {
  try {
    console.log('🏪 Getting open restaurants from Firestore');
    
    const snapshot = await db.collection('places')
      .where('isOpen', '==', true)
      .get();
    
    const restaurants = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    res.status(200).json({
      success: true,
      data: restaurants,
      count: restaurants.length
    });
  } catch (error) {
    console.error('❌ Error getting open restaurants:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener restaurantes abiertos'
    });
  }
};

// Crear restaurante
const createRestaurant = async (req, res) => {
  try {
    const restaurantData = req.body;
    console.log('🏪 Creating new restaurant:', restaurantData.name);
    
    const newRestaurant = {
      ...restaurantData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const docRef = await db.collection('places').add(newRestaurant);
    
    console.log('✅ Restaurant created successfully with ID:', docRef.id);
    
    res.status(201).json({
      success: true,
      data: {
        id: docRef.id,
        ...newRestaurant
      },
      message: 'Restaurante creado exitosamente'
    });
  } catch (error) {
    console.error('❌ Error creating restaurant:', error);
    res.status(500).json({
      success: false,
      error: 'Error al crear restaurante'
    });
  }
};

// Actualizar restaurante
const updateRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    console.log(`🏪 Updating restaurant: ${id}`);
    
    const updatePayload = {
      ...updateData,
      updatedAt: new Date()
    };
    
    await db.collection('places').doc(id).update(updatePayload);
    
    console.log('✅ Restaurant updated successfully');
    
    res.status(200).json({
      success: true,
      data: {
        id,
        ...updatePayload
      },
      message: 'Restaurante actualizado exitosamente'
    });
  } catch (error) {
    console.error('❌ Error updating restaurant:', error);
    res.status(500).json({
      success: false,
      error: 'Error al actualizar restaurante'
    });
  }
};

// Eliminar restaurante
const deleteRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🏪 Deleting restaurant: ${id}`);
    
    await db.collection('places').doc(id).delete();
    
    console.log('✅ Restaurant deleted successfully');
    
    res.status(200).json({
      success: true,
      message: 'Restaurante eliminado exitosamente'
    });
  } catch (error) {
    console.error('❌ Error deleting restaurant:', error);
    res.status(500).json({
      success: false,
      error: 'Error al eliminar restaurante'
    });
  }
};

module.exports = {
  getAllRestaurants,
  getRestaurantById,
  getRestaurantsByCategory,
  getOpenRestaurants,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant
}; 