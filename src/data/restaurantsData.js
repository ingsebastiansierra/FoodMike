// Base de datos simulada de restaurantes y productos para FoodMike

export const RESTAURANTS_DATA = [
  {
    id: "1",
    name: "La Fontana",
    stars: 4.8,
    address: "Calle 123 # 45-67, Centro",
    schedule: "10:00 AM - 10:00 PM",
    image: {
      uri: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    category: "Comida Rápida",
    deliveryTime: "15-25 min",
    deliveryFee: "$2.00",
    minOrder: "$5.00",
    products: [
      {
        id: "1_1",
        name: "Hamburguesa Clásica",
        description: "Hamburguesa con carne 100% de res, lechuga, tomate, cebolla y queso",
        price: 8.50,
        category: "Hamburguesas",
        stars: 4.8,
        reviews: 156,
        image: {
          uri: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3",
        },
        tags: ["Popular", "Recomendado"],
        available: true,
      },
      {
        id: "1_2",
        name: "Hamburguesa Doble",
        description: "Doble carne con queso, bacon y salsa especial",
        price: 12.00,
        category: "Hamburguesas",
        stars: 4.6,
        reviews: 89,
        image: {
          uri: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-4.0.3",
        },
        tags: ["Especial"],
        available: true,
      },
      {
        id: "1_3",
        name: "Pizza Margherita",
        description: "Pizza tradicional con tomate, mozzarella y albahaca",
        price: 15.00,
        category: "Pizzas",
        stars: 4.5,
        reviews: 67,
        image: {
          uri: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?ixlib=rb-4.0.3",
        },
        tags: ["Vegetariana"],
        available: true,
      },
      {
        id: "1_4",
        name: "Alitas BBQ x6",
        description: "6 alitas de pollo con salsa BBQ casera",
        price: 9.50,
        category: "Alitas",
        stars: 4.7,
        reviews: 123,
        image: {
          uri: "https://images.unsplash.com/photo-1600935926387-12d9b03066f0?ixlib=rb-4.0.3",
        },
        tags: ["Picante"],
        available: true,
      },
    ],
  },
  {
    id: "2",
    name: "McDonald's Express",
    stars: 4.2,
    address: "Avenida 456 # 78-90, Norte",
    schedule: "6:00 AM - 12:00 AM",
    image: {
      uri: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    category: "Comida Rápida",
    deliveryTime: "20-30 min",
    deliveryFee: "$3.00",
    minOrder: "$8.00",
    products: [
      {
        id: "2_1",
        name: "Big Mac",
        description: "Hamburguesa con doble carne, lechuga, queso, pepinillos y salsa especial",
        price: 12.50,
        category: "Hamburguesas",
        stars: 4.2,
        reviews: 234,
        image: {
          uri: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3",
        },
        tags: ["Clásico"],
        available: true,
      },
      {
        id: "2_2",
        name: "McNuggets x10",
        description: "10 nuggets de pollo con salsa a elección",
        price: 8.00,
        category: "Pollo",
        stars: 4.0,
        reviews: 189,
        image: {
          uri: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?ixlib=rb-4.0.3",
        },
        tags: ["Popular"],
        available: true,
      },
      {
        id: "2_3",
        name: "McFlurry Oreo",
        description: "Helado suave con galletas Oreo trituradas",
        price: 4.50,
        category: "Postres",
        stars: 4.3,
        reviews: 145,
        image: {
          uri: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
        tags: ["Dulce"],
        available: true,
      },
    ],
  },
  {
    id: "3",
    name: "Pizza Hut",
    stars: 4.3,
    address: "Calle 234 # 56-78, Norte",
    schedule: "10:00 AM - 10:00 PM",
    image: {
      uri: "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    category: "Pizzería",
    deliveryTime: "25-35 min",
    deliveryFee: "$2.50",
    minOrder: "$10.00",
    products: [
      {
        id: "3_1",
        name: "Pizza Suprema",
        description: "Pizza con pepperoni, salchicha, pimientos, cebolla y aceitunas",
        price: 18.00,
        category: "Pizzas",
        stars: 4.3,
        reviews: 178,
        image: {
          uri: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?ixlib=rb-4.0.3",
        },
        tags: ["Popular"],
        available: true,
      },
      {
        id: "3_2",
        name: "Pizza Hawaiana",
        description: "Pizza con jamón y piña",
        price: 16.50,
        category: "Pizzas",
        stars: 4.1,
        reviews: 92,
        image: {
          uri: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?ixlib=rb-4.0.3",
        },
        tags: ["Dulce"],
        available: true,
      },
      {
        id: "3_3",
        name: "Pizza Vegetariana",
        description: "Pizza con champiñones, pimientos, cebolla y aceitunas",
        price: 15.00,
        category: "Pizzas",
        stars: 4.4,
        reviews: 67,
        image: {
          uri: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?ixlib=rb-4.0.3",
        },
        tags: ["Vegetariana"],
        available: true,
      },
    ],
  },
  {
    id: "4",
    name: "KFC Original",
    stars: 4.2,
    address: "Transversal 012 # 34-56, Este",
    schedule: "9:00 AM - 9:00 PM",
    image: {
      uri: "https://images.unsplash.com/photo-1567620832904-9fe5cf23bc43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    category: "Pollo",
    deliveryTime: "20-30 min",
    deliveryFee: "$2.50",
    minOrder: "$8.00",
    products: [
      {
        id: "4_1",
        name: "Pollo Broster Familiar",
        description: "8 piezas de pollo broster con papas fritas y bebida",
        price: 20.00,
        category: "Pollo",
        stars: 4.2,
        reviews: 201,
        image: {
          uri: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?ixlib=rb-4.0.3",
        },
        tags: ["Familiar"],
        available: true,
      },
      {
        id: "4_2",
        name: "Alitas BBQ x12",
        description: "12 alitas de pollo con salsa BBQ",
        price: 18.50,
        category: "Alitas",
        stars: 4.1,
        reviews: 134,
        image: {
          uri: "https://images.unsplash.com/photo-1600935926387-12d9b03066f0?ixlib=rb-4.0.3",
        },
        tags: ["Picante"],
        available: true,
      },
      {
        id: "4_3",
        name: "Combo Individual",
        description: "2 piezas de pollo, papas fritas y bebida",
        price: 12.00,
        category: "Pollo",
        stars: 4.0,
        reviews: 89,
        image: {
          uri: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?ixlib=rb-4.0.3",
        },
        tags: ["Combo"],
        available: true,
      },
    ],
  },
];

// Función para buscar productos por término
export const searchProducts = (searchTerm, filters = {}) => {
  const term = searchTerm.toLowerCase();
  let results = [];

  RESTAURANTS_DATA.forEach(restaurant => {
    restaurant.products.forEach(product => {
      // Buscar en nombre, descripción y categoría
      const matchesSearch = 
        product.name.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term) ||
        restaurant.name.toLowerCase().includes(term);

      if (matchesSearch) {
        results.push({
          ...product,
          restaurant: {
            id: restaurant.id,
            name: restaurant.name,
            stars: restaurant.stars,
            address: restaurant.address,
            image: restaurant.image,
            deliveryTime: restaurant.deliveryTime,
            deliveryFee: restaurant.deliveryFee,
          }
        });
      }
    });
  });

  // Aplicar filtros
  if (filters.minPrice !== undefined) {
    results = results.filter(product => product.price >= filters.minPrice);
  }
  if (filters.maxPrice !== undefined) {
    results = results.filter(product => product.price <= filters.maxPrice);
  }
  if (filters.minStars !== undefined) {
    results = results.filter(product => product.stars >= filters.minStars);
  }
  if (filters.category && filters.category !== 'all') {
    results = results.filter(product => 
      product.category.toLowerCase() === filters.category.toLowerCase()
    );
  }

  // Ordenar por relevancia (estrellas + precio)
  results.sort((a, b) => {
    const scoreA = (a.stars * 0.7) + ((100 - a.price) * 0.3);
    const scoreB = (b.stars * 0.7) + ((100 - b.price) * 0.3);
    return scoreB - scoreA;
  });

  return results;
};

// Función para obtener restaurante por ID
export const getRestaurantById = (restaurantId) => {
  return RESTAURANTS_DATA.find(restaurant => restaurant.id === restaurantId);
};

// Función para obtener productos de un restaurante
export const getRestaurantProducts = (restaurantId) => {
  const restaurant = getRestaurantById(restaurantId);
  return restaurant ? restaurant.products : [];
};

// Categorías disponibles
export const CATEGORIES = [
  { id: "all", name: "Todos", icon: "list" },
  { id: "hamburguesas", name: "Hamburguesas", icon: "fast-food" },
  { id: "pizzas", name: "Pizzas", icon: "pizza" },
  { id: "pollo", name: "Pollo", icon: "restaurant" },
  { id: "alitas", name: "Alitas", icon: "fast-food-outline" },
  { id: "sushi", name: "Sushi", icon: "restaurant-outline" },
  { id: "mexicana", name: "Mexicana", icon: "earth" },
  { id: "postres", name: "Postres", icon: "ice-cream" },
  { id: "bebidas", name: "Bebidas", icon: "wine" },
]; 