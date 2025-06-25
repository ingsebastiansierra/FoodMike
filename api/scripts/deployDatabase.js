const { populateDatabase } = require('./populateDatabase');

async function deployDatabase() {
  try {
    console.log('🚀 Iniciando despliegue de base de datos en producción...');
    
    // Verificar variables de entorno
    if (!process.env.FIREBASE_CREDENTIALS_JSON) {
      throw new Error('FIREBASE_CREDENTIALS_JSON no está configurada');
    }
    
    console.log('✅ Variables de entorno verificadas');
    
    // Poblar la base de datos
    await populateDatabase();
    
    console.log('🎉 Base de datos desplegada exitosamente en producción!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error desplegando base de datos:', error);
    process.exit(1);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  deployDatabase();
}

module.exports = { deployDatabase }; 