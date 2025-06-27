const admin = require('firebase-admin');
const serviceAccount = require('../../serviceAccountKey.json');

// Inicializar Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const auth = admin.auth();

async function checkProductionAuth() {
  try {
    console.log('🔍 Verificando usuarios en Firebase Authentication de producción...\n');

    // Listar todos los usuarios
    const listUsersResult = await auth.listUsers();
    
    console.log(`✅ Usuarios en Authentication: ${listUsersResult.users.length}`);
    
    listUsersResult.users.forEach(userRecord => {
      console.log(`  - ${userRecord.displayName || 'Sin nombre'} (${userRecord.email})`);
      console.log(`    UID: ${userRecord.uid}`);
      console.log(`    Email verificado: ${userRecord.emailVerified}`);
      console.log(`    Creado: ${userRecord.metadata.creationTime}`);
      console.log('');
    });

    // Verificar usuarios específicos
    const testEmails = ['admin@foodmike.com', 'cliente@test.com'];
    
    console.log('🔍 Verificando usuarios de prueba específicos...');
    for (const email of testEmails) {
      try {
        const userRecord = await auth.getUserByEmail(email);
        console.log(`✅ ${email} - Encontrado (UID: ${userRecord.uid})`);
      } catch (error) {
        if (error.code === 'auth/user-not-found') {
          console.log(`❌ ${email} - No encontrado en Authentication`);
        } else {
          console.log(`⚠️ Error verificando ${email}:`, error.message);
        }
      }
    }

  } catch (error) {
    console.error('❌ Error verificando Authentication:', error);
  } finally {
    process.exit(0);
  }
}

checkProductionAuth(); 