const { db } = require('../config/firebase');

class Category {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description || '';
    this.image = data.image || '';
    this.restaurantId = data.restaurantId;
    this.order = data.order || 0;
    this.isActive = data.isActive !== undefined ? data.isActive : true;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  static async findByRestaurant(restaurantId) {
    try {
      const snapshot = await db.collection('categories')
        .where('restaurantId', '==', restaurantId)
        .where('isActive', '==', true)
        .orderBy('order')
        .get();
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      throw new Error(`Error fetching categories: ${error.message}`);
    }
  }

  static async findById(id) {
    try {
      const doc = await db.collection('categories').doc(id).get();
      if (!doc.exists) {
        return null;
      }
      return {
        id: doc.id,
        ...doc.data()
      };
    } catch (error) {
      throw new Error(`Error fetching category: ${error.message}`);
    }
  }

  async save() {
    try {
      const categoryData = {
        name: this.name,
        description: this.description,
        image: this.image,
        restaurantId: this.restaurantId,
        order: this.order,
        isActive: this.isActive,
        createdAt: this.createdAt,
        updatedAt: new Date()
      };

      if (this.id) {
        await db.collection('categories').doc(this.id).update(categoryData);
      } else {
        const docRef = await db.collection('categories').add(categoryData);
        this.id = docRef.id;
      }
      return this;
    } catch (error) {
      throw new Error(`Error saving category: ${error.message}`);
    }
  }

  async delete() {
    try {
      await db.collection('categories').doc(this.id).delete();
    } catch (error) {
      throw new Error(`Error deleting category: ${error.message}`);
    }
  }
}

module.exports = Category; 