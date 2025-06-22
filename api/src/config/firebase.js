const admin = require('firebase-admin');

// Inicializar Firebase Admin SDK
if (!admin.apps.length) {
  try {
    console.log('🔍 Checking for Firebase credentials...');
    let serviceAccount;

    if (process.env.FIREBASE_CREDENTIALS_JSON && process.env.FIREBASE_CREDENTIALS_JSON.length > 10) {
      console.log('✅ FIREBASE_CREDENTIALS_JSON variable found. Attempting to parse...');
      try {
        serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS_JSON);
        console.log('✅ JSON parsed successfully. Project ID:', serviceAccount.project_id);
      } catch (e) {
        console.error('❌ CRITICAL: Failed to parse FIREBASE_CREDENTIALS_JSON.', e.message);
        throw new Error('Firebase credentials JSON is malformed.');
      }
    } else {
      console.log('⚠️ FIREBASE_CREDENTIALS_JSON not found or is empty. Checking for local file...');
      // Prioridad 2: Usar un archivo local (para desarrollo local)
      try {
        // Este archivo NUNCA debe subirse a GitHub. Asegúrate que esté en .gitignore
        serviceAccount = require('../../serviceAccountKey.json'); 
        console.log('🚀 Initializing Firebase Admin SDK from local serviceAccountKey.json file...');
      } catch (e) {
        console.warn('⚠️ Firebase credentials not found. Could not find FIREBASE_CREDENTIALS_JSON env var or local serviceAccountKey.json file.');
        if (process.env.NODE_ENV !== 'development') {
          throw new Error('Firebase initialization failed in production.');
        }
      }
    }
    
    if (serviceAccount) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
      });
      console.log('✅ Firebase Admin SDK initialized successfully.');
    } else {
      // Fallback para desarrollo local sin credenciales. La app corre, pero las funciones de Firebase fallarán.
      console.log('🔄 Initializing Firebase Admin SDK in basic mode for local development.');
      admin.initializeApp({
        projectId: 'foodmike-autenticacion' // Reemplaza con tu project ID si es necesario
      });
    }

  } catch (error) {
    console.error('❌ Fatal error initializing Firebase Admin SDK:', error.message);
    if (process.env.NODE_ENV !== 'development') {
      process.exit(1); // Detiene la aplicación si la inicialización falla en producción
    }
  }
}

// Obtener instancias de Firestore y Auth
const db = admin.firestore();
const auth = admin.auth();

// Configurar Firestore para desarrollo
if (process.env.NODE_ENV === 'development') {
  db.settings({
    ignoreUndefinedProperties: true
  });
}

module.exports = {
  admin,
  db,
  auth
}; 