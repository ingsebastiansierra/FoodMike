const { db } = require('../src/config/firebase');
const Restaurant = require('../src/models/Restaurant');
const Category = require('../src/models/Category');
const Product = require('../src/models/Product');
const Addition = require('../src/models/Addition');

// Datos de restaurantes con estructura completa
const RESTAURANTS_DATA = [
  {
    name: "Café del Sol",
    description: "El mejor café colombiano con pastelería artesanal",
    address: "Carrera 15 #93-47, Bogotá",
    phone: "+57 300 567 8901",
    email: "cafe@cafedelsol.com",
    stars: 4.4,
    reviews: 203,
    deliveryTime: "15-25 min",
    deliveryFee: 1500,
    minOrder: 8000,
    image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400",
    coverImage: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800",
    categories: ["Café", "Pastelería"],
    isOpen: true,
    isFeatured: true,
    schedule: {
      monday: { open: "06:00", close: "20:00" },
      tuesday: { open: "06:00", close: "20:00" },
      wednesday: { open: "06:00", close: "20:00" },
      thursday: { open: "06:00", close: "20:00" },
      friday: { open: "06:00", close: "21:00" },
      saturday: { open: "07:00", close: "21:00" },
      sunday: { open: "07:00", close: "19:00" }
    }
  },
  {
    name: "Burger House",
    description: "Hamburguesas gourmet con las mejores carnes y salsas",
    address: "Avenida 68 #12-34, Cali",
    phone: "+57 300 345 6789",
    email: "contacto@burgerhouse.com",
    stars: 4.7,
    reviews: 156,
    deliveryTime: "20-30 min",
    deliveryFee: 2000,
    minOrder: 10000,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400",
    coverImage: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800",
    categories: ["Hamburguesas", "Comida Rápida"],
    isOpen: true,
    isFeatured: true,
    schedule: {
      monday: { open: "12:00", close: "22:00" },
      tuesday: { open: "12:00", close: "22:00" },
      wednesday: { open: "12:00", close: "22:00" },
      thursday: { open: "12:00", close: "22:00" },
      friday: { open: "12:00", close: "23:00" },
      saturday: { open: "12:00", close: "23:00" },
      sunday: { open: "12:00", close: "21:00" }
    }
  },
  {
    name: "Pizza Express",
    description: "Las mejores pizzas artesanales con ingredientes frescos",
    address: "Carrera 78 #23-45, Medellín",
    phone: "+57 300 234 5678",
    email: "pedidos@pizzaexpress.com",
    stars: 4.3,
    reviews: 95,
    deliveryTime: "25-35 min",
    deliveryFee: 2500,
    minOrder: 12000,
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400",
    coverImage: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800",
    categories: ["Pizza", "Comida Rápida"],
    isOpen: true,
    isFeatured: true,
    schedule: {
      monday: { open: "11:00", close: "23:00" },
      tuesday: { open: "11:00", close: "23:00" },
      wednesday: { open: "11:00", close: "23:00" },
      thursday: { open: "11:00", close: "23:00" },
      friday: { open: "11:00", close: "00:00" },
      saturday: { open: "12:00", close: "00:00" },
      sunday: { open: "12:00", close: "22:00" }
    }
  },
  {
    name: "Sushi Master",
    description: "Sushi fresco y auténtico preparado por expertos",
    address: "Calle 45 #67-89, Barranquilla",
    phone: "+57 300 456 7890",
    email: "reservas@sushimaster.com",
    stars: 4.6,
    reviews: 89,
    deliveryTime: "35-45 min",
    deliveryFee: 4000,
    minOrder: 20000,
    image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400",
    coverImage: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800",
    categories: ["Sushi", "Comida Japonesa"],
    isOpen: true,
    isFeatured: true,
    schedule: {
      monday: { open: "12:00", close: "22:00" },
      tuesday: { open: "12:00", close: "22:00" },
      wednesday: { open: "12:00", close: "22:00" },
      thursday: { open: "12:00", close: "22:00" },
      friday: { open: "12:00", close: "23:00" },
      saturday: { open: "12:00", close: "23:00" },
      sunday: { open: "12:00", close: "21:00" }
    }
  },
  {
    name: "El Sabor Colombiano",
    description: "Los mejores platos típicos de Colombia con sabores auténticos",
    address: "Calle 123 #45-67, Bogotá",
    phone: "+57 300 123 4567",
    email: "info@elsaborcolombiano.com",
    stars: 4.5,
    reviews: 128,
    deliveryTime: "30-45 min",
    deliveryFee: 3000,
    minOrder: 15000,
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400",
    coverImage: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800",
    categories: ["Restaurante Colombiano", "Comida Típica"],
    isOpen: true,
    isFeatured: false,
    schedule: {
      monday: { open: "07:00", close: "22:00" },
      tuesday: { open: "07:00", close: "22:00" },
      wednesday: { open: "07:00", close: "22:00" },
      thursday: { open: "07:00", close: "22:00" },
      friday: { open: "07:00", close: "23:00" },
      saturday: { open: "08:00", close: "23:00" },
      sunday: { open: "08:00", close: "21:00" }
    }
  },
  {
    name: "Tacos Mexicanos",
    description: "Los auténticos tacos mexicanos con salsas caseras",
    address: "Avenida 40 #15-67, Medellín",
    phone: "+57 300 678 9012",
    email: "tacos@mexicanos.com",
    stars: 4.2,
    reviews: 67,
    deliveryTime: "25-35 min",
    deliveryFee: 2000,
    minOrder: 12000,
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400",
    coverImage: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800",
    categories: ["Tacos", "Comida Mexicana"],
    isOpen: true,
    isFeatured: false,
    schedule: {
      monday: { open: "11:00", close: "22:00" },
      tuesday: { open: "11:00", close: "22:00" },
      wednesday: { open: "11:00", close: "22:00" },
      thursday: { open: "11:00", close: "22:00" },
      friday: { open: "11:00", close: "23:00" },
      saturday: { open: "12:00", close: "23:00" },
      sunday: { open: "12:00", close: "21:00" }
    }
  },
  {
    name: "Helados Artesanales",
    description: "Los mejores helados artesanales con sabores únicos",
    address: "Carrera 50 #23-45, Barranquilla",
    phone: "+57 300 890 1234",
    email: "helados@artesanales.com",
    stars: 4.8,
    reviews: 178,
    deliveryTime: "20-30 min",
    deliveryFee: 1500,
    minOrder: 8000,
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400",
    coverImage: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800",
    categories: ["Helados", "Postres"],
    isOpen: true,
    isFeatured: false,
    schedule: {
      monday: { open: "10:00", close: "21:00" },
      tuesday: { open: "10:00", close: "21:00" },
      wednesday: { open: "10:00", close: "21:00" },
      thursday: { open: "10:00", close: "21:00" },
      friday: { open: "10:00", close: "22:00" },
      saturday: { open: "11:00", close: "22:00" },
      sunday: { open: "11:00", close: "20:00" }
    }
  },
  {
    name: "Sandwiches Gourmet",
    description: "Sandwiches gourmet con ingredientes premium",
    address: "Avenida 68 #45-67, Bogotá",
    phone: "+57 300 901 2345",
    email: "sandwiches@gourmet.com",
    stars: 4.3,
    reviews: 92,
    deliveryTime: "20-30 min",
    deliveryFee: 2000,
    minOrder: 10000,
    image: "https://images.unsplash.com/photo-1528735602786-485c5889a1e3?w=400",
    coverImage: "https://images.unsplash.com/photo-1528735602786-485c5889a1e3?w=800",
    categories: ["Sandwiches", "Comida Rápida"],
    isOpen: true,
    isFeatured: false,
    schedule: {
      monday: { open: "08:00", close: "20:00" },
      tuesday: { open: "08:00", close: "20:00" },
      wednesday: { open: "08:00", close: "20:00" },
      thursday: { open: "08:00", close: "20:00" },
      friday: { open: "08:00", close: "21:00" },
      saturday: { open: "09:00", close: "21:00" },
      sunday: { open: "09:00", close: "19:00" }
    }
  },
  {
    name: "Pollo Asado",
    description: "El mejor pollo asado con papas y ensalada",
    address: "Calle 78 #12-34, Cali",
    phone: "+57 300 789 0123",
    email: "pollo@asado.com",
    stars: 4.1,
    reviews: 134,
    deliveryTime: "30-40 min",
    deliveryFee: 2500,
    minOrder: 15000,
    image: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=400",
    coverImage: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=800",
    categories: ["Pollo", "Comida Colombiana"],
    isOpen: true,
    isFeatured: false,
    schedule: {
      monday: { open: "11:00", close: "21:00" },
      tuesday: { open: "11:00", close: "21:00" },
      wednesday: { open: "11:00", close: "21:00" },
      thursday: { open: "11:00", close: "21:00" },
      friday: { open: "11:00", close: "22:00" },
      saturday: { open: "12:00", close: "22:00" },
      sunday: { open: "12:00", close: "20:00" }
    }
  },
  {
    name: "Bebidas Refrescantes",
    description: "Las mejores bebidas naturales y jugos frescos",
    address: "Calle 90 #12-34, Medellín",
    phone: "+57 300 012 3456",
    email: "bebidas@refrescantes.com",
    stars: 4.0,
    reviews: 45,
    deliveryTime: "15-25 min",
    deliveryFee: 1000,
    minOrder: 5000,
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400",
    coverImage: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800",
    categories: ["Bebidas", "Jugos"],
    isOpen: true,
    isFeatured: false,
    schedule: {
      monday: { open: "07:00", close: "19:00" },
      tuesday: { open: "07:00", close: "19:00" },
      wednesday: { open: "07:00", close: "19:00" },
      thursday: { open: "07:00", close: "19:00" },
      friday: { open: "07:00", close: "20:00" },
      saturday: { open: "08:00", close: "20:00" },
      sunday: { open: "08:00", close: "18:00" }
    }
  }
];

