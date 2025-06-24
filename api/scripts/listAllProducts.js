const { db } = require('../src/config/firebase');

async function listAllProducts() {
  const placesSnapshot = await db.collection('places').get();
  for (const placeDoc of placesSnapshot.docs) {
    const placeId = placeDoc.id;
    const placeName = placeDoc.data().name || '(sin nombre)';
    const productsSnapshot = await db.collection('places').doc(placeId).collection('products').get();
    const products = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log(`\n=== Place: ${placeName} (${placeId}) ===`);
    if (products.length === 0) {
      console.log('  (Sin productos)');
    } else {
      products.forEach(p => {
        console.log(`  - ${p.name || '(sin nombre)'} [${p.id}] | Categoría: ${p.category}`);
      });
    }
  }
  process.exit(0);
}

listAllProducts().catch(err => {
  console.error('Error al listar productos:', err);
  process.exit(1);
}); 