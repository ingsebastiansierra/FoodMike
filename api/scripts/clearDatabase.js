const { db } = require('../config/firebase');

async function clearDatabase() {
  try {
    console.log('🧹 Iniciando limpieza completa de la base de datos...');
    
    const collectionsToClear = ['restaurants', 'categories', 'products', 'additions', 'places'];
    
    for (const collectionName of collectionsToClear) {
      try {
        console.log(`   Limpiando colección: ${collectionName}`);
        const snapshot = await db.collection(collectionName).get();
        
        if (!snapshot.empty) {
          const batch = db.batch();
          snapshot.docs.forEach(doc => {
            batch.delete(doc.ref);
          });
          
          await batch.commit();
          console.log(`   ✅ ${snapshot.docs.length} documentos eliminados de ${collectionName}`);
        } else {
          console.log(`   ℹ️ Colección ${collectionName} ya está vacía`);
        }
      } catch (error) {
        console.log(`   ⚠️ Error limpiando ${collectionName}:`, error.message);
      }
    }
    
    console.log('✅ Limpieza completada exitosamente!');
    
  } catch (error) {
    console.error('❌ Error en limpieza:', error);
    throw error;
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  clearDatabase()
    .then(() => {
      console.log('🎉 Script de limpieza completado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error en script de limpieza:', error);
      process.exit(1);
    });
}

module.exports = { clearDatabase }; 