// Datos de categorías
const CATEGORIES_DATA = [
  { name: "Burgers", icon: "🍔", description: "Las mejores hamburguesas" },
  { name: "Pizza", icon: "🍕", description: "Pizzas artesanales" },
  { name: "Sushi", icon: "🍣", description: "Sushi fresco y auténtico" },
  { name: "Café", icon: "☕", description: "Café colombiano y pastelería" },
  { name: "Tacos", icon: "🌮", description: "Tacos mexicanos auténticos" },
  { name: "Helados", icon: "🍦", description: "Helados artesanales" },
  { name: "Sandwiches", icon: "🥪", description: "Sandwiches gourmet" },
  { name: "Pollo", icon: "🍗", description: "Pollo asado tradicional" },
  { name: "Bebidas", icon: "🥤", description: "Bebidas naturales" },
  { name: "Comida Colombiana", icon: "🇨🇴", description: "Platos típicos colombianos" }
];

// Datos de productos por restaurante
const PRODUCTS_DATA = {
  "Café del Sol": [
    {
      name: "Café Americano",
      description: "Café negro tradicional",
      price: 3500,
      image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400",
      category: "Café",
      isFeatured: true,
      stars: 4.5,
      additions: [
        { name: "Leche", price: 500 },
        { name: "Azúcar", price: 0 },
        { name: "Crema", price: 800 }
      ]
    },
    {
      name: "Cappuccino",
      description: "Café con leche espumada",
      price: 4500,
      image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400",
      category: "Café",
      isFeatured: true,
      stars: 4.7,
      additions: [
        { name: "Canela", price: 300 },
        { name: "Chocolate", price: 500 },
        { name: "Vainilla", price: 400 }
      ]
    },
    {
      name: "Croissant Clásico",
      description: "Croissant de mantequilla",
      price: 2800,
      image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400",
      category: "Pastelería",
      isFeatured: false,
      stars: 4.3,
      additions: [
        { name: "Mermelada", price: 300 },
        { name: "Mantequilla", price: 200 }
      ]
    }
  ],
  "Burger House": [
    {
      name: "Burger Clásica",
      description: "Hamburguesa con carne, lechuga, tomate y queso",
      price: 15000,
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400",
      category: "Hamburguesas",
      isFeatured: true,
      stars: 4.6,
      additions: [
        { name: "Bacon", price: 2000 },
        { name: "Queso extra", price: 1500 },
        { name: "Salsa especial", price: 800 }
      ]
    },
    {
      name: "Burger BBQ",
      description: "Hamburguesa con salsa BBQ y cebolla caramelizada",
      price: 18000,
      image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400",
      category: "Hamburguesas",
      isFeatured: true,
      stars: 4.8,
      additions: [
        { name: "Bacon", price: 2000 },
        { name: "Queso extra", price: 1500 },
        { name: "Papas fritas", price: 3000 }
      ]
    }
  ],
  "Pizza Express": [
    {
      name: "Pizza Margherita",
      description: "Pizza con tomate, mozzarella y albahaca",
      price: 22000,
      image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400",
      category: "Pizza",
      isFeatured: true,
      stars: 4.4,
      additions: [
        { name: "Pepperoni", price: 3000 },
        { name: "Champiñones", price: 2000 },
        { name: "Aceitunas", price: 1500 }
      ]
    },
    {
      name: "Pizza Hawaiana",
      description: "Pizza con jamón y piña",
      price: 25000,
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400",
      category: "Pizza",
      isFeatured: false,
      stars: 4.2,
      additions: [
        { name: "Extra queso", price: 2000 },
        { name: "Bacon", price: 2500 }
      ]
    }
  ],
  "Sushi Master": [
    {
      name: "Roll California",
      description: "Roll con cangrejo, aguacate y pepino",
      price: 28000,
      image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400",
      category: "Sushi",
      isFeatured: true,
      stars: 4.7,
      additions: [
        { name: "Salsa de soya", price: 0 },
        { name: "Wasabi", price: 0 },
        { name: "Jengibre", price: 0 }
      ]
    },
    {
      name: "Roll Salmón",
      description: "Roll con salmón fresco y aguacate",
      price: 32000,
      image: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=400",
      category: "Sushi",
      isFeatured: true,
      stars: 4.9,
      additions: [
        { name: "Salsa de soya", price: 0 },
        { name: "Wasabi", price: 0 },
        { name: "Jengibre", price: 0 }
      ]
    }
  ]
};

