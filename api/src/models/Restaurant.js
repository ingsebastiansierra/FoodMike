const { db } = require('../config/firebase');

class Restaurant {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.address = data.address;
    this.phone = data.phone;
    this.email = data.email;
    this.stars = data.stars || 0;
    this.reviews = data.reviews || 0;
    this.deliveryTime = data.deliveryTime;
    this.deliveryFee = data.deliveryFee;
    this.minOrder = data.minOrder;
    this.image = data.image;
    this.coverImage = data.coverImage;
    this.categories = data.categories || [];
    this.isOpen = data.isOpen !== undefined ? data.isOpen : true;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  static async findAll() {
    try {
      const snapshot = await db.collection('restaurants').get();
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      throw new Error(`Error fetching restaurants: ${error.message}`);
    }
  }

  static async findById(id) {
    try {
      const doc = await db.collection('restaurants').doc(id).get();
      if (!doc.exists) {
        return null;
      }
      return {
        id: doc.id,
        ...doc.data()
      };
    } catch (error) {
      throw new Error(`Error fetching restaurant: ${error.message}`);
    }
  }

  static async findByCategory(category) {
    try {
      const snapshot = await db.collection('restaurants')
        .where('categories', 'array-contains', category)
        .get();
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      throw new Error(`Error fetching restaurants by category: ${error.message}`);
    }
  }

  static async findOpen() {
    try {
      const snapshot = await db.collection('restaurants')
        .where('isOpen', '==', true)
        .get();
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      throw new Error(`Error fetching open restaurants: ${error.message}`);
    }
  }

  async save() {
    try {
      const restaurantData = {
        name: this.name,
        description: this.description,
        address: this.address,
        phone: this.phone,
        email: this.email,
        stars: this.stars,
        reviews: this.reviews,
        deliveryTime: this.deliveryTime,
        deliveryFee: this.deliveryFee,
        minOrder: this.minOrder,
        image: this.image,
        coverImage: this.coverImage,
        categories: this.categories,
        isOpen: this.isOpen,
        createdAt: this.createdAt,
        updatedAt: new Date()
      };

      if (this.id) {
        await db.collection('restaurants').doc(this.id).update(restaurantData);
      } else {
        const docRef = await db.collection('restaurants').add(restaurantData);
        this.id = docRef.id;
      }
      return this;
    } catch (error) {
      throw new Error(`Error saving restaurant: ${error.message}`);
    }
  }

  async delete() {
    try {
      await db.collection('restaurants').doc(this.id).delete();
    } catch (error) {
      throw new Error(`Error deleting restaurant: ${error.message}`);
    }
  }
}

module.exports = Restaurant; 