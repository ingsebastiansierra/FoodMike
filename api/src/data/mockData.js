// Datos simulados para desarrollo
const RESTAURANTS_DATA = [
  {
    id: 'rest1',
    name: 'Burger House',
    description: 'Las mejores hamburguesas de la ciudad',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&h=300&fit=crop',
    stars: 4.5,
    address: 'Calle Principal 123',
    deliveryTime: '25-35 min',
    deliveryFee: 2.50,
    isOpen: true,
    category: 'Hamburguesas',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'rest2',
    name: 'Pizza Palace',
    description: 'Pizzas artesanales con ingredientes frescos',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop',
    stars: 4.8,
    address: 'Avenida Central 456',
    deliveryTime: '30-45 min',
    deliveryFee: 3.00,
    isOpen: true,
    category: 'Pizza',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'rest3',
    name: 'Chicken Express',
    description: 'Pollo frito y asado de la mejor calidad',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop',
    stars: 4.2,
    address: 'Plaza Mayor 789',
    deliveryTime: '20-30 min',
    deliveryFee: 2.00,
    isOpen: true,
    category: 'Pollo',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'rest4',
    name: 'Sushi Master',
    description: 'Sushi fresco y auténtico',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
    stars: 4.7,
    address: 'Calle Gourmet 321',
    deliveryTime: '35-50 min',
    deliveryFee: 4.00,
    isOpen: false,
    category: 'Sushi',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'rest5',
    name: 'Taco Loco',
    description: 'Los tacos más auténticos de México',
    image: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?w=400&h=300&fit=crop',
    stars: 4.3,
    address: 'Avenida Latina 654',
    deliveryTime: '15-25 min',
    deliveryFee: 1.50,
    isOpen: true,
    category: 'Mexicana',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const PRODUCTS_DATA = [
  // Burger House Products
  {
    id: 'prod1',
    name: 'Hamburguesa Clásica',
    description: 'Carne de res 100%, lechuga, tomate, cebolla y queso cheddar',
    price: 10.99,
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400',
    category: 'hamburguesas',
    restaurantId: 'rest1',
    stars: 4.5,
    isAvailable: true,
    preparationTime: '15 min',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'prod2',
    name: 'Hamburguesa BBQ',
    description: 'Carne de res con salsa BBQ, bacon y cebolla caramelizada',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400',
    category: 'hamburguesas',
    restaurantId: 'rest1',
    stars: 4.7,
    isAvailable: true,
    preparationTime: '18 min',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'prod3',
    name: 'Hamburguesa Vegetariana',
    description: 'Pollo de garbanzos, vegetales frescos y salsa especial',
    price: 9.99,
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400',
    category: 'hamburguesas',
    restaurantId: 'rest1',
    stars: 4.3,
    isAvailable: true,
    preparationTime: '12 min',
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // Pizza Palace Products
  {
    id: 'prod4',
    name: 'Pizza Margherita',
    description: 'Salsa de tomate, mozzarella y albahaca fresca',
    price: 14.99,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400',
    category: 'pizzas',
    restaurantId: 'rest2',
    stars: 4.8,
    isAvailable: true,
    preparationTime: '25 min',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'prod5',
    name: 'Pizza Pepperoni',
    description: 'Salsa de tomate, mozzarella y pepperoni',
    price: 16.99,
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400',
    category: 'pizzas',
    restaurantId: 'rest2',
    stars: 4.9,
    isAvailable: true,
    preparationTime: '28 min',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'prod6',
    name: 'Pizza Hawaiana',
    description: 'Salsa de tomate, mozzarella, jamón y piña',
    price: 17.99,
    image: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?w=400',
    category: 'pizzas',
    restaurantId: 'rest2',
    stars: 4.6,
    isAvailable: true,
    preparationTime: '30 min',
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // Chicken Express Products
  {
    id: 'prod7',
    name: 'Pollo Frito Clásico',
    description: '8 piezas de pollo frito con especias secretas',
    price: 13.99,
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400',
    category: 'pollo',
    restaurantId: 'rest3',
    stars: 4.2,
    isAvailable: true,
    preparationTime: '20 min',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'prod8',
    name: 'Pollo Asado',
    description: 'Pollo asado entero con hierbas y limón',
    price: 15.99,
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400',
    category: 'pollo',
    restaurantId: 'rest3',
    stars: 4.4,
    isAvailable: true,
    preparationTime: '35 min',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'prod9',
    name: 'Alitas BBQ',
    description: '6 alitas de pollo con salsa BBQ',
    price: 11.99,
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400',
    category: 'alitas',
    restaurantId: 'rest3',
    stars: 4.5,
    isAvailable: true,
    preparationTime: '18 min',
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // Sushi Master Products
  {
    id: 'prod10',
    name: 'Sushi Roll California',
    description: 'Cangrejo, aguacate y pepino',
    price: 8.99,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
    category: 'sushi',
    restaurantId: 'rest4',
    stars: 4.7,
    isAvailable: true,
    preparationTime: '15 min',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'prod11',
    name: 'Sushi Roll Salmón',
    description: 'Salmón fresco, aguacate y pepino',
    price: 10.99,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
    category: 'sushi',
    restaurantId: 'rest4',
    stars: 4.8,
    isAvailable: true,
    preparationTime: '18 min',
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // Taco Loco Products
  {
    id: 'prod12',
    name: 'Tacos de Carne Asada',
    description: '3 tacos con carne asada, cebolla y cilantro',
    price: 7.99,
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400',
    category: 'mexicana',
    restaurantId: 'rest5',
    stars: 4.3,
    isAvailable: true,
    preparationTime: '12 min',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'prod13',
    name: 'Tacos de Pollo',
    description: '3 tacos con pollo, guacamole y salsa verde',
    price: 6.99,
    image: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=400',
    category: 'mexicana',
    restaurantId: 'rest5',
    stars: 4.4,
    isAvailable: true,
    preparationTime: '10 min',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Función para buscar productos
const searchProducts = (query = '', filters = {}) => {
  let results = [...PRODUCTS_DATA];

  // Filtrar por búsqueda
  if (query.trim()) {
    const searchTerm = query.toLowerCase();
    results = results.filter(product => 
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm)
    );
  }

  // Filtrar por categoría
  if (filters.category && filters.category !== 'all') {
    results = results.filter(product => product.category === filters.category);
  }

  // Filtrar por precio mínimo
  if (filters.minPrice) {
    results = results.filter(product => product.price >= filters.minPrice);
  }

  // Filtrar por precio máximo
  if (filters.maxPrice) {
    results = results.filter(product => product.price <= filters.maxPrice);
  }

  // Filtrar por estrellas mínimas
  if (filters.minStars) {
    results = results.filter(product => product.stars >= filters.minStars);
  }

  // Agregar información del restaurante
  results = results.map(product => {
    const restaurant = RESTAURANTS_DATA.find(r => r.id === product.restaurantId);
    return {
      ...product,
      restaurant: restaurant ? {
        id: restaurant.id,
        name: restaurant.name,
        stars: restaurant.stars,
        address: restaurant.address,
        image: restaurant.image,
        deliveryTime: restaurant.deliveryTime,
        deliveryFee: restaurant.deliveryFee,
      } : null
    };
  });

  // Ordenar por score de calidad (estrellas * 0.7 + precio * 0.3)
  results.sort((a, b) => {
    const scoreA = (a.stars * 0.7) + ((100 - a.price) * 0.3);
    const scoreB = (b.stars * 0.7) + ((100 - b.price) * 0.3);
    return scoreB - scoreA;
  });

  // Limitar resultados
  if (filters.limit) {
    results = results.slice(0, filters.limit);
  }

  return results;
};

module.exports = {
  RESTAURANTS_DATA,
  PRODUCTS_DATA,
  searchProducts
}; 