// Categorías por tipo de restaurante
const getCategoriesByRestaurantType = (restaurantName) => {
  const categories = {
    "El Sabor Colombiano": [
      { name: "Desayunos", order: 1 },
      { name: "Almuerzos", order: 2 },
      { name: "Platos a la Carta", order: 3 },
      { name: "Cenas", order: 4 },
      { name: "Bebidas", order: 5 }
    ],
    "Pizza Express": [
      { name: "Pizzas", order: 1 },
      { name: "Bebidas", order: 2 },
      { name: "Postres", order: 3 }
    ],
    "Burger House": [
      { name: "Hamburguesas", order: 1 },
      { name: "Acompañamientos", order: 2 },
      { name: "Bebidas", order: 3 },
      { name: "Postres", order: 4 }
    ],
    "Sushi Master": [
      { name: "Rolls", order: 1 },
      { name: "Nigiri", order: 2 },
      { name: "Sashimi", order: 3 },
      { name: "Bebidas", order: 4 }
    ],
    "Café del Sol": [
      { name: "Cafés", order: 1 },
      { name: "Tés", order: 2 },
      { name: "Pastelería", order: 3 },
      { name: "Desayunos", order: 4 }
    ],
    "Tacos Mexicanos": [
      { name: "Tacos", order: 1 },
      { name: "Quesadillas", order: 2 },
      { name: "Bebidas", order: 3 }
    ],
    "Pollo Asado": [
      { name: "Pollo", order: 1 },
      { name: "Acompañamientos", order: 2 },
      { name: "Bebidas", order: 3 }
    ],
    "Helados Artesanales": [
      { name: "Helados", order: 1 },
      { name: "Granizados", order: 2 },
      { name: "Bebidas", order: 3 }
    ],
    "Sandwiches Gourmet": [
      { name: "Sandwiches", order: 1 },
      { name: "Ensaladas", order: 2 },
      { name: "Bebidas", order: 3 }
    ],
    "Bebidas Refrescantes": [
      { name: "Jugos Naturales", order: 1 },
      { name: "Limonadas", order: 2 },
      { name: "Smoothies", order: 3 },
      { name: "Bebidas Gaseosas", order: 4 }
    ]
  };
  
  return categories[restaurantName] || [];
};

