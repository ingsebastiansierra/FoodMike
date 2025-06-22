const admin = require('firebase-admin');

// Configuración de Firebase Admin SDK
const serviceAccount = {
  type: process.env.FIREBASE_TYPE || "service_account",
  project_id: process.env.FIREBASE_PROJECT_ID || "foodmike-autenticacion",
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID || "your-private-key-id",
  private_key: process.env.FIREBASE_PRIVATE_KEY ? 
    process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : 
    "-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n",
  client_email: process.env.FIREBASE_CLIENT_EMAIL || "firebase-adminsdk-xxxxx@foodmike-autenticacion.iam.gserviceaccount.com",
  client_id: process.env.FIREBASE_CLIENT_ID || "your-client-id",
  auth_uri: process.env.FIREBASE_AUTH_URI || "https://accounts.google.com/o/oauth2/auth",
  token_uri: process.env.FIREBASE_TOKEN_URI || "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL || "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL || "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40foodmike-autenticacion.iam.gserviceaccount.com"
};

// Inicializar Firebase Admin SDK
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: process.env.FIREBASE_DATABASE_URL || "https://foodmike-autenticacion.firebaseio.com"
    });
    console.log('✅ Firebase Admin SDK initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing Firebase Admin SDK:', error);
    // Para desarrollo, usar configuración básica
    if (process.env.NODE_ENV === 'development') {
      console.log('🔄 Using development configuration...');
      admin.initializeApp({
        projectId: 'foodmike-autenticacion'
      });
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