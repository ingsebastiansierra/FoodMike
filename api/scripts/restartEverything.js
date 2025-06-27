const admin = require('firebase-admin');
const serviceAccount = require('../../serviceAccountKey.json');

// Inicializar Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const auth = admin.auth();

async function restartEverything() {
  try {
    console.log('🔄 Reiniciando todo el sistema...');
    
    // 1. Limpiar usuarios de Authentication (opcional)
    console.log('\n1️⃣ Limpiando usuarios de Authentication...');
    try {
      const listUsersResult = await auth.listUsers();
      for (const userRecord of listUsersResult.users) {
        if (userRecord.email.includes('test') || userRecord.email.includes('foodmike')) {
          await auth.deleteUser(userRecord.uid);
          console.log(`🗑️ Usuario eliminado de Auth: ${userRecord.email}`);
        }
      }
    } catch (error) {
      console.log('⚠️ No se pudieron eliminar usuarios de Auth:', error.message);
    }
    
    // 2. Limpiar colecciones de Firestore
    console.log('\n2️⃣ Limpiando colecciones de Firestore...');
    const collections = ['users', 'restaurants', 'products', 'categories', 'orders', 'favorites', 'carts'];
    
    for (const collectionName of collections) {
      try {
        const snapshot = await db.collection(collectionName).get();
        const batch = db.batch();
        
        snapshot.docs.forEach((doc) => {
          batch.delete(doc.ref);
        });
        
        await batch.commit();
        console.log(`🗑️ Colección ${collectionName} limpiada (${snapshot.docs.length} documentos)`);
      } catch (error) {
        console.log(`⚠️ No se pudo limpiar ${collectionName}:`, error.message);
      }
    }
    
    // 3. Poblar con datos de prueba
    console.log('\n3️⃣ Poblando con datos de prueba...');
    
    // Usuarios de prueba
    const testUsers = [
      {
        uid: 'admin-001',
        email: 'admin@foodmike.com',
        name: 'Administrador Principal',
        phone: '+573001234567',
        role: 'administrador',
        passwordHash: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8KqKqKq',
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        lastLoginAt: null,
        loginCount: 0,
        profilePhoto: '',
        profile: { bio: 'Administrador principal', address: 'Bogotá, Colombia' }
      },
      {
        uid: 'cliente-001',
        email: 'cliente@test.com',
        name: 'Cliente de Prueba',
        phone: '+573001234568',
        role: 'cliente',
        passwordHash: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8KqKqKq',
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        lastLoginAt: null,
        loginCount: 0,
        profilePhoto: '',
        profile: { bio: 'Cliente de prueba', address: 'Medellín, Colombia' }
      }
    ];
    
    // Crear usuarios en Auth y Firestore
    for (const userData of testUsers) {
      try {
        // Crear en Authentication
        await auth.createUser({
          email: userData.email,
          password: '123456',
          displayName: userData.name,
          uid: userData.uid
        });
        console.log(`✅ Usuario creado en Auth: ${userData.email}`);
        
        // Crear en Firestore
        await db.collection('users').doc(userData.uid).set(userData);
        console.log(`✅ Usuario creado en Firestore: ${userData.name} (${userData.role})`);
      } catch (error) {
        console.log(`⚠️ Error con usuario ${userData.email}:`, error.message);
      }
    }
    
    // Restaurantes de prueba
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
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    for (const restaurant of testRestaurants) {
      await db.collection('restaurants').doc(restaurant.id).set(restaurant);
      console.log(`✅ Restaurante creado: ${restaurant.name}`);
    }
    
    // Productos de prueba
    const testProducts = [
      {
        id: 'prod-001',
        restaurantId: 'rest-001',
        name: 'Bandeja Paisa',
        description: 'Plato típico colombiano',
        price: 25000,
        category: 'platos principales',
        imageUrl: 'https://via.placeholder.com/200x200',
        isAvailable: true,
        preparationTime: 20,
        allergens: ['gluten'],
        nutritionalInfo: { calories: 850, protein: 45, carbs: 65, fat: 35 },
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    for (const product of testProducts) {
      await db.collection('products').doc(product.id).set(product);
      console.log(`✅ Producto creado: ${product.name}`);
    }
    
    console.log('\n🎉 ¡Sistema reiniciado exitosamente!');
    console.log('\n📋 Credenciales de prueba:');
    console.log('👤 Administrador: admin@foodmike.com / 123456');
    console.log('👤 Cliente: cliente@test.com / 123456');
    
  } catch (error) {
    console.error('❌ Error reiniciando sistema:', error);
  } finally {
    process.exit(0);
  }
}

restartEverything(); 