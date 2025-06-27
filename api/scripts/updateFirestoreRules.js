const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');
const serviceAccount = require('../../serviceAccountKey.json');

// Inicializar Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

async function updateFirestoreRules() {
  try {
    console.log('🚀 Actualizando reglas de Firestore...');
    
    // Leer las reglas del archivo
    const rulesPath = path.join(__dirname, '../../firestore-rules.txt');
    const rules = fs.readFileSync(rulesPath, 'utf8');
    
    console.log('📖 Reglas leídas del archivo firestore-rules.txt');
    
    // Actualizar las reglas en Firestore
    await admin.firestore().setFirestoreSettings({
      rules: rules
    });
    
    console.log('✅ Reglas de Firestore actualizadas exitosamente!');
    console.log('\n📋 Reglas aplicadas:');
    console.log('=====================================');
    console.log(rules);
    console.log('=====================================');
    
  } catch (error) {
    console.error('❌ Error actualizando reglas de Firestore:', error);
  } finally {
    process.exit(0);
  }
}

updateFirestoreRules(); 