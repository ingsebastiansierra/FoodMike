const { db } = require('../config/firebase');

// Obtener todos los productos
const getAllProducts = async (req, res) => {
  try {
    console.log('📦 Getting all products from Firestore...');
    const productsSnapshot = await db.collection('products').get();
    
    if (productsSnapshot.empty) {
      console.log('⚠️ No products found in Firestore.');
      return res.status(200).json({ success: true, data: [], count: 0 });
    }
    
    const products = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log(`✅ Found ${products.length} products.`);
    res.status(200).json({ success: true, data: products, count: products.length });
  } catch (error) {
    console.error('❌ Error getting products from Firestore:', error);
    res.status(500).json({ success: false, error: 'Error al obtener productos desde la base de datos' });
  }
};

// Obtener producto por ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`📦 Getting product by ID: ${id}`);
    const productRef = db.collection('products').doc(id);
    const doc = await productRef.get();
    
    if (!doc.exists) {
      return res.status(404).json({ success: false, error: 'Producto no encontrado' });
    }
    
    res.status(200).json({ success: true, data: { id: doc.id, ...doc.data() } });
  } catch (error) {
    console.error('❌ Error getting product:', error);
    res.status(500).json({ success: false, error: 'Error al obtener producto' });
  }
};

// Obtener productos por restaurante
const getProductsByRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    console.log(`📦 Getting products by restaurant: ${restaurantId}`);
    
    const productsSnapshot = await db.collection('products').where('restaurantId', '==', restaurantId).get();
    
    if (productsSnapshot.empty) {
      return res.status(200).json({ success: true, data: [], count: 0 });
    }
    
    const products = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json({ success: true, data: products, count: products.length });
  } catch (error) {
    console.error('❌ Error getting products by restaurant:', error);
    res.status(500).json({ success: false, error: 'Error al obtener productos del restaurante' });
  }
};

// Obtener productos por categoría
const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    console.log(`📦 Getting products by category: ${category}`);
    
    const productsSnapshot = await db.collection('products').where('category', '==', category).get();

    if (productsSnapshot.empty) {
      return res.status(200).json({ success: true, data: [], count: 0 });
    }
    
    const products = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json({ success: true, data: products, count: products.length });
  } catch (error) {
    console.error('❌ Error getting products by category:', error);
    res.status(500).json({ success: false, error: 'Error al obtener productos por categoría' });
  }
};

// Obtener productos populares
const getPopularProducts = async (req, res) => {
  try {
    console.log('📦 Getting popular products');
    
    const productsSnapshot = await db.collection('products').orderBy('stars', 'desc').limit(10).get();
    
    if (productsSnapshot.empty) {
      return res.status(200).json({ success: true, data: [], count: 0 });
    }
    
    const products = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json({ success: true, data: products, count: products.length });
  } catch (error) {
    console.error('❌ Error getting popular products:', error);
    res.status(500).json({ success: false, error: 'Error al obtener productos populares' });
  }
};

// Crear producto
const createProduct = async (req, res) => {
  try {
    const productData = req.body;
    console.log('📦 Creating new product:', productData.name);
    
    const docRef = await db.collection('products').add({
      ...productData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    
    console.log('✅ Product created successfully with ID:', docRef.id);
    res.status(201).json({ success: true, data: { id: docRef.id, ...productData }, message: 'Producto creado exitosamente' });
  } catch (error) {
    console.error('❌ Error creating product:', error);
    res.status(500).json({ success: false, error: 'Error al crear producto' });
  }
};

// Actualizar producto
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    console.log(`📦 Updating product: ${id}`);
    
    const productRef = db.collection('products').doc(id);
    const doc = await productRef.get();

    if (!doc.exists) {
      return res.status(404).json({ success: false, error: 'Producto no encontrado' });
    }
    
    await productRef.update({
      ...updateData,
      updatedAt: new Date(),
    });
    
    console.log('✅ Product updated successfully');
    res.status(200).json({ success: true, message: 'Producto actualizado exitosamente' });
  } catch (error) {
    console.error('❌ Error updating product:', error);
    res.status(500).json({ success: false, error: 'Error al actualizar producto' });
  }
};

// Eliminar producto
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`📦 Deleting product: ${id}`);
    
    const productRef = db.collection('products').doc(id);
    const doc = await productRef.get();

    if (!doc.exists) {
      return res.status(404).json({ success: false, error: 'Producto no encontrado' });
    }

    await productRef.delete();
    
    console.log('✅ Product deleted successfully');
    res.status(200).json({ success: true, message: 'Producto eliminado exitosamente' });
  } catch (error) {
    console.error('❌ Error deleting product:', error);
    res.status(500).json({ success: false, error: 'Error al eliminar producto' });
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