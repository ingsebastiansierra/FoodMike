const { db } = require('../src/config/firebase');
const Restaurant = require('../src/models/Restaurant');
const Category = require('../src/models/Category');
const Product = require('../src/models/Product');
const Addition = require('../src/models/Addition');

// Utilidades para generar datos aleatorios
const randomFromArray = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomPrice = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomStars = () => (Math.random() * 1.5 + 3.5).toFixed(1);
const randomReviews = () => Math.floor(Math.random() * 400) + 50;

const RESTAURANTS = [
  // Asadero de Pollo
  {
    name: "Asadero El Pollo Feliz",
    type: "Asadero de Pollo",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800",
    coverImage: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200",
    address: "Cra 10 #20-30, Bogotá",
    phone: "+57 300 111 2222",
    email: "contacto@pollofeliz.com",
    deliveryFee: 2000,
    minOrder: 15000,
    isFeatured: true,
    schedule: {
      monday: { open: "11:00", close: "22:00" },
      tuesday: { open: "11:00", close: "22:00" },
      wednesday: { open: "11:00", close: "22:00" },
      thursday: { open: "11:00", close: "22:00" },
      friday: { open: "11:00", close: "23:00" },
      saturday: { open: "11:00", close: "23:00" },
      sunday: { open: "11:00", close: "21:00" }
    },
    specialties: ["Pollo asado", "Papas fritas", "Arepas"],
    categories: [
      {
        name: "Pollo Asado",
        icon: "🍗",
        products: [
          { name: "Pollo Entero", description: "Pollo asado entero con papas y arepas", price: 35000, image: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?w=800" },
          { name: "Medio Pollo", description: "Medio pollo asado con papas y arepa", price: 20000, image: "https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?w=800" },
          { name: "Cuarto de Pollo", description: "Cuarto de pollo asado con papas", price: 12000, image: "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?w=800" },
          { name: "Alitas BBQ", description: "Alitas de pollo en salsa BBQ", price: 16000, image: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?w=800" },
          { name: "Pechuga Asada", description: "Pechuga de pollo asada con ensalada", price: 18000, image: "https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?w=800" },
          { name: "Brochetas de Pollo", description: "Brochetas de pollo con vegetales", price: 14000, image: "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?w=800" }
        ]
      },
      {
        name: "Acompañamientos",
        icon: "🍟",
        products: [
          { name: "Papas Fritas", description: "Porción de papas fritas crocantes", price: 6000, image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800" },
          { name: "Arepas", description: "Arepas de maíz recién hechas", price: 4000, image: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?w=800" },
          { name: "Ensalada", description: "Ensalada fresca de la casa", price: 5000, image: "https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?w=800" },
          { name: "Yuca Frita", description: "Porción de yuca frita", price: 6000, image: "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?w=800" },
          { name: "Mazorca", description: "Mazorca asada con mantequilla", price: 7000, image: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?w=800" },
          { name: "Guacamole", description: "Guacamole casero", price: 8000, image: "https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?w=800" }
        ]
      },
      {
        name: "Bebidas",
        icon: "🥤",
        products: [
          { name: "Gaseosa 1.5L", description: "Botella de gaseosa 1.5 litros", price: 6000, image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800" },
          { name: "Jugo Natural", description: "Jugo natural de frutas", price: 5000, image: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?w=800" },
          { name: "Agua", description: "Botella de agua", price: 3000, image: "https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?w=800" },
          { name: "Cerveza", description: "Cerveza nacional", price: 7000, image: "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?w=800" },
          { name: "Limonada", description: "Limonada natural", price: 5000, image: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?w=800" },
          { name: "Té frío", description: "Té frío de durazno", price: 4000, image: "https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?w=800" }
        ]
      }
    ]
  },
  // Pizzería
  {
    name: "Pizzería Napoli",
    type: "Pizzería",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800",
    coverImage: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1200",
    address: "Av 19 #120-45, Bogotá",
    phone: "+57 300 222 3333",
    email: "info@napolipizza.com",
    deliveryFee: 0,
    minOrder: 20000,
    isFeatured: true,
    schedule: {
      monday: { open: "12:00", close: "23:00" },
      tuesday: { open: "12:00", close: "23:00" },
      wednesday: { open: "12:00", close: "23:00" },
      thursday: { open: "12:00", close: "23:00" },
      friday: { open: "12:00", close: "00:00" },
      saturday: { open: "12:00", close: "00:00" },
      sunday: { open: "12:00", close: "22:00" }
    },
    specialties: ["Pizza artesanal", "Calzone", "Lasaña"],
    categories: [
      {
        name: "Pizzas",
        icon: "🍕",
        products: [
          { name: "Pizza Margarita", description: "Queso mozzarella, tomate y albahaca", price: 22000, image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800" },
          { name: "Pizza Hawaiana", description: "Jamón, piña y queso mozzarella", price: 25000, image: "https://images.unsplash.com/photo-1548365328-9c6dbb6b8b76?w=800" },
          { name: "Pizza Pepperoni", description: "Pepperoni y queso mozzarella", price: 26000, image: "https://images.unsplash.com/photo-1542281286-9e0a16bb7366?w=800" },
          { name: "Pizza Vegetariana", description: "Vegetales frescos y queso", price: 24000, image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800" },
          { name: "Pizza BBQ Pollo", description: "Pollo, salsa BBQ y cebolla", price: 27000, image: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?w=800" },
          { name: "Pizza 4 Quesos", description: "Mezcla de quesos gourmet", price: 28000, image: "https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?w=800" }
        ]
      },
      {
        name: "Entradas",
        icon: "🥖",
        products: [
          { name: "Pan de Ajo", description: "Pan artesanal con ajo y mantequilla", price: 7000, image: "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?w=800" },
          { name: "Bruschetta", description: "Pan tostado con tomate y albahaca", price: 9000, image: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?w=800" },
          { name: "Ensalada Caprese", description: "Mozzarella, tomate y albahaca", price: 12000, image: "https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?w=800" },
          { name: "Calzone", description: "Calzone relleno de jamón y queso", price: 18000, image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800" },
          { name: "Lasaña", description: "Lasaña de carne y queso", price: 20000, image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800" },
          { name: "Bastones de Queso", description: "Palitos de queso mozzarella", price: 8000, image: "https://images.unsplash.com/photo-1548365328-9c6dbb6b8b76?w=800" }
        ]
      },
      {
        name: "Bebidas",
        icon: "🥤",
        products: [
          { name: "Gaseosa", description: "Gaseosa personal", price: 4000, image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800" },
          { name: "Jugo de Naranja", description: "Jugo natural de naranja", price: 6000, image: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?w=800" },
          { name: "Agua", description: "Botella de agua", price: 3000, image: "https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?w=800" },
          { name: "Cerveza", description: "Cerveza artesanal", price: 8000, image: "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?w=800" },
          { name: "Limonada", description: "Limonada natural", price: 5000, image: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?w=800" },
          { name: "Té frío", description: "Té frío de durazno", price: 4000, image: "https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?w=800" }
        ]
      }
    ]
  },
  // ...7 restaurantes más con estructura similar...
  // Hamburguesería
  {
    name: "Burger House",
    type: "Hamburguesería",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800",
    coverImage: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1200",
    address: "Calle 45 #67-89, Medellín",
    phone: "+57 300 333 4444",
    email: "info@burgerhouse.com",
    deliveryFee: 2500,
    minOrder: 18000,
    isFeatured: true,
    schedule: {
      monday: { open: "12:00", close: "22:00" },
      tuesday: { open: "12:00", close: "22:00" },
      wednesday: { open: "12:00", close: "22:00" },
      thursday: { open: "12:00", close: "22:00" },
      friday: { open: "12:00", close: "23:00" },
      saturday: { open: "12:00", close: "23:00" },
      sunday: { open: "12:00", close: "21:00" }
    },
    specialties: ["Hamburguesas gourmet", "Papas a la francesa", "Malteadas"],
    categories: [
      {
        name: "Hamburguesas",
        icon: "🍔",
        products: [
          { name: "Burger Clásica", description: "Carne 150g, queso, lechuga, tomate", price: 15000, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800" },
          { name: "Burger BBQ", description: "Carne, queso, cebolla crispy, salsa BBQ", price: 18000, image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800" },
          { name: "Burger Doble", description: "Doble carne, doble queso", price: 22000, image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800" },
          { name: "Burger Pollo", description: "Pechuga de pollo crispy, lechuga, tomate", price: 17000, image: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?w=800" },
          { name: "Burger Veggie", description: "Hamburguesa vegetariana de garbanzo", price: 16000, image: "https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?w=800" },
          { name: "Burger Mexicana", description: "Carne, guacamole, jalapeños", price: 19000, image: "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?w=800" }
        ]
      },
      {
        name: "Acompañamientos",
        icon: "🍟",
        products: [
          { name: "Papas a la Francesa", description: "Porción de papas fritas", price: 7000, image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800" },
          { name: "Aros de Cebolla", description: "Aros de cebolla crocantes", price: 8000, image: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?w=800" },
          { name: "Nuggets de Pollo", description: "Nuggets de pollo con salsa", price: 9000, image: "https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?w=800" },
          { name: "Mazorca", description: "Mazorca asada con mantequilla", price: 7000, image: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?w=800" },
          { name: "Ensalada", description: "Ensalada fresca de la casa", price: 6000, image: "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?w=800" },
          { name: "Guacamole", description: "Guacamole casero", price: 8000, image: "https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?w=800" }
        ]
      },
      {
        name: "Bebidas",
        icon: "🥤",
        products: [
          { name: "Malteada de Chocolate", description: "Malteada con helado de chocolate", price: 9000, image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800" },
          { name: "Malteada de Fresa", description: "Malteada con helado de fresa", price: 9000, image: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?w=800" },
          { name: "Gaseosa", description: "Gaseosa personal", price: 4000, image: "https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?w=800" },
          { name: "Jugo de Mango", description: "Jugo natural de mango", price: 6000, image: "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?w=800" },
          { name: "Agua", description: "Botella de agua", price: 3000, image: "https://images.unsplash.com/photo-1548365328-9c6dbb6b8b76?w=800" },
          { name: "Cerveza", description: "Cerveza nacional", price: 7000, image: "https://images.unsplash.com/photo-1548365328-9c6dbb6b8b76?w=800" }
        ]
      }
    ]
  },
  // Mexicana
  {
    name: "Tacos y Salsas",
    type: "Restaurante Mexicano",
    image: "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?w=800",
    coverImage: "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?w=1200",
    address: "Av 68 #45-67, Cali",
    phone: "+57 300 444 5555",
    email: "info@tacosysalsas.com",
    deliveryFee: 3000,
    minOrder: 18000,
    isFeatured: true,
    schedule: {
      monday: { open: "12:00", close: "22:00" },
      tuesday: { open: "12:00", close: "22:00" },
      wednesday: { open: "12:00", close: "22:00" },
      thursday: { open: "12:00", close: "22:00" },
      friday: { open: "12:00", close: "23:00" },
      saturday: { open: "12:00", close: "23:00" },
      sunday: { open: "12:00", close: "21:00" }
    },
    specialties: ["Tacos", "Burritos", "Quesadillas"],
    categories: [
      {
        name: "Tacos",
        icon: "🌮",
        products: [
          { name: "Taco de Pollo", description: "Tortilla de maíz, pollo, salsa y vegetales", price: 9000, image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800" },
          { name: "Taco de Res", description: "Tortilla de maíz, carne de res, guacamole", price: 10000, image: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?w=800" },
          { name: "Taco Veggie", description: "Tortilla de maíz, vegetales frescos", price: 8500, image: "https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?w=800" },
          { name: "Taco Pastor", description: "Carne al pastor, piña y cebolla", price: 11000, image: "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?w=800" },
          { name: "Taco de Chorizo", description: "Chorizo, cebolla y cilantro", price: 9500, image: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?w=800" },
          { name: "Taco de Camarón", description: "Camarón, salsa especial y vegetales", price: 12000, image: "https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?w=800" }
        ]
      },
      {
        name: "Burritos",
        icon: "🌯",
        products: [
          { name: "Burrito de Pollo", description: "Tortilla de trigo, pollo, arroz, frijoles", price: 13000, image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800" },
          { name: "Burrito de Res", description: "Tortilla de trigo, carne de res, arroz, frijoles", price: 14000, image: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?w=800" },
          { name: "Burrito Veggie", description: "Tortilla de trigo, vegetales frescos", price: 12000, image: "https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?w=800" },
          { name: "Burrito Pastor", description: "Carne al pastor, arroz, frijoles", price: 14500, image: "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?w=800" },
          { name: "Burrito de Chorizo", description: "Chorizo, arroz, frijoles", price: 13500, image: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?w=800" },
          { name: "Burrito de Camarón", description: "Camarón, arroz, frijoles", price: 15000, image: "https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?w=800" }
        ]
      },
      {
        name: "Bebidas",
        icon: "🥤",
        products: [
          { name: "Agua Fresca", description: "Agua fresca de frutas", price: 5000, image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800" },
          { name: "Margarita", description: "Cóctel margarita clásico", price: 12000, image: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?w=800" },
          { name: "Cerveza Mexicana", description: "Cerveza importada", price: 9000, image: "https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?w=800" },
          { name: "Jugo de Mango", description: "Jugo natural de mango", price: 6000, image: "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?w=800" },
          { name: "Gaseosa", description: "Gaseosa personal", price: 4000, image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800" },
          { name: "Limonada", description: "Limonada natural", price: 5000, image: "https://images.unsplash.com/photo-1548365328-9c6dbb6b8b76?w=800" }
        ]
      }
    ]
  },
  // ...4 más: Sandwichería, Sushi, Colombiana, Postres, Vegetariano...
  {
    name: "Sandwich Gourmet",
    type: "Sandwichería",
    image: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?w=800",
    coverImage: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?w=1200",
    address: "Cra 7 #45-12, Bogotá",
    phone: "+57 300 555 6666",
    email: "info@sandwichgourmet.com",
    deliveryFee: 1500,
    minOrder: 12000,
    isFeatured: false,
    schedule: {
      monday: { open: "10:00", close: "21:00" },
      tuesday: { open: "10:00", close: "21:00" },
      wednesday: { open: "10:00", close: "21:00" },
      thursday: { open: "10:00", close: "21:00" },
      friday: { open: "10:00", close: "22:00" },
      saturday: { open: "11:00", close: "22:00" },
      sunday: { open: "11:00", close: "20:00" }
    },
    specialties: ["Sandwiches artesanales", "Wraps", "Jugos naturales"],
    categories: [
      {
        name: "Sandwiches",
        icon: "🥪",
        products: [
          { name: "Sandwich de Pollo", description: "Pollo, lechuga, tomate, mayonesa", price: 12000, image: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?w=800" },
          { name: "Sandwich de Jamón y Queso", description: "Jamón, queso, mantequilla", price: 11000, image: "https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?w=800" },
          { name: "Sandwich Veggie", description: "Vegetales frescos, hummus", price: 10000, image: "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?w=800" },
          { name: "Sandwich de Atún", description: "Atún, lechuga, tomate, mayonesa", price: 13000, image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800" },
          { name: "Sandwich de Roast Beef", description: "Roast beef, queso, mostaza", price: 14000, image: "https://images.unsplash.com/photo-1548365328-9c6dbb6b8b76?w=800" },
          { name: "Sandwich Caprese", description: "Mozzarella, tomate, albahaca", price: 12000, image: "https://images.unsplash.com/photo-1542281286-9e0a16bb7366?w=800" }
        ]
      },
      {
        name: "Wraps",
        icon: "🌯",
        products: [
          { name: "Wrap de Pollo", description: "Pollo, vegetales, salsa de yogur", price: 13000, image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800" },
          { name: "Wrap Veggie", description: "Vegetales frescos, hummus", price: 12000, image: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?w=800" },
          { name: "Wrap de Atún", description: "Atún, vegetales, mayonesa", price: 14000, image: "https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?w=800" },
          { name: "Wrap de Roast Beef", description: "Roast beef, vegetales, mostaza", price: 15000, image: "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?w=800" },
          { name: "Wrap Caprese", description: "Mozzarella, tomate, albahaca", price: 13000, image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800" },
          { name: "Wrap de Jamón y Queso", description: "Jamón, queso, vegetales", price: 12000, image: "https://images.unsplash.com/photo-1548365328-9c6dbb6b8b76?w=800" }
        ]
      },
      {
        name: "Bebidas",
        icon: "🥤",
        products: [
          { name: "Jugo de Naranja", description: "Jugo natural de naranja", price: 6000, image: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?w=800" },
          { name: "Jugo de Mango", description: "Jugo natural de mango", price: 6000, image: "https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?w=800" },
          { name: "Jugo de Fresa", description: "Jugo natural de fresa", price: 6000, image: "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?w=800" },
          { name: "Gaseosa", description: "Gaseosa personal", price: 4000, image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800" },
          { name: "Agua", description: "Botella de agua", price: 3000, image: "https://images.unsplash.com/photo-1548365328-9c6dbb6b8b76?w=800" },
          { name: "Té frío", description: "Té frío de durazno", price: 4000, image: "https://images.unsplash.com/photo-1542281286-9e0a16bb7366?w=800" }
        ]
      }
    ]
  },
  // Sushi
  {
    name: "Sushi Master",
    type: "Sushi Bar",
    image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800",
    coverImage: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=1200",
    address: "Calle 80 #12-34, Bogotá",
    phone: "+57 300 666 7777",
    email: "info@sushimaster.com",
    deliveryFee: 4000,
    minOrder: 25000,
    isFeatured: false,
    schedule: {
      monday: { open: "12:00", close: "22:00" },
      tuesday: { open: "12:00", close: "22:00" },
      wednesday: { open: "12:00", close: "22:00" },
      thursday: { open: "12:00", close: "22:00" },
      friday: { open: "12:00", close: "23:00" },
      saturday: { open: "12:00", close: "23:00" },
      sunday: { open: "12:00", close: "21:00" }
    },
    specialties: ["Sushi fresco", "Ramen", "Tempura"],
    categories: [
      {
        name: "Sushi Rolls",
        icon: "🍣",
        products: [
          { name: "Roll California", description: "Cangrejo, aguacate, pepino", price: 28000, image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800" },
          { name: "Roll Salmón", description: "Salmón fresco, aguacate", price: 32000, image: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?w=800" },
          { name: "Roll Tempura", description: "Camarón tempura, aguacate", price: 30000, image: "https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?w=800" },
          { name: "Roll Veggie", description: "Vegetales frescos", price: 25000, image: "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?w=800" },
          { name: "Roll Atún", description: "Atún fresco, pepino", price: 31000, image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800" },
          { name: "Roll Ebi", description: "Camarón, aguacate", price: 29000, image: "https://images.unsplash.com/photo-1548365328-9c6dbb6b8b76?w=800" }
        ]
      },
      {
        name: "Ramen",
        icon: "🍜",
        products: [
          { name: "Ramen Clásico", description: "Caldo de cerdo, fideos, huevo", price: 27000, image: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?w=800" },
          { name: "Ramen Pollo", description: "Caldo de pollo, fideos, vegetales", price: 26000, image: "https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?w=800" },
          { name: "Ramen Veggie", description: "Caldo de vegetales, tofu", price: 25000, image: "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?w=800" },
          { name: "Ramen Picante", description: "Caldo picante, cerdo, huevo", price: 28000, image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800" },
          { name: "Ramen Mariscos", description: "Caldo de mariscos, fideos", price: 30000, image: "https://images.unsplash.com/photo-1548365328-9c6dbb6b8b76?w=800" },
          { name: "Ramen Miso", description: "Caldo miso, cerdo, vegetales", price: 29000, image: "https://images.unsplash.com/photo-1542281286-9e0a16bb7366?w=800" }
        ]
      },
      {
        name: "Bebidas",
        icon: "🥤",
        products: [
          { name: "Té Verde", description: "Té verde japonés", price: 6000, image: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?w=800" },
          { name: "Sake", description: "Sake tradicional", price: 12000, image: "https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?w=800" },
          { name: "Agua", description: "Botella de agua", price: 3000, image: "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?w=800" },
          { name: "Cerveza Japonesa", description: "Cerveza importada", price: 9000, image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800" },
          { name: "Jugo de Mango", description: "Jugo natural de mango", price: 6000, image: "https://images.unsplash.com/photo-1548365328-9c6dbb6b8b76?w=800" },
          { name: "Limonada", description: "Limonada natural", price: 5000, image: "https://images.unsplash.com/photo-1542281286-9e0a16bb7366?w=800" }
        ]
      }
    ]
  },
  // Colombiana
  {
    name: "El Sabor Colombiano",
    type: "Restaurante Colombiano",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800",
    coverImage: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200",
    address: "Calle 123 #45-67, Bogotá",
    phone: "+57 300 777 8888",
    email: "info@elsaborcolombiano.com",
    deliveryFee: 3000,
    minOrder: 15000,
    isFeatured: false,
    schedule: {
      monday: { open: "07:00", close: "22:00" },
      tuesday: { open: "07:00", close: "22:00" },
      wednesday: { open: "07:00", close: "22:00" },
      thursday: { open: "07:00", close: "22:00" },
      friday: { open: "07:00", close: "23:00" },
      saturday: { open: "08:00", close: "23:00" },
      sunday: { open: "08:00", close: "21:00" }
    },
    specialties: ["Bandeja paisa", "Ajiaco", "Sancocho"],
    categories: [
      {
        name: "Platos Típicos",
        icon: "🍲",
        products: [
          { name: "Bandeja Paisa", description: "Frijoles, arroz, carne, chicharrón, huevo", price: 25000, image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800" },
          { name: "Ajiaco", description: "Sopa tradicional de Bogotá", price: 18000, image: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?w=800" },
          { name: "Sancocho", description: "Sopa de carne, pollo y plátano", price: 20000, image: "https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?w=800" },
          { name: "Tamales", description: "Tamales tolimenses", price: 12000, image: "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?w=800" },
          { name: "Lechona", description: "Lechona tolimense", price: 22000, image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800" },
          { name: "Arepa de Huevo", description: "Arepa rellena de huevo", price: 8000, image: "https://images.unsplash.com/photo-1548365328-9c6dbb6b8b76?w=800" }
        ]
      },
      {
        name: "Bebidas",
        icon: "🥤",
        products: [
          { name: "Agua de Panela", description: "Bebida tradicional colombiana", price: 4000, image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800" },
          { name: "Jugo de Lulo", description: "Jugo natural de lulo", price: 6000, image: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?w=800" },
          { name: "Jugo de Mora", description: "Jugo natural de mora", price: 6000, image: "https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?w=800" },
          { name: "Gaseosa", description: "Gaseosa personal", price: 4000, image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800" },
          { name: "Agua", description: "Botella de agua", price: 3000, image: "https://images.unsplash.com/photo-1548365328-9c6dbb6b8b76?w=800" },
          { name: "Limonada", description: "Limonada natural", price: 5000, image: "https://images.unsplash.com/photo-1542281286-9e0a16bb7366?w=800" }
        ]
      }
    ]
  },
  // Postres
  {
    name: "Helados Artesanales",
    type: "Heladería y Postres",
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800",
    coverImage: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=1200",
    address: "Cra 50 #23-45, Barranquilla",
    phone: "+57 300 890 1234",
    email: "helados@artesanales.com",
    deliveryFee: 1500,
    minOrder: 8000,
    isFeatured: false,
    schedule: {
      monday: { open: "10:00", close: "21:00" },
      tuesday: { open: "10:00", close: "21:00" },
      wednesday: { open: "10:00", close: "21:00" },
      thursday: { open: "10:00", close: "21:00" },
      friday: { open: "10:00", close: "22:00" },
      saturday: { open: "11:00", close: "22:00" },
      sunday: { open: "11:00", close: "20:00" }
    },
    specialties: ["Helados artesanales", "Brownies", "Tortas"],
    categories: [
      {
        name: "Helados",
        icon: "🍦",
        products: [
          { name: "Helado de Vainilla", description: "Helado artesanal de vainilla", price: 6000, image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800" },
          { name: "Helado de Chocolate", description: "Helado artesanal de chocolate", price: 6000, image: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?w=800" },
          { name: "Helado de Fresa", description: "Helado artesanal de fresa", price: 6000, image: "https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?w=800" },
          { name: "Helado de Café", description: "Helado artesanal de café", price: 6000, image: "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?w=800" },
          { name: "Helado de Coco", description: "Helado artesanal de coco", price: 6000, image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800" },
          { name: "Helado de Mango", description: "Helado artesanal de mango", price: 6000, image: "https://images.unsplash.com/photo-1548365328-9c6dbb6b8b76?w=800" }
        ]
      },
      {
        name: "Tortas",
        icon: "🍰",
        products: [
          { name: "Torta de Chocolate", description: "Torta húmeda de chocolate", price: 9000, image: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?w=800" },
          { name: "Torta de Zanahoria", description: "Torta de zanahoria con nueces", price: 9000, image: "https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?w=800" },
          { name: "Torta de Queso", description: "Cheesecake artesanal", price: 10000, image: "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?w=800" },
          { name: "Brownie", description: "Brownie de chocolate con nueces", price: 8000, image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800" },
          { name: "Pie de Limón", description: "Pie de limón artesanal", price: 9000, image: "https://images.unsplash.com/photo-1548365328-9c6dbb6b8b76?w=800" },
          { name: "Torta de Vainilla", description: "Torta de vainilla con crema", price: 9000, image: "https://images.unsplash.com/photo-1542281286-9e0a16bb7366?w=800" }
        ]
      },
      {
        name: "Bebidas",
        icon: "🥤",
        products: [
          { name: "Malteada de Vainilla", description: "Malteada con helado de vainilla", price: 7000, image: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?w=800" },
          { name: "Malteada de Chocolate", description: "Malteada con helado de chocolate", price: 7000, image: "https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?w=800" },
          { name: "Jugo de Fresa", description: "Jugo natural de fresa", price: 6000, image: "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?w=800" },
          { name: "Jugo de Mango", description: "Jugo natural de mango", price: 6000, image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800" },
          { name: "Gaseosa", description: "Gaseosa personal", price: 4000, image: "https://images.unsplash.com/photo-1548365328-9c6dbb6b8b76?w=800" },
          { name: "Agua", description: "Botella de agua", price: 3000, image: "https://images.unsplash.com/photo-1542281286-9e0a16bb7366?w=800" }
        ]
      }
    ]
  },
  // Vegetariano
  {
    name: "Verde Vivo",
    type: "Restaurante Vegetariano",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800",
    coverImage: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200",
    address: "Cra 15 #93-47, Bogotá",
    phone: "+57 300 567 8901",
    email: "info@verdevivo.com",
    deliveryFee: 2000,
    minOrder: 12000,
    isFeatured: false,
    schedule: {
      monday: { open: "11:00", close: "21:00" },
      tuesday: { open: "11:00", close: "21:00" },
      wednesday: { open: "11:00", close: "21:00" },
      thursday: { open: "11:00", close: "21:00" },
      friday: { open: "11:00", close: "22:00" },
      saturday: { open: "12:00", close: "22:00" },
      sunday: { open: "12:00", close: "20:00" }
    },
    specialties: ["Comida vegetariana", "Ensaladas", "Jugos naturales"],
    categories: [
      {
        name: "Ensaladas",
        icon: "🥗",
        products: [
          { name: "Ensalada César", description: "Lechuga, crutones, parmesano, aderezo", price: 12000, image: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?w=800" },
          { name: "Ensalada Griega", description: "Queso feta, tomate, pepino, aceitunas", price: 13000, image: "https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?w=800" },
          { name: "Ensalada de Quinoa", description: "Quinoa, vegetales frescos", price: 14000, image: "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?w=800" },
          { name: "Ensalada de Frutas", description: "Frutas frescas de temporada", price: 10000, image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800" },
          { name: "Ensalada Caprese", description: "Mozzarella, tomate, albahaca", price: 12000, image: "https://images.unsplash.com/photo-1548365328-9c6dbb6b8b76?w=800" },
          { name: "Ensalada de Lentejas", description: "Lentejas, vegetales, vinagreta", price: 11000, image: "https://images.unsplash.com/photo-1542281286-9e0a16bb7366?w=800" }
        ]
      },
      {
        name: "Platos Calientes",
        icon: "🍲",
        products: [
          { name: "Lasaña Veggie", description: "Lasaña de vegetales y queso", price: 15000, image: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?w=800" },
          { name: "Hamburguesa Veggie", description: "Hamburguesa de garbanzo y vegetales", price: 16000, image: "https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?w=800" },
          { name: "Tortilla Española", description: "Tortilla de papa y cebolla", price: 12000, image: "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?w=800" },
          { name: "Falafel", description: "Falafel de garbanzo con salsa tahini", price: 13000, image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800" },
          { name: "Curry Vegetariano", description: "Curry de vegetales y arroz", price: 14000, image: "https://images.unsplash.com/photo-1548365328-9c6dbb6b8b76?w=800" },
          { name: "Arepa Veggie", description: "Arepa rellena de vegetales", price: 10000, image: "https://images.unsplash.com/photo-1542281286-9e0a16bb7366?w=800" }
        ]
      },
      {
        name: "Bebidas",
        icon: "🥤",
        products: [
          { name: "Jugo Verde", description: "Jugo de espinaca, manzana y piña", price: 7000, image: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?w=800" },
          { name: "Jugo de Mango", description: "Jugo natural de mango", price: 6000, image: "https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?w=800" },
          { name: "Jugo de Fresa", description: "Jugo natural de fresa", price: 6000, image: "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?w=800" },
          { name: "Gaseosa", description: "Gaseosa personal", price: 4000, image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800" },
          { name: "Agua", description: "Botella de agua", price: 3000, image: "https://images.unsplash.com/photo-1548365328-9c6dbb6b8b76?w=800" },
          { name: "Té frío", description: "Té frío de durazno", price: 4000, image: "https://images.unsplash.com/photo-1542281286-9e0a16bb7366?w=800" }
        ]
      }
    ]
  }
];

const EXTRAS = {
  porciones: [
    { name: "Porción extra de papas", price: 3000 },
    { name: "Porción extra de salsa", price: 2000 }
  ],
  ingredientes: [
    { name: "Queso extra", price: 2500 },
    { name: "Jalapeños", price: 1800 }
  ]
};

async function populateDatabase() {
  // Limpiar colecciones
  const collections = ['products', 'categories', 'restaurants'];
  for (const col of collections) {
    const snap = await db.collection(col).get();
    for (const doc of snap.docs) {
      await doc.ref.delete();
    }
  }

  for (const rest of RESTAURANTS) {
    // Crear restaurante
    const restRef = await db.collection('restaurants').add({
      name: rest.name,
      description: rest.type + ' - ' + rest.specialties.join(', '),
      image: rest.image,
      coverImage: rest.coverImage,
      address: rest.address,
      phone: rest.phone,
      email: rest.email,
      stars: randomStars(),
      reviews: randomReviews(),
      deliveryFee: rest.deliveryFee,
      minOrder: rest.minOrder,
      isOpen: true,
      isFeatured: rest.isFeatured,
      schedule: rest.schedule,
      specialties: rest.specialties,
      createdAt: new Date(),
      updatedAt: new Date(),
      location: {
        lat: 4.65 + Math.random() * 0.1,
        lng: -74.05 + Math.random() * 0.1
      }
    });
    // Crear categorías y productos
    for (const cat of rest.categories) {
      const catRef = await db.collection('categories').add({
        name: cat.name,
        icon: cat.icon,
        restaurantId: restRef.id,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      for (const prod of cat.products) {
        await db.collection('products').add({
          name: prod.name,
          description: prod.description,
          price: prod.price,
          image: prod.image,
          stars: randomStars(),
          reviews: randomReviews(),
          category: cat.name,
          categoryId: catRef.id,
          restaurant: {
            id: restRef.id,
            name: rest.name,
            image: rest.image
          },
          restaurantId: restRef.id,
          isFeatured: Math.random() > 0.7,
          createdAt: new Date(),
          updatedAt: new Date(),
          extras: {
            porciones: EXTRAS.porciones,
            ingredientes: EXTRAS.ingredientes
          }
        });
      }
    }
  }
  console.log('✅ Base de datos poblada con restaurantes, categorías, productos y extras.');
}

populateDatabase(); 