const { RESTAURANTS_DATA } = require('../data/mockData');

// Obtener todos los restaurantes
const getAllRestaurants = async (req, res) => {
  try {
    console.log('📋 Getting all restaurants');
    
    res.status(200).json({
      success: true,
      data: RESTAURANTS_DATA,
      count: RESTAURANTS_DATA.length
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
    
    const restaurant = RESTAURANTS_DATA.find(r => r.id === id);
    
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        error: 'Restaurante no encontrado'
      });
    }
    
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
    
    const restaurants = RESTAURANTS_DATA.filter(r => 
      r.category.toLowerCase() === category.toLowerCase()
    );
    
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
    console.log('🏪 Getting open restaurants');
    
    const openRestaurants = RESTAURANTS_DATA.filter(r => r.isOpen);
    
    res.status(200).json({
      success: true,
      data: openRestaurants,
      count: openRestaurants.length
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
      id: `rest${Date.now()}`,
      ...restaurantData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // En un entorno real, aquí se guardaría en la base de datos
    console.log('✅ Restaurant created successfully');
    
    res.status(201).json({
      success: true,
      data: newRestaurant,
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
    
    const restaurantIndex = RESTAURANTS_DATA.findIndex(r => r.id === id);
    
    if (restaurantIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Restaurante no encontrado'
      });
    }
    
    const updatedRestaurant = {
      ...RESTAURANTS_DATA[restaurantIndex],
      ...updateData,
      updatedAt: new Date()
    };
    
    // En un entorno real, aquí se actualizaría en la base de datos
    console.log('✅ Restaurant updated successfully');
    
    res.status(200).json({
      success: true,
      data: updatedRestaurant,
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
    
    const restaurantIndex = RESTAURANTS_DATA.findIndex(r => r.id === id);
    
    if (restaurantIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Restaurante no encontrado'
      });
    }
    
    // En un entorno real, aquí se eliminaría de la base de datos
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