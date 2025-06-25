const { db } = require('../config/firebase');

class Product {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.price = data.price;
    this.originalPrice = data.originalPrice;
    this.image = data.image;
    this.categoryId = data.categoryId;
    this.restaurantId = data.restaurantId;
    this.stars = data.stars || 0;
    this.reviews = data.reviews || 0;
    this.tags = data.tags || [];
    this.isAvailable = data.isAvailable !== undefined ? data.isAvailable : true;
    this.isPopular = data.isPopular || false;
    this.isRecommended = data.isRecommended || false;
    this.preparationTime = data.preparationTime;
    this.allergens = data.allergens || [];
    this.nutritionalInfo = data.nutritionalInfo || {};
    this.hasAdditions = data.hasAdditions || false;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  static async findAll() {
    try {
      const snapshot = await db.collection('products').get();
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      throw new Error(`Error fetching products: ${error.message}`);
    }
  }

  static async findById(id) {
    try {
      const doc = await db.collection('products').doc(id).get();
      if (!doc.exists) {
        return null;
      }
      return {
        id: doc.id,
        ...doc.data()
      };
    } catch (error) {
      throw new Error(`Error fetching product: ${error.message}`);
    }
  }

  static async findByRestaurant(restaurantId) {
    try {
      const snapshot = await db.collection('products')
        .where('restaurantId', '==', restaurantId)
        .where('isAvailable', '==', true)
        .get();
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      throw new Error(`Error fetching products by restaurant: ${error.message}`);
    }
  }

  static async findByCategory(categoryId) {
    try {
      const snapshot = await db.collection('products')
        .where('categoryId', '==', categoryId)
        .where('isAvailable', '==', true)
        .get();
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      throw new Error(`Error fetching products by category: ${error.message}`);
    }
  }

  static async findPopular() {
    try {
      const snapshot = await db.collection('products')
        .where('isPopular', '==', true)
        .where('isAvailable', '==', true)
        .get();
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      throw new Error(`Error fetching popular products: ${error.message}`);
    }
  }

  static async search(query, filters = {}) {
    try {
      let queryRef = db.collection('products').where('isAvailable', '==', true);

      // Aplicar filtros
      if (filters.categoryId && filters.categoryId !== 'all') {
        queryRef = queryRef.where('categoryId', '==', filters.categoryId);
      }

      if (filters.restaurantId) {
        queryRef = queryRef.where('restaurantId', '==', filters.restaurantId);
      }

      if (filters.minPrice !== undefined) {
        queryRef = queryRef.where('price', '>=', filters.minPrice);
      }

      if (filters.maxPrice !== undefined) {
        queryRef = queryRef.where('price', '<=', filters.maxPrice);
      }

      if (filters.minStars !== undefined) {
        queryRef = queryRef.where('stars', '>=', filters.minStars);
      }

      const snapshot = await queryRef.get();
      let products = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Búsqueda por texto (simulada ya que Firestore no tiene búsqueda de texto completo)
      if (query && query.trim()) {
        const searchTerm = query.toLowerCase();
        products = products.filter(product => 
          product.name.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm) ||
          product.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
      }

      // Ordenar por relevancia (estrellas y precio)
      products.sort((a, b) => {
        const scoreA = (a.stars * 0.7) + ((100 - a.price) * 0.3);
        const scoreB = (b.stars * 0.7) + ((100 - b.price) * 0.3);
        return scoreB - scoreA;
      });

      return products;
    } catch (error) {
      throw new Error(`Error searching products: ${error.message}`);
    }
  }

  async save() {
    try {
      const productData = {
        name: this.name,
        description: this.description,
        price: this.price,
        originalPrice: this.originalPrice,
        image: this.image,
        categoryId: this.categoryId,
        restaurantId: this.restaurantId,
        stars: this.stars,
        reviews: this.reviews,
        tags: this.tags,
        isAvailable: this.isAvailable,
        isPopular: this.isPopular,
        isRecommended: this.isRecommended,
        preparationTime: this.preparationTime,
        allergens: this.allergens,
        nutritionalInfo: this.nutritionalInfo,
        hasAdditions: this.hasAdditions,
        createdAt: this.createdAt,
        updatedAt: new Date()
      };

      if (this.id) {
        await db.collection('products').doc(this.id).update(productData);
      } else {
        const docRef = await db.collection('products').add(productData);
        this.id = docRef.id;
      }
      return this;
    } catch (error) {
      throw new Error(`Error saving product: ${error.message}`);
    }
  }

  async delete() {
    try {
      await db.collection('products').doc(this.id).delete();
    } catch (error) {
      throw new Error(`Error deleting product: ${error.message}`);
    }
  }
}

module.exports = Product; 