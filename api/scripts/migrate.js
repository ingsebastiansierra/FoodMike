const { db } = require('../src/config/firebase');
require('dotenv').config();

// Datos de restaurantes (desde el frontend actual)
const RESTAURANTS_DATA = [
  {
    id: "1",
    name: "El Corral Gourmet",
    description: "Hamburguesas gourmet con ingredientes frescos y de la más alta calidad",
    address: "Calle 123 # 45-67, Centro",
    phone: "+57 300 123 4567",
    email: "info@elcorral.com",
    stars: 4.5,
    reviews: 128,
    deliveryTime: "25-35 min",
    deliveryFee: 2000,
    minOrder: 15000,
    image: {
      uri: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    coverImage: {
      uri: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    },
    categories: ["Hamburguesas", "Fast Food", "Americana"],
    isOpen: true,
    products: [
      {
        id: "1",
        name: "Hamburguesa Clásica Especial",
        description: "Carne 100% de res, lechuga, tomate, cebolla, queso cheddar y salsa especial",
        price: 25000,
        originalPrice: 28000,
        image: {
          uri: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3",
        },
        category: "Hamburguesas",
        stars: 4.5,
        reviews: 89,
        tags: ["Popular", "Recomendado"],
        isAvailable: true,
        isPopular: true,
        preparationTime: "15-20 min",
        allergens: ["Gluten", "Lactosa"],
        nutritionalInfo: {
          calories: 650,
          protein: 35,
          carbs: 45,
          fat: 28
        }
      },
      {
        id: "2",
        name: "Hamburguesa Doble Queso",
        description: "Doble carne, doble queso, bacon crujiente y salsa BBQ",
        price: 32000,
        originalPrice: 35000,
        image: {
          uri: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?ixlib=rb-4.0.3",
        },
        category: "Hamburguesas",
        stars: 4.8,
        reviews: 156,
        tags: ["Premium", "Doble"],
        isAvailable: true,
        isPopular: true,
        preparationTime: "20-25 min",
        allergens: ["Gluten", "Lactosa"],
        nutritionalInfo: {
          calories: 850,
          protein: 45,
          carbs: 55,
          fat: 42
        }
      }
    ]
  },
  {
    id: "2",
    name: "McDonald's Express",
    description: "Comida rápida americana con la calidad que conoces",
    address: "Avenida 456 # 78-90, Norte",
    phone: "+57 300 234 5678",
    email: "contact@mcdonalds.com",
    stars: 4.0,
    reviews: 89,
    deliveryTime: "20-30 min",
    deliveryFee: 1500,
    minOrder: 12000,
    image: {
      uri: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    coverImage: {
      uri: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    },
    categories: ["Fast Food", "Hamburguesas", "Americana"],
    isOpen: true,
    products: [
      {
        id: "3",
        name: "Big Mac",
        description: "Hamburguesa con doble carne, lechuga, queso, pepinillos, cebolla y salsa especial",
        price: 18000,
        originalPrice: 20000,
        image: {
          uri: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3",
        },
        category: "Hamburguesas",
        stars: 4.2,
        reviews: 234,
        tags: ["Clásico", "Popular"],
        isAvailable: true,
        isPopular: true,
        preparationTime: "10-15 min",
        allergens: ["Gluten", "Lactosa"],
        nutritionalInfo: {
          calories: 550,
          protein: 25,
          carbs: 40,
          fat: 30
        }
      }
    ]
  },
  {
    id: "3",
    name: "Pizza Hut",
    description: "Las mejores pizzas con ingredientes frescos y masa artesanal",
    address: "Calle 234 # 56-78, Norte",
    phone: "+57 300 345 6789",
    email: "info@pizzahut.com",
    stars: 4.3,
    reviews: 167,
    deliveryTime: "30-45 min",
    deliveryFee: 2500,
    minOrder: 20000,
    image: {
      uri: "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    coverImage: {
      uri: "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    },
    categories: ["Pizza", "Italiana", "Familiar"],
    isOpen: true,
    products: [
      {
        id: "4",
        name: "Pizza Suprema",
        description: "Pizza con pepperoni, salchicha, pimientos, cebolla, aceitunas y queso mozzarella",
        price: 35000,
        originalPrice: 38000,
        image: {
          uri: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?ixlib=rb-4.0.3",
        },
        category: "Pizza",
        stars: 4.6,
        reviews: 198,
        tags: ["Suprema", "Popular"],
        isAvailable: true,
        isPopular: true,
        preparationTime: "25-35 min",
        allergens: ["Gluten", "Lactosa"],
        nutritionalInfo: {
          calories: 280,
          protein: 12,
          carbs: 35,
          fat: 10
        }
      }
    ]
  },
  {
    id: "4",
    name: "KFC Original",
    description: "Pollo frito original con 11 hierbas y especias secretas",
    address: "Transversal 012 # 34-56, Este",
    phone: "+57 300 456 7890",
    email: "contact@kfc.com",
    stars: 4.2,
    reviews: 145,
    deliveryTime: "25-40 min",
    deliveryFee: 2000,
    minOrder: 18000,
    image: {
      uri: "https://images.unsplash.com/photo-1567620832904-9fe5cf23bc43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    coverImage: {
      uri: "https://images.unsplash.com/photo-1567620832904-9fe5cf23bc43?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    },
    categories: ["Pollo", "Fast Food", "Americana"],
    isOpen: true,
    products: [
      {
        id: "5",
        name: "Pollo Broster Familiar",
        description: "8 piezas de pollo frito original con papas fritas y bebida",
        price: 45000,
        originalPrice: 50000,
        image: {
          uri: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?ixlib=rb-4.0.3",
        },
        category: "Pollo",
        stars: 4.4,
        reviews: 267,
        tags: ["Familiar", "Popular"],
        isAvailable: true,
        isPopular: true,
        preparationTime: "20-30 min",
        allergens: ["Gluten"],
        nutritionalInfo: {
          calories: 1200,
          protein: 65,
          carbs: 80,
          fat: 75
        }
      }
    ]
  }
];

// Función para migrar restaurantes
async function migrateRestaurants() {
  console.log('🔄 Iniciando migración de restaurantes...');
  
  try {
    for (const restaurant of RESTAURANTS_DATA) {
      const { products, ...restaurantData } = restaurant;
      
      // Crear restaurante
      const restaurantRef = await db.collection('restaurants').doc(restaurant.id).set({
        ...restaurantData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      console.log(`✅ Restaurante "${restaurant.name}" migrado correctamente`);
      
      // Migrar productos del restaurante
      for (const product of products) {
        await db.collection('products').doc(product.id).set({
          ...product,
          restaurantId: restaurant.id,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        
        console.log(`  ✅ Producto "${product.name}" migrado correctamente`);
      }
    }
    
    console.log('🎉 Migración completada exitosamente');
  } catch (error) {
    console.error('❌ Error durante la migración:', error);
  }
}

// Función para limpiar datos existentes
async function clearData() {
  console.log('🧹 Limpiando datos existentes...');
  
  try {
    // Limpiar productos
    const productsSnapshot = await db.collection('products').get();
    const productDeletions = productsSnapshot.docs.map(doc => doc.ref.delete());
    await Promise.all(productDeletions);
    
    // Limpiar restaurantes
    const restaurantsSnapshot = await db.collection('restaurants').get();
    const restaurantDeletions = restaurantsSnapshot.docs.map(doc => doc.ref.delete());
    await Promise.all(restaurantDeletions);
    
    console.log('✅ Datos limpiados correctamente');
  } catch (error) {
    console.error('❌ Error limpiando datos:', error);
  }
}

// Función principal
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--clear')) {
    await clearData();
  }
  
  await migrateRestaurants();
  
  console.log('🏁 Proceso completado');
  process.exit(0);
}

// Ejecutar migración
main().catch(error => {
  console.error('❌ Error fatal:', error);
  process.exit(1);
}); 