// Productos por categoría
const getProductsByCategory = (categoryName, restaurantId) => {
  const products = {
    "Desayunos": [
      {
        name: "Calentado Colombiano",
        description: "Arroz, frijoles, huevo, plátano y carne",
        price: 18000,
        originalPrice: 20000,
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400",
        stars: 4.5,
        reviews: 23,
        tags: ["típico", "colombiano", "desayuno"],
        preparationTime: "15 min",
        hasAdditions: true
      },
      {
        name: "Arepa con Huevo",
        description: "Arepa de maíz con huevo revuelto y queso",
        price: 8000,
        originalPrice: 9000,
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400",
        stars: 4.3,
        reviews: 18,
        tags: ["arepa", "huevo", "desayuno"],
        preparationTime: "10 min",
        hasAdditions: false
      }
    ],
    "Pizzas": [
      {
        name: "Pizza Margherita",
        description: "Salsa de tomate, mozzarella y albahaca",
        price: 25000,
        originalPrice: 28000,
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400",
        stars: 4.6,
        reviews: 45,
        tags: ["pizza", "margherita", "clásica"],
        preparationTime: "20 min",
        hasAdditions: true
      },
      {
        name: "Pizza Hawaiana",
        description: "Salsa de tomate, mozzarella, jamón y piña",
        price: 28000,
        originalPrice: 32000,
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400",
        stars: 4.4,
        reviews: 32,
        tags: ["pizza", "hawaiana", "jamón"],
        preparationTime: "25 min",
        hasAdditions: true
      }
    ],
    "Hamburguesas": [
      {
        name: "Hamburguesa Clásica",
        description: "Carne, lechuga, tomate, cebolla y queso",
        price: 15000,
        originalPrice: 18000,
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400",
        stars: 4.7,
        reviews: 67,
        tags: ["hamburguesa", "clásica", "carne"],
        preparationTime: "15 min",
        hasAdditions: true
      },
      {
        name: "Hamburguesa Todo Terreno",
        description: "Doble carne, bacon, queso, lechuga, tomate y salsa especial",
        price: 22000,
        originalPrice: 25000,
        image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400",
        stars: 4.8,
        reviews: 89,
        tags: ["hamburguesa", "doble", "bacon"],
        preparationTime: "20 min",
        hasAdditions: true
      }
    ],
    "Bebidas": [
      {
        name: "Coca-Cola",
        description: "Bebida gaseosa Coca-Cola",
        price: 3000,
        originalPrice: 3500,
        image: "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400",
        stars: 4.2,
        reviews: 156,
        tags: ["bebida", "gaseosa", "coca-cola"],
        preparationTime: "2 min",
        hasAdditions: true
      },
      {
        name: "Pepsi",
        description: "Bebida gaseosa Pepsi",
        price: 2800,
        originalPrice: 3200,
        image: "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400",
        stars: 4.0,
        reviews: 98,
        tags: ["bebida", "gaseosa", "pepsi"],
        preparationTime: "2 min",
        hasAdditions: true
      }
    ]
  };
  
  return products[categoryName] || [];
};

