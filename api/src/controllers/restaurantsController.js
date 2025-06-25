const Restaurant = require('../models/Restaurant');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Addition = require('../models/Addition');

// Obtener todos los restaurantes
const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.findAll();
    res.json({
      success: true,
      data: restaurants,
      message: 'Restaurantes obtenidos exitosamente'
    });
  } catch (error) {
    console.error('Error getting restaurants:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener restaurantes',
      error: error.message
    });
  }
};

// Obtener restaurante por ID con su menú completo
const getRestaurantById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Obtener restaurante
    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurante no encontrado'
      });
    }

    // Obtener categorías del restaurante
    const categories = await Category.findByRestaurant(id);
    
    // Obtener productos por categoría
    const menu = [];
    for (const category of categories) {
      const products = await Product.findByCategory(category.id);
      
      // Obtener adiciones para cada producto
      const productsWithAdditions = [];
      for (const product of products) {
        let additions = [];
        if (product.hasAdditions) {
          additions = await Addition.findByProduct(product.id);
        }
        
        productsWithAdditions.push({
          ...product,
          additions
        });
      }
      
      menu.push({
        ...category,
        products: productsWithAdditions
      });
    }

    res.json({
      success: true,
      data: {
        ...restaurant,
        menu
      },
      message: 'Restaurante obtenido exitosamente'
    });
  } catch (error) {
    console.error('Error getting restaurant:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener restaurante',
      error: error.message
    });
  }
};

// Obtener restaurantes abiertos
const getOpenRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.findOpen();
    res.json({
      success: true,
      data: restaurants,
      message: 'Restaurantes abiertos obtenidos exitosamente'
    });
  } catch (error) {
    console.error('Error getting open restaurants:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener restaurantes abiertos',
      error: error.message
    });
  }
};

// Obtener restaurantes por categoría
const getRestaurantsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const restaurants = await Restaurant.findByCategory(category);
    res.json({
      success: true,
      data: restaurants,
      message: `Restaurantes de categoría ${category} obtenidos exitosamente`
    });
  } catch (error) {
    console.error('Error getting restaurants by category:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener restaurantes por categoría',
      error: error.message
    });
  }
};

// Crear nuevo restaurante
const createRestaurant = async (req, res) => {
  try {
    const restaurantData = req.body;
    const restaurant = new Restaurant(restaurantData);
    await restaurant.save();
    
    res.status(201).json({
      success: true,
      data: restaurant,
      message: 'Restaurante creado exitosamente'
    });
  } catch (error) {
    console.error('Error creating restaurant:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear restaurante',
      error: error.message
    });
  }
};

// Actualizar restaurante
const updateRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurante no encontrado'
      });
    }

    // Actualizar datos
    Object.assign(restaurant, updateData);
    await restaurant.save();
    
    res.json({
      success: true,
      data: restaurant,
      message: 'Restaurante actualizado exitosamente'
    });
  } catch (error) {
    console.error('Error updating restaurant:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar restaurante',
      error: error.message
    });
  }
};

// Eliminar restaurante
const deleteRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    
    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurante no encontrado'
      });
    }

    await restaurant.delete();
    
    res.json({
      success: true,
      message: 'Restaurante eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error deleting restaurant:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar restaurante',
      error: error.message
    });
  }
};

// Obtener menú de un restaurante
const getRestaurantMenu = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar que el restaurante existe
    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurante no encontrado'
      });
    }

    // Obtener categorías
    const categories = await Category.findByRestaurant(id);
    
    // Obtener productos por categoría
    const menu = [];
    for (const category of categories) {
      const products = await Product.findByCategory(category.id);
      
      // Obtener adiciones para productos que las tienen
      const productsWithAdditions = [];
      for (const product of products) {
        let additions = [];
        if (product.hasAdditions) {
          additions = await Addition.findByProduct(product.id);
        }
        
        productsWithAdditions.push({
          ...product,
          additions
        });
      }
      
      menu.push({
        ...category,
        products: productsWithAdditions
      });
    }

    res.json({
      success: true,
      data: {
        restaurant: {
          id: restaurant.id,
          name: restaurant.name,
          description: restaurant.description,
          image: restaurant.image,
          stars: restaurant.stars,
          reviews: restaurant.reviews,
          deliveryTime: restaurant.deliveryTime,
          deliveryFee: restaurant.deliveryFee,
          minOrder: restaurant.minOrder,
          schedule: restaurant.schedule,
          isOpen: restaurant.isOpen
        },
        menu
      },
      message: 'Menú del restaurante obtenido exitosamente'
    });
  } catch (error) {
    console.error('Error getting restaurant menu:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener menú del restaurante',
      error: error.message
    });
  }
};

module.exports = {
  getAllRestaurants,
  getRestaurantById,
  getOpenRestaurants,
  getRestaurantsByCategory,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getRestaurantMenu
}; 