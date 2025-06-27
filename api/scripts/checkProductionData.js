const admin = require('firebase-admin');
const serviceAccount = require('../../serviceAccountKey.json');

// Inicializar Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function checkProductionData() {
  try {
    console.log('🔍 Verificando datos en la base de datos de producción...\n');

    // Verificar usuarios
    console.log('👥 Verificando usuarios...');
    const usersSnapshot = await db.collection('users').get();
    console.log(`✅ Usuarios encontrados: ${usersSnapshot.docs.length}`);
    usersSnapshot.docs.forEach(doc => {
      const user = doc.data();
      console.log(`  - ${user.name} (${user.email}) - Rol: ${user.role}`);
    });

    // Verificar restaurantes
    console.log('\n🏪 Verificando restaurantes...');
    const restaurantsSnapshot = await db.collection('restaurants').get();
    console.log(`✅ Restaurantes encontrados: ${restaurantsSnapshot.docs.length}`);
    restaurantsSnapshot.docs.forEach(doc => {
      const restaurant = doc.data();
      console.log(`  - ${restaurant.name} (${restaurant.id})`);
    });

    // Verificar productos
    console.log('\n🍕 Verificando productos...');
    const productsSnapshot = await db.collection('products').get();
    console.log(`✅ Productos encontrados: ${productsSnapshot.docs.length}`);
    productsSnapshot.docs.slice(0, 5).forEach(doc => {
      const product = doc.data();
      console.log(`  - ${product.name} ($${product.price})`);
    });
    if (productsSnapshot.docs.length > 5) {
      console.log(`  ... y ${productsSnapshot.docs.length - 5} productos más`);
    }

    // Verificar categorías
    console.log('\n📂 Verificando categorías...');
    const categoriesSnapshot = await db.collection('categories').get();
    console.log(`✅ Categorías encontradas: ${categoriesSnapshot.docs.length}`);
    categoriesSnapshot.docs.forEach(doc => {
      const category = doc.data();
      console.log(`  - ${category.name} (${category.icon})`);
    });

    // Verificar órdenes
    console.log('\n📋 Verificando órdenes...');
    const ordersSnapshot = await db.collection('orders').get();
    console.log(`✅ Órdenes encontradas: ${ordersSnapshot.docs.length}`);

    // Verificar favoritos
    console.log('\n❤️ Verificando favoritos...');
    const favoritesSnapshot = await db.collection('favorites').get();
    console.log(`✅ Favoritos encontrados: ${favoritesSnapshot.docs.length}`);

    // Verificar carritos
    console.log('\n🛒 Verificando carritos...');
    const cartsSnapshot = await db.collection('carts').get();
    console.log(`✅ Carritos encontrados: ${cartsSnapshot.docs.length}`);

    console.log('\n🎉 Verificación completada!');
    console.log('\n📊 Resumen total:');
    console.log(`- Usuarios: ${usersSnapshot.docs.length}`);
    console.log(`- Restaurantes: ${restaurantsSnapshot.docs.length}`);
    console.log(`- Productos: ${productsSnapshot.docs.length}`);
    console.log(`- Categorías: ${categoriesSnapshot.docs.length}`);
    console.log(`- Órdenes: ${ordersSnapshot.docs.length}`);
    console.log(`- Favoritos: ${favoritesSnapshot.docs.length}`);
    console.log(`- Carritos: ${cartsSnapshot.docs.length}`);

  } catch (error) {
    console.error('❌ Error verificando datos:', error);
  } finally {
    process.exit(0);
  }
}

checkProductionData(); 