// Adiciones por producto
const getAdditionsByProduct = (productName) => {
  const additions = {
    "Hamburguesa Todo Terreno": [
      {
        name: "Carne Extra",
        description: "Porción adicional de carne",
        price: 5000,
        category: "extra",
        maxQuantity: 3
      },
      {
        name: "Queso Extra",
        description: "Porción adicional de queso",
        price: 2000,
        category: "extra",
        maxQuantity: 2
      },
      {
        name: "Bacon Extra",
        description: "Porción adicional de bacon",
        price: 3000,
        category: "extra",
        maxQuantity: 2
      }
    ],
    "Pizza Margherita": [
      {
        name: "Queso Extra",
        description: "Porción adicional de mozzarella",
        price: 3000,
        category: "extra",
        maxQuantity: 2
      },
      {
        name: "Pepperoni",
        description: "Agregar pepperoni a la pizza",
        price: 4000,
        category: "extra",
        maxQuantity: 1
      }
    ],
    "Coca-Cola": [
      {
        name: "Tamaño Pequeño",
        description: "350ml",
        price: 0,
        category: "size",
        maxQuantity: 1
      },
      {
        name: "Tamaño Mediano",
        description: "500ml",
        price: 500,
        category: "size",
        maxQuantity: 1
      },
      {
        name: "Tamaño Grande",
        description: "1L",
        price: 1000,
        category: "size",
        maxQuantity: 1
      }
    ],
    "Pepsi": [
      {
        name: "Tamaño Pequeño",
        description: "350ml",
        price: 0,
        category: "size",
        maxQuantity: 1
      },
      {
        name: "Tamaño Mediano",
        description: "500ml",
        price: 500,
        category: "size",
        maxQuantity: 1
      },
      {
        name: "Tamaño Grande",
        description: "1L",
        price: 1000,
        category: "size",
        maxQuantity: 1
      }
    ]
  };
  
  return additions[productName] || [];
};

