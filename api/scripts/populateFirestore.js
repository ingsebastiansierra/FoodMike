// Script para poblar Firestore con lugares y productos de ejemplo
// Ejecuta este script con: node api/scripts/populateFirestore.js

const admin = require('firebase-admin');
const serviceAccount = require('../../serviceAccountKey.json');

// Inicializar Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Datos de prueba para usuarios
const testUsers = [
  {
    uid: 'admin-001',
    email: 'admin@foodmike.com',
    name: 'Administrador Principal',
    phone: '+573001234567',
    role: 'administrador',
    passwordHash: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8KqKqKq', // password: 123456
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
    isActive: true,
    lastLoginAt: null,
    loginCount: 0,
    profilePhoto: '',
    profile: {
      bio: 'Administrador principal de FoodMike',
      address: 'Bogotá, Colombia',
    }
  },
  {
    uid: 'cliente-001',
    email: 'cliente@test.com',
    name: 'Cliente de Prueba',
    phone: '+573001234568',
    role: 'cliente',
    passwordHash: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8KqKqKq', // password: 123456
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
    isActive: true,
    lastLoginAt: null,
    loginCount: 0,
    profilePhoto: '',
    profile: {
      bio: 'Cliente de prueba',
      address: 'Medellín, Colombia',
    }
  },
  {
    uid: 'cliente-002',
    email: 'maria@test.com',
    name: 'María González',
    phone: '+573001234569',
    role: 'cliente',
    passwordHash: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8KqKqKq', // password: 123456
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date(),
    isActive: true,
    lastLoginAt: null,
    loginCount: 0,
    profilePhoto: '',
    profile: {
      bio: 'Cliente frecuente',
      address: 'Cali, Colombia',
    }
  }
];

// Datos de prueba para restaurantes
const testRestaurants = [
  {
    id: 'rest-001',
    name: 'Restaurante El Buen Sabor',
    description: 'Comida tradicional colombiana',
    address: 'Calle 123 #45-67, Bogotá',
    phone: '+573001234570',
    email: 'info@elbuensabor.com',
    rating: 4.5,
    deliveryTime: '30-45 min',
    minimumOrder: 15000,
    deliveryFee: 3000,
    isActive: true,
    categories: ['tradicional', 'colombiana'],
    imageUrl: 'https://via.placeholder.com/300x200',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  },
  {
    id: 'rest-002',
    name: 'Pizza Express',
    description: 'Las mejores pizzas de la ciudad',
    address: 'Carrera 78 #90-12, Bogotá',
    phone: '+573001234571',
    email: 'info@pizzaexpress.com',
    rating: 4.2,
    deliveryTime: '25-35 min',
    minimumOrder: 20000,
    deliveryFee: 2500,
    isActive: true,
    categories: ['pizza', 'italiana'],
    imageUrl: 'https://via.placeholder.com/300x200',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  }
];

// Datos de prueba para productos
const testProducts = [
  {
    id: 'prod-001',
    restaurantId: 'rest-001',
    name: 'Bandeja Paisa',
    description: 'Plato típico colombiano con frijoles, arroz, carne, chicharrón, huevo y plátano',
    price: 25000,
    category: 'platos principales',
    imageUrl: 'https://via.placeholder.com/200x200',
    isAvailable: true,
    preparationTime: 20,
    allergens: ['gluten'],
    nutritionalInfo: {
      calories: 850,
      protein: 45,
      carbs: 65,
      fat: 35
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  },
  {
    id: 'prod-002',
    restaurantId: 'rest-001',
    name: 'Ajiaco',
    description: 'Sopa tradicional bogotana con pollo, papa y guascas',
    price: 18000,
    category: 'sopas',
    imageUrl: 'https://via.placeholder.com/200x200',
    isAvailable: true,
    preparationTime: 15,
    allergens: [],
    nutritionalInfo: {
      calories: 320,
      protein: 25,
      carbs: 45,
      fat: 8
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  },
  {
    id: 'prod-003',
    restaurantId: 'rest-002',
    name: 'Pizza Margherita',
    description: 'Pizza clásica con tomate, mozzarella y albahaca',
    price: 22000,
    category: 'pizzas',
    imageUrl: 'https://via.placeholder.com/200x200',
    isAvailable: true,
    preparationTime: 25,
    allergens: ['gluten', 'lactosa'],
    nutritionalInfo: {
      calories: 285,
      protein: 12,
      carbs: 35,
      fat: 10
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  }
];

// Función para poblar la base de datos
async function populateFirestore() {
  try {
    console.log('🚀 Iniciando población de Firestore...');

    // Crear usuarios
    console.log('👥 Creando usuarios...');
    for (const user of testUsers) {
      await db.collection('users').doc(user.uid).set(user);
      console.log(`✅ Usuario creado: ${user.name} (${user.role})`);
    }

    // Crear restaurantes
    console.log('🏪 Creando restaurantes...');
    for (const restaurant of testRestaurants) {
      await db.collection('restaurants').doc(restaurant.id).set(restaurant);
      console.log(`✅ Restaurante creado: ${restaurant.name}`);
    }

    // Crear productos
    console.log('🍕 Creando productos...');
    for (const product of testProducts) {
      await db.collection('products').doc(product.id).set(product);
      console.log(`✅ Producto creado: ${product.name}`);
    }

    console.log('🎉 ¡Base de datos poblada exitosamente!');
    console.log('\n📊 Resumen:');
    console.log(`- ${testUsers.length} usuarios creados`);
    console.log(`- ${testRestaurants.length} restaurantes creados`);
    console.log(`- ${testProducts.length} productos creados`);

  } catch (error) {
    console.error('❌ Error poblando Firestore:', error);
  } finally {
    process.exit(0);
  }
}

// Ejecutar el script
populateFirestore(); 