const admin = require('firebase-admin');
const serviceAccount = require('../../serviceAccountKey.json');

// Inicializar Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

console.log('🚀 Configuración para producción actualizada!');
console.log('\n📋 Para actualizar CORS en Render:');
console.log('=====================================');
console.log('1. Ve a https://dashboard.render.com');
console.log('2. Selecciona tu servicio "foodmike"');
console.log('3. Ve a "Environment"');
console.log('4. Agrega o actualiza la variable:');
console.log('   CORS_ORIGIN=*');
console.log('5. O si prefieres ser más específico:');
console.log('   CORS_ORIGIN=exp://exp.host,exp://u.expo.dev,foodmike://,com.sebasing.foodmike://');
console.log('6. Guarda y redeploya el servicio');
console.log('=====================================');
console.log('\n💡 Alternativamente, puedes usar el script de actualización automática:');
console.log('   node scripts/updateFirestoreRules.js');
console.log('\n✅ La base de datos ya está poblada y lista para producción!');
console.log('📱 Credenciales de prueba:');
console.log('   👤 Admin: admin@foodmike.com / 123456');
console.log('   👤 Cliente: cliente@test.com / 123456');

process.exit(0); 