async function populateDatabase() {
  try {
    console.log('🚀 Iniciando población de base de datos...');

    // 1. Limpiar colecciones existentes (excepto users)
    console.log('🧹 Limpiando colecciones existentes...');
    await clearCollections();

    // 2. Crear categorías
    console.log('📂 Creando categorías...');
    const categories = await createCategories();

    // 3. Crear restaurantes
    console.log('🏪 Creando restaurantes...');
    const restaurants = await createRestaurants();

    // 4. Crear productos para cada restaurante
    console.log('🍕 Creando productos...');
    await createProducts(restaurants);

    console.log('✅ Base de datos poblada exitosamente!');
    console.log(`📊 Estadísticas:`);
    console.log(`   - ${categories.length} categorías creadas`);
    console.log(`   - ${restaurants.length} restaurantes creados`);
    console.log(`   - Productos creados para ${Object.keys(PRODUCTS_DATA).length} restaurantes`);

  } catch (error) {
    console.error('❌ Error poblando base de datos:', error);
    throw error;
  }
}

async function clearCollections() {
  const collectionsToClear = ['restaurants', 'categories', 'products', 'additions'];
  
  for (const collectionName of collectionsToClear) {
    try {
      const snapshot = await db.collection(collectionName).get();
      const batch = db.batch();
      
      snapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });
      
      await batch.commit();
      console.log(`   ✅ Colección ${collectionName} limpiada`);
    } catch (error) {
      console.log(`   ⚠️ Error limpiando ${collectionName}:`, error.message);
    }
  }
}

async function createCategories() {
  const categories = [];
  
  for (const categoryData of CATEGORIES_DATA) {
    const categoryRef = db.collection('categories').doc();
    const category = {
      id: categoryRef.id,
      ...categoryData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await categoryRef.set(category);
    categories.push(category);
  }
  
  return categories;
}

async function createRestaurants() {
  const restaurants = [];
  
  for (const restaurantData of RESTAURANTS_DATA) {
    const restaurantRef = db.collection('restaurants').doc();
    const restaurant = {
      id: restaurantRef.id,
      ...restaurantData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await restaurantRef.set(restaurant);
    restaurants.push(restaurant);
  }
  
  return restaurants;
}

async function createProducts(restaurants) {
  for (const restaurant of restaurants) {
    const products = PRODUCTS_DATA[restaurant.name] || [];
    
    for (const productData of products) {
      const productRef = db.collection('products').doc();
      const product = {
        id: productRef.id,
        restaurantId: restaurant.id,
        restaurant: {
          id: restaurant.id,
          name: restaurant.name,
          image: restaurant.image
        },
        ...productData,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      await productRef.set(product);
    }
    
    console.log(`   ✅ ${products.length} productos creados para ${restaurant.name}`);
  }
}

module.exports = { populateDatabase }; 