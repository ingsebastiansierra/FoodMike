require('dotenv').config();
const admin = require('firebase-admin');

// Configurar Firebase Admin SDK para producción
if (!admin.apps.length) {
  try {
    console.log('🔍 Configurando Firebase Admin SDK para producción...');
    
    if (process.env.FIREBASE_CREDENTIALS_JSON) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS_JSON);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
      });
      console.log('✅ Firebase Admin SDK configurado con credenciales de producción');
    } else {
      throw new Error('FIREBASE_CREDENTIALS_JSON no está configurada');
    }
  } catch (error) {
    console.error('❌ Error configurando Firebase:', error);
    process.exit(1);
  }
}

const { populateDatabase } = require('./populateDatabase');

async function populateProduction() {
  try {
    console.log('🚀 Iniciando población de base de datos en producción...');
    console.log('🌍 Ambiente: PRODUCCIÓN');
    
    // Poblar la base de datos
    await populateDatabase();
    
    console.log('🎉 Base de datos poblada exitosamente en producción!');
    console.log('📊 Puedes verificar en: https://foodmike.onrender.com/api/restaurants/open');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error poblando base de datos en producción:', error);
    process.exit(1);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  populateProduction();
}

module.exports = { populateProduction }; 