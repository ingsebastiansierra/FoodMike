const { db } = require('../config/firebase');

class Addition {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.price = data.price;
    this.category = data.category; // 'size', 'extra', 'customization'
    this.productId = data.productId;
    this.restaurantId = data.restaurantId;
    this.isAvailable = data.isAvailable !== undefined ? data.isAvailable : true;
    this.order = data.order || 0;
    this.maxQuantity = data.maxQuantity || 1;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  static async findByProduct(productId) {
    try {
      const snapshot = await db.collection('additions')
        .where('productId', '==', productId)
        .where('isAvailable', '==', true)
        .orderBy('order')
        .get();
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      throw new Error(`Error fetching additions: ${error.message}`);
    }
  }

  static async findByRestaurant(restaurantId) {
    try {
      const snapshot = await db.collection('additions')
        .where('restaurantId', '==', restaurantId)
        .where('isAvailable', '==', true)
        .orderBy('order')
        .get();
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      throw new Error(`Error fetching additions: ${error.message}`);
    }
  }

  static async findById(id) {
    try {
      const doc = await db.collection('additions').doc(id).get();
      if (!doc.exists) {
        return null;
      }
      return {
        id: doc.id,
        ...doc.data()
      };
    } catch (error) {
      throw new Error(`Error fetching addition: ${error.message}`);
    }
  }

  async save() {
    try {
      const additionData = {
        name: this.name,
        description: this.description,
        price: this.price,
        category: this.category,
        productId: this.productId,
        restaurantId: this.restaurantId,
        isAvailable: this.isAvailable,
        order: this.order,
        maxQuantity: this.maxQuantity,
        createdAt: this.createdAt,
        updatedAt: new Date()
      };

      if (this.id) {
        await db.collection('additions').doc(this.id).update(additionData);
      } else {
        const docRef = await db.collection('additions').add(additionData);
        this.id = docRef.id;
      }
      return this;
    } catch (error) {
      throw new Error(`Error saving addition: ${error.message}`);
    }
  }

  async delete() {
    try {
      await db.collection('additions').doc(this.id).delete();
    } catch (error) {
      throw new Error(`Error deleting addition: ${error.message}`);
    }
  }
}

module.exports = Addition; 