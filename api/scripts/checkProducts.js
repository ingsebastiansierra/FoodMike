const { db } = require('../src/config/firebase');

async function checkProducts() {
  try {
    console.log('🔍 Verificando productos en Firestore...\n');
    
    // Verificar productos en la colección principal
    const productsSnapshot = await db.collection('products').get();
    console.log(`📦 Productos en colección 'products': ${productsSnapshot.size}`);
    
    if (productsSnapshot.size > 0) {
      console.log('\n📋 Lista de productos:');
      productsSnapshot.docs.forEach((doc, index) => {
        const product = doc.data();
        console.log(`${index + 1}. ${product.name || '(sin nombre)'} - $${product.price || 0} - ${product.category || '(sin categoría)'}`);
      });
    }
    
    // Verificar productos en restaurantes
    console.log('\n🏪 Verificando productos en restaurantes...');
    const restaurantsSnapshot = await db.collection('restaurants').get();
    let totalRestaurantProducts = 0;
    
    for (const restaurantDoc of restaurantsSnapshot.docs) {
      const restaurant = restaurantDoc.data();
      const menuSnapshot = await db.collection('restaurants').doc(restaurantDoc.id).collection('menu').get();
      const menuItems = menuSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      console.log(`\n📍 ${restaurant.name || '(sin nombre)'}: ${menuItems.length} productos`);
      totalRestaurantProducts += menuItems.length;
      
      if (menuItems.length > 0) {
        menuItems.forEach((item, index) => {
          console.log(`  ${index + 1}. ${item.name || '(sin nombre)'} - $${item.price || 0}`);
        });
      }
    }
    
    console.log(`\n📊 RESUMEN:`);
    console.log(`- Productos en colección 'products': ${productsSnapshot.size}`);
    console.log(`- Productos en restaurantes: ${totalRestaurantProducts}`);
    console.log(`- Total de productos: ${productsSnapshot.size + totalRestaurantProducts}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
  
  process.exit(0);
}

checkProducts(); 