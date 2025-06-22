const { PRODUCTS_DATA } = require('../data/mockData');

// Obtener todos los productos
const getAllProducts = async (req, res) => {
  try {
    console.log('📦 Getting all products');
    
    res.status(200).json({
      success: true,
      data: PRODUCTS_DATA,
      count: PRODUCTS_DATA.length
    });
  } catch (error) {
    console.error('❌ Error getting products:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener productos'
    });
  }
};

// Obtener producto por ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`📦 Getting product by ID: ${id}`);
    
    const product = PRODUCTS_DATA.find(p => p.id === id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Producto no encontrado'
      });
    }
    
    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('❌ Error getting product:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener producto'
    });
  }
};

// Obtener productos por restaurante
const getProductsByRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    console.log(`📦 Getting products by restaurant: ${restaurantId}`);
    
    const products = PRODUCTS_DATA.filter(p => p.restaurantId === restaurantId);
    
    res.status(200).json({
      success: true,
      data: products,
      count: products.length
    });
  } catch (error) {
    console.error('❌ Error getting products by restaurant:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener productos del restaurante'
    });
  }
};

// Obtener productos por categoría
const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    console.log(`📦 Getting products by category: ${category}`);
    
    const products = PRODUCTS_DATA.filter(p => 
      p.category.toLowerCase() === category.toLowerCase()
    );
    
    res.status(200).json({
      success: true,
      data: products,
      count: products.length
    });
  } catch (error) {
    console.error('❌ Error getting products by category:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener productos por categoría'
    });
  }
};

// Obtener productos populares
const getPopularProducts = async (req, res) => {
  try {
    console.log('📦 Getting popular products');
    
    // Ordenar por estrellas y tomar los top 10
    const popularProducts = [...PRODUCTS_DATA]
      .sort((a, b) => b.stars - a.stars)
      .slice(0, 10);
    
    res.status(200).json({
      success: true,
      data: popularProducts,
      count: popularProducts.length
    });
  } catch (error) {
    console.error('❌ Error getting popular products:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener productos populares'
    });
  }
};

// Crear producto
const createProduct = async (req, res) => {
  try {
    const productData = req.body;
    console.log('📦 Creating new product:', productData.name);
    
    const newProduct = {
      id: `prod${Date.now()}`,
      ...productData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // En un entorno real, aquí se guardaría en la base de datos
    console.log('✅ Product created successfully');
    
    res.status(201).json({
      success: true,
      data: newProduct,
      message: 'Producto creado exitosamente'
    });
  } catch (error) {
    console.error('❌ Error creating product:', error);
    res.status(500).json({
      success: false,
      error: 'Error al crear producto'
    });
  }
};

// Actualizar producto
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    console.log(`📦 Updating product: ${id}`);
    
    const productIndex = PRODUCTS_DATA.findIndex(p => p.id === id);
    
    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Producto no encontrado'
      });
    }
    
    const updatedProduct = {
      ...PRODUCTS_DATA[productIndex],
      ...updateData,
      updatedAt: new Date()
    };
    
    // En un entorno real, aquí se actualizaría en la base de datos
    console.log('✅ Product updated successfully');
    
    res.status(200).json({
      success: true,
      data: updatedProduct,
      message: 'Producto actualizado exitosamente'
    });
  } catch (error) {
    console.error('❌ Error updating product:', error);
    res.status(500).json({
      success: false,
      error: 'Error al actualizar producto'
    });
  }
};

// Eliminar producto
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`📦 Deleting product: ${id}`);
    
    const productIndex = PRODUCTS_DATA.findIndex(p => p.id === id);
    
    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Producto no encontrado'
      });
    }
    
    // En un entorno real, aquí se eliminaría de la base de datos
    console.log('✅ Product deleted successfully');
    
    res.status(200).json({
      success: true,
      message: 'Producto eliminado exitosamente'
    });
  } catch (error) {
    console.error('❌ Error deleting product:', error);
    res.status(500).json({
      success: false,
      error: 'Error al eliminar producto'
    });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  getProductsByRestaurant,
  getProductsByCategory,
  getPopularProducts,
  createProduct,
  updateProduct,
  deleteProduct
}; 